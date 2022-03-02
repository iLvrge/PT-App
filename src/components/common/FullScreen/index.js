import React, { useState } from 'react'


import Paper from '@mui/material/Paper'

import useStyles from './styles'
import clsx from "clsx";
import IconButton from '@mui/material/IconButton'
import { Fullscreen, Close } from '@mui/icons-material'
import Modal from '@mui/material/Modal'


const FullScreen = ({componentItems, setScreen, showScreen, paper}) => {

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
                className={classes.fullscreenChartsModal}
                open={isFullscreenOpen}
            > 
                <Paper className={clsx(classes.fullscreenCharts, typeof paper !== 'undefined' && paper === false ? classes.noBackground : '')} square   >
                    <IconButton
                        onClick={handleClickOpenCloseFullscreen}
                        className={classes.right}
                        size="large">
                        <Close />
                    </IconButton>
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