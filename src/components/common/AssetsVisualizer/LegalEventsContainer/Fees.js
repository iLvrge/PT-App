import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import Paper from '@mui/material/Paper'
import themeMode from '../../../../themes/themeMode'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@mui/material/CircularProgress'
import Loader from '../../Loader'

import useStyles from './styles'
import { Badge, Tab, Tabs } from '@mui/material'
import { numberWithCommas, applicationFormat, removeLeadingZeros } from '../../../../utils/numbers'
import PatenTrackApi from '../../../../api/patenTrack2'
import { setFamilyActiveTab, toggleFamilyItemMode, toggleFamilyMode, toggleLifeSpanMode } from '../../../../actions/uiActions'
import { getAssetDetails, setAssetsIllustration, setChannelID, setCommentsEntity, setSelectedAssetsPatents, setSlackMessages } from '../../../../actions/patentTrackActions2'
import { assetFamily, assetFamilySingle, assetLegalEvents } from '../../../../actions/patenTrackActions'

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
 
const getTemplateContent = (item, icons, showAbandoned) => {   
  let formatString = ''; 
  if(typeof showAbandoned != 'undefined' && showAbandoned == 'abandoned') {
    if(item.grant_doc_num != '' ) {
      formatString = `US<br/>${numberWithCommas(removeLeadingZeros(item.grant_doc_num))}`
    } else {
      formatString =  `US<br/>${applicationFormat(item.appno_doc_num)}`
    }
  } else { 
    if(item.event_code == '13') {
      if(item.template_string == '0') {
        if(item.patent != '' ) {
          formatString = `US<br/>${numberWithCommas(item.patent)}`
        } else {
          formatString =  `US<br/>${applicationFormat(item.application)}`
        }
      } else {
        formatString = `US<br/>${item.template_string}`
      }
    } else {
      if(typeof item.template_string != 'undefined') {
        if(item.template_string == '0') {
          formatString = `US<br/>${numberWithCommas(item.grant_doc_num)}`
        } else {
          formatString = item.template_string
        }
      } else {
        formatString = item.maintainence_code.template_string
      }
    }
  }

  /*typeof item.template_string != 'undefined' ? item.template_string == '0' ? `US<br/>${numberWithCommas(item.grant_doc_num)}` : item.event_code == '13' ? `US<br/>${item.template_string == '0' ? item.patent != '' ? numberWithCommas(item.patent) : applicationFormat(item.application) : item.template_string}` : item.template_string : item.maintainence_code.template_string*/
  const getEventIcons = icons[item.event_code] 
  const icon = getEventIcons["icon3"] != undefined ? getEventIcons["icon3"]: ''
  
  const templateContent = `<div class='first'>${formatString}</div><div class='textColumn'>${item.event_code == '13' ? `<div style="text-align:left;line-height:0.7">${typeof showAbandoned != 'undefined' && showAbandoned == 'abandoned' ? 'Expired on': 'Filed on'}:</div>` : typeof showAbandoned != 'undefined' && showAbandoned == 'abandoned' ? 'Expired on:<br/>' : ''}${moment(new Date(item.eventdate)).format(DATE_FORMAT)}</div><div class='absolute'>${icon}</div>`
  return templateContent
} 

const convertDataToItem = (eventItem, index, type, cls, icons, showAbandoned) => {
  const assetType = type === 1 ? 'background' : 'box'
  const date = new Date( type === 0 ? eventItem.eventdate : eventItem.start )
  const item = {
    id: index + 1,
    content: type === 1 ? `` : getTemplateContent(eventItem, icons, showAbandoned),
    start: date,
    type: assetType,
    rawData: eventItem,
    number: eventItem.event_code,
    className: type === 1 ? `${eventItem.type} negative` : 'asset-type-default',
    description: type == 0 ? typeof eventItem.template_string != 'undefined' ? eventItem.template_string : eventItem.maintainence_code.event_description : 'Payment Due / Grace Period',
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

const Fees = ({ events, showTabs, tabText, showAbandoned }) => {
  const dispatch = useDispatch()
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
  const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
  const legalEventDataRetrieved = useSelector(state => state.patenTrack.legalEventDataRetrieved)
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
  const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)

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

  const findChannelID = useCallback((asset) => {
    let channelID = ''
    if(slack_channel_list.length > 0 && asset != undefined) {
      const findIndex = slack_channel_list.findIndex( channel => channel.name == `us${asset}`.toString().toLocaleLowerCase())
  
      if( findIndex !== -1) {
        channelID = slack_channel_list[findIndex].id
      }
    }
    return channelID
  }, [ slack_channel_list ]) 

  const onSelect =  ( properties ) => { 
    const {items, event} = properties 
    const item = timelineRef.current.itemsData.get(items)
    if(item.length > 0 ) { 
      let {grant_doc_num, appno_doc_num, application, patent } = item[0].rawData

      if(typeof grant_doc_num != 'undefined' && typeof appno_doc_num != 'undefined') {
        application = appno_doc_num
        patent = grant_doc_num
      } 
      patent = removeLeadingZeros( patent ) 
      dispatch(setFamilyActiveTab(1))
      dispatch(toggleLifeSpanMode(false));
      dispatch(toggleFamilyItemMode(true));
      dispatch(toggleFamilyMode(true));
      PatenTrackApi.cancelFamilyCounterRequest()
      PatenTrackApi.cancelClaimsCounterRequest()
      PatenTrackApi.cancelFiguresCounterRequest()
      PatenTrackApi.cancelPtabCounterRequest()
      PatenTrackApi.cancelCitationCounterRequest()
      PatenTrackApi.cancelFeesCounterRequest() 
      PatenTrackApi.cancelStatusCounterRequest() 
      dispatch(
          setAssetsIllustration({
              type: "patent",
              id: patent || application,
              flag: patent !== '' && patent !== null ? 1 : 0
          }),
      );
      dispatch(
        setCommentsEntity({
            type: "asset",
            id: patent || application,
        }),
        );
      dispatch(setSelectedAssetsPatents([patent, application]))
      dispatch(getAssetDetails(application, patent))
      dispatch(assetFamilySingle(application, patent !== '' && patent!== null ? 1 : 0))
      dispatch(assetLegalEvents(application, patent))
      dispatch(assetFamily(application, patent!== '' && patent!== null ? 1 : 0))
      dispatch(setSlackMessages({ messages: [], users: [] }))
      const channelID = findChannelID(patent != '' ? patent: application)        
      if( channelID != '') {
        dispatch(setChannelID({channel_id: channelID}))
      }
    } 
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
        const checkFullScreen = document.getElementsByClassName('fullscreenModal'); 
        const element = checkFullScreen.length > 0 ? checkFullScreen[0].querySelector('#timelineCharts') : document.getElementById('timelineCharts');  
        const getPosition = element.getBoundingClientRect();  
        let tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid #fff;background:${isDarkTheme ? themeMode.dark.palette.background.default : themeMode.light.palette.background.default} ;top:${ getPosition.y }px;left:${ getPosition.x }px;'>`
        if(typeof tabText != 'undefined' && tabText == 'To Record') {
          PatenTrackApi
          .allFilledAssetsEventsDetails(item.application)
          .then( response => {
            const { data } = response 
            if(data != null) {
              const agents = [], applicants = [], assignees = [], inventors = []
              if(typeof data.agent != 'undefined') {
                data.agent.map(item => {
                  agents.push(item.name)
                })
              } 
              if(typeof data.applicant != 'undefined') {
                data.applicant.map(item => {
                  applicants.push(item.original_name)
                })
              }
              if(typeof data.assignee != 'undefined') {
                data.assignee.map(item => {
                  assignees.push(item.original_name)
                })
              }
              if(typeof data.inventor != 'undefined') {
                data.inventor.map(item => {
                  inventors.push(item.name)
                })
              }
              tootltipTemplate += `<div>Filed: ${moment(new Date(item.eventdate)).format(DATE_FORMAT)}</div>`
              tootltipTemplate += `<div>Agent: ${agents.join(', ')}</div>`
              tootltipTemplate += `<div>Applicant: ${applicants.join(', ')}</div>`
              tootltipTemplate += `<div>Assignee: ${assignees.join(', ')}</div>`
              tootltipTemplate += `<div>Inventors: ${inventors.join(', ')}</div>` 
              tootltipTemplate += `</div>`
              resetTooltipContainer() 
              if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
                document.body.insertAdjacentHTML('beforeend',tootltipTemplate)                
              } 
            }
          })
        } else {
          let text = item.maintainence_code.event_description.split(',');
          const firstText = text[0];
          text.splice(0,1);
          text = firstText+'<br/>'+text.join(',');
          
          tootltipTemplate += `<h4 style='color:${color};text-align:left;margin:0'>${text}</h4></div>`
          resetTooltipContainer() 
          if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
            document.body.insertAdjacentHTML('beforeend',tootltipTemplate)                
          }
        }

        
        
        
      } else {
          resetTooltipContainer()
      }                
    }, TIME_INTERVAL) 
  }


  const onRangeChanged = useCallback( async(properties) => {
    items.current = new DataSet()
    const mainItems = Object.keys(events).length > 0 &&  events.main != undefined ? events.main.map((event, index) => convertDataToItem(event, index, 0, classes, events.icons, showAbandoned)) : []
    let otherItems = []
     
    if( Object.keys(events).length > 0 && events.other != undefined &&  events.other.length > 0 ) {
      otherItems = events.other.map((event, index ) => convertDataToItem(event, mainItems.length + index, 1, classes, events.icons, showAbandoned))
    }

    const convertedItems = [...mainItems, ...otherItems]

    items.current.add(convertedItems)
    timelineRef.current.setItems(items.current)  
  }, [ events ])

  /**
  * Intial timline items dataset and ref setup
  */
  useEffect(() => {
    timelineRef.current.setOptions(options) 
    timelineRef.current.on('itemover', onItemover)
    timelineRef.current.on('itemout', onItemout)
    timelineRef.current.on('select', onSelect)
    timelineRef.current.on('rangechanged', onRangeChanged)
    return () => {
      timelineRef.current.off('itemover', onItemover) 
      timelineRef.current.off('itemout', onItemout)
      timelineRef.current.off('select', onSelect)
      timelineRef.current.off('rangechanged', onRangeChanged)
      resetTooltipContainer()
    } 
  }, [ onItemover, onItemout, onSelect, onRangeChanged ]) 


  useEffect(() => {
    if (isLoadingTimelineRawData) return 
   
    const mainItems = Object.keys(events).length > 0 &&  events.main != undefined ? events.main.map((event, index) => convertDataToItem(event, index, 0, classes, events.icons, showAbandoned)) : []
    let otherItems = []
     
    if( Object.keys(events).length > 0 && events.other != undefined &&  events.other.length > 0 ) {
      otherItems = events.other.map((event, index ) => convertDataToItem(event, mainItems.length + index, 1, classes, events.icons, showAbandoned))
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
      let startIndex = convertedItems.length - 1;
      if(typeof tabText != 'undefined' && tabText == 'To Record') {
        if(convertedItems.length > 16) {
          min = new Date(convertedItems[15].start)
          startIndex = 15
        }
      }
      start = new moment(min).subtract(3, 'year') 
      end = new moment(max).add(3, 'year') 
      min = start
      max = end
      
      //items.current.add(convertedItems)
      items.current.add(convertedItems.slice(0, startIndex))    
      setDisplay('block')      
    } else {
      /* setDisplay('none') */
    }
    timelineRef.current.setItems(items.current)
    
    timelineRef.current.setOptions({ ...options, start, end, min, max  }) 
    
}, [ legalEvents, isLoadingTimelineRawData, events ])

const ItemLabel = ({label}) =>  {
  return ( 
      <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(Object.keys(events).length > 0 &&  events.main != undefined ? events.main.length : 0)} showZero={false}></Badge></span>
    )
  }

  return (
        <Paper className={`${classes.timelineRoot} timelineRoot`} square >
            {
              showTabs === true && (
                <Tabs className={classes.tabs} variant={'scrollable'} value={0}>
                {
                  [tabText].map( (item, index) => (
                    <Tab
                      key={index}
                      className={classes.tab} 
                      label={<ItemLabel label={item}/>}
                    /> 
                  ))
                }                            
                </Tabs>
              )

            }
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