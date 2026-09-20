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
    {/* A bare <input> inherits neither font nor box-sizing, where the MUI
        InputBase this replaced set `font: inherit` and kept content-box. Left
        alone it rendered Arial 13.33px in a border-box, making the field 148px
        against master's 211px. Padding is master's theme.spacing(1,1,1,0) and
        calc(1em + theme.spacing(4)) in real pixels - Tailwind's rem-based scale
        would give 28px for `2rem` at this app's 14px root, not the 32px MUI
        computes. The tracking and leading are MUI's body1, which InputBase's
        root applied and a plain input has no way to inherit. */}
    <input
      type="search"
      aria-label="search"
      placeholder="Search…"
      className={
        'w-full box-content bg-transparent [font:inherit] tracking-[0.00938em] leading-[1.4375] ' +
        'py-[8px] pr-[8px] text-inherit outline-none transition-[width] ' +
        'pl-[calc(1em+32px)] md:w-[20ch] ' + (className || '')
      }
      {...props}
    />
  </div>
)

export default StyledSearch
