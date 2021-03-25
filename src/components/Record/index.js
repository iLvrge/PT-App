import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import SplitPane from 'react-split-pane'

import AssetsSummary from '../common/AssetsSummary'

import useStyles from './styles'
import clsx from 'clsx'

const Record = () => { 

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
                    <SplitPane
                        className={clsx(classes.splitPane, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                        split="horizontal"
                        minSize={100}
                        defaultSize={'70%'}
                        onChange={(size) => localStorage.setItem('midSplitPos', size)}
                        >
                            Record
                    </SplitPane>
            </Grid>            
        </>
    )
}



export default Record