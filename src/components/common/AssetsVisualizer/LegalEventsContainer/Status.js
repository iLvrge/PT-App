import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import Paper from '@mui/material/Paper'
import themeMode from '../../../../themes/themeMode'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import PatenTrackApi from '../../../../api/patenTrack2'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@mui/material/CircularProgress'
import Loader from '../../Loader'

import useStyles from './styles'
import { SettingsInputComponentSharp } from '@mui/icons-material'

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
  let status = item.status, icon = '';
  if(status.toLowerCase().indexOf('abandoned') !== -1 || status.toLowerCase().indexOf('expired') !== -1 || status.toLowerCase().indexOf('allowance') !== -1) {
    switch(status) {
      case 'Notice of Allowance Mailed -- Application Received in Office of Publications': 
        status = status.split('Application Received in ');
        status.splice(1, 0, 'Application Received in ');
        status = status.join('<br/>')
      break;
      case 'Patent Expired Due to NonPayment of Maintenance Fees Under 37 CFR 1.362': 
        status = status.split('Due to NonPayment of Maintenance Fees ');
        status.splice(1, 0, 'Due to NonPayment of Maintenance Fees ');
        status = status.join('<br/>')
      break;
      case  'Expressly Abandoned  --  During Publication Process': 
      case 'Expressly Abandoned  --  During Examination': 
        status = status.split('Expressly Abandoned  --  ');
        status.splice(0, 0, 'Expressly Abandoned  --  ');
        status = status.join('<br/>')
      break;
      case 'Abandoned  --  After Examiner\'s Answer or Board of Appeals Decision': 
        status = status.split('After Examiner\'s Answer or ');
        status.splice(1, 0, 'After Examiner\'s Answer or ');
        status = status.join('<br/>')
      break;
      case 'Abandoned  --  Failure to Pay Issue Fee':  
        status = status.split('Failure to Pay Issue Fee ');
        status.splice(1, 0, 'Failure to Pay Issue Fee ');
        status = status.join('<br/>')
      break;
      case 'Abandoned  --  File-Wrapper-Continuation Parent Application': 
        status = status.split('File-Wrapper-Continuation ');
        status.splice(1, 0, 'File-Wrapper-Continuation ');
        status = status.join('<br/>')
      break;
      case 'Abandoned  --  Failure to Respond to an Office Action': 
        status = status.split('Failure to Respond to an ');
        status.splice(1, 0, 'Failure to Respond to an ');
        status = status.join('<br/>')
      break;
      case 'Abandoned  --  Incomplete (Filing Date Under Rule 53 (b) - PreExam)': 
        status = status.split('Incomplete (Filing Date Under Rule 53 (b) - PreExam) ');
        status.splice(1, 0, 'Incomplete (Filing Date Under Rule 53 (b) - PreExam) ');
        status = status.join('<br/>')
      break;
      case 'Abandoned  --  Incomplete Application (Pre-examination)': 
        status = status.split('Incomplete Application ');
        status.splice(1, 0, 'Incomplete Application ');
        status = status.join('<br/>')
      break;
      case 'Abandonment for Failure to Correct Drawings/Oath/NonPub Request': 
        status = status.split('for Failure to ');
        status.splice(1, 0, 'for Failure to ');
        status = status.join('<br/>')
      break;
    }
  } /* else if(status.toLowerCase().indexOf('expire') !== -1) {
    status = 'Expired'
    icon = icons[0]
  } */
  const templateContent = `<div class='first limit'>${status} ${typeof item.anotherStatus != 'undefined' ? '<br/>' + item.anotherStatus : ''}</div><div class='textColumn'>${moment(new Date(item.eventdate)).format(DATE_FORMAT)}</div><div class='absolute icon'>${icon}</div>`
  return templateContent 
} 

const convertDataToItem = (event, icons) => { 
  const item = {
    id: event.id,
    content: event.type == 'background' ? event.status : getTemplateContent(event, icons),
    start: new Date(event.start_date),
    rawData: event,  
    description: event.status,
    collection: [], 
    showTooltip: false
  }  

  if(typeof event.end_date != 'undefined') { 
    item.end =  new Date(event.end_date);  
  } 

  if(typeof event.className != 'undefined') { 
    item.className =  event.className
  } else if(event.status.toLowerCase().indexOf('abandoned') !== -1 || event.status.toLowerCase().indexOf('expire') !== -1) {  
    item.className =  'redBorder'  
  } else {
    item.className =  'yellowBorder' 
  }

  if(event.type == 'background') {
    item.type = event.type
  }
  
  return item
}

var tootlTip = ''
const TIME_INTERVAL = 1000

const Status = ({ number, rawData, updateRawData, standalone }) => {
  const classes = useStyles()
  const timelineRef = useRef()
  const timelineContainerRef = useRef()
  const items = useRef(new DataSet())
  const [display, setDisplay] = useState('block')
  const [ timelineRawData, setTimelineRawData ] = useState([]) 
  const [ allIcons, setAllIcons ] = useState([]) 
  const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
  const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
  const [ tooltipItem, setToolTipItem] = useState([])
  const [ timeInterval, setTimeInterval] = useState(null)
  const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
  
  const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  ) 

  useEffect(() => {
      timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
  }, [])

  

  /**
  * on Itemover for the tooltip data
  */

  const onItemover = ({item, event}) => {
    const overItem = items.current.get(item)     
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
        const color = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary
        const height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight;  
        
        let text = item.status; 
        const element = document.getElementById('statusTimeline');
        const getPosition = element.getBoundingClientRect(); 
        let tootltipTemplate = `<div class='custom_tooltip' style='background:${isDarkTheme ? themeMode.dark.palette.background.default : themeMode.light.palette.background.default} ;top:${getPosition.y}px;left:${getPosition.x}px;'><h4 style='color:${color};text-align:left;margin:0'>${text}</h4></div>`
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


  const processRawData = useCallback(() => {
    if(rawData.length > 0) {
      setIsLoadingTimelineRawData(false) 
      setTimelineRawData(rawData.main)
      setAllIcons(rawData.icons)
    } else {
      setIsLoadingTimelineRawData(false) 
      setTimelineRawData([])
    }

}, [rawData])

useEffect(() => {
    if(typeof rawData !== 'undefined') {
        if(typeof standalone !== 'undefined' &&  standalone === true) {
            processRawData()
        } else {
            setIsLoadingTimelineRawData(false) 
            if(rawData.main.length > 0) {
                setTimelineRawData(rawData.main)
                setAllIcons(rawData.icons)
            }
        }
    } else {
        
        const getStatusbData = async() => {
            setIsLoadingTimelineRawData(true)
            PatenTrackApi.cancelStatusData()    
            const { data } = await PatenTrackApi.getStatusData(selectedAssetsPatents[1])
            setIsLoadingTimelineRawData(false) 
            if(data !== null && data.main.length > 0 )  {
              setAllIcons(data.icons)

              const allEvents = data.main;
              let grantStatus = true, publishedDate = null, expiredStatus = false, expiredDate = null, patentEndDate = null, patentIndex = -1
              const promises = allEvents.map( (event, index) => {
                if(event.id == 'A') { 
                  publishedDate = event.end_date 
                } else if(event.id == 'B') {
                  grantStatus = true
                  patentEndDate = event.end_date
                  patentIndex = index
                } else if(event.status.toLowerCase().indexOf('expired') !== -1) {
                  expiredStatus = true
                  expiredDate = event.start_date
                }
              })
              await Promise.all(promises)
              if(patentIndex >= 0 && expiredStatus === true && expiredDate != null) {
                allEvents[patentIndex].end_date = expiredDate
                allEvents.push({
                  id: 'C',
                  start_date: expiredDate,
                  end_date: patentEndDate == null ? publishedDate : patentEndDate,
                  eventdate: expiredDate,
                  type: 'background',
                  className: 'grey',
                  status: ''
                })
              }

              setTimelineRawData(allEvents)
              updateRawData(allEvents)
            }
        }
        getStatusbData()
    }
}, [selectedAssetsPatents, rawData])


  useEffect(() => {
    if (isLoadingTimelineRawData) return 
   
    const convertedItems = timelineRawData.map((event) => convertDataToItem(event, allIcons))

    console.log('convertedItems', convertedItems)
    items.current = new DataSet()
    let start = new moment().subtract(2, 'year')
    let end = new moment().add(2, 'year')
    let min = start.format('YYYY-MM-DD'), max = end.format('YYYY-MM-DD') 
    if (convertedItems.length > 0) {      
      convertedItems.map( (item, index) => {
        if(index == 0) {
          min = new moment(item.start).format('YYYY-MM-DD')
          const date = typeof item.rawData.eventdate != 'undefined' && item.rawData.eventdate != '' ? item.rawData.eventdate : item.rawData.end_date
          if(new moment(date).isAfter(max)) {
            max = new moment(date).format('YYYY-MM-DD')
          }
        } else {
          if( new moment(item.start).isBefore(min) ) {
            min = new moment(item.start).format('YYYY-MM-DD')
          } else {
            const date = typeof item.rawData.end_date != 'undefined' && item.rawData.end_date != '' ? item.rawData.end_date : item.rawData.eventdate
            if(new moment(date).isAfter(max)) {
              max = new moment(date).format('YYYY-MM-DD')
            }
          } 
        }        
      })
      start = new moment(min).subtract(7, 'year').format('YYYY-MM-DD')
      end = new moment(max).add(4, 'year').format('YYYY-MM-DD')
      min = start
      max = end
      items.current.add(convertedItems)
      setDisplay('block')      
    } 
    timelineRef.current.setItems(items.current)  
    timelineRef.current.setOptions({ ...options, start, end, min, max  }) 
    
}, [ timelineRawData, allIcons, isLoadingTimelineRawData, timelineContainerRef ])

  return (
        <Paper className={`${classes.timelineRoot} timelineRoot`} square >
            <div
                id={`statusTimeline`}
                style={{ 
                    display: display,
                    filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                }}
                ref={timelineContainerRef}
                className={classes.timelineStatus}
            />
            { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
            { isLoadingTimelineData && <Loader /> }
        </Paper>
    )
} 

export default Status