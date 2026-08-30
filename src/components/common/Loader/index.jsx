import React from 'react'

/**
 * Fills its positioned ancestor. Also used as the Suspense fallback for every
 * lazy route, so it deliberately pulls in no component library.
 */
const Loader = () => (
  <div className="absolute inset-0 z-[9999] flex items-center justify-center">
    <span
      role="progressbar"
      aria-label="Loading"
      className="block h-10 w-10 animate-spin rounded-full border-[3px] border-divider border-t-secondary"
    />
  </div>
)

export default Loader
