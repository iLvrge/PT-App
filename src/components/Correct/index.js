import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import SplitPane from 'react-split-pane'


import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import ErrorView from './ErrorView'
/* import AssetsSummary from '../common/AssetsSummary' */
import AssetsVisualizer from '../common/AssetsVisualizer'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import USPTOContainer from '../common/AssetsVisualizer/USPTOContainer'
import PdfViewer from '../common/PdfViewer'
import ConnectionBox from '../common/ConnectionBox'

import { toggleUsptoMode } from '../../actions/uiActions'
import { resizePane, resizePane2 } from '../../utils/splitpane'

import useStyles from './styles'
import clsx from 'clsx'

const Correct = () => { 
    const dispatch = useDispatch()
    const classes = useStyles()
    const [ isDrag, setIsDrag ] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [illustrationRecord, setIllustrationRecord] = useState()
    const [ errorBarSize , setErrorBarSize ] = useState( 200 )
    const [ visualizerBarSize , setVisualizerBarSize ] = useState('60%')
    const [ commentBarSize , setCommentBarSize ] = useState('30%')
    const [ illustrationBarSize , setIllustrationBarSize ] = useState('34.2%')
    const [size, setSize] = useState(0)
    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)

    const selectedTimelineAsset = useSelector(state => state.ui.timeline.selectedAsset)
    const usptoMode = useSelector(state => state.ui.usptoMode)
    const familyMode = useSelector(state => state.ui.familyMode)
    const familyItemMode = useSelector(state => state.ui.familyItemMode)
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const connectionBoxView = useSelector(state => state.patenTrack2.connectionBoxView)
    const pdfView = useSelector(state => state.patenTrack2.pdfView)


    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])

    const onCloseUspto = useCallback(() => {
        dispatch(toggleUsptoMode( false ))
    }, [ dispatch ])

    useEffect(() => {
        if(pdfView || selectedTimelineAsset || connectionBoxView || familyItemMode || usptoMode || familyMode ) {
            setVisualizerBarSize(500)
        } else {
            setVisualizerBarSize('100%')
        }
    }, [pdfView, selectedTimelineAsset, connectionBoxView, familyItemMode, usptoMode, familyMode])

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
                {/* <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{ flexBasis: 'auto' }} 
                >
                    <AssetsSummary />
                </Grid> */}
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
                            size={errorBarSize}
                            onDragFinished={(size) => resizePane('split7', size, setErrorBarSize)}
                        >
                            <ErrorView /> 
                            <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className={classes.flexColumn}
                                style={{ background: '#292928' }}
                            >
                                <SplitPane
                                    className={`${classes.splitPane} ${classes.splitPane2}`}
                                    split="vertical"
                                    minSize={50}
                                    defaultSize={visualizerBarSize}
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
                                    {
                                        pdfView ? (<PdfViewer display={'false'} />) : 
                                        (selectedTimelineAsset || connectionBoxView || familyItemMode || usptoMode || familyMode)  ?
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
                                            primary={'second'}
                                        >

                                            {selectedTimelineAsset && (<IllustrationContainer asset={selectedTimelineAsset} />)}
                                            {selectedTimelineAsset && (<USPTOContainer asset={selectedTimelineAsset} />)}   
                                            {
                                                connectionBoxView ?
                                                (<ConnectionBox display={'false'} assets={illustrationRecord} />)
                                                :
                                                ''
                                            }
                                            {
                                            !selectedTimelineAsset && (
                                                usptoMode ? (
                                                <USPTOContainer
                                                    asset={assetIllustration} onClose={onCloseUspto} />
                                                ) : ''
                                            )
                                            }
                                        </SplitPane>
                                        :
                                        '<span></span>'
                                    }
                                </SplitPane>
                            </Grid>
                        </SplitPane>
                    </Grid>
                </Grid>
            </Grid>          
        </>
    )
}



export default Correct