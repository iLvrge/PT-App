import React, {useEffect, useRef, useState} from "react"
import { useSelector, useDispatch } from 'react-redux'
import SplitPane from 'react-split-pane'

import AssignmentsTable from '../common/AssignmentsTable'
import ArrowButton from '../common/ArrowButton'
import IllustrationCommentContainer from '../common/IllustrationCommentContainer'
import AssetDetailsContainer from '../common/AssetDetailsContainer'

import { resizePane, resizePane2 } from '../../utils/splitpane'
import { updateResizerBar } from '../../utils/resizeBar'
import { loginRedirect } from '../../utils/tokenStorage'

import PatenTrackApi from '../../api/patenTrack2'

import { 
    setChannelID,
    setBreadCrumbs,
    setAssetTypeAssignments,
    setAssetTypesAssignmentsLoading
} from '../../actions/patentTrackActions2'

import clsx from 'clsx'
import useStyles from './styles'


const Search = (props) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const assignmentRef = useRef()
    const mainContainerRef = useRef()
    const [ gap, setGap ] = useState({ x: "14.1rem", y: "7.5rem"})
    const [ openAssignmentBar, setAssignmentOpenBar ] = useState(true)
    const [ toggleAssignmentButtonType , setToggleAssignmentButtonType ] = useState(true)
    const [ assignmentButtonVisible, setAssignmentButtonVisible ] = useState(false)
    const [ assignmentBarSize, setAssignmentBarSize ] = useState(200)
    

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

    /* const pdfFile = useSelector( state => state.patenTrack.pdfFile )
    const connectionBoxData = useSelector( state => state.patenTrack.connectionBoxData ) */
    
    const channel_id = useSelector( state => state.patenTrack2.channel_id )    
    const authenticated = useSelector(store => store.auth.authenticated)
    const search_string = useSelector(state => state.patenTrack2.search_string)
    const breadcrumbs = useSelector(state => state.patenTrack2.breadcrumbs)

    useEffect(() => {
        const searchData = async () => {            
            if( search_string && search_string != '' ) {
                dispatch( setAssetTypesAssignmentsLoading( true ) )
                const { data } = await PatenTrackApi.getSearch(search_string)
                dispatch( setAssetTypesAssignmentsLoading( false ) )
                if( data && data != null ) {
                    dispatch(setAssetTypeAssignments( data, true ))                    
                }
            }
        }
        
        searchData()
    }, [ search_string ])

    useEffect(() => {
        loginRedirect( authenticated )
    }, [ authenticated ])

    useEffect(() => {
        if(breadcrumbs != 'Search') {
            dispatch(setBreadCrumbs('Search'))
        }        
    }, [ dispatch, breadcrumbs ])

    useEffect(() => {
        updateResizerBar(assignmentRef, openAssignmentBar)
    }, [ assignmentRef, openAssignmentBar ])

    useEffect(() => {
        updateResizerBar(mainContainerRef, openVisualizerBar)
    }, [ mainContainerRef, openVisualizerBar ])

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

    /* useEffect(() => {
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
    }, [ pdfFile, connectionBoxData ]) */


    const handleAssignmentButton = (event, flag) => {
        event.preventDefault()
        setAssignmentButtonVisible( flag )
    }

    const handleAssignmentBarOpen = (event) => {
        setToggleAssignmentButtonType( !toggleAssignmentButtonType )
        setAssignmentOpenBar( !openAssignmentBar )
        if(!openAssignmentBar === false) {
            setAssignmentBarSize(0)
        } else {
            setAssignmentBarSize(120)
        }
    }

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
            <SplitPane
                className={classes.splitPane}
                split="vertical"
                size={assignmentBarSize}
                onDragFinished={(size) => resizePane('split8', size > 900 ? 900 : size, setAssignmentBarSize)}
                ref={assignmentRef}
            >
                <div style={{ height: '100%'}}
                    onMouseOver={(event) => handleAssignmentButton(event, true)}
                    onMouseLeave={(event) => handleAssignmentButton(event, false)}
                >
                    { 
                        openAssignmentBar === true 
                        ? 
                            <>
                                <ArrowButton handleClick={handleAssignmentBarOpen} buttonType={toggleAssignmentButtonType} buttonVisible={assignmentButtonVisible}/>
                                <AssignmentsTable defaultLoad={false}/>
                            </>
                        : 
                        ''
                    }
                </div>
                <SplitPane
                    className={`${classes.splitPane} ${classes.splitPane2}  ${classes.splitPane3} ${classes.splitPane2OverflowUnset}`}
                    split="vertical"
                    minSize={10}
                    size={visualizerBarSize}
                    onDragFinished={(size) => {
                        resizePane('split4', size, setVisualizerBarSize)
                    }}
                    ref={mainContainerRef}
                    primary={'second'}
                    maxSize={-250}
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
                        gap={gap}
                        templateButton={false}
                        maintainenceButton={false}
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
                        bar={openVisualizerBar}
                        parentBarDrag={setVisualizerBarSize}
                        parentBar={setVisualizeOpenBar}
                        primary={'second'}
                        illustrationData={illustrationRecord}
                        chartBar={openChartBar}
                        analyticsBar={openAnalyticsBar}
                    />
                </SplitPane> 
            </SplitPane>
        </>
    )
}



export default Search