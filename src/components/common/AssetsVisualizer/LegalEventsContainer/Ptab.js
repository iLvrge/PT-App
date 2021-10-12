import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@material-ui/core/CircularProgress'
import moment from 'moment'
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
      return `<div class='first'>${data.rawData.name}, Filed: ${moment(new Date(data.rawData.start)).format(DATE_FORMAT)} Status: ${data.rawData.status}, ${moment(new Date(data.rawData.end)).format(DATE_FORMAT)}</div>`
    },  
}

const convertDataToItem = (item) => {
    const assetType = 'default'
    return ({
      id: item.id,
      content: '',
      type: 'box',
      start: new Date(item.start),
      end: new Date(item.end),
      assetType,
      zoomMin: 3456e5,
      rawData: item,
      number: item.name,
      country: 'US',
      className: `asset-type-${assetType}`,
      collection: []
    })
}


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

    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )


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
        let start = new moment().subtract(10, 'months')
        let end = new moment().add(10, 'months')
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
                start = new moment(start).subtract(10, 'months') 
                end = new moment(end).add(10, 'months')
                items.current.add(convertedItems)
                setDisplay('block')
            } else {
                setDisplay('none')
            }
        }
        /* console.log(items.current, start, end) */
        
        timelineRef.current.setItems(items.current)
        timelineRef.current.setOptions({ ...options, start, end, min: start, max: end })
    }, [ timelineRawData, isLoadingTimelineRawData, timelineContainerRef ])



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