import React from 'react'
import Box from '@mui/material/Box'
import Loader from '../Loader'

/**
 * Suspense fallback for a route chunk that is still downloading.
 * Fills the routing area so the layout does not collapse while the chunk loads.
 */
const RouteFallback = () => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      minHeight: 240,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
    }}
  >
    <Loader />
  </Box>
)

export default RouteFallback
