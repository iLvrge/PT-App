import { IconButton, Paper } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import moment from 'moment'
import useStyles from './styles'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import Close from '@mui/icons-material/Close';
import { dispatch } from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { setFamilyLegalItem } from '../../../../actions/patentTrackActions2';
import { setFamilyLegalItemMode } from '../../../../actions/uiActions';

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
} 

const DATE_FORMAT = 'MMM DD, YYYY'

const getTemplateContent = (item) => { 
    const templateContent = `<div class='first limit'>${item.desc}</div><div class='textColumn'>${moment(new Date(item.gazette_date)).format(DATE_FORMAT)}</div>`
  return templateContent   
}

const convertDataToItem = (item) => {
    const assetType = 'default'
    const rawDate = item.gazette_date
    return ({
        id: `${item.document_number.trim()}-${moment(new Date(item.date_first_exchanged)).format('YYYYMMDD')}-${Math.random()}`,
        content: getTemplateContent(item), 
        start:  new Date(rawDate) ,
        assetType,
        zoomMin: 3456e5,
        rawData: item,
        number: item.document_number.trim(),
        className: `asset-type-${assetType}`,
        showTooltips: false
    })
}


const LegalData = ({legalEvents}) => {
    const classes = useStyles()
    const timelineRef = useRef()   
    const timelineContainerRef = useRef()
    const dispatch = useDispatch()
    const items = useRef(new DataSet())
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
    const [ display, setDisplay] = useState('block')
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const familyLegalItem = useSelector(state => state.patenTrack2.familyLegalItem)  

    useEffect(() => {
        setTimelineRawData(familyLegalItem)
        setIsLoadingTimelineRawData(false)
    }, [familyLegalItem])

    useEffect(() => {
        if(timelineContainerRef.current != null) {
            timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
            setDisplay('none')
        }        
    }, [ timelineContainerRef ])


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
                start = new moment(start).subtract(1, 'year') 
                end = new moment(end).add(1, 'year')
                items.current.add(convertedItems)
            } 

            setDisplay('block')
        }
        /* console.log(items.current, start, end) */
        setTimeout(() => {
            timelineRef.current.setItems(items.current)
            timelineRef.current.setOptions({ ...options, start, end, min: new moment().subtract(2, 'year'), max: moment(new Date()).add(1, 'year') })
        }, 50)
    }, [ timelineRawData, isLoadingTimelineRawData, timelineContainerRef ])

    const handleClearEvent = () =>{
        dispatch(setFamilyLegalItem([]))
        dispatch(setFamilyLegalItemMode(false))
    }

    return (
        <Paper className={classes.root}>    
            <IconButton
                className={classes.btnClose}
                onClick={handleClearEvent}
            >
                <Close/>
            </IconButton>
            <div
                id={`familyLegalTimeline`}
                style={{ 
                    display: display,
                    filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                }}
                ref={timelineContainerRef}
                className={classes.timelineLegal}
            /> 
        </Paper>
    )
    
}


export default LegalData;