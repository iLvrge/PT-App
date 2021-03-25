import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import SplitPane from 'react-split-pane'
import { IconButton, Paper, Modal, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TextField } from '@material-ui/core'


import { Close, Fullscreen } from '@material-ui/icons'
import IllustrationContainer from '../AssetsVisualizer/IllustrationContainer'
import TimelineContainer from '../AssetsVisualizer/TimelineContainer'
import AssetsCommentsTimeline from '../AssetsCommentsTimeline'
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
    onHandleGapSize }) => {
    const classes = useStyles() 
    const iframeRef = useRef()
    const illustrationRef = useRef()
    const [ toggleCommentButtonType , setToggleCommentButtonType ] = useState(true)
    const [ openCommentBar, setCommentOpenBar ] = useState(true)
    const [ commentButtonVisible, setCommentButtonVisible ] = useState(false)
    
    
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
    const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
    
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll)

    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetCompaniesRowSelect = useSelector(state => state.patenTrack2.mainCompaniesList.row_select)
    const search_string = useSelector(state => state.patenTrack2.search_string)    
    

    useEffect(() => {
        updateResizerBar(illustrationRef, commentBar, 1)
    }, [ illustrationRef, commentBar ])

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
    }, [ ])


    const shouldShowTimeline = useMemo(
        () => (!selectedAssetsPatents.length &&  !assetIllustration),
        [ selectedAssetsPatents, selectedAssetAssignments, assetIllustration ],
    )

    const LoadMaintainenceAssets = ({rows}) => {
        return (
            <TableContainer 
                component={Paper} s
                tyle={{height: '100%'}}
            >
                <TextField 
                    id='file_name' 
                    label='File Name' 
                    placeholder='File Name' 
                    defaultValue='MaintainenceFee' 
                    onChange={onChangeFileName}
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                ['Patent #', 'Application #', 'Attorney Docket #', 'Fee Code', 'Fee Amount'].map( (col, index) => (
                                    <TableCell key={index}>{col}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rows.map( ( row, rowIndex) => (
                                <TableRow key={{rowIndex}}>
                                    {
                                        row.map( (col, cellIndex) => (
                                            <TableCell key={rowIndex+cellIndex}>{col}</TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )  
    }

    return (
        <SplitPane
            className={cls}
            split={split}
            minSize={minSize}
            defaultSize={defaultSize}
            onDragFinished={(size) => {
                fn2(size, fn2Params)
                fn(fnVarName, size, fnParams)
                /* onHandleGapSize(size) */
            }}
            maxSize={-10}
            primary={primary}
            ref={illustrationRef}
        >         
            <>   
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
                    maintainenceFrameMode === true
                    ?
                        <LoadMaintainenceAssets 
                            rows={selectedMaintainencePatents}/>
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
                            <TimelineContainer />
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
                                <TimelineContainer />
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
            </>

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
                            channel_id={channel_id} />
                    :
                    ''
                }
            </div>
        </SplitPane>
    )
}
 
export default IllustrationCommentContainer