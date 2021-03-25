import React, { useState, useCallback, useEffect  } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import SplitPane from 'react-split-pane'

import AssetsVisualizer from '../common/AssetsVisualizer'
import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import USPTOContainer from '../common/AssetsVisualizer/USPTOContainer'
/* import AssetsSummary from '../common/AssetsSummary'
import routes from '../../routeList' */
import { resizePane, resizePane2 } from '../../utils/splitpane'
import useStyles from './styles'
import clsx from 'clsx'

const AssetTimelineWithCommentView = () => {

    const classes = useStyles()
    const [customerId, setCustomerId]  = useState(0)

    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)
    const assets = useSelector(state => state.patenTrack2.assets)
    const selectedTimelineAsset = useSelector(state => state.ui.timeline.selectedAsset)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const reviewTransactionView = useSelector(state => state.patenTrack2.reviewTransactionView)
    const [ visualizerBarSize , setVisualizerBarSize ] = useState('60%')
    const [ commentBarSize , setCommentBarSize ] = useState('30%')
    const [ illustrationBarSize , setIllustrationBarSize ] = useState('60%')
    const [size, setSize] = useState(0)
    const [illustrationRecord, setIllustrationRecord] = useState()
    const [ isDrag, setIsDrag ] = useState(false)


    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])

    useEffect(()  =>{
        if(reviewTransactionView.customerId > 0) {
            setCustomerId(reviewTransactionView.customerId)
        }
    }, [reviewTransactionView, assets])

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
                {/* <div className={classes.assetSummary}>
                    <AssetsSummary />
                </div> */}
                <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    <Grid container 
                        style={{ flexGrow: 1, height: '100%', paddingRight: 6}} 
                    >
                        <SplitPane
                            className={`${classes.splitPane} ${classes.splitPane2}  ${classes.splitPane3}`}
                            split="vertical"
                            size={visualizerBarSize}
                            onDragFinished={(size) => resizePane('split4', size, setVisualizerBarSize)}
                        >
                            <SplitPane
                                className={clsx(classes.splitPane, classes.splitPane2OverflowHidden, { [classes.minimized]: assetsCommentsTimelineMinimized })}
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
                            <Grid
                                className={classes.flexColumn}
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                style={{ flexGrow: 1, height: '100%' }}
                                >
                                <SplitPane
                                    className={clsx(classes.splitPane, { [classes.onDrag]: isDrag })}
                                    split="horizontal"
                                    minSize={50}
                                    defaultSize={illustrationBarSize}
                                    onDragStarted={() => setIsDrag(true)}
                                    /* onDragFinished={() => setIsDrag(false)} */
                                    onDragFinished={(size) => {
                                        setIsDrag(false)
                                        resizePane('split6', size, setIllustrationBarSize)
                                    }} 
                                    primary='second'
                                >

                                    {selectedTimelineAsset && (<IllustrationContainer asset={selectedTimelineAsset} />)}
                                    {selectedTimelineAsset && (<USPTOContainer asset={selectedTimelineAsset} />)}   
                                </SplitPane>
                            </Grid>
                        </SplitPane>
                    </Grid>
                </Grid>
            </Grid>   
        </>
    )
}



export default AssetTimelineWithCommentView