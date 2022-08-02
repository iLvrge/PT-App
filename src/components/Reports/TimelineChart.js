import React, {useCallback, useEffect, useRef, useState} from 'react'
import { 
    useDispatch,
    useSelector 
} from 'react-redux'
import moment from 'moment'
import _debounce from 'lodash/debounce'
import { DataSet } from 'vis-data-71/esnext'
import { Timeline } from 'vis-timeline/esnext'
import { Typography, Tooltip, Zoom, CircularProgress, IconButton, Paper } from '@mui/material';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import useStyles from './styles'
import clsx from 'clsx'
import { numberWithCommas, capitalize } from '../../utils/numbers'
import { assetsTypesWithKey, convertTabIdToAssetType, oldConvertTabIdToAssetType } from '../../utils/assetTypes'
import PatenTrackApi from '../../api/patenTrack2'
import themeMode from '../../themes/themeMode'
import AddToolTip from './AddToolTip'
import { Close, Fullscreen } from '@mui/icons-material' 
import { setConnectionBoxView, setPDFFile, setPDFView } from '../../actions/patenTrackActions'
import { retrievePDFFromServer } from '../../actions/patentTrackActions2'


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
        return data.items.length > 0 ? `<span class="cluster-header"><span class="cluster-image cluster-${data.items[0].assetType}"></span><span>${data.items.length} ${data.items[0].companyName.length > 0 ? capitalize(data.items[0].assetType)  : ''} transactions</span></span>` : ``
      } else { 
        return `<span style="width:100%;display:block;" class="${data.assetType} ${data.rawData.tab_id}">${data.customerName}</span>`
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
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ tooltipItem, setToolTipItem] = useState([])
    const [ timeInterval, setTimeInterval] = useState(null)
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const screenWidth = useSelector( state => state.patenTrack.screenWidth)
    const screenHeight = useSelector( state => state.patenTrack.screenHeight)
    

    const onSelect = useCallback((properties) => {
        const {items, event} = properties
        const {nodeName} = event.target.parentNode
        const item = timelineRef.current.itemsData.get(items)
        if(item.length > 0) {
            const {security_pdf, release_pdf, rawData} = item[0];

            const pdfFile = nodeName == "TT" ? security_pdf : nodeName == "EM" ? release_pdf : ''
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
            }
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
                let tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${calcTop}px;left:${calcLeft}px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'>
                <div style='display:flex;'><div style='display:flex;flex-direction: column;'>                            
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
                if(typeof data.releaseAssignor != 'undefined') {
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
            const removeRelease = list.filter( item => parseInt(item.release_rf_id) > 0 ? item.release_rf_id : '' )
            if(removeRelease.length > 0) {
                removeRelease.forEach( remove => {
                    const findIndex = list.findIndex( item => item.id == remove.release_rf_id)
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
            let name = `<tt><img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></tt>${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`;
            if(assetsCustomer.release_exec_dt != null ) {
                const releasePDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.release_reel_no}-${assetsCustomer.release_frame_no}.pdf`
                item['release_pdf'] = releasePDF
                name += `<em><span>(${numberWithCommas(assetsCustomer.releaseAssets)})</span><img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></em>`
            }
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
    let start =  new moment(), end = new moment().add(1, 'year')   
    if(timelineRef.current !== null) {
        timelineRef.current.destroy()
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
        timelineRef.current.on('select', onSelect)
        timelineRef.current.on('itemover', onItemover)
        timelineRef.current.on('itemout', onItemout)
    } 
    
    if (convertedItems.length > 0) {
        start = props.type === 5 ? new moment(convertedItems[0].start).subtract(1, 'week') : new moment(convertedItems[convertedItems.length - 1].start).subtract(1, 'week')
        items.current.add(convertedItems)   
    }
    timelineRef.current.setOptions({ ...options, start, end, min: new moment(new Date('1998-01-01')), max: new moment().add(2, 'week')})
    timelineRef.current.setItems(items.current)   
    }, [ timelineRawData ])
    return (
        <Paper className={clsx(classes.container, classes.columnDirection)} square>
            {
                props.card.title != '' && (
                    <div className={classes.timelineHeading}>
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
        </Paper>
    )
}

export default TimelineChart;