import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'

import {
  setSelectedAssetsTransactions,
  setSelectedAssetsPatents,
  setAssetsIllustration,
  setSearchString,
  setResetAll,
} from '../../actions/patentTrackActions2'

/**
 * Values carried over from the previous makeStyles: rgba(255,255,255,.15) rest
 * and .25 hover, 4px radius, 26px height, 16px icon gutter, and the sm
 * breakpoint (640px) widths of 12ch growing to 20ch on focus.
 */
const SearchBar = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const search_string = useSelector((state) => state.patenTrack2.search_string)

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Enter') return
      dispatch(setResetAll())
      dispatch(setAssetsIllustration(null))
      dispatch(setSelectedAssetsTransactions([]))
      dispatch(setSelectedAssetsPatents([]))
      dispatch(setSearchString(event.target.value))
      history.push('/search')
    },
    [ dispatch, history ]
  )

  return (
    <div className="relative flex h-[26px] w-full rounded bg-white/15 transition-colors hover:bg-white/25 sm:w-auto">
      <div className="pointer-events-none absolute flex h-full items-center justify-center px-4">
        <SearchIcon />
      </div>
      <input
        type="text"
        aria-label="search"
        placeholder="Search…"
        defaultValue={search_string != null ? search_string : ''}
        onKeyDown={handleKeyDown}
        className={
          'h-[26px] w-full bg-transparent p-0 pl-[calc(1em+2rem)] text-inherit outline-none ' +
          'transition-[width] sm:w-[12ch] sm:focus:w-[20ch]'
        }
      />
    </div>
  )
}

export default SearchBar
