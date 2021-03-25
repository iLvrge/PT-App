import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import FilterListIcon from '@material-ui/icons/FilterList'

import { IconButton, CircularProgress } from '@material-ui/core'
import SplitPane from 'react-split-pane'
import ArrowButton from '../common/ArrowButton'
import MainCompaniesSelector from '../common/MainCompaniesSelector'
import MaintainenceAssetsList from '../common/MaintainenceAssetsList'
import IllustrationCommentContainer from '../common/IllustrationCommentContainer'
import AssetDetailsContainer from '../common/AssetDetailsContainer'
import NavigationIcon from '../NavigationIcon'
import Loader from '../common/Loader'

import { resizePane, resizePane2 } from '../../utils/splitpane'
import { updateResizerBar } from '../../utils/resizeBar'

import useStyles from './styles'
import clsx from 'clsx'

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
    setMainCompaniesAllSelected
} from '../../actions/patentTrackActions2'

import { loginRedirect } from '../../utils/tokenStorage'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode, toggleLifeSpanMode, setMaintainenceFeeFrameMode } from '../../actions/uiActions'

const BigScreen = () => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const mainContainerRef = useRef()
    const companyRef = useRef()
    const assignmentTypeRef = useRef()
    const otherPartyRef = useRef()
    const assignmentRef = useRef()
    const assetRef = useRef()

    const [ gap, setGap ] = useState({ x: "14.1rem", y: "7.5rem"})
    const [ toggleButtonType , setToggleButtonType ] = useState(true)
    const [ openBar, setOpenBar ] = useState(true)
    const [ companyButtonVisible, setCompanyButtonVisible ] = useState(false)
    const [ companyBarSize, setCompanyBarSize ] = useState(200)

    const [ toggleCustomerButtonType , setToggleCustomerButtonType ] = useState(true)
    const [ openCustomerBar, setCustomerOpenBar ] = useState(true)
    const [ customerButtonVisible, setCustomerButtonVisible ] = useState(false)
    const [ customerBarSize, setCustomerBarSize ] = useState(120)

    const [ toggleTypeButtonType , setToggleTypeButtonType ] = useState(true)
    const [ openTypeBar, setTypeOpenBar ] = useState(false)
    const [ typeButtonVisible, setTypeButtonVisible ] = useState(false)
    const [ typeBarSize, setTypeBarSize ] = useState(0) 

    const [ toggleOtherPartyButtonType , setToggleOtherPartyButtonType ] = useState(true)
    const [ openOtherPartyBar, setOtherPartyOpenBar ] = useState(false)
    const [ otherPartyButtonVisible, setOtherPartyButtonVisible ] = useState(false)
    const [ otherPartyBarSize, setOtherPartyBarSize ] = useState(0)

    const [ toggleAssignmentButtonType , setToggleAssignmentButtonType ] = useState(true)
    const [ openAssignmentBar, setAssignmentOpenBar ] = useState(false)
    const [ assignmentButtonVisible, setAssignmentButtonVisible ] = useState(false)
    const [ assignmentBarSize, setAssignmentBarSize ] = useState(0)

    const [ commentBarSize , setCommentBarSize ] = useState('30%')
    const [ illustrationBarSize , setIllustrationBarSize ] = useState('34.2%')
    const [ visualizerBarSize , setVisualizerBarSize ] = useState('30%')
    const [ openVisualizerBar, setVisualizeOpenBar ] = useState(true)

    const [ openIllustrationBar, setIllustrationBar ] = useState(true)
    const [ openCommentBar, setCommentBar ] = useState(true)
    const [ openChartBar, setChartBar ] = useState(true)
    const [ openAnalyticsBar, setAnalyticsBar ] = useState(true)

    const [ isDrag, setIsDrag ] = useState(false)
    const [ size, setSize] = useState(0)

    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [ illustrationRecord, setIllustrationRecord ] = useState()
    
    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, []) 

    const companies = useSelector( state => state.patenTrack2.mainCompaniesList.list )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedMainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )

    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList )
    const maintainenceAssetsLoadingMore = useSelector( state => state.patenTrack2.maintainenceAssetsLoadingMore )
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const channel_id = useSelector( state => state.patenTrack2.channel_id )
    const authenticated = useSelector(store => store.auth.authenticated)
    const categoryName = useSelector(state => state.patenTrack2.categoryName)

    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents )
    const pdfFile = useSelector( state => state.patenTrack2.pdfFile )
    const connectionBoxData = useSelector( state => state.patenTrack2.connectionBoxData )

    useEffect(() => {
        loginRedirect( authenticated )
    }, [ authenticated ])

    useEffect(() => {
        dispatch(setMainCompaniesAllSelected(true))
    }, [  ])
    
    useEffect(() => {
        if(categoryName != 'Maintenance > Pay Maintenance Fee') {
            dispatch(setBreadCrumbs('Maintenance > Pay Maintenance Fee'))
        }        
    }, [ dispatch, categoryName ])
    
    useEffect(() => {
        if(selectedMainCompanies.length > 0) {
            dispatch( getMaintainenceAssetsList( selectedMainCompanies ))
        } else {
            resetAll(dispatch)
        }
    }, [dispatch, selectedMainCompanies])

    useEffect(() => {
        if(selectedCompaniesAll === true) {
            dispatch( getMaintainenceAssetsList( [] ))
        } else {
            resetAll(dispatch)
        }
    }, [dispatch, selectedCompaniesAll ])

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
        updateResizerBar(assetRef, openCustomerBar)
    }, [ assetRef, openCustomerBar ])

    useEffect(() => {
        updateResizerBar(mainContainerRef, openVisualizerBar)
    }, [ mainContainerRef, openVisualizerBar ])

    useEffect(() => {
        if( pdfFile != null || connectionBoxData != null ) {
            let stateChange = false

            if( pdfFile != null && Object.keys(pdfFile).length > 0 ) {
                if( openChartBar === false ) {
                    setChartBar( !openChartBar )
                    setVisualizeOpenBar( true )
                }
            }

            if( connectionBoxData != null && Object.keys(connectionBoxData).length > 0 ) {
                if( openAnalyticsBar === false ) {
                    setAnalyticsBar( !openAnalyticsBar )
                    setIllustrationBarSize('34.2%')
                }
                if( openChartBar === false ) {
                    setChartBar( !openChartBar )
                    setIllustrationBarSize('30%')
                }
                setVisualizeOpenBar( true )
                setVisualizerBarSize('30%')
            }
            console.log( "pdfFile connectionBoxData", pdfFile, connectionBoxData )
        }
    }, [ pdfFile, connectionBoxData ]) 

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

    const checkContainer = () => {
        setTimeout(() => {
            if( mainContainerRef.current != null  && mainContainerRef.current != undefined) {
                const mainWidth = mainContainerRef.current.pane2.clientWidth, illustrationContainer = mainContainerRef.current.pane2.querySelector('#patentrackDiagramDiv')
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


    const onHandleIllustrationSize = (size) => {
        if(mainContainerRef.current != null ) {
            const containerSize = mainContainerRef.current.pane2.clientWidth
            const illustrationSize = size != undefined ? containerSize - size - 3 : mainContainerRef.current.pane1.querySelector('#patentrackDiagramDiv').clientWidth
            const width = 620
            if( illustrationSize > width ) {
                const constantX = 14.1, constantValue = parseFloat(constantX / width).toFixed(4)
                let calc = (illustrationSize * constantValue) - 1.4
                if(calc > 14.1) {
                    console.log({...gap, x: `${parseFloat(calc).toFixed(1)}rem`})
                    setGap({...gap, x: `${parseFloat(calc).toFixed(1)}rem`}) 
                }
            } else {
                setGap({...gap, x: '14.1rem'})
            }
        }
    }

    const handleCompanyBarOpen = (event) => {
        setToggleButtonType( !toggleButtonType )
        setOpenBar( !openBar )
        if(!openBar === false) {
            setCompanyBarSize(0)
        } else {
            setCompanyBarSize(200)
        }
    }

    const handleCompanyButton = (event, flag) => {
        event.preventDefault()
        setCompanyButtonVisible( flag )
    }

    const handleCustomersBarOpen = (event) => {
        setToggleCustomerButtonType( !toggleCustomerButtonType )
        setCustomerOpenBar( !openCustomerBar )
        if(!openCustomerBar === false) {
            setCustomerBarSize(0)
        } else {
            setCustomerBarSize(120)
        }
    }

    const handleCustomerButton = (event, flag) => {
        event.preventDefault()
        setCustomerButtonVisible( flag )
    }

    const onHandleChangeFileName = useCallback((value) => {
        dispatch(setMaintainenceFileName(value == '' ? 'MaintainenceFee' : value))
    }, [ dispatch,  setMaintainenceFileName ])

    const changeVisualBar = (chart, analytics, comment, illustration) => {
        let barOpen = true, barSize = '30%'
        if(chart === false && analytics === false && (comment === true || illustration === true)){
            barSize = '0%'
            barOpen = false
        } else if (comment === false && illustration === false && ( chart === true ||  analytics === true )) {
            barSize = '100%'
        }
        setVisualizeOpenBar(barOpen)
        setVisualizerBarSize(barSize)
    }

    const handleCommentBarOpen = () => {
        let bar = openCommentBar, barSize = '30%'
        setCommentBar( !bar )
        if((!bar === false && openIllustrationBar === false) || (!bar === false && openIllustrationBar === true)) {
            barSize = 0  
        } else if(!bar === true && openIllustrationBar === false) {
            barSize = '100%'
        }
        setCommentBarSize(barSize)
        changeVisualBar(openChartBar, openAnalyticsBar, !bar, openIllustrationBar)
    }

    const handleIllustrationBarOpen = () => {
        let bar = openIllustrationBar, barSize = '30%'
        setIllustrationBar( !bar )
        if(!bar === false && openCommentBar === true) {
            barSize = '100%'
        } else if((!bar === false && openCommentBar === false) || (!bar === true && openCommentBar === false)) {
            barSize = 0  
        }
        setCommentBarSize(barSize)
        changeVisualBar(openChartBar, openAnalyticsBar, openCommentBar, !bar)
    }

    const handleChartBarOpen = () => {
        let bar = openChartBar, barSize = '34.2%'
        setChartBar( !bar )
        if(!bar === false && openAnalyticsBar === true) {
            barSize = '100%'
        } else if((!bar === true && openAnalyticsBar === false) || ( !bar === false && openAnalyticsBar === false )) {
            barSize = 0         
        }
        setIllustrationBarSize(barSize)       
        changeVisualBar(!bar, openAnalyticsBar, openCommentBar, openIllustrationBar)
    }

    const handleAnalyticsBarOpen = () => {
        let bar = openAnalyticsBar, barSize = '34.2%'
        setAnalyticsBar( !bar )
        if((!bar === false && openChartBar === false) || (openChartBar === true && !bar === false)) {
            barSize = 0
        } else if(!bar === false && openChartBar === true ) {
            barSize = '100%'
        } 
        setIllustrationBarSize(barSize)
        changeVisualBar(openChartBar, !bar, openCommentBar, openIllustrationBar)
    }

    
    return (
        <>
            <div className={classes.filterToolbar}> 
                <div className={classes.flex}>
                    <div className={classes.showIcon} style={{height: '40px'}}>
                        <FilterListIcon />
                    </div>
                    <NavigationIcon click={handleCompanyBarOpen} tooltip={`Companies`} cl={classes} bar={openBar} selectAll={selectedCompaniesAll} selected={selectedMainCompanies} data={companies} t={1}/>
                    <NavigationIcon tooltip={`Activities`} t={2} disabled={true} />
                    <NavigationIcon tooltip={`Parties`} t={3} disabled={true} />
                    <NavigationIcon tooltip={`Assignments`} t={4} disabled={true} />
                    <NavigationIcon click={handleCustomersBarOpen} tooltip={`Assets`} cl={classes} bar={openCustomerBar} selectAll={selectedAssetsPatents} selected={selectedAssetsPatents} data={maintainenceAssetsList} t={5} />
                </div>
                <div className={`${classes.flex} ${classes.bottom}`}>
                    <NavigationIcon click={handleIllustrationBarOpen} tooltip={`Illustration`} cl={classes} bar={openIllustrationBar} t={6}/>
                    <NavigationIcon click={handleCommentBarOpen} tooltip={`Slack bar`} cl={classes} bar={openCommentBar} t={7}/>
                    <NavigationIcon click={handleChartBarOpen} tooltip={`Charts`} cl={classes} bar={openChartBar} t={8}/>
                    <NavigationIcon click={handleAnalyticsBarOpen} tooltip={`Analytics`} cl={classes} bar={openAnalyticsBar} t={9}/>
                </div>
            </div>
            <SplitPane
                className={classes.splitPane}
                split="vertical"
                size={companyBarSize}
                onDragFinished={(size) => resizePane('split1', size, setCompanyBarSize)}
                ref={companyRef}  
            >
                <div 
                    className={classes.companyBar}
                    onMouseOver={(event) => handleCompanyButton(event, true)}
                    onMouseLeave={(event) => handleCompanyButton(event, false)}
                >
                    
                    { openBar === true 
                        ? 
                            <>
                                <ArrowButton handleClick={handleCompanyBarOpen} buttonType={toggleButtonType} buttonVisible={companyButtonVisible}/>
                                <MainCompaniesSelector /> 
                            </>
                        : 
                        <div className={classes.showIcon}>
                            <IconButton onClick={handleCompanyBarOpen}><i className={`fad fa-building`}></i></IconButton>
                        </div>
                    }
                </div>
                <SplitPane
                    className={classes.splitPane}
                    split="vertical"
                    size={customerBarSize}
                    ref={assetRef}
                    onDragFinished={(size) => resizePane('split2', size > 900 ? 900 : size, setCustomerBarSize)}
                >
                    <div style={{ height: '100%'}}
                        onMouseOver={(event) => handleCustomerButton(event, true)}
                        onMouseLeave={(event) => handleCustomerButton(event, false)}
                    >
                        { 
                            openCustomerBar === true 
                            ? 
                                <>
                                    <ArrowButton handleClick={handleCustomersBarOpen} buttonType={toggleCustomerButtonType} buttonVisible={customerButtonVisible}/>
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
                                    />
                                </>
                            : 
                            <div className={`${classes.showIcon} ${classes.fontChange}`}>
                                <IconButton onClick={handleCustomersBarOpen}><i className={`fad fa-handshake-alt`}></i></IconButton>
                            </div>
                        }
                    </div>
                    <SplitPane
                        className={`${classes.splitPane} ${classes.splitPane2}  ${classes.splitPane3} ${classes.splitPane2OverflowUnset}`}
                        split="vertical"
                        minSize={10}
                        maxSize={-250}
                        size={visualizerBarSize}
                        onDragFinished={(size) => {
                            resizePane('split4', size, setVisualizerBarSize)
                        }}
                        primary={'second'}
                        ref={mainContainerRef}
                    >

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
                            setMaintainenceFeeFrameMode={setMaintainenceFeeFrameMode}
                            setMaintainenceFileName={onHandleChangeFileName}
                            gap={gap}
                            templateButton={true}
                            maintainenceButton={true}
                        />

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
                            parentBarDrag={setVisualizerBarSize}
                            parentBar={setVisualizeOpenBar}
                            primary={'second'}
                            illustrationData={illustrationRecord}
                            bar={openVisualizerBar}
                            chartBar={openChartBar}
                            analyticsBar={openAnalyticsBar}
                        />
                    </SplitPane>
                </SplitPane>
            </SplitPane>
        </>
    )
}

export default BigScreen