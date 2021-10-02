import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import _debounce from 'lodash/debounce'
import Paper from '@material-ui/core/Paper'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'

import CircularProgress from '@material-ui/core/CircularProgress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import { 
    setFamilyItemDisplay,
    assetLegalEvents,
    setAssetLegalEvents
  } from '../../../../actions/patenTrackActions'

import {
    toggleFamilyItemMode
} from '../../../../actions/uiActions'

import { numberWithCommas } from '../../../../utils/numbers'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import useStyles from './styles'
  
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
      let applicationDate = data.rawData.application_date, grantDate = data.rawData.publication_date
      if( applicationDate != '' && applicationDate != null ) {
        applicationDate = moment(new Date(data.start)).format(DATE_FORMAT)
      }
      if( grantDate!= '' && grantDate != null ) {
        grantDate = grantDate.indexOf('-') !== -1 ? moment(new Date(grantDate)).format(DATE_FORMAT) :   moment(new Date(grantDate.substr(0,4)+'-'+ grantDate.substr(4,2)+'-'+grantDate.substr(6,2))).format(DATE_FORMAT)
      } else {
        grantDate = ''
      }
      return `<div class='first'>${data.country.toUpperCase()} ${numberWithCommas(data.number)}</div><div class='flexMain ${ data.country.toLowerCase() == "cn" ? 'alignBaseline' : ''} '><img src='${data.country.toLowerCase() == 'ep' || data.country.toLowerCase() == 'wo' ? 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/'+data.country.toLowerCase()+'.png' : 'https://flagcdn.com/w80/'+data.country.toLowerCase()+'.png'}' srcset='${data.country.toLowerCase() == 'ep' || data.country.toLowerCase() == 'wo' ? 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/'+data.country.toLowerCase()+'.png' : 'https://flagcdn.com/w160/'+data.country.toLowerCase()+'.png 2x'}'/><div class='textColumn'><div class='absolute'><div>${applicationDate}</div><div>${grantDate}</div></div></div></div>`
    },  
} 

const convertDataToItem = (familyItem) => {
    const assetType = 'default'
    const rawDate = familyItem.application_date
    return ({
      id: familyItem.id,
      content: '',
      type: 'box',
      start: rawDate.indexOf('-') !== -1 ? new Date(rawDate) : new Date(`${rawDate.substr(0,4)}-${rawDate.substr(4,2)}-${rawDate.substr(6,2)}`),
      assetType,
      zoomMin: 3456e5,
      rawData: familyItem,
      number: familyItem.patent_number !== '' && familyItem.patent_number !== null && familyItem.patent_number !== 'null' ? familyItem.patent_number : familyItem.application_number,
      country: familyItem.publication_country,
      className: `asset-type-${assetType}`,
      collection: []
    })
}

const FamilyContainer = ({ family, onClose }) => {
    const classes = useStyles()

    const timelineRef = useRef()
    const timelineContainerRef = useRef()
    const items = useRef(new DataSet())
    const dispatch = useDispatch()
    const [ display, setDisplay] = useState('block')
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
    
    const selectedAsset = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    
    const onSelect = useCallback((properties) => {        
        if (properties.items.length > 0)  {            
            const item = items.current.get(properties.items[0])
            const publicationCountry = item.rawData.publication_country
            if(publicationCountry.toString().toLowerCase() == 'us') {
                dispatch(assetLegalEvents(item.rawData.application_number, item.rawData.patent_number))
            } else {
                dispatch(setAssetLegalEvents([]))
            }            
            dispatch(setFamilyItemDisplay(item.rawData))
            dispatch(toggleFamilyItemMode(true))
        }
    }, [ dispatch ]) 
    
    
    const handleClickAway = () => {
        /*timelineRef.current.setSelection([])
        toggleFamilyItemMode(false)
        setFamilyItemDisplay({})*/
    }

    useEffect(() => {
        if(timelineContainerRef.current != null) {
            timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
            setDisplay('none')
        }        
    }, [ timelineContainerRef ])

    useEffect(() => {
        if (family.length === 0 || selectedAsset.length === 0 ) return setTimelineRawData([])
        const getTimelineRawDataFunction = async () => {            
            setTimelineRawData(family)
            setIsLoadingTimelineRawData(false)
            const findIndex = family.findIndex(item => selectedAsset.includes(item.application_number) || selectedAsset.includes(item.patent_number))
            
            if(findIndex !== -1 ) { 
                dispatch(setFamilyItemDisplay(family[findIndex]))
                dispatch(toggleFamilyItemMode(true))
            }
        }        
        getTimelineRawDataFunction()
    }, [ dispatch, family, selectedAsset ])

    useEffect(() => {
        items.current = new DataSet()
        timelineRef.current.setOptions(options)
        timelineRef.current.on('select', onSelect)
        return () => {
          timelineRef.current.off('select', onSelect)
        } 
    }, [ onSelect ])


    useEffect(() => {
        if (isLoadingTimelineRawData) return
        let start = new moment().subtract(18, 'months')
        let end = new moment().add(18, 'months')
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
                start = new moment(start).subtract(36, 'months') 
                end = new moment(end).add(36, 'months')
                items.current.add(convertedItems)
                setDisplay('block')
            } else {
                setDisplay('none')
            }
        }
        /* console.log(items.current, start, end) */
        setTimeout(() => {
            timelineRef.current.setItems(items.current)
            timelineRef.current.setOptions({ ...options, start, end, min: start, max: end })
        }, 50)
    }, [ timelineRawData, isLoadingTimelineRawData, timelineContainerRef ])

    return(
        <Paper className={classes.root}>   
            <div className={classes.root}>
                <div
                    id={`familyTimeline`}
                    style={{ 
                        display: display,
                        filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                    }}
                    ref={timelineContainerRef}
                    className={classes.timeline}
                />
                {/* { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> } */} 
            </div>
        </Paper>
    )
}


export default FamilyContainer