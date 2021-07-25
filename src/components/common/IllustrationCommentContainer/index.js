import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import SplitPane from 'react-split-pane'
import { IconButton, Paper, Modal, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TextField } from '@material-ui/core'
import { Draggable } from 'react-drag-and-drop'

import { Close, Fullscreen } from '@material-ui/icons'
import IllustrationContainer from '../AssetsVisualizer/IllustrationContainer'
import TimelineContainer from '../AssetsVisualizer/TimelineContainer'
import AssetsCommentsTimeline from '../AssetsCommentsTimeline'
import LoadMaintainenceAssets from './LoadMaintainenceAssets'
import LoadTransactionQueues from './LoadTransactionQueues'
import LoadTransactionNameQueues from './LoadTransactionNameQueues'
import ArrowButton from '../ArrowButton'
import { updateResizerBar } from '../../../utils/resizeBar'
import useStyles from './styles'

const IllustrationCommentContainer = ({ 
    cls, 
    split, 
    minSize, 
    defaultSize, 
    fn, 
    fnParams, 
    commentBar, 
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
    chartsBarToggle, 
    checkChartAnalytics,
    onHandleGapSize,
    assignmentBar,
    assignmentBarToggle }) => {
    const classes = useStyles() 
    const iframeRef = useRef()
    const illustrationRef = useRef()
    const [ toggleCommentButtonType , setToggleCommentButtonType ] = useState(true)
    const [ openCommentBar, setCommentOpenBar ] = useState(true)
    const [ commentButtonVisible, setCommentButtonVisible ] = useState(false)
    const [ isDrag, setIsDrag ] = useState(false)
    const [ templateURL, settemplateURL] = useState('about:blank')
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
    const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
    const driveTemplateFrameMode = useSelector(state => state.ui.driveTemplateFrameMode)
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
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    
    
    useEffect(() => {
        updateResizerBar(illustrationRef, commentBar, 1)
    }, [ illustrationRef, commentBar ])

    useEffect(() => {        
        if(new_drive_template_file != null && Object.keys(new_drive_template_file).length > 0 && new_drive_template_file.hasOwnProperty('id')) {
            settemplateURL(`https://docs.google.com/document/d/${new_drive_template_file.id}/edit`)
        }
    }, [new_drive_template_file])

    useEffect(() => {
        if( templateURL != template_document_url ) {
            settemplateURL(template_document_url)
        }        
    }, [ templateURL,  template_document_url ])

    const handleCommentButton = (event, flag) => {
        event.preventDefault()
        setCommentButtonVisible( flag )
    }

    const handleCommentBarOpen = () => {
        setToggleCommentButtonType( !toggleCommentButtonType )
        setCommentOpenBar( !openCommentBar )
        if(!openCommentBar === false) {
            fnParams(0)
        } else {
            fnParams('30%')
        }
    }

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


    const shouldShowTimeline = useMemo(
        () => (!selectedAssetsPatents.length &&  !assetIllustration),
        [ selectedAssetsPatents, selectedAssetAssignments, assetIllustration ],
    )

    return (
        <SplitPane
            className={cls}
            split={split}
            minSize={minSize}
            defaultSize={defaultSize}
            onDragStarted={() => {
                console.log('!isDrag', !isDrag)
                setIsDrag(!isDrag)
            }}
            onDragFinished={(size) => {
                console.log("Drag End", !isDrag)
                setIsDrag(!isDrag)
                fn2(size, fn2Params)
                fn(fnVarName, size, fnParams)   
            }} 
            maxSize={-10} 
            primary={primary}
            ref={illustrationRef}
            pane1Style={{
                pointerEvents: isDrag === true ? 'none' : 'auto',
            }}
        >         
            <div style={{display: 'unset'}}>   
                {
                    !isFullscreenOpen && 
                        illustrationBar === true && 
                        ( search_string != '' || assetCompaniesRowSelect.length > 0 || 
                            selectedCompaniesAll === true || 
                            selectedCompanies.length > 0
                        )
                    ?
                        <IconButton 
                            size="small" 
                            className={classes.fullscreenBtn} 
                            onClick={handleClickOpenFullscreen}
                        >
                            <Fullscreen />
                        </IconButton>
                    :
                    ''
                }                 
                {  
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
                    !isFullscreenOpen && 
                        illustrationBar === true && 
                        ( search_string != '' || assetCompaniesRowSelect.length > 0 || 
                            selectedCompaniesAll === true || 
                            selectedCompanies.length > 0

                        ) 
                    ?
                        shouldShowTimeline
                        ?
                            <TimelineContainer assignmentBar={assignmentBar} assignmentBarToggle={assignmentBarToggle}/>
                        :

                            <IllustrationContainer 
                                isFullscreenOpen={isFullscreenOpen} 
                                asset={assetIllustration} 
                                setIllustrationRecord={illustrationRecord} 
                                chartsBar={chartsBar}
                                chartsBarToggle={chartsBarToggle}
                                checkChartAnalytics={checkChartAnalytics}
                                gap={gap}
                            />
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
                        <IconButton 
                            onClick={handleCloseFullscreen} 
                            className={classes.right}
                        >
                            <Close /> 
                        </IconButton> 
                        {
                            shouldShowTimeline === true ? (
                                <TimelineContainer assignmentBar={assignmentBar} assignmentBarToggle={assignmentBarToggle}/>
                            )
                            :
                                illustrationBar === true ? (
                                    <IllustrationContainer 
                                        isFullscreenOpen={isFullscreenOpen}  
                                        asset={assetIllustration} 
                                        setIllustrationRecord={illustrationRecord} 
                                        chartsBar={chartsBar}
                                        chartsBarToggle={chartsBarToggle}
                                        checkChartAnalytics={checkChartAnalytics}
                                    />
                                )
                                :
                                ''
                        }
                    </Paper>
                </Modal>
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
    )
}
 
export default IllustrationCommentContainer