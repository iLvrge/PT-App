import React from 'react'
import { Fab } from '@mui/material'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'

import useStyles from './styles'

const ArrowButton = ({ arrowId, handleClick, buttonType, arrow, cls }) => {
    const classes = useStyles()

    const Icon =
        buttonType === true && arrow == 2
            ? KeyboardArrowDownOutlinedIcon
            : buttonType === true && arrow == 3
              ? KeyboardArrowRightOutlinedIcon
              : KeyboardArrowLeftOutlinedIcon

    return (
        <div id={arrowId} className={`${classes.arrowButton} ${cls != undefined ? cls : ''}`}>
            <Fab aria-label='toggle' size='small' className={`${classes.btnColor}`} onClick={handleClick}>
                <Icon />
            </Fab>
        </div>
    )
}

export default ArrowButton
