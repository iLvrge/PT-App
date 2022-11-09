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
  if(status.toLowerCase().indexOf('abandoned') !== -1) {
    status = 'Abandoned'
    icon = icons[1]
  } else if(status.toLowerCase().indexOf('expire') !== -1) {
    status = 'Expired'
    icon = icons[0]
  }
  const templateContent = `<div class='first limit'>${status}</div><div class='textColumn'>${moment(new Date(item.eventdate)).format(DATE_FORMAT)}</div><div class='absolute icon'>${icon}</div>`
  return templateContent
} 

const convertDataToItem = (event, icons) => {
  const assetType =  'box'
  const date = new Date( event.eventdate )
  const item = {
    id: event.id,
    content: getTemplateContent(event, icons),
    start: date,
    type: assetType,
    rawData: event, 
    className:  'asset-type-default',
    description: event.status,
    collection: [], 
    showTooltip: false
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
              setTimelineRawData(data.main)
              updateRawData(data.main)
            }
        }
        getStatusbData()
    }
}, [selectedAssetsPatents, rawData])


  useEffect(() => {
    if (isLoadingTimelineRawData) return 
   
    const convertedItems = timelineRawData.map((event) => convertDataToItem(event, allIcons))

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
                className={classes.timeline}
            />
            { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
            { isLoadingTimelineData && <Loader /> }
        </Paper>
    )
} 

export default Status