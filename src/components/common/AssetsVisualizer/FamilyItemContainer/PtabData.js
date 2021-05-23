import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'

import Paper from '@material-ui/core/Paper'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline/esnext'
import CircularProgress from '@material-ui/core/CircularProgress'

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
    tooltip:{
      template: function(originalItemData) {
        let text = originalItemData.description.split(',');
        const firstText = text[0];
        text.splice(0,1);
        text = firstText+'<br/>'+text.join(',');
        return `<span>${text}</span>`
      }
    } 
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
  } 

  if(type === 1) {
    item.end = new Date(eventItem.end)
    item.title = 'Payment Due / Grace Period'
  }

  return (item)
}

const PtabData = ({ data }) => {
  const classes = useStyles()
  const timelineRef = useRef()
  const timelineContainerRef = useRef()
  const items = useRef(new DataSet())
  const [display, setDisplay] = useState('block')
  
  const [ legalEvents, setLegalEvents ] = useState([])
  const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
  
  useEffect(() => {
      timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
  }, [])

  useEffect(() => {
    if(data.length == 0 || data.main.length == 0) {
      setIsLoadingTimelineRawData(false)
      return setLegalEvents([])
    }
    const getLegalEventListFunction = async () => {
      setLegalEvents(data)
      setIsLoadingTimelineRawData(false)
    }
    getLegalEventListFunction()
  }, [ data ])

  useEffect(() => {
    if (isLoadingTimelineRawData) return 
   
    const mainItems = Object.keys(data).length > 0 &&  data.main != undefined ? data.main.map((event, index) => convertDataToItem(event, index, 0, classes, data.icons)) : []
    let otherItems = []
     
    if( Object.keys(data).length > 0 && data.other != undefined &&  data.other.length > 0 ) {
      otherItems = data.other.map((event, index ) => convertDataToItem(event, mainItems.length + index, 1, classes, data.icons))
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
      setDisplay('block')
    }
    timelineRef.current.setItems(items.current)
    
    timelineRef.current.setOptions({ ...options, start, end, min, max  }) 
    
}, [ legalEvents, isLoadingTimelineRawData, data ])

  return (
    <Paper className={`${classes.rootContainer} timelineRoot`} square >
        <>
            <div
                id={`ptabdata`}
                style={{ 
                    display: display,
                    filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                }}
                ref={timelineContainerRef}
                className={classes.timeline}
            />
            { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
        </>
    </Paper>
  )
}

export default PtabData
