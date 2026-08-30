import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import useOnlineStatus from '../../../hooks/useOnlineStatus'

/**
 * App-wide connectivity banner.
 *
 * Shown persistently while offline, because the consequence is ongoing: API
 * calls will fail and route chunks that have not been downloaded yet cannot be
 * fetched. On reconnect it briefly confirms recovery, then hides itself.
 *
 * Colours come from the existing theme only (secondary.main is the same red in
 * both light and dark), so this introduces no new palette values.
 */
const RECONNECTED_VISIBLE_MS = 3000

const OfflineBanner = () => {
  const isOnline = useOnlineStatus()
  const [ showReconnected, setShowReconnected ] = useState(false)
  const wasOffline = useRef(!isOnline)

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true
      setShowReconnected(false)
      return undefined
    }

    if (!wasOffline.current) return undefined

    wasOffline.current = false
    setShowReconnected(true)
    const timer = setTimeout(() => setShowReconnected(false), RECONNECTED_VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [ isOnline ])

  const visible = !isOnline || showReconnected

  return (
    <Slide direction="down" in={visible} mountOnEnter unmountOnExit>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.snackbar + 1,
          py: 0.75,
          px: 2,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 500,
          // Offline uses the theme's existing red (secondary.main, #E60000 in
          // both modes). The transient "back online" state deliberately uses the
          // neutral paper surface rather than introducing a green that is not in
          // this palette.
          color: isOnline ? 'text.primary' : '#fff',
          bgcolor: isOnline ? 'background.paper' : 'secondary.main',
          borderBottom: isOnline ? 1 : 0,
          borderColor: 'divider',
        }}
      >
        {isOnline
          ? 'Back online'
          : 'No internet connection — changes will not be saved until you reconnect'}
      </Box>
    </Slide>
  )
}

export default OfflineBanner
