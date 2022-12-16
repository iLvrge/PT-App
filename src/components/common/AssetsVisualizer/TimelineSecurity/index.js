import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useHistory } from "react-router-dom";
import routes from "../../../../routeList"; 
import moment from 'moment'
import _debounce from 'lodash/debounce'
import { useDispatch, useSelector } from 'react-redux'
import { DataSet } from 'vis-data-71/esnext'
import { Timeline } from 'vis-timeline/esnext'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import ClickAwayListener from '@mui/base'
import themeMode from '../../../../themes/themeMode';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import { 
  setSelectedAssetsPatents, 
  setChannelID,
  setDriveTemplateFile,
  setTemplateDocument,
  setMainCompaniesRowSelect,
  setAssetTypeSelectedRow,
  setAssetTypeCustomerSelectedRow,
  setSelectedAssetsTransactions,
  setAssetsIllustration,
  setChildSelectedAssetsTransactions,
  setChildSelectedAssetsPatents,
} from '../../../../actions/patentTrackActions2'
import {
  toggleUsptoMode, 
  toggleFamilyMode,
  toggleFamilyItemMode,
  setDriveTemplateFrameMode
} from "../../../../actions/uiActions";
import {
  setConnectionBoxView,
  setPDFView,
} from "../../../../actions/patenTrackActions"
import PatenTrackApi from '../../../../api/patenTrack2'
import { convertAssetTypeToTabId, oldConvertTabIdToAssetType, convertTabIdToAssetType, exportGroups, assetsTypesWithKey } from '../../../../utils/assetTypes'
import { numberWithCommas, capitalize } from '../../../../utils/numbers'

import FullScreen from '../../FullScreen'

import useStyles from './styles'
import { setTimelineSelectedItem, setTimelineSelectedAsset } from '../../../../actions/uiActions'
import clsx from 'clsx';

/**
 * Default options parameter for the Timeline
 */

const options = {
  height: '100%',
  autoResize: true,
  stack: true,
  orientation: 'both',
  zoomKey: 'ctrlKey',
  moveable: true,
  zoomable: true,
  horizontalScroll: true,
  verticalScroll: true,
  zoomFriction: 30,
  zoomMin: 1000 * 60 * 60 * 24 * 7, // 7 days
  /* zoomMax: 1000 * 60 * 60 * 24 * 30 * 3, */ // 3months
  /* cluster: {
  //   titleTemplate: 'Cluster containing {count} events.<br/> Zoom in to see the individual events.',
    showStipes: false,
    clusterCriteria: (firstItem, secondItem) => {
      return ( firstItem.rawData.company === secondItem.rawData.company &&  firstItem.rawData.tab_id == secondItem.rawData.tab_id)
    }
  }, */
  template: function(item, element, data) {
    if (data.isCluster) {
      return data.items.length > 0 ? `<span class="cluster-header"><span class="cluster-image cluster-${data.items[0].assetType}"></span><span>${data.items.length} ${data.items[0].companyName.length > 0 ? capitalize(data.items[0].assetType)  : ''} transactions</span></span>` : ``
    } else { 
      return `<span class="${data.assetType} ${data.rawData.tab_id}">${data.customerName}</span>`
    }
  },
}

/**
 * 
 * @param {*} assetsCustomer 
 * item data to dsplay for the timeline and for the tooltip
 */




const TIME_INTERVAL = 1000
var tootlTip = ''
const TimelineSecurity = ({ data, assignmentBar, assignmentBarToggle, type, standalone }) => {
  
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const timelineRef = useRef() //timeline Object ref
  const timelineContainerRef = useRef() //div container ref
  const items = useRef(new DataSet()) // timeline items dataset
  const groups = useRef(new DataSet()) // timeline groups dataset
  const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
  const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
  const companies = useSelector( state => state.patenTrack2.mainCompaniesList.list )
  const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
  const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
  const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
  const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
  const assetTypeInventors = useSelector(state => state.patenTrack2.assetTypeInventors.list)
  const assetTypeAssignmentAssets = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.list,
  );
  const switch_button_assets = useSelector(state => state.patenTrack2.switch_button_assets)
  
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  const assignmentList = useSelector(
    state => state.patenTrack2.assetTypeAssignments.list,
  );

  const assetTypesCompaniesSelected = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selected,
  );
  const assetTypesCompaniesSelectAll = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selectAll,
  );

  const assetTypesSelected = useSelector(
    state => state.patenTrack2.assetTypes.selected,
  );

  const foreignAssets = useSelector(state => state.patenTrack2.foreignAssets)

  const selectedItem = useSelector(state => state.ui.timeline.selectedItem)
  const auth_token = useSelector(state => state.patenTrack2.auth_token)
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);

  const setSelectedItem = useCallback((item) => {
    dispatch(setTimelineSelectedItem(item))
  }, [ dispatch ])

  const setSelectedAsset = useCallback((asset) => {
    dispatch(setTimelineSelectedAsset(asset))
  }, [ dispatch ])

  

  const [ timelineRawData, setTimelineRawData ] = useState([])
  const [ timelineItems, setTimelineItems ] = useState([])
  const [ timelineGroups, setTimelineRawGroups] = useState([])
  const [ tooltipItem, setToolTipItem] = useState([])
  const [ timeInterval, setTimeInterval] = useState(null)

  const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
  const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(false)
  const search_string = useSelector(state => state.patenTrack2.search_string)
  const search_rf_id = useSelector(state => state.patenTrack2.search_rf_id)
  const menuItems = [
        {
            id: 1,
            label: 'Timeline Security Data',
            component: TimelineSecurity,
            standalone: true,
            assignmentBar, 
            assignmentBarToggle
        }
    ]   

  //Item for the timeline

  const convertDataToItem = (assetsCustomer) => {
    
    const assetType = Number.isInteger(assetsCustomer.tab_id) ? convertTabIdToAssetType(assetsCustomer.tab_id) : 'default'
    const companyName =  selectedWithName.filter( company => assetsCustomer.company == company.id ? company.name : '')
    const customerFirstName = assetsCustomer.tab_id == 10 ? assetsCustomer.customerName.split(' ')[0] : assetsCustomer.customerName
    return ({
      
      type: 'point',
      start: new Date(assetsCustomer.exec_dt),
      customerName: `${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`,
      assetType,
      companyName,
      rawData: assetsCustomer,
      /* group: assetsCustomer.group, */
      className: `asset-type-${assetType}`,
      collection: [ { id: assetsCustomer.id, totalAssets: assetsCustomer.totalAssets } ],
      showTooltips: false, 
      /* title: `
        <div>
          <span><strong>Transaction Date:</strong> ${moment(assetsCustomer.exec_dt).format('ll')}</span> 
          <span><strong>Other Party:</strong> ${assetsCustomer.customerName}</span>
          <span><strong>Number of Assets:</strong> ${assetsCustomer.totalAssets}</span>
        </div>
      `, */
    })
  }

  // Custom ToolTip
  
  const showTooltip = (item, event) => {
  } 

  /**
   * When select an item from timeline
   */

  const onSelect = useCallback((properties) => {
    resetTooltipContainer()
    if (properties.items.length === 0) {
      setSelectedItem()
    } else {
      const item = items.current.get(properties.items[0])
      setSelectedAsset({ type: 'transaction', id: item.rawData.id })
      setSelectedItem(item)
      dispatch(setChannelID(''))
      dispatch(setDriveTemplateFrameMode(false));
      dispatch(setDriveTemplateFile(null));
      dispatch(setTemplateDocument(null));      
      dispatch(setConnectionBoxView(true));
      dispatch(setPDFView(false));
      dispatch(toggleUsptoMode(false));
      dispatch(toggleFamilyMode(false));
      dispatch(toggleFamilyItemMode(false)); 
      dispatch(setMainCompaniesRowSelect([]));
      dispatch(setAssetTypeSelectedRow([]));
      dispatch(setAssetTypeCustomerSelectedRow([]));
      dispatch(setChildSelectedAssetsTransactions([]));
      dispatch(setChildSelectedAssetsPatents([])); 
      dispatch(setSelectedAssetsPatents([]));
      dispatch(setSelectedAssetsTransactions([item.rawData.id]));
      dispatch(setAssetsIllustration({ type: "transaction", id: item.rawData.id }));
      if(assignmentBar === false) {
        assignmentBarToggle()
      }
      //history.push(routes.review3)
    }
  }, [ ])

  /**
   * on Itemover for the tooltip data
   */

  const onItemover = useCallback(({item, event}) => {
    const overItem = items.current.get(item)    
    if(overItem != null) {
      onItemout()
      tootlTip = overItem.rawData.id
      showTooltip(overItem.rawData, event)
    }
  }, [ timelineItems, timeInterval ])

  /**
   * on onItemout for the remove tooltip
   */

  const onItemout = () => {
    tootlTip = ''
    PatenTrackApi.cancelTimelineItemRequest()
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

  /**
   * this call when Timeline rangechange
   */

 /*  const onRangeChange = useCallback((properties) => {
    setIsLoadingTimelineData(true)
  }, []) */

  const onRangeChange = useCallback(_debounce((properties) => {
    setIsLoadingTimelineData(true)
    const updatedItems = timelineItems.filter((item) => (item.start >= properties.start && item.start <= properties.end))
    items.current = new DataSet()
    items.current.add(updatedItems)
    timelineRef.current.setItems(items.current)
    setIsLoadingTimelineData(false)
  }, 100), [ timelineItems ])


  /**
   * this call when Timeline rangechanged
   */

  const onRangeChanged = useCallback(_debounce((properties) => {
    setIsLoadingTimelineData(true)
    const updatedItems = timelineItems.filter((item) => (item.start >= properties.start && item.start <= properties.end))
    items.current = new DataSet()
    items.current.add(updatedItems)
    timelineRef.current.setItems(items.current)
    setIsLoadingTimelineData(false)
  }, 1000), [ timelineItems ])

  useEffect(() => {
    if (!selectedItem && timelineRef.current) {
      timelineRef.current.setSelection([])
    }
  }, [ selectedItem, timelineRef ])

  useEffect(() => {
    timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
  }, [])

  //Timeline list from server
  useEffect(() => {
    /**
     * return empty if no company selected
     */
    setTimelineRawGroups([]) //groups
    setTimelineRawData([]) //items
    //redrawTimeline()
    PatenTrackApi.cancelTimelineSecurityRequest()
    /**
     * call for the timeline api data
    */
    const getTimelineSecurityRawDataFunction = async () => {
        //search
        try{
            resetTooltipContainer()  
            const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
            tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
            customers = assetTypesCompaniesSelectAll === true ? [] :  assetTypesCompaniesSelected,
            rfIDs = selectedAssetAssignments.length > 0 ? selectedAssetAssignments : [];
            const { data } = await PatenTrackApi.getTimelineSecurityData(companies, tabs, customers, rfIDs, selectedCategory)
            setTimelineRawData(data.list)
        } catch (err) {
            console.log(err)
        }        
    }
    getTimelineSecurityRawDataFunction()
    
  }, [ selectedCompanies, selectedCompaniesAll, selectedAssetsPatents, selectedAssetAssignments, assetTypesSelectAll, assetTypesSelected, assetTypesCompaniesSelectAll, assetTypesCompaniesSelected, search_string, assetTypeInventors, auth_token, switch_button_assets ])

  

  const redrawTimeline = () => {
    if(timelineRef.current !== null) {
      timelineRef.current.destroy()
      timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
    }
  }

  
  /**
   * Intial timline items dataset and ref setup
   */
  useEffect(() => {
    items.current = new DataSet()
    groups.current = new DataSet()
    timelineRef.current.setOptions(options) 
    timelineRef.current.on('select', onSelect)
    timelineRef.current.on('itemover', onItemover)
    timelineRef.current.on('itemout', onItemout)
    timelineRef.current.on('rangechanged', onRangeChanged)
    timelineRef.current.on('rangechange', onRangeChange)    
    return () => {
      timelineRef.current.off('select', onSelect)
      timelineRef.current.off('itemover', onItemover) 
      timelineRef.current.off('itemout', onItemout)
      timelineRef.current.off('rangechange', onRangeChange)
      timelineRef.current.off('rangechanged', onRangeChanged)
      resetTooltipContainer()
    } 
  }, [ onRangeChange, onRangeChanged, onSelect, onItemover ]) 

  /**
   * Add timeline items to the the dataset and set the start, end, min and max date
   */
  useEffect(() => {
    if (isLoadingTimelineRawData) return null
    const clusteredItems = timelineRawData.reduce((result, dataItem) => {
      const itemName = dataItem.tab_id == 10 ? dataItem.customerName.split(' ')[0] : dataItem.customerName
      result[`${dataItem.id}_${itemName}_${dataItem.exec_dt}`] = convertDataToItem(dataItem)
      return result 
    }, {})
    
    const convertedItems = Object.values(clusteredItems).sort((a, b) => (new Date(a.start) > new Date(b.start)))  

    setTimelineItems(convertedItems)
    items.current = new DataSet()
    groups.current = new DataSet()
    let start =  new moment(), end = new moment().add(1, 'year')  

    if (convertedItems.length > 0) {
      const startIndex = convertedItems.length < 100 ? (convertedItems.length - 1) : 99
      start = convertedItems.length ? new moment(convertedItems[startIndex].start).subtract(1, 'week') : new Date()
      //end = new moment().add(1, 'month')
      items.current.add(convertedItems.slice(0, startIndex))      
    }    
    timelineRef.current.setOptions({ ...options, start, end, min: new moment(new Date('1998-01-01')), max: new moment().add(3, 'year')})
    timelineRef.current.setItems(items.current)   
    //checkCurrentDateStatus()
  }, [ timelineRawData ])

  useEffect(() => {
    /* window.addEventListener('keydown', handleKeyEvent)
    return () => window.removeEventListener("keydown", handleKeyEvent) */
  }, []) 

  /* const checkCurrentDateStatus = () => {
    setTimeout(() => {
      if( document.getElementsByClassName('vis-current-time').length == 0 ) {
        let currentElementTransform = document.getElementsByClassName('vis-current-time')[0].style.transform
        currentElementTransform = parseInt(currentElementTransform.replace('translateX(', '').replace(')', ''))

      } else {
        checkCurrentDateStatus()
      }
    }, 1000)
  } */
  const handleKeyEvent = (event) =>{ 
    if(event.key === 'ArrowDown' || event.key === 'ArrowUp' ) {
      if(event.key === 'ArrowUp' ) {
        timelineRef.current.zoomOut(0.30)
      } else {
        timelineRef.current.zoomIn(0.30)
      }
      
    }
  }
 
  /**
   * return component 
   */    

  return (
      <Paper className={classes.root}>    
        {
            typeof standalone === 'undefined' && (
                <div className={classes.fullScreenContainer}>
                    <FullScreen componentItems={menuItems}/>
                </div>
            )
        }    
        <div
          style={{ 
            filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`
          }}  
          ref={timelineContainerRef}
          className={clsx(classes.timeline, 'timeline')}
        />
        {
          isLoadingTimelineData &&
          <CircularProgress size={15} color={'secondary'} className={classes.timelineProcessingIndicator} />
        }
        { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
      </Paper>
  ) 
}

export default TimelineSecurity
