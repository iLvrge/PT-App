import React, { useState } from 'react'


import Paper from '@material-ui/core/Paper'

import useStyles from './styles'

import IconButton from '@material-ui/core/IconButton'
import { Fullscreen, Close } from '@material-ui/icons'
import Modal from '@material-ui/core/Modal'


const FullScreen = ({componentItems}) => {

    const classes = useStyles()
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)

    const handleClickOpenCloseFullscreen = () => {
        setIsFullscreenOpen(!isFullscreenOpen)
    }

    return(
        <Paper className={classes.root} square>
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
                <Paper className={classes.fullscreenCharts} square>
                    <IconButton onClick={handleClickOpenCloseFullscreen} className={classes.right}>
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
        </Paper>
    ) 
}

export default FullScreen