import React from 'react'
import cn from '../../../ui/cn'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'

/**
 * Was a MUI Fab whose size was overridden through a .MuiFab-sizeSmall selector.
 * A plain button drops that reach into MUI's internals; the 21x22 box and the
 * #f50057/#fff colour pair are carried over unchanged.
 */
const ArrowButton = ({ arrowId, handleClick, buttonType, arrow, cls }) => {
  const Icon =
    buttonType === true && arrow == 2
      ? KeyboardArrowDownOutlinedIcon
      : buttonType === true && arrow == 3
        ? KeyboardArrowRightOutlinedIcon
        : KeyboardArrowLeftOutlinedIcon

  return (
    <div id={arrowId} className={cn('absolute -right-[10px] top-[28px] z-[99999]', cls)}>
      <button
        type="button"
        aria-label="toggle"
        onClick={handleClick}
        className={cn(
          'flex h-[22px] w-[21px] items-center justify-center rounded-full shadow-md',
          'bg-white text-[#f50057] transition-colors',
          'hover:bg-[#f50057] hover:text-white'
        )}
      >
        <Icon fontSize="inherit" />
      </button>
    </div>
  )
}

export default ArrowButton
