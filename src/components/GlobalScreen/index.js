import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    useLocation
  } from "react-router-dom";
import SplitPane from 'react-split-pane'


import ArrowButton from '../common/ArrowButton'
import MainCompaniesSelector from '../common/MainCompaniesSelector'
import AssignmentsType from '../common/AssignmentsType'
import CustomerTable from '../common/CustomerTable'
import InventorTable from '../common/InventorTable'
import CorrectAddressTable from '../common/CorrectAddressTable'
import AssignmentsTable from '../common/AssignmentsTable'
import AssetsTable from '../common/AssetsTable'
import IllustrationCommentContainer from '../common/IllustrationCommentContainer'
import AssetDetailsContainer from '../common/AssetDetailsContainer'
import MaintainenceAssetsList from '../common/MaintainenceAssetsList'
import LayoutTemplates from '../common/LayoutTemplates'
import FilesTemplates from '../common/FilesTemplates'
import ForeignAsset from '../common/ForeignAsset'
import { resizePane, resizePane2, editorBar } from '../../utils/splitpane'
import { updateResizerBar } from '../../utils/resizeBar'
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
    setMainCompanies,
    setMainCompaniesSelected,
    setAssetTypesSelect,
    setSelectAssignmentCustomers,
    setDashboardShareData
} from '../../actions/patentTrackActions2'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode, toggleLifeSpanMode, setMaintainenceFeeFrameMode, setTimelineScreen } from '../../actions/uiActions'

import useStyles from './styles'
import clsx from 'clsx'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import LegalEventsContainer from '../common/AssetsVisualizer/LegalEventsContainer'
import ConnectionBox from '../common/ConnectionBox'
import PdfViewer from '../common/PdfViewer'
import IllustrationPdf from '../common/AssetDetailsContainer/IllustrationPdf'
import PatenTrackApi from '../../api/patenTrack2'
import LawFirmTable from '../common/LawFirmTable';
import FamilyContainer from '../common/AssetsVisualizer/FamilyContainer';
import SecuredAssets from '../common/SecuredAssets';

const GlobalScreen = ({
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
    handleInventorBarOpen,
    toggleCustomerButtonType,
    customerButtonVisible,
    commentBarSize,
    setCommentBarSize,
    openCommentBar,
    openIllustrationBar,
    handleIllustrationBarOpen,
    handleChartBarOpen,
    handleAnalyticsBarOpen,
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
    driveTemplateMode,
    securedTransactionAssets
}) => {
    const classes = useStyles() 
    let location = useLocation();
    const dispatch = useDispatch()
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
    const [ gap, setGap ] = useState( { x: '14.1rem', y: '7.5rem'} )
    const [ isDragging, setIsDragging] = useState(false)
    const [ isFullscreenOpen, setIsFullscreenOpen] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const timelineScreen = useSelector(state => state.ui.timelineScreen)
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
    const dashboardPanel = useSelector(state => state.ui.dashboardPanel)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const companies = useSelector( state => state.patenTrack2.mainCompaniesList.list)
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedMainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )

    
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents )
    
    const connectionBoxView = useSelector( state => state.patenTrack.connectionBoxView)
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList )
    const maintainenceAssetsLoadingMore = useSelector( state => state.patenTrack2.maintainenceAssetsLoadingMore )
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const channel_id = useSelector( state => state.patenTrack2.channel_id )   
    const selectedAssetsLegalEvents = useSelector(state => state.patenTrack.assetLegalEvents)
    const connectionBoxData = useSelector(state =>  state.patenTrack.connectionBoxData)
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const dashboard_share_selected_data = useSelector(state => state.patenTrack2.dashboard_share_selected_data)
    const selectedAssetsFamily = useSelector(state => state.patenTrack.assetFamily) 
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
        if(process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' && auth_token !== null) {
            let url = location.pathname
            if(url != '' && location != 'blank') {
                url = url.replace('/', '')
                if(url != '') {
                    (async () => {
                        PatenTrackApi.cancelShareDashboard()
                        const {data} = await PatenTrackApi.getShareDashboardList(url)
                        if(data != null && Object.keys(data).length > 0) {
                            dispatch(setDashboardShareData(data))
                            let { selectedCompanies, tabs, customers } = data
                            if(typeof selectedCompanies != 'undefined' && selectedCompanies != '') {
                                try{
                                    selectedCompanies = JSON.parse(selectedCompanies)
                                    if(selectedCompanies.length > 0) {
                                        dispatch(setMainCompaniesSelected(selectedCompanies, []))
                                        (async () => {
                                            const promise = companies.map((row, index) => {
                                                if(!selectedCompanies.includes(row.representative_id)) {
                                                    companies[index].status = 0
                                                }
                                            })
                                            await Promise.all(promise)
                                            dispatch(setMainCompanies(companies, { append: false }))
                                        })()
                    
                                        if(typeof tabs != 'undefined' && tabs != '') {
                                            dispatch( setAssetTypesSelect([tabs]) )
                                        }
                                        if(typeof customers != 'undefined' && customers != '') {
                                            customers = JSON.parse(customers)
                                            if(customers.length > 0) {
                                                dispatch( setSelectAssignmentCustomers(customers) )
                                            }
                                        }
                                    }                    
                                } catch (e){
                                    console.log(e)
                                }
                            }
                        }
                    })()
                }
            } 
        }
        return (() => {
        })
    }, [auth_token])

    useEffect(() => {
        if(selectedCategory == 'correct_details') {
            if(openAssignmentBar === false) {
                handleAssignmentBarOpen()
            }
            if(openCustomerBar === true) {
                handleCustomersBarOpen()
            }
        } else {
            if((openAssignmentBar === true && timelineScreen === false) || (openAssignmentBar === false && timelineScreen === true && selectedCategory != 'top_lenders' &&  selectedCategory != 'proliferate_inventors')) {
                handleAssignmentBarOpen()
            } 
            if(openCustomerBar === false && dashboardScreen === false && timelineScreen === false) {
                handleCustomersBarOpen()
            }
        }
    }, [selectedCategory])

    useEffect(() => {
        if( type === 0 ) {
            if( selectedMainCompanies.length > 0 || selectedCompaniesAll === true ) {
                dispatch( getMaintainenceAssetsList( selectedCompaniesAll === true ? [] : selectedMainCompanies ))
            } else {
                resetAll(dispatch)
            }
        }
        
    }, [ dispatch, selectedMainCompanies, selectedCompaniesAll , type ])

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


    return (
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
                className={classes.companyBar}
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
                                <React.Fragment>
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
                                                securedTransactionAssets === true 
                                                ?
                                                    <SecuredAssets
                                                        sheetName={sheetName} 
                                                        handleSheetName={handleTextChange}
                                                    />
                                                :
                                                    <div></div>
                                        }
                                    </SplitPane>
                                </React.Fragment>
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
                                openAssignmentBar === true 
                                ? 
                                    selectedCategory === 'top_law_firms'
                                    ?
                                        <LawFirmTable 
                                            checkChartAnalytics={checkChartAnalytics}
                                            chartsBar={openChartBar}
                                            analyticsBar={openAnalyticsBar}
                                            type={type} 
                                            defaultLoad={type === 2 ? false : true} 
                                        />
                                    :
                                        <AssignmentsTable 
                                            checkChartAnalytics={checkChartAnalytics}
                                            chartsBar={openChartBar}
                                            analyticsBar={openAnalyticsBar}
                                            type={type} 
                                            defaultLoad={type === 2 ? false : true} 
                                        />
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
                            <div id={`assets_container`} style={{ height: '100%'}}>
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
                                                type == 0 ? (
                                                    <MaintainenceAssetsList 
                                                        assets={maintainenceAssetsList} 
                                                        isLoading={maintainenceAssetsLoadingMore} 
                                                        loadMore={getMaintainenceAssetsList} 
                                                        toggleLifeSpanMode={toggleLifeSpanMode}
                                                        setAssetsIllustration={setAssetsIllustration}
                                                        setSelectedAssetsPatents={setSelectedAssetsPatents} 
                                                        setCommentsEntity={setCommentsEntity}
                                                        assetLegalEvents={assetLegalEvents}
                                                        assetFamily={assetFamily}
                                                        setSelectedMaintainenceAssetsList={setSelectedMaintainenceAssetsList}
                                                        selectedMaintainencePatents={selectedMaintainencePatents}
                                                        channel_id={channel_id}
                                                        getChannelID={getChannelID}
                                                        selectedAssetsPatents={selectedAssetsPatents}
                                                        getSlackMessages={getSlackMessages}
                                                        openChartBar={openChartBar}
                                                        openAnalyticsBar={openAnalyticsBar}
                                                        openAnalyticsAndCharBar={openAnalyticsAndCharBar}
                                                        closeAnalyticsAndCharBar={closeAnalyticsAndCharBar}
                                                        openIllustrationBar={openIllustrationBar}
                                                        handleAnalyticsBarOpen={handleAnalyticsBarOpen}
                                                        handleIllustrationBarOpen={handleIllustrationBarOpen}
                                                    />
                                                )
                                                :
                                                type == 5 ? 
                                                    <></>
                                                :
                                                <AssetsTable 
                                                    standalone={true} 
                                                    type={type} 
                                                    openChartBar={openChartBar}
                                                    openAnalyticsBar={openAnalyticsBar}
                                                    openAnalyticsAndCharBar={openAnalyticsAndCharBar}
                                                    closeAnalyticsAndCharBar={closeAnalyticsAndCharBar}
                                                    changeVisualBar={setVisualizerBarSize}
                                                    openIllustrationBar={openIllustrationBar}
                                                    handleAnalyticsBarOpen={handleAnalyticsBarOpen}
                                                    handleIllustrationBarOpen={handleIllustrationBarOpen}
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
                                        maxSize={dashboardScreen === true ? -270 : -100}  
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
                                        <div className={isDragging === true ? classes.notInteractive : classes.isInteractive} style={{ height: '100%'}} >
                                            <IllustrationCommentContainer 
                                                cls={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPane1OverflowUnset, classes.paneHeightZero, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                                                split={`horizontal`} 
                                                minSize={50}
                                                maxSize={-200}
                                                defaultSize={commentBarSize}
                                                fn={resizePane}
                                                fnParams={setCommentBarSize}
                                                commentBar={openCommentBar}
                                                openCustomerBar={openCustomerBar}
                                                illustrationBar={openIllustrationBar}
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
                                                openInventorBar={openInventorBar}
                                                handleInventorBarOpen={handleInventorBarOpen}  
                                                openOtherPartyBar={openOtherPartyBar}
                                                handleOtherPartyBarOpen={handleOtherPartyBarOpen}
                                            /> 
                                        </div>
                                        <div className={isDragging === true ? classes.notInteractive : classes.isInteractive} style={{ height: '100%'}} id={`information_container`}>
                                        {
                                            dashboardScreen === true && dashboardPanel === true && type !== 9  
                                            ? 
                                                selectedAssetsFamily.length > 0 
                                                ?
                                                    <FamilyContainer
                                                        family={selectedAssetsFamily}
                                                    />
                                                :
                                                assetIllustration != null 
                                                ?
                                                    <IllustrationContainer 
                                                        isFullscreenOpen={isFullscreenOpen} 
                                                        asset={assetIllustration} 
                                                        setIllustrationRecord={setIllustrationRecord} 
                                                        chartsBar={openChartBar}
                                                        analyticsBar={openAnalyticsBar}
                                                        chartsBarToggle={handleChartBarOpen}
                                                        checkChartAnalytics={checkChartAnalytics}
                                                        setAnalyticsBar={setAnalyticsBar}
                                                        setChartBar={setChartBar}
                                                        fullScreen={handleClickOpenFullscreen}
                                                        pdfModal={true}
                                                        gap={gap}
                                                        viewOnly={true}
                                                    />
                                                :
                                                    selectedAssetsLegalEvents != null && Object.keys(selectedAssetsLegalEvents).length > 0
                                                    ?
                                                        <LegalEventsContainer
                                                            events={selectedAssetsLegalEvents} 
                                                            type={type}/>  
                                                    :
                                                        connectionBoxView === true 
                                                        ?
                                                            <IllustrationPdf 
                                                                cls={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPaneMainOverflowUnset, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                                                                split={`horizontal`}
                                                                primary={'second'}
                                                                illustrationData={connectionBoxData}
                                                                dragStart={setIsDrag}
                                                                dragFinished={setIsDrag}    
                                                                analyticsBar={openAnalyticsBar}
                                                                type={type}
                                                            />
                                                        :
                                                            ''
                                            :
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
                                            />
                                        }                                            
                                        </div>
                                    </SplitPane>
                                </SplitPane>
                            </SplitPane>
                        </SplitPane>
                    </SplitPane>
                </SplitPane>
            </SplitPane>
        </SplitPane>
    )

}


export default GlobalScreen