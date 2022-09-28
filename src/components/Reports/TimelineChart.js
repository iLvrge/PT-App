import React, {useCallback, useEffect, useRef, useState} from 'react'
import { 
    useDispatch,
    useSelector 
} from 'react-redux'
import moment from 'moment'
import _debounce from 'lodash/debounce'
import { DataSet } from 'vis-data-71/esnext'
import { Timeline } from 'vis-timeline/esnext'
import { Typography, Tooltip, Zoom, CircularProgress, IconButton, Paper, Modal, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Close, Fullscreen } from '@mui/icons-material' 
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import useStyles from './styles'
import clsx from 'clsx'
import { numberWithCommas, capitalize } from '../../utils/numbers'
import { assetsTypesWithKey, convertTabIdToAssetType, oldConvertTabIdToAssetType } from '../../utils/assetTypes'
import PatenTrackApi from '../../api/patenTrack2'
import themeMode from '../../themes/themeMode'
import AddToolTip from './AddToolTip'
import { setConnectionBoxView, setConnectionData, setPDFFile, setPDFView } from '../../actions/patenTrackActions'
import { retrievePDFFromServer, setAssetsIllustration, setSelectAssignmentCustomerName } from '../../actions/patentTrackActions2'
import PdfViewer from '../common/PdfViewer'
import FullScreen from '../common/FullScreen'
import { setDashboardPanel } from '../../actions/uiActions'


/**
 * Default options parameter for the Timeline
 */

const options = {
    height: '100%',
    autoResize: true,
    stack: true,
    orientation: 'both',
    zoomKey: 'ctrlKey',
    moveable: true,
    zoomable: true,
    horizontalScroll: true,
    verticalScroll: true,
    zoomFriction: 30,
    zoomMin: 1000 * 60 * 60 * 24 * 7, // 7 days
    /* showTooltips: true, */
    /* zoomMax: 1000 * 60 * 60 * 24 * 30 * 3, */ // 3months
    /* cluster: {
    //   titleTemplate: 'Cluster containing {count} events.<br/> Zoom in to see the individual events.',
      showStipes: false,
      clusterCriteria: (firstItem, secondItem) => {
        return ( firstItem.rawData.company === secondItem.rawData.company &&  firstItem.rawData.tab_id == secondItem.rawData.tab_id)
      }
    }, */
    template: function(item, element, data) {
        if (data.isCluster) {
            return `<span class="cluster-header">${data.items[0].customerName}(${data.items.length})</span>`
        } else { 
            return `<span class="${data.assetType} ${data.rawData.tab_id}">${data.customerName}</span>`
        }
    },
}

const TIME_INTERVAL = 1000
var tootlTip = ''
const TimelineChart = (props) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const timelineRef = useRef() //timeline Object ref
    const timelineContainerRef = useRef() //div container ref
    const items = useRef(new DataSet()) // timeline items dataset
    const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(false)
    const [ fullScreen, setFullScreen ] = useState(false)
    const [ openModal, setOpenModal ] = useState(false)
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ tooltipItem, setToolTipItem] = useState([])
    const [ itemData, setItemData ] = useState([])
    const [ timeInterval, setTimeInterval] = useState(null)
    const [ selectTransaction, setSelectTransaction] = useState(null)
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const screenWidth = useSelector( state => state.patenTrack.screenWidth)
    const screenHeight = useSelector( state => state.patenTrack.screenHeight)

    const fullScreenItems = [
        {
            id: 1,
            label: '',
            component: PdfViewer,
            display: true,
            pdfTab: 0,
            show_tab: false
        }  
    ]
    
    const handleOpenPDF = async(item) => {
        const { data } = await PatenTrackApi.getCollectionIllustration(item.rf_id)
        if(data != null) {                        
            const obj = data.line.length > 0 ? data.line[0] : null
            if(obj != null) {
                setFullScreen(true)
                dispatch(
                    setConnectionData(obj)
                ) 
                dispatch(
                    setPDFView(true)
                )
                dispatch(
                    setConnectionBoxView(true)
                )
                if(obj.document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document1 == "" && obj.ref_id > 0)) {
                    obj.rf_id =  obj.ref_id
                    dispatch(retrievePDFFromServer(obj))   
                } else {
                    dispatch(
                        setPDFFile(
                            { 
                                document: obj.document1, 
                                form: obj.document1, 
                                agreement: obj.document1 
                            }
                        )
                    ) 
                }                         
            }                        
        }
    }

    const handleClose = () => {
        setOpenModal(false)
    } 


    const onSelect = useCallback((properties) => {
        const {items, event} = properties
        const {nodeName} = event.target.parentNode 
        const item = timelineRef.current.itemsData.get(items) 
        if(item.length > 0) {
            console.log('onSelect', item);
            const {security_pdf, release_pdf,  rawData} = item[0];
            const {all_release_ids, id} = rawData
            /* if(all_release_ids != null && all_release_ids != '' ) {
                setOpenModal(true)
                setItemData(JSON.parse(all_release_ids))
            } */
            if(selectTransaction != id) {
                setSelectTransaction(id)
                dispatch(setDashboardPanel(true))  
                props.checkChartAnalytics(null, null, true)
                dispatch(setAssetsIllustration({ type: "transaction", id }));
            } else {
                setSelectTransaction(null)
                dispatch(setDashboardPanel(false))  
                dispatch(setAssetsIllustration(null))
                props.checkChartAnalytics(null, null, false)
            }

            /* const pdfFile = nodeName == "TT" ? security_pdf : nodeName == "EM" ? release_pdf : ''
            if(pdfFile !== '' && pdfFile != undefined) {
                console.log('props.checkChartAnalytics', props.checkChartAnalytics)
                props.checkChartAnalytics(null, null, true)
                dispatch(
                    setPDFView(true)
                )
                dispatch(
                    setConnectionBoxView(true)
                )
                if(pdfFile.indexOf('legacy-assignments.uspto.gov') !== -1) {
                    const retrievePDF = {rf_id: nodeName == "TT" ? rawData.id : rawData.release_rf_id}
                    dispatch(retrievePDFFromServer(retrievePDF))  
                } else {
                    dispatch(
                        setPDFFile({ 
                            document: pdfFile, 
                            form: pdfFile,
                            agreement: pdfFile
                        })
                    ) 
                }
            } */
        } else {
            setSelectTransaction(null)
            props.checkChartAnalytics(null, null, false)
        }
    })

    const findImageColor = (item) => {
        let image = '', color ='';
        switch(parseInt(item.tab_id)) {
        case 1:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/acquisition.png'
            color = '#E60000'
            break;
        case 2:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/sales.png'
            color = '#70A800'
            break;
        case 3:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/licensein.png'
            color = '#E69800'
            break;
        case 4:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/licenseout.png'
            color = '#E69800'
            break;
        case 5:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
            color = '#00a9e6'
            break;
        case 6:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerin.png'
            color = '#FFFFFF'
            break;
        case 7:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerout.png'
            color = '#FFFFFF'
            break;
        case 8:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/options.png'
            color = '#000000'
            break;
        case 9:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/courtorder.png'
            color = '#E60000'
            break;
        case 10:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png'
            color = '#FFFFFF'
            break;
        case 11:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/release.png'
            color = '#00a9e6'
            break;
        case 12:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
            color = '#00a9e6'
            break;
        case 13:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
            color = '#00a9e6'
            break;
        case 14:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png'
            color = '#FFFFFF'
            break;
        case 14:
        default:
            image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png'
            color = '#FFFFFF'
            break;
        }
        return {image, color}
    }
      // Custom ToolTip

    const showTooltip = (item, event) => {    
        setTimeout(() => {
        if(tootlTip === item.id) {
            PatenTrackApi
            .cancelTimelineItem()
            PatenTrackApi
            .getTimelineItemData(item.id)
            .then( response => {
            const { data } = response
            if( data != null && ( data.assignor.length > 0 || data.assignee.length > 0 ) && tootlTip === data.assignment.rf_id) {
                const executionDate = data.assignor.length > 0 ? data.assignor[0].exec_dt : ''
                let transactionType = convertTabIdToAssetType(item.tab_id)
                const findIndex = assetsTypesWithKey.findIndex( row => row.type == transactionType)

                if(findIndex !== -1) {
                    transactionType = assetsTypesWithKey[findIndex].name
                } else {
                    transactionType = capitalize(transactionType)
                }
                let {image, color} = findImageColor(item)
                
                let calcLeft = event.clientX + 20, calcTop = event.clientY
                if((calcLeft + 100) > screenWidth) {
                    calcLeft = screenWidth - 300
                }
                if((calcTop + 160) > screenHeight) {
                    calcTop = screenHeight - 350
                }
                const element = document.getElementById(`timeline-${props.id}`);
                const getPosition = element.getBoundingClientRect();  
                
                let tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${getPosition.y}px;left:${getPosition.x}px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'>
                <div style='display:flex;'><div style='display:flex;flex-direction: column;${typeof data.releaseAssignor != 'undefined' && data.releaseAssignor.length > 0 ? "max-width: 48%;margin-right: 10px;" : "" } '>                            
                <h4 style='color:${color};text-align:left;margin:0'>${transactionType}</h4>
                                            <div>
                                            ${ executionDate != '' ? moment(executionDate).format('ll') : ''}
                                            </div>
                                            <div>
                                            <h4>Assignors:</h4>
                                            ${data.assignor.map(or => ( 
                                                '<div>'+or.original_name+'</div>'
                                            )).join('')}
                                            </div>
                                            <div>
                                            <h4>Assignees:</h4>
                                            ${data.assignee.map(ee => (
                                                '<div>'+ee.original_name+'</div>'
                                            )).join('')}
                </div></div>`;
                if(typeof data.releaseAssignor != 'undefined' && data.releaseAssignor.length > 0) {
                    const {releaseAssignor, releaseAssignee, releaseAssignment} = data
                    const releaseExecutionDate = releaseAssignor.length > 0 ? releaseAssignor[0].exec_dt : ''
                    tootltipTemplate += `<div style='display:flex;flex-direction: column;'><h4 style='color:#00a9e6;text-align:left;margin:0'>Release</h4><div>
                    ${ releaseExecutionDate != '' ? moment(releaseExecutionDate).format('ll') : ''}
                    </div>
                    <div>
                    <h4>Assignors:</h4>
                    ${releaseAssignor.map(or => ( 
                        '<div>'+or.original_name+'</div>'
                    )).join('')}
                    </div>
                    <div>
                    <h4>Assignees:</h4>
                    ${releaseAssignee.map(ee => (
                        '<div>'+ee.original_name+'</div>'
                    )).join('')}
                    </div></div>`
                }

                tootltipTemplate +=`</div></div>` 
                resetTooltipContainer() 
                if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
                    document.body.insertAdjacentHTML('beforeend',tootltipTemplate)
                    //timelineContainerRef.current.childNodes[0].insertAdjacentHTML('beforeend',tootltipTemplate)
                }
            } else {
                resetTooltipContainer()
            }
            })
        }                
        }, TIME_INTERVAL) 
    } 
   

    /**
    * on Itemover for the tooltip data
    */

    const onItemover = useCallback(({item, event}) => {
        const overItem = timelineRef.current.itemsData.get(item)
        if(overItem != null) {
        onItemout()
        tootlTip = overItem.rawData.id
        showTooltip(overItem.rawData, event)
        }
    }, [ timelineItems, timeInterval ])

    /**
     * on onItemout for the remove tooltip
     */

    const onItemout = () => {
         tootlTip = ''
        PatenTrackApi.cancelTimelineItem()
        resetTooltipContainer()
        setToolTipItem([]) 
        
        /* clearInterval(timeInterval) */
    }

    const resetTooltipContainer = () => {  
        const findOldToolTip = document.getElementsByClassName('custom_tooltip')
        if( findOldToolTip.length > 0 ) {
        findOldToolTip[0].parentNode.removeChild(findOldToolTip[0])      
        } 
    }


    useEffect(() => {
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
    }, [])

    /**
     * Intial timline items dataset and ref setup
     */
    useEffect(() => {
        items.current = new DataSet()
        timelineRef.current.setOptions(options) 
        timelineRef.current.on('select', onSelect)
        timelineRef.current.on('itemover', onItemover)
        timelineRef.current.on('itemout', onItemout)
        return () => {
            timelineRef.current.off('select', onSelect)
            timelineRef.current.off('itemover', onItemover) 
            timelineRef.current.off('itemout', onItemout)
        } 
    }, [ onSelect, onItemover]) 

    useEffect(() => {
        let {list} = props.card
        if(props.card.type == 4 || props.card.type == 7) {
            let removeRelease = []
            list.forEach( item => {
                if(parseInt(item.release_rf_id) > 0) {
                    removeRelease.push(item.release_rf_id);
                    const getOtherRelease = item.all_release_ids
                    if(getOtherRelease != '') {
                        const parseRelease = JSON.parse(getOtherRelease)
                        if(parseRelease.length > 0 ) {
                            parseRelease.forEach(row => removeRelease.push(Number(row.rf_id)))
                        }
                    }
                } 
            })
            if(removeRelease.length > 0) {
                removeRelease = [...new Set(removeRelease)];
                
                removeRelease.forEach( remove => {
                    const findIndex = list.findIndex( item => item.id == remove)
                    if(findIndex !== -1) {
                        list.splice(findIndex, 1)
                    }
                })  
            }
        }   
        setTimelineRawData(list)
    }, [props])

    //Item for the timeline

    const convertDataToItem = (assetsCustomer) => {
        
        const assetType = Number.isInteger(assetsCustomer.tab_id) ? convertTabIdToAssetType(assetsCustomer.tab_id) : 'default'
        const companyName =  selectedWithName.filter( company => assetsCustomer.company == company.id ? company.name : '')
        const customerFirstName = assetsCustomer.tab_id == 10 ? assetsCustomer.customerName.split(' ')[0] : assetsCustomer.customerName;
        
        const item = {        
            type: 'point',
            start: new Date(assetsCustomer.exec_dt),
            customerName: `${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`,
            assetType,
            companyName,
            rawData: assetsCustomer,
            className: `asset-type-${assetType} ${assetsCustomer.release_exec_dt != null ? assetsCustomer.partial_transaction == 1 ? 'asset-type-security-release-partial' : 'asset-type-security-release' : ''}`,
            collection: [ { id: assetsCustomer.id, totalAssets: assetsCustomer.totalAssets } ],
            showTooltips: false
        }

        if([5,12].includes(parseInt(assetsCustomer.tab_id))){            
            item.type = 'range';
            item['end'] = assetsCustomer.release_exec_dt != null ? new Date(assetsCustomer.release_exec_dt) : new Date();
            
            const securityPDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.reel_no}-${assetsCustomer.frame_no}.pdf`
            item['security_pdf'] = securityPDF
            /* let name = `<tt><img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></tt><dd>${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})</dd>`;
            name += `<em>`
            if(assetsCustomer.release_exec_dt != null ) {
                const getAllReleases = assetsCustomer.all_release_ids
                if(getAllReleases != '') {
                    const parseReleases = JSON.parse(getAllReleases)
                    parseReleases.forEach((r, index) => {
                        name += `<img title='${index}' src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/>`
                    })
                }
                const releasePDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.release_reel_no}-${assetsCustomer.release_frame_no}.pdf`
                item['release_pdf'] = releasePDF
            }
            name += `${assetsCustomer.partial_transaction == 1 ? `<span>(${numberWithCommas(assetsCustomer.releaseAssets)})</span>` : ''}</em>` */
            let name = `${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`
            item['customerName'] = name
        }
        return item
    }

    /**
     * Add timeline items to the the dataset and set the start, end, min and max date
     */
   useEffect(() => {
    if (isLoadingTimelineRawData) return null
    
    const clusteredItems = timelineRawData.reduce((result, dataItem) => {
        const itemName = dataItem.tab_id == 10 ? dataItem.customerName.split(' ')[0] : dataItem.customerName
        result[`${dataItem.id}_${itemName}_${dataItem.exec_dt}`] = convertDataToItem(dataItem)
        return result 
    }, {})
      
    const convertedItems = Object.values(clusteredItems).sort((a, b) => (new Date(a.start) > new Date(b.start)))  
    
    setTimelineItems(convertedItems)
    items.current = new DataSet()
    let start =  new moment(), end =  props.type === 4 ? new moment(new Date('2500-01-01')) : new moment().add(1, 'year')   
    if(timelineRef.current !== null) {
        timelineRef.current.destroy()
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
        timelineRef.current.on('select', onSelect)
        timelineRef.current.on('itemover', onItemover)
        timelineRef.current.on('itemout', onItemout)
    } 
    
    if (convertedItems.length > 0) {
        start = props.type === 5 ? new moment(convertedItems[0].start).subtract(1, 'week') : props.type === 4 ? new moment(new Date('1900-01-01')) : new moment(convertedItems[convertedItems.length - 1].start).subtract(1, 'week')
        items.current.add(convertedItems)   
    }
    
    timelineRef.current.setOptions({ ...options, start, end, min: new moment(new Date('1400-01-01')), max: new moment(new Date('2500-01-01'))})
    timelineRef.current.setItems(items.current)   
    }, [ timelineRawData ])
    return (
        <Paper className={clsx(classes.container, classes.columnDirection)} square>
            {
                props.card.title != '' && (
                    <div className={clsx(classes.timelineHeading, 'full_heading')}>
                        <Typography variant="h6" component="div" align="center" className={clsx(classes.border, classes.border1)}>
                            {props.card.title}
                        </Typography>
                        <div className={classes.fullscreenButton}> 
                            <AddToolTip
                                tooltip={typeof props.standalone !== 'undefined' ? 'Close big screen view.' : 'Big screen view.'}
                                placement='bottom'
                            >
                                <IconButton size="small"
                                    onClick={() => props.handleFullScreen(props.type)}
                                    className={clsx(classes.actionIcon, typeof props.standalone !== 'undefined' ? classes.fontStandalone : '' )}
                                >
                                    { typeof props.standalone !== 'undefined' ? <Close/> : <Fullscreen /> }                            
                                </IconButton>   
                            </AddToolTip>
                        </div>
                    </div>  
                )
            }
            <div className={clsx(classes.timelineContainer,{[classes.timelineContainerFullheight]: typeof props.standalone !== 'undefined' ? props.standalone : props.card.type === 7 ? true : false})}>
                <div
                    id={`timeline-${props.id}`}
                    style={{ 
                        filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`
                    }}  
                    ref={timelineContainerRef}
                    className={clsx(classes.timeline, 'timeline')}
                />
                {
                isLoadingTimelineData &&
                    <CircularProgress size={15} color={'secondary'} className={classes.timelineProcessingIndicator} />
                }
                { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }            
            </div>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{display:'flex',alignItems:'flex-start',justifyContent:'flex-start', width: 400, position: 'fixed', top: '50%',left: '50%',transform: 'translate(-50%, -50%)',overflow: 'hidden auto'}}
            >
                <TableContainer component={Paper} style={{height: '100%', border: '1px solid #0B0C0E'}}>
                    <IconButton
                        onClick={handleClose}
                        className={clsx(classes.right)}
                        size="large">
                        <Close />
                    </IconButton>
                    <Table>
                        <TableBody>
                        {
                            itemData.map(item => (
                                <TableRow>
                                    <TableCell>
                                        {item.exec_dt}
                                    </TableCell>     
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => handleOpenPDF(item)} 
                                        >
                                            <img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        {item?.total_assets ? item.total_assets : ''}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal>
            {  
                fullScreen === true && (
                    <FullScreen 
                        componentItems={fullScreenItems} 
                        showScreen={true}
                        setScreen={setFullScreen}                                    
                    />
                )
            }
        </Paper>
    )
}

export default TimelineChart;