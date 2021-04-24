import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitPane from 'react-split-pane'


import ArrowButton from '../common/ArrowButton'
import MainCompaniesSelector from '../common/MainCompaniesSelector'
import AssignmentsType from '../common/AssignmentsType'
import CustomerTable from '../common/CustomerTable'
import AssignmentsTable from '../common/AssignmentsTable'
import AssetsTable from '../common/AssetsTable'
import IllustrationCommentContainer from '../common/IllustrationCommentContainer'
import AssetDetailsContainer from '../common/AssetDetailsContainer'
import MaintainenceAssetsList from '../common/MaintainenceAssetsList'
import LayoutTemplates from '../common/LayoutTemplates'
import FilesTemplates from '../common/FilesTemplates'
import { resizePane, resizePane2 } from '../../utils/splitpane'
import { updateResizerBar } from '../../utils/resizeBar'


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
    setBreadCrumbs
} from '../../actions/patentTrackActions2'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode, toggleLifeSpanMode, setMaintainenceFeeFrameMode } from '../../actions/uiActions'

import useStyles from './styles'
import clsx from 'clsx'

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
    otherPartyBarSize,
    setOtherPartyBarSize,
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
    toggleCustomerButtonType,
    customerButtonVisible,
    commentBarSize,
    setCommentBarSize,
    openCommentBar,
    openIllustrationBar,
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
    assetFilesBarSize,
    assetFilesBar,
    driveTemplateBarSize,
    driveTemplateFrameMode
}) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const mainContainerRef = useRef()
    const companyRef = useRef()
    const assignmentTypeRef = useRef()
    const otherPartyRef = useRef()
    const assignmentRef = useRef()
    const assetRef = useRef()
    const assetFileRef = useRef()
    const templateFileRef = useRef()
    const [ gap, setGap ] = useState( { x: '14.1rem', y: '7.5rem'} )
    const [ isDragging, setIsDragging] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)

    
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedMainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )

    
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents )
    

    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList )
    const maintainenceAssetsLoadingMore = useSelector( state => state.patenTrack2.maintainenceAssetsLoadingMore )
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )

    const channel_id = useSelector( state => state.patenTrack2.channel_id )   
    const checkContainer = () => {
        setTimeout(() => {
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
        }, 1000)
    }

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
        updateResizerBar(otherPartyRef, openOtherPartyBar)
    }, [ otherPartyRef, openOtherPartyBar ])

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
        updateResizerBar(assetFileRef, assetFilesBar)
    }, [ assetFileRef, assetFilesBar ])

    useEffect(() => {
        updateResizerBar(templateFileRef, driveTemplateFrameMode)
    }, [ templateFileRef, driveTemplateFrameMode ])    

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
        dispatch( toggleLifeSpanMode( false ) )
        dispatch( toggleFamilyMode( true ) )
        dispatch( toggleFamilyItemMode( true ) )
    }

    const onHandleIllustrationSize = (size) => {
        if(mainContainerRef.current != null ) {
            const containerSize = mainContainerRef.current.pane2.clientWidth
            const illustrationSize = size != undefined ? containerSize - size - 3 : mainContainerRef.current.pane1.querySelector('#patentrackDiagramDiv').clientWidth
            const width = 620
            if( illustrationSize > width ) {
                const constantX = 14.1, constantValue = parseFloat(constantX / width).toFixed(4)
                let calc = (illustrationSize * constantValue) - 1.4
                if(calc > 14.1) {
                    setGap({...gap, x: `${parseFloat(calc).toFixed(1)}rem`}) 
                }
            } else {
                setGap({...gap, x: '14.1rem'})
            }
        }
    }

    return (
        <SplitPane
            className={classes.splitPane}
            split="vertical"
            size={companyBarSize}
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
                            <ArrowButton arrowId={`arrow_company`} handleClick={handleCompanyBarOpen} buttonType={toggleButtonType} buttonVisible={companyButtonVisible}/>
                            <MainCompaniesSelector 
                                selectAll={false} 
                                defaultSelect={''} 
                                addUrl={true} 
                                parentBarDrag={setVisualizerBarSize}
                                parentBar={setVisualizeOpenBar}                                
                            /> 

                        </>
                    : 
                    ''
                }
            </div>
            <SplitPane
                className={classes.splitPane}
                split="vertical"
                size={typeBarSize}
                onDragFinished={(size) => resizePane('split9', size > 900 ? 900 : size, setTypeBarSize)}
                ref={assignmentTypeRef}
            >
                <div id={`activity_container`} style={{ height: '100%'}}>
                    { 
                        openTypeBar === true 
                        ? 
                            <>
                                <ArrowButton arrowId={`arrow_activity`} handleClick={handleTypeBarOpen} buttonType={toggleTypeButtonType} buttonVisible={typeButtonVisible}/>
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
                    onDragFinished={(size) => resizePane('split7', size > 900 ? 900 : size, setOtherPartyBarSize)}
                    ref={otherPartyRef}
                >
                    <div id={`parties_container`}  style={{ height: '100%'}}>
                        { 
                            openOtherPartyBar === true 
                            ? 
                                <>
                                    <ArrowButton arrowId={`arrow_parties`} handleClick={handleOtherPartyBarOpen} buttonType={toggleOtherPartyButtonType} buttonVisible={otherPartyButtonVisible}/>
                                    <CustomerTable 
                                        standalone={true}
                                        parentBarDrag={setVisualizerBarSize}
                                        parentBar={setVisualizeOpenBar}
                                        type={type}
                                    />
                                </>
                            : 
                            ''
                        }
                    </div>
                    <SplitPane
                        className={classes.splitPane}
                        split="vertical"
                        size={assignmentBarSize}
                        onDragFinished={(size) => resizePane('split8', size > 900 ? 900 : size, setAssignmentBarSize)}
                        ref={assignmentRef}
                    >
                        <div id={`transaction_container`} style={{ height: '100%'}}>
                            { 
                                openAssignmentBar === true 
                                ? 
                                    <>
                                        <ArrowButton arrowId={`arrow_transactions`} handleClick={handleAssignmentBarOpen} buttonType={toggleAssignmentButtonType} buttonVisible={assignmentButtonVisible}/>
                                        <AssignmentsTable type={type} defaultLoad={type === 2 ? false : true} />
                                    </>
                                : 
                                ''
                            }
                        </div>
                        <SplitPane
                            className={classes.splitPane}
                            split="vertical"
                            size={customerBarSize}
                            onDragFinished={(size) => resizePane('split2', size > 900 ? 900 : size, setCustomerBarSize)}
                            ref={assetRef}
                        >
                            <div id={`assets_container`} style={{ height: '100%'}}>
                                { 
                                    openCustomerBar === true 
                                    ? 
                                        <>
                                            <ArrowButton arrowId={`arrow_assets`} handleClick={handleCustomersBarOpen} buttonType={toggleCustomerButtonType} buttonVisible={customerButtonVisible}/>
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
                            >
                                <div id={`assets_files_container`} style={{ height: '100%'}}>
                                    {
                                        assetFilesBar === true
                                        ?
                                            <FilesTemplates />
                                        :
                                        ''
                                    }
                                </div> 
                                <SplitPane
                                    className={classes.splitPane}
                                    split="vertical"
                                    size={driveTemplateBarSize}
                                    ref={templateFileRef}
                                >
                                    <div id={`layout_templates_container`} style={{ height: '100%'}}>
                                        {
                                            driveTemplateFrameMode === true
                                            ?
                                                <LayoutTemplates />
                                            :
                                            ''
                                        }
                                    </div>
                                    <SplitPane
                                        className={`${classes.splitPane} ${classes.splitPane2}  ${classes.splitPane3} ${classes.splitPane2OverflowUnset}`}
                                        split="vertical"
                                        minSize={10}
                                        size={visualizerBarSize}
                                        onDragStarted={() => {
                                            setIsDragging(!isDragging)
                                        }}
                                        onDragFinished={(size) => {
                                            resizePane('split4', size, setVisualizerBarSize)
                                            setIsDragging(!isDragging)
                                        }}
                                        ref={mainContainerRef}
                                        primary={'second'}
                                        maxSize={-250} 
                                    >
                                        <div className={isDragging === true ? classes.notInteractive : classes.isInteractive} style={{ height: '100%'}}>
                                            <IllustrationCommentContainer 
                                                cls={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPane1OverflowUnset, classes.paneHeightZero, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                                                split={`horizontal`}
                                                minSize={50}
                                                defaultSize={commentBarSize}
                                                fn={resizePane}
                                                fnParams={setCommentBarSize}
                                                commentBar={openCommentBar}
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
                                                chartsBarToggle={handleChartBarOpen}
                                                checkChartAnalytics={checkChartAnalytics}
                                                type={type}
                                            />
                                        </div>
                                        <div className={isDragging === true ? classes.notInteractive : classes.isInteractive} style={{ height: '100%'}}>
                                            {
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
                                                    parentBarDrag={setVisualizerBarSize}
                                                    parentBar={setVisualizeOpenBar}
                                                    primary={'second'}
                                                    illustrationData={illustrationRecord}
                                                    chartBar={openChartBar}
                                                    analyticsBar={openAnalyticsBar}
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