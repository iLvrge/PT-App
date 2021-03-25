import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {  Grid } from '@material-ui/core'
import SplitPane from 'react-split-pane'

import AssetsVisualizer from '../common/AssetsVisualizer'
import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import AssetsTransactionStandalone from '../common/AssetsController/AssetsTransactionStandalone'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import USPTOContainer from '../common/AssetsVisualizer/USPTOContainer'
import FamilyItemContainer from '../common/AssetsVisualizer/FamilyItemContainer'
import FamilyContainer from '../common/AssetsVisualizer/FamilyContainer'
import LifeSpanContainer from '../common/AssetsVisualizer/LifeSpanContainer'
import InventionVisualizer from '../common/AssetsVisualizer/InventionVisualizer'
import PdfViewer from '../common/PdfViewer'
import ConnectionBox from '../common/ConnectionBox'
/* import AssetsSummary from '../common/AssetsSummary' */

import { toggleFamilyItemMode, toggleFamilyMode, toggleUsptoMode } from '../../actions/uiActions'
import { resizePane, resizePane2 } from '../../utils/splitpane'

import useStyles from './styles'
import clsx from 'clsx'

const AssetTimelineCommentWithTransactionView = () => {
    const classes = useStyles() 
    const dispatch = useDispatch() 
    const location = useLocation()
    const reviewTransactionView = useSelector(state => state.patenTrack2.reviewTransactionView)
    const selectedTimelineAsset = useSelector(state => state.ui.timeline.selectedAsset)
    const assets = useSelector(state => state.patenTrack2.assets)

    const usptoMode = useSelector(state => state.ui.usptoMode)
    const lifeSpanMode = useSelector(state => state.ui.lifeSpanMode)
    const familyMode = useSelector(state => state.ui.familyMode)
    const familyItemMode = useSelector(state => state.ui.familyItemMode)
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const selectedAssetsFamily = useSelector(state => state.patenTrack.assetFamily)
    const selectedAssetsFamilyItem = useSelector(state => state.patenTrack.familyItem)
    const connectionBoxView = useSelector(state => state.patenTrack2.connectionBoxView)
    const pdfView = useSelector(state => state.patenTrack2.pdfView)
    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)

    const [assetType, setAssetType]   =  useState(0)
    const [companyId, setCompanyId]  = useState(0)
    const [customerId, setCustomerId]  = useState(0)
    const [transactions, setTransactions] = useState({transactions:[], transactionCount: 0})
    const [ offset, setOffset ] = useState(0)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [illustrationRecord, setIllustrationRecord] = useState()
    const [ isDrag, setIsDrag ] = useState(false)
    const [ transactionBarSize , setTransactionBarSize ] = useState(150)
    const [ visualizerBarSize , setVisualizerBarSize ] = useState('60%')
    const [ commentBarSize , setCommentBarSize ] = useState('30%')
    const [ illustrationBarSize , setIllustrationBarSize ] = useState('34.2%')
    const [size, setSize] = useState(0)

    const [ tvPosition, setTvPosition] = useState(0)

    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, []) 

    const onCloseUspto = useCallback(() => {
        dispatch(toggleUsptoMode( false ))
    }, [ dispatch ])
    
    const onCloseFamilyMode = useCallback(() => {
        dispatch(toggleFamilyMode())
    }, [ dispatch ])
    
    const onCloseFamilyItemMode = useCallback(() => {
        dispatch(toggleFamilyItemMode(false))
    }, [ dispatch ])

    const handleBarSize = (size) => {
        setTransactionBarSize(size)
    }

    useEffect(() => {
        console.log("transactionBarSize, visualizerBarSize, commentBarSize, illustrationBarSize", transactionBarSize, visualizerBarSize, commentBarSize, illustrationBarSize)
    }, [ transactionBarSize, visualizerBarSize, commentBarSize, illustrationBarSize ])

    useEffect(() => {
        if(reviewTransactionView.customerId > 0) {
            setCompanyId(reviewTransactionView.companyId)
            setAssetType(reviewTransactionView.assetType)
            setCustomerId(reviewTransactionView.customerId)

            if(assets[reviewTransactionView.assetType][reviewTransactionView.customerId]){
                setTransactions(assets[reviewTransactionView.assetType][reviewTransactionView.customerId])
            }
        }
    }, [reviewTransactionView, assets])

    useEffect(() => {
        console.log("asdasdasas", selectedAssetsPatents, selectedAssetsTransactions)
        if(selectedAssetsTransactions.length > 0 && selectedAssetsPatents.length === 0) {
            console.log(1)
            setTvPosition(1)
        } else {
            console.log(2)
            setTvPosition(0)
        }
    }, [location, selectedAssetsPatents, selectedAssetsTransactions])


    /* if(customerId == 0) return <Redirect to={routes.review} /> */

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
                                {
                                    tvPosition == 1
                                    ?
                                    <SplitPane
                                        className={`${classes.splitPane} ${classes.splitPane2}  ${classes.splitPane3}`}
                                        split="vertical"
                                        minSize={50}
                                        defaultSize={visualizerBarSize}
                                        onDragFinished={(size) => resizePane('split4', size, setVisualizerBarSize)}
                                        
                                    >
                                        {
                                            pdfView ? (<PdfViewer display={'false'} />) :   
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
                                            >

                                                {selectedTimelineAsset && (<IllustrationContainer asset={selectedTimelineAsset} />)}
                                                {selectedTimelineAsset && (<USPTOContainer asset={selectedTimelineAsset} />)}   
                                                {
                                                    connectionBoxView ?
                                                    (<ConnectionBox display={'false'} assets={illustrationRecord} />)
                                                    :
                                                    familyItemMode && !selectedTimelineAsset ? (
                                                        <FamilyItemContainer item={selectedAssetsFamilyItem} onClose={onCloseFamilyItemMode} />
                                                    )
                                                    :
                                                    !selectedTimelineAsset && (<InventionVisualizer />)
                                                }
                                                {
                                                !selectedTimelineAsset && (
                                                    usptoMode ? (
                                                    <USPTOContainer
                                                        asset={assetIllustration} onClose={onCloseUspto} />
                                                    ) : familyMode ? (
                                                    <FamilyContainer
                                                        family={selectedAssetsFamily}
                                                        onClose={onCloseFamilyMode} />) : lifeSpanMode ? (
                                                    <LifeSpanContainer />
                                                    ) :  ''
                                                )
                                                }
                                                <span></span>
                                            </SplitPane>
                                        } 
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
                                    </SplitPane>
                                    :

                                    <SplitPane
                                        className={`${classes.splitPane} ${classes.splitPane2}  ${classes.splitPane3}`}
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
                                                    familyItemMode && !selectedTimelineAsset ? (
                                                        <FamilyItemContainer item={selectedAssetsFamilyItem} onClose={onCloseFamilyItemMode} />
                                                    )
                                                    :
                                                    !selectedTimelineAsset && (<InventionVisualizer />)
                                                }
                                                {
                                                !selectedTimelineAsset && (
                                                    usptoMode ? (
                                                    <USPTOContainer
                                                        asset={assetIllustration} onClose={onCloseUspto} />
                                                    ) : familyMode ? (
                                                    <FamilyContainer
                                                        family={selectedAssetsFamily}
                                                        onClose={onCloseFamilyMode} />) : lifeSpanMode ? (
                                                    <LifeSpanContainer />
                                                    ) :  ''
                                                )
                                                }
                                                <span></span>
                                            </SplitPane>
                                        } 
                                    </SplitPane>
                                }
                            </Grid>
                        </SplitPane>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}



export default AssetTimelineCommentWithTransactionView