import React from 'react'
import SearchIcon from '@mui/icons-material/Search'

/**
 * Values carried over from the previous makeStyles: rgba(255,255,255,.15) rest
 * and .25 hover (MUI alpha on common.white), 4px radius (theme.shape), 16px
 * icon gutter, and the 20ch width from the md breakpoint (900px).
 */
const StyledSearch = ({ className, ...props }) => (
  <div className="relative ml-0 rounded bg-white/15 transition-colors hover:bg-white/25">
    <div className="pointer-events-none absolute flex h-full items-center justify-center px-4">
      <SearchIcon />
    </div>
    <input
      type="search"
      aria-label="search"
      placeholder="Search…"
      className={
        'w-full bg-transparent py-2 pr-2 text-inherit outline-none transition-[width] ' +
        'pl-[calc(1em+2rem)] md:w-[20ch] ' + (className || '')
      }
      {...props}
    />
  </div>
)

export default StyledSearch
