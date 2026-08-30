import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useOnlineStatus from '../../../hooks/useOnlineStatus'

/**
 * Route-level error fallback.
 *
 * Distinguishes the two failures that code splitting introduces:
 *  - the chunk never arrived (offline, or a deploy replaced it)
 *  - the module loaded but threw while rendering
 *
 * A rejected React.lazy import is cached by React, so "Try again" cannot
 * refetch it — for a chunk error the only honest recovery is a reload.
 */
const RouteErrorFallback = ({ error, reset, isChunkError }) => {
  const isOnline = useOnlineStatus()

  const title = isChunkError
    ? isOnline
      ? 'This part of the app could not be loaded'
      : 'You appear to be offline'
    : 'Something went wrong on this screen'

  const detail = isChunkError
    ? isOnline
      ? 'The download did not complete. This usually means the app was updated while this tab was open.'
      : 'The rest of this screen still needs to be downloaded. Reconnect and try again.'
    : 'The screen failed to render. Reloading usually clears it.'

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 240,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        p: 3,
        textAlign: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" sx={{ maxWidth: 460, opacity: 0.8 }}>
        {detail}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        {!isChunkError && (
          <Button variant="outlined" onClick={reset}>
            Try again
          </Button>
        )}
      </Box>

      {process.env.NODE_ENV !== 'production' && error && (
        <Typography
          component="pre"
          variant="caption"
          sx={{ mt: 2, maxWidth: '90%', overflowX: 'auto', textAlign: 'left', opacity: 0.7 }}
        >
          {String(error && error.stack ? error.stack : error)}
        </Typography>
      )}
    </Box>
  )
}

export default RouteErrorFallback
