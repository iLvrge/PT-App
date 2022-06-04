import React, {useEffect, useRef, useState} from 'react'
import { 
    useDispatch,
    useSelector 
} from 'react-redux'
import moment from 'moment'
import _debounce from 'lodash/debounce'
import { DataSet } from 'vis-data-71/esnext'
import { Timeline } from 'vis-timeline/esnext'
import { Typography, Tooltip, Zoom, CircularProgress } from '@mui/material';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import useStyles from './styles'
import clsx from 'clsx'
import { numberWithCommas, capitalize } from '../../utils/numbers'
import { convertTabIdToAssetType } from '../../utils/assetTypes'


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
        return `<span class="${data.assetType} ${data.rawData.tab_id}">${data.customerName}</span>`
      }
    },
}

const TimelineChart = (props) => {
    const classes = useStyles()
    const timelineRef = useRef() //timeline Object ref
    const timelineContainerRef = useRef() //div container ref
    const items = useRef(new DataSet()) // timeline items dataset
    const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(false)
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])

    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)

    useEffect(() => {
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
    }, [])

    /**
   * Intial timline items dataset and ref setup
   */
    useEffect(() => {
        items.current = new DataSet()
        timelineRef.current.setOptions(options) 
        return () => {
        } 
    }, [ ]) 

    useEffect(() => {
        let {list} = props.card

        if(props.card.type == 4) {
            const removeRelease = list.filter( item => parseInt(item.release_rf_id) > 0 ? item.release_rf_id : '' )

            if(removeRelease.length > 0) {
                removeRelease.forEach( ID => {
                    const findIndex = list.findIndex( item => item.rf_id == ID ? true : false)

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
            /* group: assetsCustomer.group, */
            className: `asset-type-${assetType}`,
            collection: [ { id: assetsCustomer.id, totalAssets: assetsCustomer.totalAssets } ],
            showTooltips: false
        }

        if([5,12].includes(parseInt(assetsCustomer.tab_id))){
            item.type = 'range';
            item['end'] = new Date(assetsCustomer.release_exec_dt);
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
    } 
    
    if (convertedItems.length > 0) {
        start = new moment(convertedItems[0].start).subtract(1, 'week')
        items.current.add(convertedItems)      
    }
    timelineRef.current.setOptions({ ...options, start, end, min: new moment(new Date('1998-01-01')), max: new moment().add(3, 'year')})
    timelineRef.current.setItems(items.current)   
    }, [ timelineRawData ])

    return (
        <div className={classes.timelineContainer}>
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
            <Tooltip 
                title="Tooltip" 
                placement="right"
                enterDelay={0}
                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                className={clsx(classes.tooltip/* , {[classes.mobileTooltip]: typeof isMobile !== 'undefined' && isMobile === true} */)}  
            >
                <div>
                    <Typography variant="h6" component="div" align="center" className={classes.border}>
                        {props.card.title}
                    </Typography>
                </div>
            </Tooltip>
        </div>
    )
}

export default TimelineChart;