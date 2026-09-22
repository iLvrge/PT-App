import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useState that ignores a set() arriving after the component has unmounted.
 *
 * The chart panels fetch in an effect and then set state with the result. The
 * user can leave before the request lands - the panes on these screens mount
 * and unmount constantly, and each route renders its own layout, so even the
 * layout is replaced on navigation - and React 17 then logs
 *
 *   Can't perform a React state update on an unmounted component. This is a
 *   no-op, but it indicates a memory leak in your application.
 *
 * once per late response. The update really is a no-op, so nothing renders
 * wrongly; what the warning points at is the un-cancelled request behind it.
 * Cancelling every one of those would mean threading an AbortController through
 * an API layer that several dozen call sites share, so the setter is guarded
 * instead: the late response is dropped where it would have been used.
 *
 * Swapping `useState` for this at the declaration leaves every call site
 * unchanged, which is why it is a hook rather than a wrapper at each setter.
 *
 * Use it for state that is set after an await, or set by a callback this
 * component hands to a child that may call it after one. Ordinary state does
 * not need the extra ref, and applying it everywhere would hide which state is
 * actually written asynchronously.
 */
export default function useSafeState(initialValue) {
  const [value, setValue] = useState(initialValue)
  const mounted = useRef(true)

  // Cleanup runs on unmount; the flag is set on mount too, because an effect
  // can be mounted, cleaned up and mounted again, and a flag left false would
  // silently freeze this component's state forever.
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const setSafeValue = useCallback((next) => {
    if (mounted.current) setValue(next)
  }, [])

  return [value, setSafeValue]
}
