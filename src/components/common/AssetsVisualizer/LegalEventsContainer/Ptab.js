import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@mui/material/CircularProgress'
import moment from 'moment'
import { numberWithCommas, toTitleCase, ptabHeadings } from '../../../../utils/numbers'

import PatenTrackApi from '../../../../api/patenTrack2'
import useStyles from './styles'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

const DATE_FORMAT = 'MMM DD, YYYY'


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
      return `<div class='first'><div class='textColumn'><h4>${data.rawData.name} (${data.rawData.otherInfo.proceedingNumber})</h4></div><div class='textColumn'><h4>Filed: </h4> ${moment(new Date(data.rawData.start)).format(DATE_FORMAT)}</div><div class='textColumn'><h4>Status: </h4> ${data.rawData.status} (${moment(new Date(data.rawData.end)).format(DATE_FORMAT)})</div></div>`
    },  
} 

const convertDataToItem = (item) => {
    const assetType = 'default'
    return ({
      id: item.id,
      content: '',
      start: new Date(item.start),
      end: new Date(item.end),
      assetType,
      zoomMin: 3456e5,
      rawData: item,
      number: item.name,
      country: 'US',
      className: `asset-type-${assetType}`,
      collection: [],
      showTooltip: false
    })
}
var tootlTip = ''
const TIME_INTERVAL = 1000

const Ptab = ({ number }) => {
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
                const color = '#fff'   
                const height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight;   
                let tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${event.clientY - 400 }px;left:${event.clientX + 20 }px;'>`
                const { otherInfo } = item
                Object.keys(otherInfo).map(key => {
                    if(Array.isArray(otherInfo[key])) {
                        otherInfo[key].forEach( arrItem => {
                            Object.keys(arrItem).map(arrKey => {
                                tootltipTemplate += `<div>
                                    <h4 style='display:inline'>${ptabHeadings[arrKey]}: </h4>${arrKey.toLowerCase().indexOf('date') !== -1 ?  moment(new Date(arrItem[arrKey])).format(DATE_FORMAT) : arrItem[arrKey]}
                                </div>`
                            })
                        })
                    } else {
                        tootltipTemplate += `<div>
                            <h4 style='display:inline'>${ptabHeadings[key]}: </h4>${key.toLowerCase().indexOf('date') !== -1 ?  moment(new Date(otherInfo[key])).format(DATE_FORMAT) : otherInfo[key]}
                        </div>`
                    }                    
                })

                tootltipTemplate += `</div>`
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
        const getPtabData = async() => {
            setIsLoadingTimelineRawData(true)
            PatenTrackApi.cancelPtab()    
            const { data } = await PatenTrackApi.getPtabData(selectedAssetsPatents[1])
            setIsLoadingTimelineRawData(false) 
            if(data !== null) {
                setTimelineRawData(data)
            }
        }
        getPtabData()
    }, [selectedAssetsPatents])

   
    useEffect(() => {
        if(timelineRef.current !== null && timelineRef.current != undefined && typeof timelineRef.current.destroy === 'function') {
            timelineRef.current.destroy()
            timelineRef.current = new Timeline(timelineContainerRef.current, [], options)  
        } else {
            timelineRef.current = new Timeline(timelineContainerRef.current, [], options)  
        }                        
    }, [])


    useEffect(() => {
        if (isLoadingTimelineRawData) return
        let start = new moment().subtract(24, 'months')
        let end = new moment().add(24, 'months')
        if(timelineContainerRef.current != null) {
            const convertedItems = timelineRawData.map(convertDataToItem)
            setTimelineItems(convertedItems)
            items.current = new DataSet()
            if (convertedItems.length > 0) {
                start = new Date()
                end = new Date()
                const promise = convertedItems.map( (c, index) => {
                    let newDate = new Date(c.start), endDate = new Date(c.end);
                    if(index === 0) {
                        end = endDate
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
                start = new moment(start).subtract(24, 'months') 
                end = new moment(end).add(24, 'months')
                items.current.add(convertedItems)
                setDisplay('block')
            } else {
                /* setDisplay('none') */
            }
        }
        /*console.log(items.current, start, end) */
        
        timelineRef.current.setItems(items.current)
        timelineRef.current.setOptions({ ...options, start, end, min: start, max: end })
    }, [ timelineRawData, isLoadingTimelineRawData, timelineContainerRef ])

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

    return(
        <Paper className={classes.root}>   
            <div className={classes.root}>
                <div
                    id={`ptabTimeline`}
                    style={{ 
                        display: display,
                        filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                    }}
                    ref={timelineContainerRef}
                    className={classes.timelinePtab}
                />
                { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> } 
            </div>
        </Paper>
    )
}

export default Ptab