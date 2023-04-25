import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useLocation } from "react-router-dom";

import SplitPane from 'react-split-pane' 
import MainCompaniesSelector from '../common/MainCompaniesSelector'
import AssignmentsType from '../common/AssignmentsType'
import CustomerTable from '../common/CustomerTable'
import InventorTable from '../common/InventorTable' 
import AssignmentsTable from '../common/AssignmentsTable'
import AssetsTable from '../common/AssetsTable'
import IllustrationCommentContainer from '../common/IllustrationCommentContainer'
import AssetDetailsContainer from '../common/AssetDetailsContainer' 
import LayoutTemplates from '../common/LayoutTemplates'
import FilesTemplates from '../common/FilesTemplates'
import ForeignAsset from '../common/ForeignAsset'
import { resizePane, resizePane2, editorBar } from '../../utils/splitpane'
import { updateResizerBar } from '../../utils/resizeBar' 
import { Steps } from 'intro.js-react';
import config from "../common/PatentrackDiagram/config.json";

import { 
    assetLegalEvents, 
    assetFamily,
    setAssetFamily,
    setAssetLegalEvents,
    setFamilyItemDisplay,
    setConnectionData,
    setConnectionBoxView,
} from '../../actions/patenTrackActions'

import { 
    setMaintainenceAssetsList,
    getMaintainenceAssetsList,
    setAssetsIllustration, 
    setSelectedAssetsPatents,
    setCommentsEntity,
    setSelectedMaintainenceAssetsList,
    setChannelID,
    getChannelID,
    getSlackMessages,
    setMaintainenceFileName,
    setSlackMessages,
    setBreadCrumbs,
    setSelectedCategory,
    setBreadCrumbsAndCategory,
    setViewEnableStep
} from '../../actions/patentTrackActions2'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode, toggleLifeSpanMode, setMaintainenceFeeFrameMode, setPatentScreen, setDashboardScreen, setTimelineScreen } from '../../actions/uiActions'

import useStyles from './styles'
import clsx from 'clsx'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import Maintainance from '../common/Maintainence'
import { useReloadLayout } from '../../utils/useReloadLayout';
import {ANALYTICS_STRING, CHART_STRING, DISCUSSION_STRING, TV_STRING } from '../../utils/icons';

const PatentLayout = ({
    type,
    openBar,
    companyBarSize, 
    setCompanyBarSize, 
    handleCompanyButton, 
    handleCompanyBarOpen, 
    toggleButtonType, 
    companyButtonVisible, 
    visualizerBarSize,
    setVisualizerBarSize, 
    setVisualizeOpenBar,
    openTypeBar,
    typeBarSize,
    setTypeBarSize,
    handleTypeButton,
    handleTypeBarOpen,
    toggleTypeButtonType,
    typeButtonVisible,
    openOtherPartyBar,
    openInventorBar,
    openGoogleDriveBar,
    otherPartyBarSize,
    setOtherPartyBarSize,
    partyBarSize,
    driveBarSize,
    handleOtherPartyButton,
    handleOtherPartyBarOpen,
    toggleOtherPartyButtonType,
    otherPartyButtonVisible,
    assignmentBarSize,
    setAssignmentBarSize,
    handleAssignmentButton,
    openAssignmentBar,
    handleAssignmentBarOpen,
    toggleAssignmentButtonType,
    assignmentButtonVisible,
    customerBarSize,
    setCustomerBarSize,
    handleCustomerButton,
    openCustomerBar,
    handleCustomersBarOpen,
    handleCommentBarOpen,
    toggleCustomerButtonType,
    customerButtonVisible,
    commentBarSize,
    setCommentBarSize,
    openCommentBar,
    openIllustrationBar,
    handleIllustrationBarOpen,
    handleChartBarOpen,
    handleAnalyticsBarOpen,
    changeVisualBar,
    setIsDrag,
    setSize,
    size,
    illustrationRecord,
    setIllustrationRecord,
    illustrationBarSize,
    setIllustrationBarSize,
    openChartBar,
    openAnalyticsBar,
    openVisualizerBar,
    setAnalyticsBar,
    setChartBar,
    openAnalyticsAndCharBar,
    closeAnalyticsAndCharBar,
    checkChartAnalytics,
    setAssetFilesBarSize,
    assetFilesBarSize,
    assetFilesBar,
    driveTemplateBarSize,
    driveTemplateFrameMode,
    driveTemplateMode
}) => {
    
    const classes = useStyles() 
    const dispatch = useDispatch()
    const location = useLocation()
    const mainContainerRef = useRef()
    const companyRef = useRef()
    const assignmentTypeRef = useRef()
    const otherPartyRef = useRef()
    const entityRef = useRef()
    const assignmentRef = useRef()
    const assetRef = useRef()
    const assetFileRef = useRef()
    const fileBarRef = useRef()
    const templateFileRef = useRef()
    const [sheetName, setSheetName] = useState('')
    const [isLoaded, checkPageLoad] = useReloadLayout()
    const [ gap, setGap ] = useState( { x: '14.1rem', y: '7.5rem'} )
    const [ isDragging, setIsDragging] = useState(false) 
    const [ isFullscreenOpen, setIsFullscreenOpen] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const viewEnableSteps = useSelector(state => state.patenTrack2.viewEnableSteps);
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedMainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )

    
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents )
    

    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList )
    const assetTypeAssignmentAssets = useSelector( state => state.patenTrack2.assetTypeAssignmentAssets )
    const channel_id = useSelector( state => state.patenTrack2.channel_id )   
    const STEPS = [ 
        {
            element: document.querySelector('.inner-step-1'), 
            intro: `The Assets table lists the patent and patent applications filtered under the category you just selected.`,
            position: 'right',
            tooltipClass: 'dashboardIntroTooltip',
            highlightClass: 'dashboardHighlightClass',
        },
        {
            element: document.querySelector('.inner-step-2'),
            intro: `Use these 4 buttons to open and close the 4 windows in this view.<ul><li><div><span>${TV_STRING}</span> - main window</div></li><li><div><span>${DISCUSSION_STRING}</span> - group chatting. We dedicated a Slack/Teams channel for each patent assets in which your team can collaborate.</div></li><li><div><span>${CHART_STRING}</span> - analytical data</div></li><li><div><span>${ANALYTICS_STRING}</span> - additional analytical data</div></li></ul>`,
            position: 'right',
            tooltipClass: 'dashboardIntroTooltip',
            highlightClass: 'dashboardHighlightClass',
        } 
    ]
    const checkContainer = () => {
        /* setTimeout(() => {
            if( mainContainerRef.current != null  && mainContainerRef.current != undefined) {                
                const mainWidth = mainContainerRef.current.pane2.clientWidth, illustrationContainer = mainContainerRef.current.pane1.querySelector('#patentrackDiagramDiv')
                if( illustrationContainer != null && illustrationContainer != undefined ) {
                    const illustrationWidth = illustrationContainer.clientWidth - 3
                    onHandleIllustrationSize(mainWidth - illustrationWidth)
                } else {
                    checkContainer()
                }
            } else {
                checkContainer()
            }            
        }, 1000) */
    }

    useEffect(() => {
        dispatch(setTimelineScreen(false))
        dispatch(setDashboardScreen(false))
        dispatch(setPatentScreen(true))
        /* dispatch(setBreadCrumbs('Assets')) */
    }, [])

 
    useEffect(() => {
        if(!isLoaded) { 
            checkPageLoad(1)
        }
    }, []) 

    useEffect(() => {
        if((maintainenceAssetsList.list.length > 0 || assetTypeAssignmentAssets.list.length > 0) && viewEnableSteps === false) {
            dispatch(setViewEnableStep(true))
        }
    }, [maintainenceAssetsList, assetTypeAssignmentAssets])

    useEffect(() => {
        if(openAssignmentBar === true) {
            handleAssignmentBarOpen()
        }
        if( openCommentBar === false ) {
            handleCommentBarOpen()
        }
        let statusChange = false;

        if(openIllustrationBar === false) {
            statusChange = true
            handleIllustrationBarOpen()
        } 
        if( openChartBar === false ) {
            statusChange = true
            handleChartBarOpen()
        }
        if( openAnalyticsBar === false ) {
            statusChange = true
            handleAnalyticsBarOpen()
        }
        if(statusChange === true) {
            changeVisualBar(true, true, true, true)
        }

    }, [selectedCategory])

    useEffect(() => {
        if( type === 0 ) {
            if(selectedMainCompanies.length > 0) {
                dispatch( getMaintainenceAssetsList( selectedMainCompanies ))
            } else {
                resetAll(dispatch)
            }
        }
        
    }, [ dispatch, selectedMainCompanies , type ])

    useEffect(() => {
        if( type === 0 ) {
            if(selectedCompaniesAll === true) {
                dispatch( getMaintainenceAssetsList( [] ))
            } else {
                resetAll(dispatch)
            }
        }
    }, [dispatch, selectedCompaniesAll, type ])

    useEffect(() => {
        checkContainer()
    }, [ selectedAssetsPatents, visualizerBarSize ])
    
    useEffect(() => {
        if(openVisualizerBar === false) {
            if( openAnalyticsBar === true ) {
                setAnalyticsBar( !openAnalyticsBar )
            }
            if( openChartBar === true ) {
                setChartBar( !openChartBar )
            }
        }
    }, [ openVisualizerBar ])
    

    useEffect(() => {
        updateResizerBar(companyRef, openBar)
    }, [ companyRef, openBar ])

    useEffect(() => {
        updateResizerBar(assignmentTypeRef, openTypeBar)
    }, [ assignmentTypeRef, openTypeBar ])

    useEffect(() => {
        updateResizerBar(otherPartyRef, openOtherPartyBar === false && openInventorBar === false ? false : true)
        updateResizerBar(entityRef, openOtherPartyBar === true && openInventorBar === true ? true : false, 1 )
    }, [ otherPartyRef, entityRef, openOtherPartyBar, openInventorBar ])

    useEffect(() => {
        updateResizerBar(assignmentRef, openAssignmentBar)
    }, [ assignmentRef, openAssignmentBar ])

    useEffect(() => {
        updateResizerBar(assetRef, openCustomerBar)
    }, [ assetRef, openCustomerBar ])

    useEffect(() => {
        updateResizerBar(mainContainerRef, openVisualizerBar)
    }, [ mainContainerRef, openVisualizerBar ])

    useEffect(() => {
        if( openCommentBar === false && openIllustrationBar === false && openChartBar === false && openAnalyticsBar === false ) {
            updateResizerBar(mainContainerRef, false)
            if( openVisualizerBar === true ) {
                setVisualizeOpenBar(false)
            }
        }        
    }, [ mainContainerRef, openVisualizerBar, openCommentBar, openIllustrationBar, openChartBar, openAnalyticsBar ])

    useEffect(() => {
        updateResizerBar(assetFileRef, assetFilesBar === false && openGoogleDriveBar === false ? false : true )
        updateResizerBar(fileBarRef, assetFilesBar === true && openGoogleDriveBar === true ? true : false, 1 )
    }, [ assetFileRef, fileBarRef,  assetFilesBar, openGoogleDriveBar ])  

    useEffect(() => {
        updateResizerBar(templateFileRef, driveTemplateMode)
    }, [ templateFileRef, driveTemplateMode ])    

    const resetAll = (dispatch) => {
        dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
        dispatch( setSelectedAssetsPatents( [] ) )
        dispatch( setChannelID( "" ) )
        dispatch( setAssetsIllustration( null ) )
        dispatch( setSlackMessages( [] ) )
        dispatch( setAssetFamily( [] ) )
        dispatch( setAssetLegalEvents( {main: [], other: []} ) )
        dispatch( setFamilyItemDisplay( null ) )
        dispatch( setConnectionData( null ) )
        dispatch( setConnectionBoxView( false ) )
        dispatch( toggleUsptoMode( false ) )
        dispatch( toggleLifeSpanMode( true ) )
        dispatch( toggleFamilyMode( false ) )
        dispatch( toggleFamilyItemMode( false ) )
    }

    const onHandleIllustrationSize = (size) => {
        if(mainContainerRef.current != null ) {
            
            const containerSize = mainContainerRef.current.pane2.clientWidth
            const windowWidth = size != undefined ? containerSize - size - 3 : mainContainerRef.current.pane1.querySelector('#patentrackDiagramDiv').clientWidth, pixelSize = 14, totalColumn = 4,  totalGap = 3
            /* console.log(windowWidth, config.node, ((windowWidth - parseFloat(config.node.leftOffset) - ( totalColumn * parseFloat(config.node.width))) / totalGap)) */


            const xGap = (windowWidth - parseFloat(config.node.leftOffset) - ( totalColumn * parseFloat(config.node.width))) / totalGap            
            /* setGap({
                ...gap, 
                x: `${parseFloat(xGap / pixelSize).toFixed(2)}rem`  
            }) */

            setGap({...gap, x: '14.1rem'})    
        }
    } 

    /* const onHandleIllustrationSize = (size) => {
        if(mainContainerRef.current != null ) {
            const containerSize = mainContainerRef.current.pane2.clientWidth
            const illustrationSize = mainContainerRef.current.pane1.querySelector('#patentrackDiagramDiv').clientWidth
            const width = 620
            if( illustrationSize > width ) {
                const constantX = 14.1, constantValue = parseFloat(constantX / width).toFixed(4)
                let calc = ((illustrationSize / 14 ) - 1.4 ) * constantValue
                if(calc > 14.1) {
                    setGap({...gap, x: `${parseFloat(calc).toFixed(1)}rem`}) 
                }
            } else {
                setGap({...gap, x: '14.1rem'}) 
            }
        }
    } */


    //console.log('GlobalScreen=>type', type)

    const handleTextChange = (name) => {
        setSheetName(name);
    }

    const handleClickOpenFullscreen = () => {
        setIsFullscreenOpen(true)
    }

    const onExit = () => {
        dispatch(setViewEnableStep(false))
    }


    return (
        <React.Fragment>
        <SplitPane
            className={classes.splitPane}
            split="vertical"
            size={companyBarSize}
            onChange={(size) => { 
                setCompanyBarSize(size > 900 ? 900 : size)
            }}
            onDragFinished={(size) => resizePane('split1', size, setCompanyBarSize)}
            ref={companyRef}
        >
            <div 
                className={clsx(classes.companyBar, 'step-1')}
                id={`company_container`} >
                { 
                    openBar === true 
                    ? 
                        <>
                            {/* <ArrowButton arrowId={`arrow_company`} handleClick={handleCompanyBarOpen} buttonType={toggleButtonType} buttonVisible={companyButtonVisible}/> */}
                            {
                                type == 9 
                                ? 
                                    <ForeignAsset sheetName={sheetName} handleSheetName={handleTextChange}/>
                                :
                                    <MainCompaniesSelector 
                                        selectAll={false} 
                                        defaultSelect={''} 
                                        addUrl={true} 
                                        parentBarDrag={setVisualizerBarSize}
                                        parentBar={setVisualizeOpenBar}                                
                                    /> 
                            }
                        </>
                    : 
                    ''
                }
            </div>
            <SplitPane
                className={classes.splitPane}
                split="vertical"
                size={typeBarSize}
                onChange={(size) => { 
                    setTypeBarSize(size > 900 ? 900 : size)
                }}
                onDragFinished={(size) => resizePane('split9', size > 900 ? 900 : size, setTypeBarSize)}
                ref={assignmentTypeRef}
            >
                <div id={`activity_container`} style={{ height: '100%'}}>
                    { 
                        openTypeBar === true 
                        ? 
                            <>
                                {/* <ArrowButton arrowId={`arrow_activity`} handleClick={handleTypeBarOpen} buttonType={toggleTypeButtonType} buttonVisible={typeButtonVisible}/> */}
                                <AssignmentsType
                                    parentBarDrag={setVisualizerBarSize}
                                    parentBar={setVisualizeOpenBar}
                                    type={type}
                                    {...(type === 2 && {defaultLoad: false})}
                                />  
                            </>
                        : 
                        '' 
                    }
                </div>
                <SplitPane
                    className={classes.splitPane}
                    split="vertical"
                    size={otherPartyBarSize}
                    onChange={(size) => { 
                        setOtherPartyBarSize(size > 900 ? 900 : size)
                    }} 
                    onDragFinished={(size) => resizePane('split7', size > 900 ? 900 : size, setOtherPartyBarSize)}
                    ref={otherPartyRef}
                >
                    <div id={`parties_container`}  style={{ height: '100%'}}>
                        { 
                            openOtherPartyBar === true || openInventorBar === true
                            ? 
                                <>
                                    {/* <ArrowButton arrowId={`arrow_parties`} handleClick={handleOtherPartyBarOpen} buttonType={toggleOtherPartyButtonType} buttonVisible={otherPartyButtonVisible}/> */}
                                    <SplitPane
                                        className={classes.splitPane}
                                        split={`horizontal`}
                                        size={partyBarSize}
                                        ref={entityRef}
                                    >
                                        {
                                            openOtherPartyBar === true 
                                            ?
                                                <CustomerTable 
                                                    standalone={true}
                                                    parentBarDrag={setVisualizerBarSize}
                                                    parentBar={setVisualizeOpenBar}
                                                    type={type}
                                                    customerType={0}
                                                />
                                            :
                                            <div></div>
                                        }

                                        {
                                            openInventorBar === true 
                                            ?
                                                <InventorTable 
                                                    standalone={true}
                                                    parentBarDrag={setVisualizerBarSize}
                                                    parentBar={setVisualizeOpenBar}
                                                    type={type}
                                                    customerType={1}
                                                />
                                            :
                                            <div></div>
                                        }
                                    </SplitPane>
                                </>
                            : 
                            ''
                        }
                    </div>
                    <SplitPane
                        className={classes.splitPane}
                        split="vertical"
                        size={assignmentBarSize}
                        onChange={(size) => { 
                            setAssignmentBarSize(size > 900 ? 900 : size)
                        }} 
                        onDragFinished={(size) => resizePane('split8', size > 900 ? 900 : size, setAssignmentBarSize)}
                        ref={assignmentRef}
                    >
                        <div id={`transaction_container`} style={{ height: '100%'}}>
                            { 
                                openAssignmentBar === true && selectedCategory == 'due_dilligence'
                                ? 
                                    <>
                                        {/* <ArrowButton 
                                            arrowId={`arrow_transactions`} 
                                            handleClick={handleAssignmentBarOpen} 
                                            buttonType={toggleAssignmentButtonType} 
                                            buttonVisible={assignmentButtonVisible}/> */}
                                        <AssignmentsTable 
                                            type={type} 
                                            defaultLoad={type === 2 ? false : true} />
                                    </>
                                : 
                                ''
                            }
                        </div>
                        <SplitPane
                            className={classes.splitPane}
                            split="vertical"
                            size={customerBarSize}
                            onChange={(size) => { 
                                setCustomerBarSize(size > 900 ? 900 : size)
                            }} 
                            onDragFinished={(size) => resizePane('split2', size > 900 ? 900 : size, setCustomerBarSize)}
                            ref={assetRef}
                        >
                            <div id={`assets_container`} style={{ height: '100%'}} className={'inner-step-1'}>
                                { 
                                    openCustomerBar === true 
                                    ? 
                                        <>
                                            {/* <ArrowButton 
                                                arrowId={`arrow_assets`} 
                                                handleClick={handleCustomersBarOpen} 
                                                buttonType={toggleCustomerButtonType} 
                                                buttonVisible={customerButtonVisible}/> */}
                                            {
                                                type != 5 
                                                ?
                                                    (
                                                        <AssetsTable 
                                                            standalone={true} 
                                                            type={type} 
                                                            openChartBar={openChartBar}
                                                            openAnalyticsBar={openAnalyticsBar}
                                                            openAnalyticsAndCharBar={openAnalyticsAndCharBar}
                                                            closeAnalyticsAndCharBar={closeAnalyticsAndCharBar}
                                                            changeVisualBar={setVisualizerBarSize}
                                                            openIllustrationBar={openIllustrationBar}
                                                            commentBar={openCommentBar}
                                                            handleChartBarOpen={handleChartBarOpen}
                                                            handleAnalyticsBarOpen={handleAnalyticsBarOpen}
                                                            handleIllustrationBarOpen={handleIllustrationBarOpen}
                                                            handleVisualBarSize={changeVisualBar}
                                                            handleCommentBarOpen={handleCommentBarOpen}
                                                            {...(typeof selectedCategory == 'pay_maintainence_fee' ? {assets: maintainenceAssetsList} : {})} 
                                                        />
                                                    )
                                                :
                                                    <React.Fragment>
                                                    </React.Fragment>
                                                
                                            } 
                                            
                                        </> 
                                    : 
                                    ''
                                }
                            </div>
                            <SplitPane
                                className={classes.splitPane}
                                split="vertical"
                                size={assetFilesBarSize}
                                ref={assetFileRef}
                                onDragStarted={() => {
                                    setIsDragging(!isDragging)
                                }}
                                onDragFinished={(size) => {
                                    //resizePane('split10', size, setAssetFilesBarSize)
                                    setIsDragging(!isDragging)
                                }}
                                pane2Style={{
                                    pointerEvents: isDragging === true ? 'none' : 'auto',
                                }}  
                            >
                                <div id={`assets_files_container`} style={{ height: '100%'}}>
                                    <SplitPane
                                        className={classes.splitPane}
                                        split={`horizontal`}
                                        size={driveBarSize}
                                        ref={fileBarRef}
                                    >
                                        {
                                            assetFilesBar === true
                                            ?
                                                <FilesTemplates type={0}/>
                                            :
                                            <div></div>
                                        }  
                                        {
                                            openGoogleDriveBar === true
                                            ?
                                                <FilesTemplates type={1}/>
                                            :
                                            <div></div>
                                        }
                                    </SplitPane>                                    
                                </div> 
                                <SplitPane
                                    className={classes.splitPane}
                                    split="vertical"
                                    size={driveTemplateBarSize}
                                    ref={templateFileRef}
                                    onDragStarted={() => {
                                        setIsDragging(!isDragging)
                                    }}
                                    onDragFinished={(size) => {
                                        /* resizePane('split4', size, setVisualizerBarSize) */
                                        setIsDragging(!isDragging)
                                    }}
                                    pane2Style={{
                                        pointerEvents: isDragging === true ? 'none' : 'auto',
                                    }}  
                                >
                                    <div id={`layout_templates_container`} style={{ height: '100%'}}>
                                        {
                                            driveTemplateMode === true
                                            ?
                                                <LayoutTemplates />
                                            :
                                            ''
                                        }
                                    </div>
                                    <SplitPane
                                        className={`${classes.splitPane} ${classes.splitPane2}  ${classes.splitPane3} ${classes.splitPane2OverflowUnset}`}
                                        split="vertical"
                                        minSize={100}
                                        maxSize={-270}  
                                        size={visualizerBarSize}
                                        onChange={(size) => { 
                                            setVisualizerBarSize(size)
                                            //editorBar(1) 
                                        }} 
                                        onDragStarted={() => {
                                            setIsDragging(!isDragging)
                                        }}
                                        onDragFinished={(size) => {
                                            resizePane('split4', size, setVisualizerBarSize)
                                            setIsDragging(!isDragging)
                                        }}
                                        pane1Style={{  
                                            pointerEvents: isDragging === true ? 'none' : 'auto',
                                        }}
                                        pane2Style={{
                                            pointerEvents: isDragging === true ? 'none' : 'auto',
                                        }}
                                        ref={mainContainerRef}
                                        primary={'second'}                                
                                    >
                                        <div className={isDragging === true ? classes.notInteractive : classes.isInteractive} style={{ height: '100%'}}>
                                            <IllustrationCommentContainer 
                                                cls={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPane1OverflowUnset, classes.paneHeightZero, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                                                split={`horizontal`} 
                                                minSize={50}
                                                maxSize={-200}
                                                defaultSize={commentBarSize}
                                                fn={resizePane}
                                                fnParams={setCommentBarSize}
                                                commentBar={openCommentBar}
                                                companyBarSize={companyBarSize}
                                                openCustomerBar={openCustomerBar}
                                                illustrationBar={openIllustrationBar}
                                                illustrationBarSize={illustrationBarSize}
                                                visualizerBarSize={visualizerBarSize}
                                                customerBarSize={customerBarSize}
                                                fnVarName={`split5`}
                                                fn2={resizePane2}
                                                fn2Params={setSize}
                                                primary={'second'}
                                                illustrationRecord={setIllustrationRecord}
                                                channel_id={channel_id}
                                                setChannel={setChannelID}
                                                size={size}
                                                gap={gap}
                                                templateButton={false}
                                                maintainenceButton={false}
                                                chartsBar={openChartBar}
                                                analyticsBar={openAnalyticsBar}
                                                chartsBarToggle={handleChartBarOpen}
                                                checkChartAnalytics={checkChartAnalytics}
                                                type={type}
                                                assignmentBar={openAssignmentBar}
                                                assignmentBarToggle={handleAssignmentBarOpen}
                                                setAnalyticsBar={setAnalyticsBar}
                                                setChartBar={setChartBar}
                                                handleCommentBarOpen={handleCommentBarOpen}
                                                handleCustomersBarOpen={handleCustomersBarOpen}
                                                cube={selectedCategory === 'ptab' ? false : true}
                                                ptab={selectedCategory === 'ptab' ? true : false}
                                                maintainence={selectedCategory === 'late_maintainance' ? true : false}
                                                record={selectedCategory === 'missed_monetization' ? true : false}
                                            /> 
                                        </div>
                                        <div className={isDragging === true ? classes.notInteractive : classes.isInteractive} style={{ height: '100%'}}>
                                            <AssetDetailsContainer 
                                                cls={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPaneMainOverflowUnset, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                                                split={`horizontal`}
                                                minSize={10}
                                                defaultSize={illustrationBarSize}
                                                fn={resizePane}
                                                fnParams={setIllustrationBarSize}
                                                fnVarName={`split6`}
                                                dragStart={setIsDrag}
                                                dragFinished={setIsDrag}
                                                bar={openVisualizerBar}
                                                visualizerBarSize={visualizerBarSize}
                                                parentBarDrag={setVisualizerBarSize}
                                                parentBar={setVisualizeOpenBar}
                                                primary={'second'}
                                                illustrationData={illustrationRecord}
                                                chartBar={openChartBar}
                                                analyticsBar={openAnalyticsBar}
                                                openCustomerBar={openCustomerBar}
                                                commentBar={openCommentBar}
                                                illustrationBar={openIllustrationBar}
                                                customerBarSize={customerBarSize}
                                                companyBarSize={companyBarSize}
                                                isDragging={isDragging}
                                                type={type}
                                                cube={true}
                                            />                                
                                        </div>
                                    </SplitPane>
                                </SplitPane>
                            </SplitPane>
                        </SplitPane>
                    </SplitPane>
                </SplitPane>
            </SplitPane>
        </SplitPane>
        <Steps 
            enabled={viewEnableSteps}
            steps={STEPS}
            initialStep={0}
            onExit={onExit}
        />
        </React.Fragment> 
    )
}


export default PatentLayout