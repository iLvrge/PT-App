import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import Paper from '@material-ui/core/Paper'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@material-ui/core/CircularProgress'
import Loader from '../../Loader'

import useStyles from './styles'

const options = { 
    height: '100%',
    stack: true,
    zoomKey: 'ctrlKey',
    moveable: true,
    zoomable: true,
    horizontalScroll: true,
    verticalScroll: true,
    zoomFriction: 30,
    zoomMin: 1000 * 60 * 60 * 24 * 7,  
    
}
const DATE_FORMAT = 'MMM DD, YYYY'
 
const getTemplateContent = (item, icons) => {  
  const getEventIcons = icons[item.event_code]
  const icon = getEventIcons["icon3"] != undefined != undefined ? getEventIcons["icon3"]: ''
  const templateContent = `<div class='first'>${item.maintainence_code.template_string}</div><div class='textColumn'>${moment(new Date(item.eventdate)).format(DATE_FORMAT)}</div><div class='absolute'>${icon}</div>`
  return templateContent
} 

const convertDataToItem = (eventItem, index, type, cls, icons) => {
  const assetType = type === 1 ? 'background' : 'box'
  const date = new Date( type === 0 ? eventItem.eventdate : eventItem.start )
  const item = {
    id: index + 1,
    content: type === 1 ? `` : getTemplateContent(eventItem, icons),
    start: date,
    type: assetType,
    rawData: eventItem,
    number: eventItem.event_code,
    className: type === 1 ? 'negative' : 'asset-type-default',
    description: type == 0 ? eventItem.maintainence_code.event_description : 'Payment Due / Grace Period',
    collection: [], 
    showTooltip: false
  } 

  if(type === 1) {
    item.end = new Date(eventItem.end)
    item.title = 'Payment Due / Grace Period'
  }

  return (item)
}

var tootlTip = ''
const TIME_INTERVAL = 1000

const Fees = ({ events }) => {
  const classes = useStyles()
  const timelineRef = useRef()
  const timelineContainerRef = useRef()
  const items = useRef(new DataSet())
  const [display, setDisplay] = useState('block')
  
  const [ legalEvents, setLegalEvents ] = useState([])
  const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
  const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
  const [ tooltipItem, setToolTipItem] = useState([])
  const [ timeInterval, setTimeInterval] = useState(null)
  
  const legalEventDataRetrieved = useSelector(state => state.patenTrack.legalEventDataRetrieved)

  useEffect(() => {
      timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
  }, [])

  useEffect(() => {
    setIsLoadingTimelineData(legalEventDataRetrieved)
  }, [legalEventDataRetrieved])

  useEffect(() => {
    if(events.length == 0 || events.main.length == 0) {
      setIsLoadingTimelineRawData(false)
      return setLegalEvents([])
    }
    const getLegalEventListFunction = async () => {
      setLegalEvents(events)
      setIsLoadingTimelineRawData(false)
    }
    getLegalEventListFunction()
  }, [ events ])

  /**
  * on Itemover for the tooltip data
  */

  const onItemover = ({item, event}) => {
    const overItem = items.current.get(item)    
    console.log('onItemover=>overItem', overItem, event, item)
    if(overItem != null) {
        onItemout()
        tootlTip = overItem.rawData.id
        showTooltip(overItem.rawData, event)
    }
  }

  /**
  * on onItemout for the remove tooltip
  */

  const onItemout = () => {
      tootlTip = ''
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


  // Custom ToolTip

  const showTooltip = (item, event) => {     
    setTimeout(() => {
      if(tootlTip === item.id) {      
        const color = '#fff'   
        const height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight;  
        
        let text = item.maintainence_code.event_description.split(',');
        const firstText = text[0];
        text.splice(0,1);
        text = firstText+'<br/>'+text.join(',');

        let tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${event.clientY }px;left:${event.clientX + 20 }px;'><h4 style='color:${color};text-align:left;margin:0'>${text}</h4></div>`
        resetTooltipContainer() 
        if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
            document.body.insertAdjacentHTML('beforeend',tootltipTemplate)                
        }
      } else {
          resetTooltipContainer()
      }                
    }, TIME_INTERVAL) 
  }


  /**
  * Intial timline items dataset and ref setup
  */
  useEffect(() => {
    timelineRef.current.setOptions(options) 
    timelineRef.current.on('itemover', onItemover)
    timelineRef.current.on('itemout', onItemout)
    return () => {
      timelineRef.current.off('itemover', onItemover) 
      timelineRef.current.off('itemout', onItemout)
      resetTooltipContainer()
    } 
  }, [ onItemover, onItemout ]) 


  useEffect(() => {
    if (isLoadingTimelineRawData) return 
   
    const mainItems = Object.keys(events).length > 0 &&  events.main != undefined ? events.main.map((event, index) => convertDataToItem(event, index, 0, classes, events.icons)) : []
    let otherItems = []
     
    if( Object.keys(events).length > 0 && events.other != undefined &&  events.other.length > 0 ) {
      otherItems = events.other.map((event, index ) => convertDataToItem(event, mainItems.length + index, 1, classes, events.icons))
    }

    const convertedItems = [...mainItems, ...otherItems]

    

    items.current = new DataSet()
    let start = new moment().subtract(5, 'year')
    let end = new moment().add(3, 'year')
    let min = start.format('YYYY-MM-DD'), max = end.format('YYYY-MM-DD')
    if (convertedItems.length > 0) {      
      convertedItems.map( (item, index) => {
        if(index == 0) {
          min = new moment(item.start).format('YYYY-MM-DD')
          max = min
        } else {
          if( new moment(item.start).isBefore(min) ) {
            min = new moment(item.start).format('YYYY-MM-DD')
          } else if(new moment(item.start).isAfter(max)) {
            max = new moment(item.start).format('YYYY-MM-DD')
          }
        }        
      })
      start = new moment(min).subtract(5, 'year').format('YYYY-MM-DD')
      end = new moment(max).add(5, 'year').format('YYYY-MM-DD')
      min = start
      max = end
      items.current.add(convertedItems)
      setDisplay('block')      
    } else {
      setDisplay('none')
    }
    timelineRef.current.setItems(items.current)
    
    timelineRef.current.setOptions({ ...options, start, end, min, max  }) 
    
}, [ legalEvents, isLoadingTimelineRawData, events ])

  return (
        <Paper className={`${classes.timelineRoot} timelineRoot`} square >
            <div
                id={`timelineCharts`}
                style={{ 
                    display: display,
                    filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                }}
                ref={timelineContainerRef}
                className={classes.timeline}
            />
            { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
            { isLoadingTimelineData && <Loader /> }
        </Paper>
    )
} 

export default Fees