import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import SplitPane from 'react-split-pane'


import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import AssetsSummary from '../common/AssetsSummary'
import AssetsCharts from '../common/AssetsCharts'
import { resizePane } from '../../utils/splitpane'
import useStyles from './styles'
import clsx from 'clsx'

const InSight = () => { 

    const classes = useStyles()
    const [ commentBarSize , setCommentBarSize ] = useState('30%')
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
                    <div className={classes.assetSummary}>
                        <AssetsSummary />
                    </div>
                    <SplitPane
                        className={clsx(classes.splitPane, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                        split="horizontal"
                        minSize={50}
                        defaultSize={commentBarSize}
                        onDragFinished={(size) => resizePane('split5', size, setCommentBarSize)}
                        primary={'second'}
                    >
                        <AssetsCharts />
                        <AssetsCommentsTimeline toggleMinimize={toggleMinimizeAssetsCommentsTimeline} />
                    </SplitPane>
            </Grid>            
        </>
    )
}



export default InSight