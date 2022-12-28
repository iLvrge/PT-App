import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useHistory } from "react-router-dom"; 
import moment from 'moment'
import _debounce from 'lodash/debounce'
import { useDispatch, useSelector } from 'react-redux'
import { DataSet } from 'vis-data-71/esnext'
import { Timeline } from 'vis-timeline/esnext'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress' 
import themeMode from '../../../../themes/themeMode';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import { 
  retrievePDFFromServer,
  transactionRowClick
} from '../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../api/patenTrack2'
import { convertTabIdToAssetType, assetsTypesWithKey } from '../../../../utils/assetTypes'
import { numberWithCommas, capitalize, applicationFormat} from '../../../../utils/numbers'
import { timelineOptions } from '../../../../utils/options'


import useStyles from './styles'
import { setTimelineSelectedItem, setTimelineSelectedAsset } from '../../../../actions/uiActions'
import clsx from 'clsx';
import { setConnectionBoxView, setConnectionData, setPDFFile, setPDFView } from '../../../../actions/patenTrackActions';
import { Button, IconButton } from '@mui/material';

/**
 * Default options parameter for the Timeline
 */

const TIME_INTERVAL = 1000
var tootlTip = ''
const LawFirmTimeline = ({ data, assignmentBar, assignmentBarToggle, type, timelineData, updateTimelineRawData }) => {
  
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const timelineRef = useRef() //timeline Object ref
  const timelineContainerRef = useRef() //div container ref
  const [previousLoad, setPreviousLoad] = useState(false)
  const [buttonClick, setSetButtonClick] = useState(false)
  const items = useRef(new DataSet()) // timeline items dataset
  const groups = useRef(new DataSet()) // timeline groups dataset
  const [options, setOptions] = useState({
      ...timelineOptions, 
      type: 'point',
      template: function(item, element, data) {
        if (data.isCluster) {
          return `<span class="cluster-header">${data.items[0].rawData.lawfirm}(${data.items.length})</span>`
        } else { 
          return `<span class="lawfirm">${data.customerName}</span>`
        }
      }
    })
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
  const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)
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
  const selectedLawFirm = useSelector( state => state.patenTrack2.selectedLawFirm);

  //Item for the timeline

  const convertDataToItem = (assetsCustomer) => {   
    const customerFirstName =  assetsCustomer.lawfirm
    const item = { 
      start: new Date(assetsCustomer.exec_dt),
      customerName: `${customerFirstName}`,
      rawData: assetsCustomer,
      className: `lawfirm ${typeof assetsCustomer.type !== 'undefined' ? 'filled' : ''} `
    }  
    return item
  }

  // Custom ToolTip

  const showTooltipForAsset = (item, event) => {
    if(tootlTip === item.appno_doc_num) {
      const element = document.getElementById('all_timeline');
      const getPosition = element.getBoundingClientRect();  
      const color = '#e91e63;';
      const tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${getPosition.y}px;left:${getPosition.x }px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'> <h4 style='color:#fff;text-align:left;margin:0'>${item.patent != '' ? numberWithCommas(item.patent) : applicationFormat(item.appno_doc_num)}</h4>
        <div>
          ${item.title}
        </div>
        </div>` 
        resetTooltipContainer() 
        if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
          document.body.insertAdjacentHTML('beforeend',tootltipTemplate)
          //timelineContainerRef.current.childNodes[0].insertAdjacentHTML('beforeend',tootltipTemplate)
        }
    } else {
      resetTooltipContainer()
    }
  } 
  
  const showTooltip = (item, event) => {    
      setTimeout(() => {
        if(tootlTip === item.id) {
          PatenTrackApi
          .cancelTimelineItemRequest()
          PatenTrackApi
          .getTimelineItemData(item.id)
          .then( response => {
            const { data } = response
            if( data != null && ( data.assignor.length > 0 || data.assignee.length > 0 ) && tootlTip === data.assignment.rf_id) {
              const executionDate = data.assignor.length > 0 ? data.assignor[0].exec_dt : ''
              let transactionType = convertTabIdToAssetType(item.tab_id)
              const findIndex = assetsTypesWithKey.findIndex( row => row.type == transactionType)

              if(findIndex !== -1) {
                transactionType = assetsTypesWithKey[findIndex].name
              } else {
                transactionType = capitalize(transactionType)
              }
              let image = '', color ='';
              switch(parseInt(item.tab_id)) {
                case 1:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/acquisition.png'
                  color = '#E60000'
                  break;
                case 2:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/sales.png'
                  color = '#70A800'
                  break;
                case 3:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/licensein.png'
                  color = '#E69800'
                  break;
                case 4:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/licenseout.png'
                  color = '#E69800'
                  break;
                case 5:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
                  color = '#00a9e6'
                  break;
                case 6:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerin.png'
                  color = '#FFFFFF'
                  break;
                case 7:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerout.png'
                  color = '#FFFFFF'
                  break;
                case 8:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/options.png'
                  color = '#000000'
                  break;
                case 9:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/courtorder.png'
                  color = '#E60000'
                  break;
                case 10:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png'
                  color = '#FFFFFF'
                  break;
                case 11:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/release.png'
                  color = '#00a9e6'
                  break;
                case 12:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
                  color = '#00a9e6'
                  break;
                case 13:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
                  color = '#00a9e6'
                  break;
                case 14:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png'
                  color = '#FFFFFF'
                  break;
                case 14:
                default:
                  image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png'
                  color = '#FFFFFF'
                  break;
              }
              const element = document.getElementById('all_timeline');
              const getPosition = element.getBoundingClientRect();  
              const tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${getPosition.y}px;left:${getPosition.x }px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'>
                                          <h4 style='color:${color};text-align:left;margin:0'>${transactionType}</h4>
                                          <div>
                                            ${ executionDate != '' ? moment(executionDate).format('ll') : ''}
                                          </div>
                                          <div>
                                            <h4>Assignors:</h4>
                                            ${data.assignor.map(or => ( 
                                              '<div>'+or.original_name+'</div>'
                                            )).join('')}
                                          </div>
                                          <div>
                                            <h4>Assignees:</h4>
                                            ${data.assignee.map(ee => (
                                              '<div>'+ee.original_name+'</div>'
                                            )).join('')}
                                          </div>
                                        </div>` 
                resetTooltipContainer() 
              if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
                document.body.insertAdjacentHTML('beforeend',tootltipTemplate)
                //timelineContainerRef.current.childNodes[0].insertAdjacentHTML('beforeend',tootltipTemplate)
              }
            } else {
              resetTooltipContainer()
            }
          })
        }                
      }, TIME_INTERVAL) 
  } 

  /**
   * When select an item from timeline
   */

  const onSelect = useCallback(async (properties) => {
    resetTooltipContainer()
    if (properties.items.length === 0) {
      setSelectedItem(null)
      dispatch(
        setConnectionBoxView(false)
      )
      dispatch(
        setPDFView(false)
      )
      dispatch(    
        setConnectionData(null)
      )
      dispatch(
        setPDFFile({ 
          document: null,  
          form: null, 
          agreement: null
        })
      ) 
    } else {
      const item = items.current.get(properties.items[0])
      if(typeof item.rawData.type === 'undefined'){
        /* setSelectedAsset({ type: 'transaction', id: item.rawData.id })
        setSelectedItem(item)
        dispatch(transactionRowClick(item.rawData.id, slack_channel_list, false, search_string))
        if(assignmentBar === false) {
          assignmentBarToggle()  
        } */
          if(assignmentBar === false) {
            assignmentBarToggle()  
          }
          const { data } = await PatenTrackApi.getCollectionIllustration(item.rawData.id)
          if(data != null) {                        
            const obj = data.line.length > 0 ? data.line[0] : null
            if(obj != null) {
              dispatch(    
                setConnectionData(obj)
              )  
              dispatch(
                setConnectionBoxView(true)
              ) 
              dispatch(
                setPDFView(true)
              ) 
              if(obj.document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document1 == "" && obj.ref_id > 0)) {
                obj.rf_id =  obj.ref_id
                dispatch(retrievePDFFromServer(obj))   
              } else {
                dispatch(
                  setPDFFile({ 
                    document: obj.document1,  
                    form: obj.document1, 
                    agreement: obj.document1 
                  })
                ) 
              }                       
            }                        
          }
      }
    }
  }, [ ])

  /**
   * on Itemover for the tooltip data
   */

  const onItemover = useCallback(({item, event}) => {
    const overItem = items.current.get(item)    
    if(overItem != null) {
      onItemout()
      if(typeof overItem.rawData.type !== 'undefined'){
        tootlTip =  overItem.rawData.appno_doc_num 
        showTooltipForAsset(overItem.rawData, event)

      } else {
        tootlTip =  overItem.rawData.id 
        showTooltip(overItem.rawData, event)
      }
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

  const onRangeChange = useCallback((properties) => {
    setIsLoadingTimelineData(true)
    /* const updatedItems = timelineItems.filter((item) => (item.start >= properties.start && item.start <= properties.end))
    items.current = new DataSet()
    items.current.add(updatedItems)
    timelineRef.current.setItems(items.current) */
    setIsLoadingTimelineData(false)
  }, [ timelineItems ])


  /**
   * this call when Timeline rangechanged
   */

  /* const onRangeChanged = useCallback(_debounce((properties) => {
    setIsLoadingTimelineData(true)
    const updatedItems = timelineItems.filter((item) => (item.start >= properties.start && item.start <= properties.end))
    items.current = new DataSet()
    items.current.add(updatedItems)
    timelineRef.current.setItems(items.current)
    setIsLoadingTimelineData(false)
  }, 1000), [ timelineItems ]) */


  const onRangeChanged = useCallback(async (properties) => {
    if(buttonClick === true) {

      setIsLoadingTimelineData(true)
      const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
          tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
          customers = assetTypesCompaniesSelectAll === true ? [] :  assetTypesCompaniesSelected,
          rfIDs = selectedLawFirm > 0 ? [selectedLawFirm] : [];
      const { data } = await PatenTrackApi.getActivitiesTimelineData(companies, tabs, customers, rfIDs, selectedCategory, (assetTypeInventors.length > 0 || tabs.includes(10)) ? true : undefined, moment(properties.start).format('YYYY-MM-DD'), moment(properties.end).format('YYYY-MM-DD'))
      setIsLoadingTimelineData(false) 
      if( data != null && data.length > 0 ) { 
        setTimelineRawData(data.list)
        if(typeof updateTimelineRawData !== 'undefined') {
          updateTimelineRawData(data.list) 
        }
      }
    }
    /* const updatedItems = timelineItems.filter((item) => (item.start >= properties.start && item.start <= properties.end))
    items.current = new DataSet()
    items.current.add(updatedItems)
    timelineRef.current.setItems(items.current) */
   
  }, [ timelineItems ])

  

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
    
    let isSubscribed = true;
    if(typeof timelineData !== 'undefined') {
      setTimelineRawData(timelineData)
    } else {
      /**
           * return empty if no company selected
           */
      setTimelineRawGroups([]) //groups
      setTimelineRawData([]) //items
      //redrawTimeline()
      /* PatenTrackApi.cancelTimelineActivityRequest() */
      /**
        * call for the timeline api data
      */

      const getTimelineRawDataFunction = async () => {
        //search
        if(isSubscribed) {
          resetTooltipContainer()
          if(search_string != '' && search_string != null){
            if(search_rf_id.length > 0) {
              //setIsLoadingTimelineData(true)
              const { data } = await PatenTrackApi.getActivitiesTimelineData([], [], [], search_rf_id) // empty array for company, tabs, customers
              //setIsLoadingTimelineData(false)
              //setTimelineRawGroups(data.groups) //groups
              setTimelineRawData(data.list) //items
              if(typeof updateTimelineRawData !== 'undefined') {
                updateTimelineRawData(data.list)
              }
            }       
          } else {
            if(type !== 9)  {
              const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
              tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
              customers = assetTypesCompaniesSelectAll === true ? [] :  assetTypesCompaniesSelected,
              rfIDs = selectedLawFirm > 0 ? [selectedLawFirm] : [];
      
              if( (process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD') && (selectedCompaniesAll === true || selectedCompanies.length > 0)) {
                setIsLoadingTimelineData(true)
                const { data } = await PatenTrackApi.getActivitiesTimelineData(companies, tabs, customers, rfIDs, selectedCategory, (assetTypeInventors.length > 0 || tabs.includes(10)) ? true : undefined)
                const mainList = data.list
                //setIsLoadingTimelineData(false) 
                if(selectedCategory == 'top_law_firms') {
                  /**
                   * Filling Assets
                   */
                 /*  PatenTrackApi.cancelTimelineRequest() */
                  /* const { data } = await PatenTrackApi.getFilledAssetsTimelineData(companies, tabs, customers, rfIDs, selectedCategory, (assetTypeInventors.length > 0 || tabs.includes(10)) ? true : undefined)
                  setIsLoadingTimelineData(false) 
                  if( data != null && data.length > 0 ) { 
                    const oldItems = [...mainList, ...data] 
                    setTimelineRawData(oldItems)
                    if(typeof updateTimelineRawData !== 'undefined') {
                      updateTimelineRawData(oldItems) 
                    }
                  } else { 
                    setTimelineRawData(mainList) 
                    if(typeof updateTimelineRawData !== 'undefined') {
                      updateTimelineRawData(mainList)
                    }
                  } */
                  setTimelineRawData(mainList) 
                    if(typeof updateTimelineRawData !== 'undefined') {
                      updateTimelineRawData(mainList)
                    }
                } else {
                  setIsLoadingTimelineData(false) 
                  setTimelineRawData(mainList) 
                  if(typeof updateTimelineRawData !== 'undefined') {
                    updateTimelineRawData(mainList)
                  }
                }
              } else if( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null ) {
                setIsLoadingTimelineData(true)
                const { data } = await PatenTrackApi.getShareTimelineList(location.pathname.replace('/', ''))
                setTimelineRawData(data.list)     
                if(typeof updateTimelineRawData !== 'undefined') {
                  updateTimelineRawData(data.list)
                }      
                setIsLoadingTimelineData(false)            
              }
            }
          } 
        }
      }
      getTimelineRawDataFunction()
    }
    return () => (isSubscribed = false)
    
  }, [ selectedCompanies, selectedCompaniesAll, selectedAssetsPatents, selectedAssetAssignments, assetTypesSelectAll, assetTypesSelected, assetTypesCompaniesSelectAll, assetTypesCompaniesSelected, selectedLawFirm, search_string, assetTypeInventors, auth_token, switch_button_assets, selectedCategory ])

  useEffect(() => {
    if(typeof timelineData !== 'undefined') {
      setTimelineRawData(timelineData)
    } else {
      const getForeignAssetTimelineData = async(foreignAssets, assetTypeAssignmentAssets) => {
        if(foreignAssets.selected.length > 0 && assetTypeAssignmentAssets.length > 0) {
          const assets = []
          assetTypeAssignmentAssets.forEach( item => {
            assets.push(item.asset)
          })
          const form = new FormData()
          form.append('assets', JSON.stringify(assets)) 
          PatenTrackApi.cancelForeignAssetTimelineRequest()
          const { data } = await PatenTrackApi.getForeignAssetsTimeline(form)
          //setIsLoadingTimelineData(false)
          setTimelineRawData(data.list) 
          if(typeof updateTimelineRawData !== 'undefined') {
            updateTimelineRawData(data.list)
          }
        }
      }
      getForeignAssetTimelineData(foreignAssets, assetTypeAssignmentAssets)
    }
  }, [foreignAssets, assetTypeAssignmentAssets])

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
    let start = new moment().subtract(20, 'months'), end = new moment().add(20, 'months')

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
      /* const startIndex = convertedItems.length < 201 ? (convertedItems.length - 1) : 199
      items.current.add(convertedItems.slice(0, startIndex))  */  
      items.current.add(convertedItems)  
    }    
   
    /* const min = new moment(start).subtract(20, 'months') 
    end = new moment(end).add(5, 'months')
    const max = new moment(end).add(20, 'months')
    start = new moment(end).subtract(12, 'months')  */
    redrawTimeline() 
    console.log('Timeline Loading.....', timelineRawData, previousLoad)
    if(timelineRawData.length > 0 || previousLoad === false) {
      console.log('Entered.....')
      setPreviousLoad(true)
      timelineRef.current.setOptions({ 
        ...options, 
        end: new moment().add(1, 'months')
        /* zoomMin: 1000 * 60 * 60 * 24,     
        zoomMax: 1000 * 60 * 60 * 24 * 30 * 12,  */
        /* start, end, min: start, max: end  */})  
      timelineRef.current.setItems(items.current)   
    }
    
    //checkCurrentDateStatus() 
  }, [ timelineRawData ])

  const move  = (percentage) => {
    var range = timelineRef.current.getWindow();
    var interval = range.end - range.start;

    timelineRef.current.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end:   range.end.valueOf()   - interval * percentage
    });
  }

  const zoomIn = () => {
    setSetButtonClick(true)
    timelineRef.current.zoomIn(0.2);
  }

  const zoomOut = () => {
    setSetButtonClick(true)
    timelineRef.current.zoomOut(0.2);
  }

  const moveLeft = () => {
    move(0.2);
  }

  const moveRight = () => {
    move(-0.2);
  }
 
  /**
   * return component 
   */    

  return (
      <Paper className={classes.root}>     
        <div id="visualization">
          <div class="menu">
            <IconButton onClick={zoomIn}>
              <ZoomInIcon/>
            </IconButton>
            <IconButton onClick={zoomOut}>
              <ZoomOutIcon/>
            </IconButton>
            <IconButton onClick={moveLeft}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={moveRight}>
              <ChevronRightIcon/>
            </IconButton> 
          </div>
        </div>   
        <div
          id={`all_timeline`}
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

export default LawFirmTimeline