import React, 
        { useCallback, 
          useEffect, 
          useState,
          useRef,
          useMemo
        } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitPane from 'react-split-pane'

import MainCompaniesSelector from '../common/MainCompaniesSelector'
import AssignmentsType from '../common/AssignmentsType'
import ForeignAsset from '../common/ForeignAsset'
import AssetsTable from '../common/AssetsTable'
import CustomerTable from '../common/CustomerTable'
import InventorTable from '../common/InventorTable'
import AssignmentsTable from '../common/AssignmentsTable'
import MaintainenceAssetsList from '../common/MaintainenceAssetsList'
import FilesTemplates from '../common/FilesTemplates'
import LayoutTemplates from '../common/LayoutTemplates'
import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import PdfViewer from '../common/PdfViewer'
import ConnectionBox from '../common/ConnectionBox'
import USPTOContainer from '../common/AssetsVisualizer/USPTOContainer'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import TimelineContainer from '../common/AssetsVisualizer/TimelineContainer'
import InventionVisualizer from '../common/AssetsVisualizer/InventionVisualizer'
import FamilyItemContainer from '../common/AssetsVisualizer/FamilyItemContainer'
import LifeSpanContainer from '../common/AssetsVisualizer/LifeSpanContainer'
import LegalEventsContainer from '../common/AssetsVisualizer/LegalEventsContainer'

import { 
    assetLegalEvents, 
    assetFamily
} from '../../actions/patenTrackActions'

import { 
    getMaintainenceAssetsList,
    setAssetsIllustration, 
    setSelectedAssetsPatents,
    setCommentsEntity,
    setSelectedMaintainenceAssetsList,
    setChannelID,
    getChannelID,
    getSlackMessages
} from '../../actions/patentTrackActions2'

import { toggleFamilyItemMode, toggleLifeSpanMode, toggleUsptoMode } from '../../actions/uiActions'

import useStyles from './styles'
import clsx from 'clsx'

const MobileScreen = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const illustrationRef = useRef()
    const [defaultSize, setDefaultSize] = useState('50%')
    const [isDrag, setIsDrag] = useState(false)
    const [sheetName, setSheetName] = useState('')
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [resizeFrame, setResizeFrame] = useState(false);
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetCompaniesRowSelect = useSelector(state => state.patenTrack2.mainCompaniesList.row_select)
    const search_string = useSelector(state => state.patenTrack2.search_string) 
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList )
    const maintainenceAssetsLoadingMore = useSelector( state => state.patenTrack2.maintainenceAssetsLoadingMore )
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
	const channel_id = useSelector( state => state.patenTrack2.channel_id )  
    const selectedAssetsFamilyItem = useSelector( state => state.patenTrack.familyItem )
    const pdfView = useSelector(state => state.patenTrack.pdfView)
    const usptoMode = useSelector(state => state.ui.usptoMode)
    const familyMode = useSelector(state => state.ui.familyMode)
    const familyItemMode = useSelector(state => state.ui.familyItemMode)
    const lifeSpanMode = useSelector(state => state.ui.lifeSpanMode)
    const selectedAssetsLegalEvents = useSelector(state => state.patenTrack.assetLegalEvents)
    const connectionBoxView = useSelector( state => state.patenTrack.connectionBoxView)

    useEffect(() => {
        if(props.openIllustrationBar === false && props.openCommentBar === false && props.openChartBar === false && props.openAnalyticsBar === false && (props.openBar === true || props.openTypeBar === true || props.openOtherPartyBar === true || props.openInventorBar === true || props.openAssignmentBar === true || props.openCustomerBar === true || props.assetFilesBar === true || props.openGoogleDriveBar === true || props.driveTemplateMode === true) ) {
            setDefaultSize('100%')
        } else {
            setDefaultSize('50%')
        }
    }, [props.openIllustrationBar, props.openCommentBar, props.openChartBar, props.openAnalyticsBar])

    useEffect(() => {
        if(props.openBar === false && props.openTypeBar === false && props.openOtherPartyBar === false && props.openInventorBar === false && props.openAssignmentBar === false && props.openCustomerBar === false && props.assetFilesBar === false && props.openGoogleDriveBar === false && props.driveTemplateMode === false && (props.openIllustrationBar === true && props.openCommentBar === true && props.openChartBar === true && props.openAnalyticsBar === true)) {
            setDefaultSize('0%')
        } else {
            setDefaultSize('50%')
        }
    }, [props.openBar, props.openTypeBar, props.openOtherPartyBar, props.openInventorBar, props.openAssignmentBar, props.openCustomerBar, props.assetFilesBar, props.openGoogleDriveBar, props.driveTemplateMode])

    const handleTextChange = (name) => {
        setSheetName(name);
    }

    const shouldShowTimeline = useMemo(
        () => (!selectedAssetsPatents.length &&  !assetIllustration),
        [ selectedAssetsPatents, selectedAssetAssignments, assetIllustration ],
    )

    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])

    const onCloseFamilyItemMode = useCallback(() => {
        dispatch(toggleFamilyItemMode(false));
    }, [dispatch]);

    const onCloseUspto = useCallback(() => {
        dispatch(toggleUsptoMode());
    }, [dispatch]);
    return (
        <SplitPane
            className={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPane1OverflowUnset, classes.paneHeightZero)}
            split={`horizontal`} 
            minSize={50}
            defaultSize={defaultSize}
            onDragStarted={() => {
                setIsDrag(!isDrag)
            }}  
            onDragFinished={(size) => {
                setIsDrag(!isDrag)
            }} 
            maxSize={-10} 
            primary={'second'}
            ref={illustrationRef}
            pane1Style={{
                pointerEvents: isDrag === true ? 'none' : 'auto',
            }}
        >
            <div 
                className={clsx(classes.companyBar, classes.mobileTable)}>
                    {
                        props.openBar === true 
                        ? 
                            props.type == 9 
                                ? 
                                    <ForeignAsset 
                                        sheetName={sheetName} 
                                        handleSheetName={handleTextChange}
                                    />
                                :
                                    <MainCompaniesSelector 
                                        selectAll={false} 
                                        defaultSelect={''} 
                                        addUrl={true} 
                                        parentBarDrag={props.setVisualizerBarSize}
                                        parentBar={props.setVisualizeOpenBar}     
                                        isMobile={props.isMobile}                           
                                    />
                        :
                        props.openTypeBar === true
                        ?
                            <AssignmentsType
                                parentBarDrag={props.setVisualizerBarSize}
                                parentBar={props.setVisualizeOpenBar}
                                type={props.type}
                                isMobile={props.isMobile}        
                                {...(props.type === 2 && {defaultLoad: false})}
                            />
                        :
                        props.openOtherPartyBar === true
                        ?
                            <CustomerTable 
                                standalone={true}
                                parentBarDrag={props.setVisualizerBarSize}
                                parentBar={props.setVisualizeOpenBar}
                                type={props.type}
                                isMobile={props.isMobile}        
                                customerType={0}
                            />
                        :
                        props.openInventorBar === true
                        ?
                            <InventorTable 
                                standalone={true}
                                parentBarDrag={props.setVisualizerBarSize}
                                parentBar={props.setVisualizeOpenBar}
                                type={props.type}
                                isMobile={props.isMobile}        
                                customerType={1}
                            />
                        :
                        props.openAssignmentBar === true
                        ?
                            <AssignmentsTable 
                                type={props.type} 
                                isMobile={props.isMobile}        
                                defaultLoad={props.type === 2 ? false : true} 
                            />
                        :
                        props.openCustomerBar === true || props.assetFilesBar === true || props.openGoogleDriveBar === true
                        ?
                            <>
                                {
                                    props.type === 0 && props.openCustomerBar === true  ? (
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
                                            openChartBar={props.openChartBar}
                                            openAnalyticsBar={props.openAnalyticsBar}
                                            openAnalyticsAndCharBar={props.openAnalyticsAndCharBar}
                                            closeAnalyticsAndCharBar={props.closeAnalyticsAndCharBar}
                                            isMobile={props.isMobile}   
                                            fileBar={props.assetFilesBar}           
                                            driveBar={props.openGoogleDriveBar}           
                                        />
                                    )
                                    :
                                    props.type === 5 && props.openCustomerBar === true ? 
                                        <></>
                                    :
                                        props.openCustomerBar === true && (
                                            <AssetsTable 
                                                standalone={true} 
                                                type={props.type} 
                                                openChartBar={props.openChartBar}
                                                openAnalyticsBar={props.openAnalyticsBar}
                                                openAnalyticsAndCharBar={props.openAnalyticsAndCharBar}
                                                closeAnalyticsAndCharBar={props.closeAnalyticsAndCharBar}
                                                isMobile={props.isMobile}
                                                fileBar={props.assetFilesBar}           
                                                driveBar={props.openGoogleDriveBar}           
                                            />
                                        )
                                }
                                { 
                                    props.assetFilesBar === true
                                    ?
                                        <FilesTemplates 
                                            type={0}
                                            isMobile={props.isMobile}  
                                            assetBar={props.openCustomerBar}   
                                        />
                                    :
                                        props.openGoogleDriveBar === true && (
                                            <FilesTemplates                                             
                                                type={1}
                                                isMobile={props.isMobile}
                                                assetBar={props.openCustomerBar}   
                                            />     
                                        )  
                                }
                            </>
                        :
                        props.driveTemplateMode === true
                        ?
                            <LayoutTemplates />        
                        :                     
                        ''
                    }
            </div>
            <div
                className={clsx(classes.companyBar, classes.mobileTable)}>
                {
                    props.openIllustrationBar === true && (   search_string != '' || 
                        assetCompaniesRowSelect.length > 0 || 
                        selectedCompaniesAll === true || 
                        selectedCompanies.length > 0 ||
                        props.type === 9
                    )
                    ?
                        shouldShowTimeline
                        ?
                            <TimelineContainer 
                                assignmentBar={props.assignmentBar} 
                                assignmentBarToggle={props.assignmentBarToggle} 
                                type={props.type}
                                isMobile={props.isMobile}     
                            />
                        :                            
                            <IllustrationContainer 
                                isFullscreenOpen={isFullscreenOpen} 
                                asset={assetIllustration} 
                                setIllustrationRecord={props.illustrationRecord} 
                                chartsBar={props.chartsBar}
                                chartsBarToggle={props.chartsBarToggle} 
                                checkChartAnalytics={props.checkChartAnalytics}
                                gap={props.gap}
                            />
                    :
                    props.openCommentBar === true
                    ?
                        <AssetsCommentsTimeline 
                            toggleMinimize={toggleMinimizeAssetsCommentsTimeline} 
                            size={props.size} 
                            setChannel={setChannelID} 
                            channel_id={channel_id} 
                            illustrationBar={props.illustrationBar}
                        />
                    :
                    props.openChartBar == true
                    ?
                        selectedCompanies.length > 0 || props.type === 9 || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE')
                        ?
                            pdfView === true && !connectionBoxView ? (
                                <PdfViewer display={"false"} resize={resizeFrame} />
                            ) :  (
                                connectionBoxView === true ? (
                                    <PdfViewer
                                        display={"false"}
                                        fullScreen={false}
                                        resize={resizeFrame}
                                    />  
                                ) : lifeSpanMode === true ? (
                                    <InventionVisualizer 
                                        defaultSize={props.openCommentBarSize} 
                                        illustrationBar={props.openIllustrationBar} 
                                        visualizerBarSize={props.visualizerBarSize} 
                                        analyticsBar={props.openAnalyticsBar} 
                                        openCustomerBar={props.openCustomerBar} 
                                        commentBar={props.openCommentBar} 
                                        illustrationBar={props.illustrationBar} 
                                        customerBarSize={props.customerBarSize} 
                                        companyBarSize={props.companyBarSize}
                                        type={props.type} 
                                    />
                                ) : familyItemMode === true ? (
                                    <FamilyItemContainer 
                                        item={selectedAssetsFamilyItem} 
                                        onClose={onCloseFamilyItemMode} 
                                        analyticsBar={props.openAnalyticsBar} 
                                        chartBar={props.openChartBar} 
                                        illustrationBar={props.illustrationBar}
                                        visualizerBarSize={props.visualizerBarSize} 
                                        type={props.type}
                                    />
                                ) : (
                                    <InventionVisualizer 
                                        defaultSize={props.openCommentBarSize} 
                                        illustrationBar={props.openIllustrationBar} 
                                        visualizerBarSize={props.visualizerBarSize} 
                                        analyticsBar={props.openAnalyticsBar} 
                                        openCustomerBar={props.openCustomerBar} 
                                        commentBar={props.openCommentBar} 
                                        illustrationBar={props.illustrationBar} 
                                        customerBarSize={props.customerBarSize} 
                                        companyBarSize={props.companyBarSize}
                                        type={props.type} 
                                    />
                                )
                            )
                        :
                        ''
                    :
                    props.openAnalyticsBar === true
                    ?
                        selectedCompanies.length > 0 || props.type === 9 || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE')
                        ?     
                            connectionBoxView === true ? (
                                <ConnectionBox display={"false"} assets={props.illustrationData} type={props.ype}/>
                            )  
                            : 
                            usptoMode === true ? (
                                <USPTOContainer
                                    asset={assetIllustration} 
                                    onClose={onCloseUspto} 
                                    type={props.type}
                                />
                            ) : 
                            lifeSpanMode === true ? (
                                <LifeSpanContainer 
                                    chartBar={props.openChartBar} 
                                    openCustomerBar={props.openCustomerBar} 
                                    visualizerBarSize={props.visualizerBarSize}
                                    type={props.type}
                                />
                            ) :
                            familyMode === true ? (
                                <LegalEventsContainer
                                    events={selectedAssetsLegalEvents} 
                                    type={props.type}
                                />
                            ) 
                            :
                            <LifeSpanContainer 
                                chartBar={props.openChartBar} 
                                openCustomerBar={props.openCustomerBar} 
                                visualizerBarSize={props.visualizerBarSize}
                                type={props.type}
                            />
                        :
                        ''      
                    :                        
                    ''
                }
            </div>
        </SplitPane>
    )
}

export default MobileScreen