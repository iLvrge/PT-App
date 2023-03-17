import React, { useState } from 'react'


import Paper from '@mui/material/Paper'

import useStyles from './styles'
import clsx from "clsx";
import {IconButton, Tooltip, Typography, Zoom} from '@mui/material'
import { Fullscreen, Close,  } from '@mui/icons-material'
import Modal from '@mui/material/Modal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons"

const FullScreen = ({componentItems, setScreen, showScreen, paper, share, handleShare, full, showClose, outside, changeColor}) => {

    const classes = useStyles()
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
                    <IconButton size="small" className={classes.fullscreenBtn} onClick={handleClickOpenCloseFullscreen}>
                        <Fullscreen />
                    </IconButton>
                )
            }            
            <Modal
                className={clsx(classes.fullscreenChartsModal, 'fullscreenModal')}
                open={isFullscreenOpen}  
            > 
                <Paper className={clsx(classes.fullscreenCharts, typeof paper !== 'undefined' && paper === false ? classes.noBackground : '', typeof full !== 'undefined' && full === false ? classes.noFullScreen : '')} square   >
                    {
                        typeof showClose == 'undefined' && (
                            <IconButton
                                onClick={handleClickOpenCloseFullscreen}
                                className={clsx(classes.right, {[classes.activeColor]: changeColor === true ? true : false})}
                                size="large">
                                <Close />
                            </IconButton>
                        )
                    }                    
                    {
                        share === true && (  
                            <IconButton
                                onClick={handleShare}
                                className={clsx(classes.right, classes.shareIcon)}   
                            >
                                <Tooltip 
                                    title={
                                        <Typography color="inherit" variant='body2'>Share Dashboard</Typography>
                                    } 
                                    className={clsx(classes.tooltip)}  
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
                                <Component key={index} {...props} />
                            )
                        )
                    }
                </Paper>
            </Modal>
        </React.Fragment>
    ); 
}

export default FullScreen