import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@mui/material/CircularProgress'
import moment from 'moment'
import PatenTrackApi from '../../../../api/patenTrack2'
import themeMode from '../../../../themes/themeMode'
import { numberWithCommas, toTitleCase } from '../../../../utils/numbers'

import useStyles from './styles'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

const DATE_FORMAT = 'MMM DD, YYYY'
const CDN_PATH_LOGO = process.env.REACT_APP_COMPANY_PATH
const NO_IMAGE_AVAILABLE = 'no_image_available.jpg'


var tootlTip = ''
const TIME_INTERVAL = 1000
const options = {  
    height: '100%',
    autoResize: true,
    orientation: 'bottom',
    zoomKey: 'ctrlKey',
    moveable: true,
    zoomable: true,
    horizontalScroll: true,
    verticalScroll: true,
    zoomFriction: 30,
    zoomMin: 1000 * 60 * 60 * 24 * 7,  
    template: function(item, element, data) {
        let image = data.rawData.logo
        if(data.rawData.logo !== '' && data.rawData.logo !== null) {
            if( data.rawData.logo.indexOf('http') === -1 ) {
                image = CDN_PATH_LOGO + data.rawData.logo
            } 
        } else {
            image = CDN_PATH_LOGO + NO_IMAGE_AVAILABLE
        }
      return `<div class="first">
                <div class="flexMain">
                    <div class="textColumn">${numberWithCommas(data.number)}</div>
                    <div class="textColumn text-height" >${toTitleCase(data.rawData.assignee)}</div>
                    <div class="textColumn small-font">${moment(new Date(data.rawData.start)).format(DATE_FORMAT)}</div>
                </div>
            </div>
            <div class="second"><span class="img-holder">
                <img class="${data.rawData.logo == '' || data.rawData.logo == null ? 'no-image' : ''}" src='${image}' /></span>
            </div>`
    },  
}

const convertDataToItem = (item) => {
    const assetType = 'default'
    return ({
      id: item.id,
      content: '',
      type: 'box',
      start: item.start,
      assetType,
      zoomMin: 3456e5,
      rawData: item,
      number: item.number,
      country: 'US',
      className: `asset-type-${assetType}`,
      collection: [],
      showTooltips: false, 
    })
}


const Citation = ({ number, citationRawData, updateCitationRawData }) => {
    const classes = useStyles()
    const timelineRef = useRef()
    const timelineContainerRef = useRef()
    const items = useRef(new DataSet())
    const [ display, setDisplay] = useState('block')
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
    const [ tooltipItem, setToolTipItem] = useState([])
    const [ timeInterval, setTimeInterval] = useState(null)
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )

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
                const checkFullScreen = document.getElementsByClassName('fullscreenModal');
                console.log('FullScreen', checkFullScreen)
                const element = checkFullScreen.length > 0 ? checkFullScreen[0].querySelector('#citationTimeline') : document.getElementById('citationTimeline');
                const getPosition = element.getBoundingClientRect();    
                const color = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary
                const tootltipTemplate = `<div class='custom_tooltip' style='background:${isDarkTheme ? themeMode.dark.palette.background.default : themeMode.light.palette.background.default} ;top:${ getPosition.y }px;left:${ getPosition.x }px;'>
                                            <h4 style='color:${color};text-align:left;margin:0'>${numberWithCommas(item.number)}</h4>
                                            <div>
                                                <h4>Grant Date: </h4>${moment(new Date(item.start)).format(DATE_FORMAT)}
                                            </div>
                                            <div>
                                                <h4>Assignees:</h4>
                                                ${item.all_assignee.map(name => (
                                                    '<div>'+ toTitleCase(name.assignee_organization) +'</div>'
                                                )).join('')}
                                            </div>
                                            <div>
                                                <h4>Cited a Total of: </h4>
                                                ${item.combined} patent assets
                                            </div>
                                        </div>` 
                resetTooltipContainer() 
                if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
                    document.body.insertAdjacentHTML('beforeend',tootltipTemplate)                
                }
            } else {
                resetTooltipContainer()
            }                
        }, TIME_INTERVAL) 
    }

    useEffect(() => {
        if(typeof citationData !== 'undefined' && citationRawData.length > 0) {
            setIsLoadingTimelineRawData(false)
            setTimelineRawData(citationRawData)
        } else {
            const getPtabData = async() => {
                setIsLoadingTimelineRawData(true)
                PatenTrackApi.cancelPtabRequest()    
                const asset = selectedAssetsPatents[0] !== '' ? selectedAssetsPatents[0] : selectedAssetsPatents[1]
                PatenTrackApi.cancelCitationDataRequest()
                const { data } = await PatenTrackApi.getCitationData(asset)
                setIsLoadingTimelineRawData(false)
                if(data !== null ) {
                    setTimelineRawData(data)
                    updateCitationRawData(data)
                }
            }
            getPtabData()
        }
    }, [selectedAssetsPatents])


    useEffect(() => {
        if(timelineRef.current !== null && timelineRef.current != undefined && typeof timelineRef.current.destroy === 'function') {
            timelineRef.current.destroy()
            timelineRef.current = new Timeline(timelineContainerRef.current, [], options)  
        } else {
            timelineRef.current = new Timeline(timelineContainerRef.current, [], options)    
        }          
    }, [])

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
        let start = new moment().subtract(20, 'months')
        let end = new moment().add(20, 'months')
        if(timelineContainerRef.current != null) {
            const convertedItems = timelineRawData.map(convertDataToItem)
            setTimelineItems(convertedItems)
            items.current = new DataSet()
            if (convertedItems.length > 0) {
                start = new Date()
                end = new Date()
                const promise = convertedItems.map( (c, index) => {
                    let newDate = new Date(c.start);
                    if(index === 0) {
                        end = newDate
                    }
                    if(newDate.getTime() < start.getTime()) {
                        start = newDate
                    }
                    if(newDate.getTime() > end.getTime()) {
                        end = newDate
                    }
                    return c
                })
                Promise.all(promise)
                start = new moment(start).subtract(20, 'months') 
                end = new moment(end).add(20, 'months')
                items.current.add(convertedItems)
                setDisplay('block')
            } else {
                /* setDisplay('none') */
            }
        }
        /* console.log(items.current, start, end) */
        setTimeout(() => {
            timelineRef.current.setItems(items.current)
            timelineRef.current.setOptions({ ...options, start, end, min: start, max: end })
        }, 50)
    }, [ timelineRawData, isLoadingTimelineRawData, timelineContainerRef ])



    return(
        <Paper className={classes.timelineRoot} square>    
                <div
                    id={`citationTimeline`}
                    style={{ 
                        display: display,
                        filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                    }}
                    ref={timelineContainerRef}
                    className={classes.timelineCitation}
                />
                { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> } 
        </Paper>
    )
}

export default Citation