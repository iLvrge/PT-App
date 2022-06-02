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

  /**
   * Add timeline items to the the dataset and set the start, end, min and max date
   */
   useEffect(() => {
    if (isLoadingTimelineRawData) return null
    
    
    items.current = new DataSet()
    let start =  new moment(), end = new moment().add(1, 'year')   
    if(timelineRef.current !== null) {
        timelineRef.current.destroy()
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
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