import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import SplitPane from 'react-split-pane'


import useStyles from './styles'
import clsx from 'clsx'

const Resources = () => { 

    const classes = useStyles()
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)

    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])


    return(   
        <>
            <Grid
                item
                lg={gridWidthClassNumber}
                md={gridWidthClassNumber}
                sm={gridWidthClassNumber}
                xs={gridWidthClassNumber}
                className={classes.flexColumn}
                style={{ flexGrow: 1, height: '100%'}} 
                >
                    
                    Resources
            </Grid>            
        </>
    )
}



export default Resources