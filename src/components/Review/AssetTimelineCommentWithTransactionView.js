import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import { Paper, Grid, List, Typography, ListSubheader } from '@material-ui/core'
import SplitPane from 'react-split-pane'

import AssetsVisualizer from '../common/AssetsVisualizer'
import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import AssetsTransactionStandalone from '../common/AssetsController/AssetsTransactionStandalone'
/* import AssetsSummary from '../common/AssetsSummary' */

import { resizePane, resizePane2 } from '../../utils/splitpane'
import routes from '../../routeList'
import useStyles from './styles'
import clsx from 'clsx'

const AssetTimelineCommentWithTransactionView = () => {
    const classes = useStyles() 
    const location = useLocation()
    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [ illustrationRecord, setIllustrationRecord ] = useState()
    const [ transactionBarSize , setTransactionBarSize ] = useState(150)
    const [ commentBarSize , setCommentBarSize ] = useState('30%')
    const [size, setSize] = useState(0)
    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])

    const handleBarSize = (size) => {
        setTransactionBarSize(size)
    }
    
    if(!location.state) return <Redirect to={routes.review} /> 
    return(   
        <>
            <Grid
                item
                lg={gridWidthClassNumber}
                md={gridWidthClassNumber} 
                sm={gridWidthClassNumber}
                xs={gridWidthClassNumber}
                className={classes.flexColumn}
            >
                <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    <Grid container 
                        style={{ flexGrow: 1, height: '100%'}} 
                    >
                        <SplitPane
                            className={`${classes.splitPane} ${classes.splitPane2}`}
                            split="vertical"
                            size={transactionBarSize}
                            onDragFinished={(size) => resizePane('split3', size, setTransactionBarSize)}
                        >
                            <AssetsTransactionStandalone  handleTransactionBarSize={handleBarSize} />
                            <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className={classes.flexColumn}
                                style={{ flexGrow: 1, height: '100%' }}
                                >
                                    {/* <div className={classes.assetSummary}>
                                        <AssetsSummary />
                                    </div> */}
                                    <SplitPane
                                        className={clsx(classes.splitPane, classes.calHeight, classes.splitPane2OverflowHidden, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                                        split="horizontal"
                                        minSize={50}
                                        defaultSize={commentBarSize}
                                        onDragFinished={(size) => {
                                            resizePane2(size, setSize)
                                            resizePane('split5', size, setCommentBarSize)
                                        }}
                                        primary={'second'}
                                        >
                                            <AssetsVisualizer   
                                            toggleMinimize={toggleMinimizeAssetsCommentsTimeline}
                                            isMinimized={assetsCommentsTimelineMinimized}
                                            setIllustrationRecord={setIllustrationRecord} />

                                            <AssetsCommentsTimeline toggleMinimize={toggleMinimizeAssetsCommentsTimeline} size={size} />
                                    </SplitPane>
                            </Grid>        
                        </SplitPane>
                    </Grid>
                </Grid>
            </Grid>   
        </>
    )
}



export default AssetTimelineCommentWithTransactionView