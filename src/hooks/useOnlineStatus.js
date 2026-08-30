import { useEffect, useState } from 'react'

/**
 * Tracks browser connectivity.
 *
 * `navigator.onLine` only tells us whether the browser has a network interface,
 * not whether the internet is actually reachable, so treat it as a fast negative
 * signal: false is reliable, true is optimistic. Anything that must be certain
 * (a chunk fetch, an API call) still has to handle its own failure.
 */
const getInitial = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true

export default function useOnlineStatus() {
  const [ isOnline, setIsOnline ] = useState(getInitial)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    // The events can fire between first render and this effect attaching.
    setIsOnline(getInitial())

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return isOnline
}

/**
 * Promise that settles as soon as the browser reports a connection.
 * Used by lazyWithRetry so a chunk fetch waits for the network to come back
 * instead of burning its retries while the user is offline.
 */
export const waitForOnline = (timeoutMs = 60000) =>
  new Promise((resolve) => {
    if (getInitial()) {
      resolve(true)
      return
    }
    let timer = null
    const done = (result) => {
      window.removeEventListener('online', onOnline)
      if (timer) clearTimeout(timer)
      resolve(result)
    }
    const onOnline = () => done(true)
    window.addEventListener('online', onOnline)
    timer = setTimeout(() => done(false), timeoutMs)
  })
