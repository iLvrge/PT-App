import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import SplitPane from 'react-split-pane'
import { IconButton, Paper, Modal, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TextField } from '@mui/material'
import { Draggable } from 'react-drag-and-drop'
import _debounce from 'lodash/debounce'
import { Close, Fullscreen } from '@mui/icons-material'
import IllustrationContainer from '../AssetsVisualizer/IllustrationContainer'
import TimelineContainer from '../AssetsVisualizer/TimelineContainer'
import AssetsCommentsTimeline from '../AssetsCommentsTimeline'
import LoadMaintainenceAssets from './LoadMaintainenceAssets'
import LoadTransactionQueues from './LoadTransactionQueues'
import LoadTransactionNameQueues from './LoadTransactionNameQueues'
import LoadLinkAssets from './LoadLinkAssets'
import AllComponentsMenu from '../AllComponentsMenu'
import ArrowButton from '../ArrowButton'
import DisplayFile from './DisplayFile'
import { updateResizerBar } from '../../../utils/resizeBar'

import { numberWithCommas, applicationFormat, capitalize } from "../../../utils/numbers";
import useStyles from './styles'
import Reports from '../../Reports'
import FullScreen from '../FullScreen'
import clsx from 'clsx'

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
    handleCustomersBarOpen }) => {
    const classes = useStyles() 
    const iframeRef = useRef()
    const illustrationRef = useRef()
    const [ containerSize, setContainerSize] = useState(0)
    const [ dashboardFullScreen, setDashboardFullScreen ] = useState( false )
    const [ toggleCommentButtonType , setToggleCommentButtonType ] = useState(true)
    const [ openCommentBar, setCommentOpenBar ] = useState(true)
    const [ commentButtonVisible, setCommentButtonVisible ] = useState(false)
    const [ isDrag, setIsDrag ] = useState(false)
    const [ templateURL, setTemplateURL] = useState('about:blank')
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [ menuComponent, setMenuComponent ] = useState([])
    const [ showManualComponent, setShowManualComponent ] = useState(false)
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
    const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
    const driveTemplateFrameMode = useSelector(state => state.ui.driveTemplateFrameMode)
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
    const new_drive_template_file = useSelector(state => state.patenTrack2.new_drive_template_file)
    const template_document_url = useSelector(state => state.patenTrack2.template_document_url)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll)

    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetCompaniesRowSelect = useSelector(state => state.patenTrack2.mainCompaniesList.row_select)
    const search_string = useSelector(state => state.patenTrack2.search_string)   
    const addressQueuesDisplay = useSelector(state => state.patenTrack2.addressQueuesDisplay)   
    const nameQueuesDisplay = useSelector(state => state.patenTrack2.nameQueuesDisplay)
    const link_assets_sheet_display = useSelector(state => state.patenTrack2.link_assets_sheet_display)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const link_assets_sheet_type = useSelector(state => state.patenTrack2.link_assets_sheet_type)
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    
  
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
            handleCustomersBarOpen: handleCustomersBarOpen
        }
    ] 


    useEffect(() => {
        updateResizerBar(illustrationRef, commentBar, 1)
    }, [ illustrationRef, commentBar ]) 

    useEffect(() => {        
        if(new_drive_template_file != null && Object.keys(new_drive_template_file).length > 0 && new_drive_template_file.hasOwnProperty('id')) {
            setTemplateURL(`https://docs.google.com/document/d/${new_drive_template_file.id}/edit`)
        }
    }, [new_drive_template_file])

    useEffect(() => {
        if( templateURL != template_document_url ) {
            setTemplateURL(template_document_url)
        }        
    }, [ templateURL,  template_document_url ])

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
            defaultSize={defaultSize}
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
                {/* <AllComponentsMenu onClick={onHandleComponentMenuItem}/> */}
                {
                    illustrationBar === true && dashboardScreen === false && !isFullscreenOpen && shouldShowTimeline
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
                    illustrationBar === true && (process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' ||  type === 9 || ((process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD') && auth_token !== null))
                    ?
                        dashboardScreen === true
                        ?
                            <Reports
                                fullScreen={dashboardFullScreen}
                                handleFullScreen={setDashboardFullScreen}
                                chartsBar={chartsBar}
                                analyticsBar={analyticsBar}
                                checkChartAnalytics={checkChartAnalytics}
                                openCustomerBar={openCustomerBar}
                                openCommentBar={commentBar}
                                handleCommentBarOpen={handleCommentBarOpen}
                                handleCustomersBarOpen={handleCustomersBarOpen}
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
                                <TimelineContainer assignmentBar={assignmentBar} assignmentBarToggle={assignmentBarToggle} type={type}/>
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
                            shouldShowTimeline === true ? (
                                <TimelineContainer assignmentBar={assignmentBar} assignmentBarToggle={assignmentBarToggle} type={type}/>
                            )
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
            </div>

            <div 
                className={classes.commentContainer}
            >
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
            </div>
        </SplitPane>
    );
}
 
export default IllustrationCommentContainer