import React, { useEffect } from 'react'
import { Box } from '@mui/system'
import { IconButton } from '@mui/material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import AddToolTip from '../../Reports/AddToolTip'
import cn from '../../../ui/cn'

/**
 * `enabled` was state whose only setter sat behind a commented-out onClick, so
 * it was permanently false and the text it gated never rendered. Dropped, along
 * with the branch. The mount-time callback(false) is preserved because callers
 * may rely on being told the initial state.
 */
const TitleBar = ({ title, callback, enablePadding, underline, relative, button }) => {
  useEffect(() => {
    if (typeof callback !== 'undefined') callback(false)
  }, [ callback ])

  return (
    <div className="relative z-[9999999] w-full">
      <span
        className={cn(
          'absolute -left-[15px] -top-[15px] z-[9999999] mb-[5px] block w-full text-[1.1rem]',
          enablePadding === true && 'pl-4 pt-[7px]',
          underline === true && 'underline',
          relative === true && 'absolute z-[9999] w-full'
        )}
      >
        <AddToolTip tooltip={title} placement="right">
          <span>
            <IconButton className="p-1">
              <HelpOutlineOutlinedIcon />
            </IconButton>
          </span>
        </AddToolTip>

        {typeof button !== 'undefined' && (
          <span className="block">
            <IconButton
              onClick={(event) =>
                button.dashboardScreen === true ? button.click(event, true) : button.click()
              }
              className={cn(button.class)}
              size="large"
            >
              {/* 24px, not w-6: Tailwind's scale is rem-based and this app's
                  root font-size is 14px, so w-6 (1.5rem) renders 21px where
                  master's literal `width: 24px` renders 24. */}
              <svg
                className="w-[24px] fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path d="M5 11.86V29a1 1 0 0 0 2 0V11.86A4 4 0 0 0 7 4.14V3A1 1 0 0 0 5 3V4.14a4 4 0 0 0 0 7.72zM6 6A2 2 0 1 1 4 8 2 2 0 0 1 6 6zM27 12.14V3a1 1 0 0 0-2 0v9.14a4 4 0 0 0 0 7.72V29a1 1 0 0 0 2 0V19.86a4 4 0 0 0 0-7.72zM26 18a2 2 0 1 1 2-2A2 2 0 0 1 26 18zM16 30a1 1 0 0 0 1-1V23.86a4 4 0 0 0 0-7.72V3a1 1 0 0 0-2 0V16.14a4 4 0 0 0 0 7.72V29A1 1 0 0 0 16 30zM14 20a2 2 0 1 1 2 2A2 2 0 0 1 14 20z" />
              </svg>
            </IconButton>
          </span>
        )}
      </span>
    </div>
  )
}

export default TitleBar
