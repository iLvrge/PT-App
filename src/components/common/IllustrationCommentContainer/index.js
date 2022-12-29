import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux' 
import SplitPane from 'react-split-pane'
import { IconButton, Paper, Modal } from '@mui/material' 
import _debounce from 'lodash/debounce'
import { Close, Fullscreen } from '@mui/icons-material'
import IllustrationContainer from '../AssetsVisualizer/IllustrationContainer'
import TimelineContainer from '../AssetsVisualizer/TimelineContainer'
import AssetsCommentsTimeline from '../AssetsCommentsTimeline'
import LoadMaintainenceAssets from './LoadMaintainenceAssets'
import LoadTransactionQueues from './LoadTransactionQueues'
import LoadTransactionNameQueues from './LoadTransactionNameQueues'
import LoadLinkAssets from './LoadLinkAssets' 
import DisplayFile from './DisplayFile'
import ErrorBoundary from '../ErrorBoundary'
import { updateResizerBar } from '../../../utils/resizeBar'
 
import useStyles from './styles'
import Reports from '../../Reports'
import FullScreen from '../FullScreen'
import clsx from 'clsx'
import InventionVisualizer from '../AssetsVisualizer/InventionVisualizer'
import Ptab from '../AssetsVisualizer/LegalEventsContainer/Ptab'
import LawFirmTimeline from '../AssetsVisualizer/LawFirmTimeline'
import GeoChart from '../AssetsVisualizer/GeoChart' 
import CorrectAddressTable from '../CorrectAddressTable'
import NamesContainer from '../AssetsVisualizer/NamesContainer'
import Fees from '../AssetsVisualizer/LegalEventsContainer/Fees'
import PatenTrackApi from '../../../api/patenTrack2' 
import ConnectionBox from '../ConnectionBox'
import { useIsMounted } from '../../../utils/useIsMounted'
import SankeyChart from '../AssetsVisualizer/SankeyChart'

const IllustrationCommentContainer = ({ 
    cls, 
    split, 
    minSize, 
    defaultSize, 
    fn, 
    fnParams, 
    commentBar, 
    openCustomerBar,
    illustrationBar, 
    illustrationBarSize,
    visualizerBarSize,
    customerBarSize,
    companyBarSize,
    fnVarName, 
    fn2, 
    fn2Params, 
    primary, 
    size, 
    illustrationRecord, 
    setChannel, 
    channel_id,  
    setMaintainenceFileName, 
    gap, 
    chartsBar,
    analyticsBar,
    chartsBarToggle, 
    checkChartAnalytics,
    onHandleGapSize,
    assignmentBar,
    assignmentBarToggle,
    setChartBar,
    setAnalyticsBar,
    type,
    handleCommentBarOpen,
    handleCustomersBarOpen,
    openInventorBar,
    handleInventorBarOpen,
    openOtherPartyBar,
    handleOtherPartyBarOpen,
    parentBarDrag,
    parentBar,
    cube,
    ptab, 
    maintainence,
    record
    }) => {
    const classes = useStyles()  
    const illustrationRef = useRef()
    const isMounted = useIsMounted()
    const [ containerSize, setContainerSize] = useState(0)
    const [ dashboardFullScreen, setDashboardFullScreen ] = useState( false ) 
    const [ commentButtonVisible, setCommentButtonVisible ] = useState(false)
    const [ isDrag, setIsDrag ] = useState(false)
    const [ templateURL, setTemplateURL] = useState('about:blank')
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [ menuComponent, setMenuComponent ] = useState([])
    const [ dashboardData, setDashboardData ] = useState([])
    const [ dashboardTimelineData, setDashboardTimelineData ] = useState([])
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ allAssetsEvents, setAllAssetsEvents ] = useState([])
    const [lineGraph, setLineGraph] = useState(false)
    const [gauge, setGauge] = useState(false)
    const [jurisdictions, setJurisdiction] = useState(false)
    const [invention, setInvention] = useState(false)
    const [sankey, setSankey] = useState(false)
    const [kpi, setKpi] = useState(true)
    const [timeline, setTimeline] = useState(false)
    const [showManualComponent, setShowManualComponent ] = useState(false)
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
    const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
    const driveTemplateFrameMode = useSelector(state => state.ui.driveTemplateFrameMode)
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
    const new_drive_template_file = useSelector(state => state.patenTrack2.new_drive_template_file)
    const template_document_url = useSelector(state => state.patenTrack2.template_document_url)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected ) 

    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected ) 
    const search_string = useSelector(state => state.patenTrack2.search_string)   
    const addressQueuesDisplay = useSelector(state => state.patenTrack2.addressQueuesDisplay)   
    const nameQueuesDisplay = useSelector(state => state.patenTrack2.nameQueuesDisplay)
    const link_assets_sheet_display = useSelector(state => state.patenTrack2.link_assets_sheet_display)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const link_assets_sheet_type = useSelector(state => state.patenTrack2.link_assets_sheet_type)
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const ptabAssets = useSelector(state => state.patenTrack2.ptabAssets)  

    const menuItems = [
        {
            id: 1,
            label: 'Dashboard',
            component: Reports,
            standalone: true,   
            fullScreen: dashboardFullScreen,
            handleFullScreen: setDashboardFullScreen,
            chartsBar: chartsBar,
            analyticsBar: analyticsBar,
            checkChartAnalytics: checkChartAnalytics,
            openCustomerBar: openCustomerBar,
            openCommentBar: commentBar,
            handleCommentBarOpen: handleCommentBarOpen,
            handleCustomersBarOpen: handleCustomersBarOpen,
            dashboardData: dashboardData,
            updateDashboardData: setDashboardData,
            dashboardTimelineData: dashboardTimelineData, 
            openInventorBar: openInventorBar,
            handleInventorBarOpen: handleInventorBarOpen,
            openOtherPartyBar: openOtherPartyBar,
            handleOtherPartyBarOpen: handleOtherPartyBarOpen,
            lineGraph: lineGraph,
            setLineGraph: setLineGraph,
            gauge: gauge,
            setGauge: setGauge,
            jurisdictions: jurisdictions,
            setJurisdiction: setJurisdiction,
            invention: invention,
            setInvention: setInvention,
            sankey: sankey,
            setSankey: setSankey,
            kpi: kpi,
            setKpi: setKpi,
            timeline: timeline,
            setTimeline: setTimeline
        }
    ] 

    useEffect(() => {
        let val = '0px'
        if(commentBar === true) {
            val = defaultSize
        }
        if (isMounted.current) { 
            setContainerSize(val)
        }
        if(illustrationRef !== null) {
            const container = illustrationRef.current.splitPane;
            container.querySelector('div.Pane2').style.height = val
        }
    }, [defaultSize, commentBar])

    
    useEffect(() => {
        checkChartAnalytics(null, null, false)
    }, [sankey, invention, jurisdictions, lineGraph])

    useEffect(() => {
        updateResizerBar(illustrationRef, commentBar, 1)
    }, [ illustrationRef, commentBar ])

    useEffect(() => {        
        if(new_drive_template_file != null && Object.keys(new_drive_template_file).length > 0 && new_drive_template_file.hasOwnProperty('id')) {
            if (isMounted.current) { 
                setTemplateURL(`https://docs.google.com/document/d/${new_drive_template_file.id}/edit`)
            }
        }
    }, [new_drive_template_file])

    useEffect(() => {
        if( templateURL != template_document_url ) {
            if (isMounted.current) { 
                setTemplateURL(template_document_url)
            }
        }        
    }, [ templateURL,  template_document_url ])

    useEffect(() => { 
        if(selectedCategory === 'late_maintainance' && maintainence === true && selectedCompanies.length > 0 && assetIllustration == null ){
            const getAllSurchargeAssetsEvents = async () => { 
                const {data} = await PatenTrackApi.allAssetsSurchargeLegalEvents(selectedCompanies)
                if (isMounted.current) { 
                    setAllAssetsEvents(data)
                }
            }
            getAllSurchargeAssetsEvents() 
            //dispatch(allAssetsSurchargeLegalEvents(selectedCompanies))
        } else if(selectedCategory === 'missed_monetization' && record === true && selectedCompanies.length > 0 && assetIllustration == null ){
            const getAllRecordAssetsEvents = async () => { 
                const {data} = await PatenTrackApi.allFilledAssetsEvents(selectedCompanies)
                if (isMounted.current) { 
                    setAllAssetsEvents(data)
                }
            }
            getAllRecordAssetsEvents() 
            //dispatch(allAssetsSurchargeLegalEvents(selectedCompanies))
        } 
    }, [ maintainence, record, assetIllustration, selectedCompanies, selectedCategory])

    const handleCommentButton = (event, flag) => {
        event.preventDefault()
        setCommentButtonVisible( flag )
    }

    /* const handleCommentBarOpen = () => {
        setToggleCommentButtonType( !toggleCommentButtonType )
        setCommentOpenBar( !openCommentBar )
        if(!openCommentBar === false) {
            fnParams(0)
        } else {
            fnParams('30%')
        }
    } */

    const handleClickOpenFullscreen = () => {
        setIsFullscreenOpen(true)
    }
    
    const handleCloseFullscreen = () => {
        setIsFullscreenOpen(false)
    }

    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])

    const onChangeFileName = useCallback((event) => {
        setMaintainenceFileName(event.target.value)
    }, [ setMaintainenceFileName ])


    /* const shouldShowTimeline = useMemo(
        () => (!selectedAssetsPatents.length &&  !assetIllustration),
        [ selectedAssetsPatents, selectedAssetAssignments, assetIllustration ],
    ) */

    const shouldShowTimeline = useMemo(
        () => (assetIllustration === null),
        [ selectedAssetsPatents, selectedAssetAssignments, assetIllustration ],
    )

    const onHandleComponentMenuItem = (item) => {
        setShowManualComponent(true)     
        setMenuComponent(item)
    }

    const changePane =  useCallback(_debounce((size) => {
        fn2(size, fn2Params)
        fn(fnVarName, size, fnParams)   
    }, 1), [  ]) 
     
    return (
        <SplitPane
            className={cls}
            split={split}
            minSize={minSize}
            defaultSize={containerSize}
            onDragStarted={() => {
                setIsDrag(!isDrag)
            }}
            onDragFinished={(size) => {
                setIsDrag(!isDrag)
                fn2(size, fn2Params)
                fn(fnVarName, size, fnParams)   
            }} 
            onChange={(size) => {
                changePane(size)
            }}
            maxSize={-10} 
            primary={primary}
            ref={illustrationRef}
            pane1Style={{
                pointerEvents: isDrag === true ? 'none' : 'auto',
            }}
        >         
            <div style={{display: 'unset'}}>   
                <ErrorBoundary>
                {/* <AllComponentsMenu onClick={onHandleComponentMenuItem}/> */}
                {
                    illustrationBar === true && ( typeof cube == 'undefined' || (typeof cube !== 'undefined' && cube === false))  && dashboardScreen === false && !isFullscreenOpen && shouldShowTimeline === true
                    ?
                        <IconButton 
                            size="small" 
                            className={clsx(classes.fullscreenBtn, {[classes.frameButton]: (typeof driveTemplateFrameMode !== 'undefined' && driveTemplateFrameMode === true && templateURL != 'about:blank' && templateURL != null) ? true : false})} 
                            onClick={handleClickOpenFullscreen}
                        >
                            <Fullscreen />
                        </IconButton> 
                    :
                        ''  
                }                
                                              
                {  
                    illustrationBar === true && (process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' ||  type === 9 || ((process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') && auth_token !== null))
                    ?
                        (maintainence  === true || record === true) && assetIllustration === null
                        ?
                            <Fees
                                standalone={true}
                                events={allAssetsEvents}
                                tabText={maintainence  === true ? 'M.Fees' : 'To Record'}
                                showTabs={true}
                            />
                        :    
                        ptab === true && assetIllustration === null
                        ?
                            <Ptab 
                                rawData={ptabAssets}
                                standalone={true}
                            />
                        :
                        cube === true && maintainenceFrameMode === false && assetIllustration === null
                        ?
                            selectedCategory == 'divested'
                            ?
                                <SankeyChart
                                    type={'divested'} 
                                    showTabs={true}
                                    tabText={'Divested'}
                                    fullScreen={true}
                                />
                            :
                            selectedCategory == 'incorrect_names' ?
                                <NamesContainer
                                visualizerBarSize={visualizerBarSize}/>
                            :
                            selectedCategory == 'collaterlized' || selectedCategory == 'clear_encumbrances' ?
                                <TimelineContainer 
                                    assignmentBar={assignmentBar} 
                                    assignmentBarToggle={assignmentBarToggle} 
                                    type={type}
                                    updateTimelineRawData={setTimelineRawData}
                                />
                            :
                                selectedCategory == 'top_non_us_members' ?
                                    <GeoChart
                                        chartBar={chartsBar} 
                                        openCustomerBar={openCustomerBar} 
                                        visualizerBarSize={visualizerBarSize}
                                        type={type}
                                        titleBar={true}
                                        disableOtherTabs={true}
                                    /> 
                                :
                                    <InventionVisualizer 
                                        defaultSize={illustrationBarSize} 
                                        visualizerBarSize={visualizerBarSize} 
                                        analyticsBar={analyticsBar} 
                                        openCustomerBar={openCustomerBar} 
                                        commentBar={commentBar} 
                                        illustrationBar={illustrationBar} 
                                        customerBarSize={customerBarSize} 
                                        companyBarSize={companyBarSize}
                                        openChartBar={chartsBar}
                                        handleChartBarOpen={chartsBarToggle}
                                        type={type}  
                                        middle={true}
                                    />
                        :
                        dashboardScreen === true &&  type !== 9  && selectedCategory == 'due_dilligence'
                        ?
                            <Reports
                                fullScreen={dashboardFullScreen}
                                handleFullScreen={setDashboardFullScreen}
                                defaultSize={illustrationBarSize} 
                                customerBarSize={customerBarSize} 
                                companyBarSize={companyBarSize}  
                                type={type}
                                illustrationBar={illustrationBar} 
                                chartsBar={chartsBar}
                                analyticsBar={analyticsBar}
                                checkChartAnalytics={checkChartAnalytics}
                                openCustomerBar={openCustomerBar}
                                openCommentBar={commentBar}
                                handleCommentBarOpen={handleCommentBarOpen}
                                handleCustomersBarOpen={handleCustomersBarOpen}
                                updateDashboardData={setDashboardData}
                                updateDashboardTimelineData={setDashboardTimelineData}
                                visualizerBarSize={visualizerBarSize} 
                                openInventorBar={openInventorBar}
                                handleInventorBarOpen={handleInventorBarOpen}
                                lineGraph={lineGraph}
                                setLineGraph={setLineGraph}
                                gauge={gauge}
                                setGauge={setGauge}
                                jurisdictions={jurisdictions}
                                setJurisdiction={setJurisdiction}
                                invention={invention}
                                setInvention={setInvention}
                                sankey={sankey}
                                setSankey={setSankey}
                                kpi={kpi}
                                setKpi={setKpi}
                                timeline={timeline}
                                setTimeline={setTimeline}
                                assignmentBar={assignmentBar}
                                assignmentBarToggle={assignmentBarToggle}
                                openOtherPartyBar={openOtherPartyBar}
                                handleOtherPartyBarOpen={handleOtherPartyBarOpen}
                            /> 
                        :
                        showManualComponent === true && menuComponent.length > 0
                        ?                        
                            menuComponent.map(
                                ({component: Component, ...props }, index) => (
                                    <Component key={index} {...props} size={size}/>
                                )
                            )
                        :
                        driveTemplateFrameMode === true && (templateURL != 'about:blank' && templateURL != null)
                        ?
                            <iframe src={templateURL} className={classes.templateFrame}></iframe>
                        :                  
                        maintainenceFrameMode === true
                        ?
                            <LoadMaintainenceAssets 
                                rows={selectedMaintainencePatents} onChangeFileName={onChangeFileName}/>
                        :
                        addressQueuesDisplay === true
                        ?
                            <LoadTransactionQueues />
                        :
                        nameQueuesDisplay === true || selectedCategory === 'correct_names' 
                        ?
                            <LoadTransactionNameQueues />
                        :
                        link_assets_sheet_display === true || selectedCategory === 'technical_scope'
                        ?
                            <LoadLinkAssets type={link_assets_sheet_type.type} asset={link_assets_sheet_type.asset}  size={size}/>
                        :
                        (selectedCategory ==  'late_recording' || selectedCategory =='incorrect_recording') && selectedAssetAssignments.length > 0 ? 
                            <ConnectionBox 
                                display={"false"} 
                                assets={assetIllustration}
                            />
                        :
                        !isFullscreenOpen && 
                            illustrationBar === true && 
                            (   search_string != '' || 
                                /*assetCompaniesRowSelect.length > 0 || 
                                selectedCompaniesAll === true || 
                                selectedCompanies.length > 0 || */
                                type === 9
                            ) 
                        ?
                            shouldShowTimeline
                            ?
                                selectedCategory == 'incorrect_names' ?
                                    <NamesContainer/>
                                : 
                                    selectedCategory == 'incorrect_address'
                                ?
                                    <CorrectAddressTable 
                                        standalone={true}
                                        parentBarDrag={parentBarDrag}
                                        parentBar={parentBar}
                                        type={type}
                                    />
                                :
                                selectedCategory == 'top_law_firms' 
                                ?
                                    <LawFirmTimeline 
                                        assignmentBar={assignmentBar} 
                                        assignmentBarToggle={assignmentBarToggle} 
                                        type={type} 
                                        updateTimelineRawData={setTimelineRawData}
                                    />
                                :
                                    <TimelineContainer 
                                        assignmentBar={assignmentBar} 
                                        assignmentBarToggle={assignmentBarToggle} 
                                        type={type}
                                        updateTimelineRawData={setTimelineRawData}
                                    />
                                
                            :
                                
                                    <IllustrationContainer 
                                        isFullscreenOpen={isFullscreenOpen} 
                                        asset={assetIllustration} 
                                        setIllustrationRecord={illustrationRecord} 
                                        chartsBar={chartsBar}
                                        analyticsBar={analyticsBar}
                                        chartsBarToggle={chartsBarToggle}
                                        checkChartAnalytics={checkChartAnalytics}
                                        setAnalyticsBar={setAnalyticsBar}
                                        setChartBar={setChartBar}
                                        fullScreen={handleClickOpenFullscreen}
                                        gap={gap}
                                    />
                        :
                        ''
                    :
                    ''  
                }
                
                <Modal
                    className={classes.fullscreenChartsModal}
                    open={isFullscreenOpen}
                > 
                    <Paper 
                        className={classes.fullscreenCharts} 
                        square
                    >
                        <IconButton onClick={handleCloseFullscreen}  className={clsx(classes.right, {[classes.frameButton]: (typeof driveTemplateFrameMode !== 'undefined' && driveTemplateFrameMode === true && templateURL != 'about:blank' && templateURL != null) ? true : false})} size="large">
                            <Close /> 
                        </IconButton> 
                        {
                            
                            shouldShowTimeline === true ? 
                                selectedCategory == 'top_law_firms'
                                ?
                                    <LawFirmTimeline 
                                        assignmentBar={assignmentBar} 
                                        assignmentBarToggle={assignmentBarToggle} 
                                        type={type} 
                                        timelineData={timelineRawData}
                                    />
                                :
                                    <TimelineContainer 
                                        assignmentBar={assignmentBar} 
                                        assignmentBarToggle={assignmentBarToggle} 
                                        type={type}
                                        timelineData={timelineRawData}
                                    />
                            :
                                (typeof driveTemplateFrameMode !== 'undefined' && driveTemplateFrameMode === true && templateURL != 'about:blank' && templateURL != null)
                                ?
                                    <DisplayFile 
                                        templateURL={templateURL}
                                    />
                                :
                                    illustrationBar === true ? (
                                        <IllustrationContainer 
                                            isFullscreenOpen={isFullscreenOpen}  
                                            asset={assetIllustration} 
                                            setIllustrationRecord={illustrationRecord} 
                                            chartsBar={chartsBar}
                                            analyticsBar={analyticsBar}
                                            chartsBarToggle={chartsBarToggle}
                                            checkChartAnalytics={checkChartAnalytics}
                                            setAnalyticsBar={setAnalyticsBar}
                                            setChartBar={setChartBar}
                                        />
                                )
                                :
                                ''
                        }
                    </Paper>
                </Modal>
                {
                    dashboardFullScreen === true && (
                    <FullScreen 
                        componentItems={menuItems} 
                        showScreen={dashboardFullScreen} 
                        setScreen={setDashboardFullScreen} 
                        showClose={false}
                    />
                    )
                }
                </ErrorBoundary>
            </div>

            <div 
                className={classes.commentContainer}
            >
                <ErrorBoundary>
                    {
                        commentBar === true
                        ?
                            <AssetsCommentsTimeline 
                                toggleMinimize={toggleMinimizeAssetsCommentsTimeline} 
                                size={size} 
                                setChannel={setChannel} 
                                channel_id={channel_id} 
                                illustrationBar={illustrationBar}
                            />
                                
                        :
                        ''
                    }
                </ErrorBoundary>
            </div>
        </SplitPane>
    );
}
 
export default IllustrationCommentContainer