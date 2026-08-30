import React, { useState } from 'react'


import Paper from '@mui/material/Paper'

import clsx from "clsx";
import {IconButton, Tooltip, Typography, Zoom} from '@mui/material'
import Fullscreen from '@mui/icons-material/Fullscreen'
import Close from '@mui/icons-material/Close'
import Modal from '@mui/material/Modal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons"

const FullScreen = ({componentItems, setScreen, showScreen, paper, share, handleShare, full, showClose, outside, changeColor, padding}) => {

    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(typeof showScreen !== 'undefined' ? showScreen : false)

    const handleClickOpenCloseFullscreen = () => {
        if(typeof setScreen !== 'undefined') {
            setScreen(!isFullscreenOpen === true ? true : false)
        }
        setIsFullscreenOpen(!isFullscreenOpen)
    }
 
    return (
        <React.Fragment>    
            {
                !isFullscreenOpen  && (
                    <IconButton size="small" className={clsx("absolute right-0 top-[9px] z-[99999] [&_svg]:fill-[#6d6d6d] [&_svg]:stroke-[#6d6d6d] hover:[&_svg]:fill-secondary hover:[&_svg]:stroke-secondary hover:[&_svg]:text-secondary", 'full_screen_btn')} onClick={handleClickOpenCloseFullscreen}>
                        <Fullscreen />
                    </IconButton>
                )
            }            
            <Modal
                className={clsx("flex", 'fullscreenModal')}
                open={isFullscreenOpen}  
            > 
                <Paper className={clsx("relative m-7 flex flex-1 bg-bg-default [&_.full_heading_.MuiTypography-root]:mt-[15px]", typeof paper !== 'undefined' && paper === false ? "bg-none" : '', typeof full !== 'undefined' && full === false ? "mx-auto my-[50px] flex-none" : '')} square   >
                    {
                        typeof showClose == 'undefined' && (
                            <IconButton
                                onClick={handleClickOpenCloseFullscreen}
                                className={clsx("absolute right-0 z-[999999] h-5 w-5", {["text-secondary"]: changeColor === true ? true : false})}
                                size="large">
                                <Close />
                            </IconButton>
                        )
                    }                    
                    {
                        share === true && (  
                            <IconButton
                                onClick={handleShare}
                                className={clsx("absolute right-0 z-[999999] h-5 w-5", "right-[30px] top-[2px]")}   
                            >
                                <Tooltip 
                                    title={
                                        <Typography color="inherit" variant='body2'>Share Dashboard</Typography>
                                    } 
                                    className={clsx("text-base")}  
                                    placement='right'
                                    enterDelay={0}
                                    TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                                >
                                    <FontAwesomeIcon  
                                        icon={faShareAlt}  
                                    />
                                </Tooltip>
                                
                            </IconButton>
                        )
                    }
                    {
                        componentItems.map(
                            ({component: Component, ...props }, index) => (
                                <Component key={index} {...props} activeFullScreen={true}/>
                            )
                        )
                    }
                </Paper>
            </Modal>
        </React.Fragment>
    ); 
}

export default FullScreen