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

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ClickAwayListener from '@mui/base'
import themeMode from '../../../../themes/themeMode';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import { 
  setAssetTypeAssignmentAllAssets,
  setAssetTypesAssignmentsAllAssetsLoading,
  setSelectAssignments,
  setTimelineData,
  setTimelineRequest,
  transactionRowClick
} from '../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../api/patenTrack2'
import { convertTabIdToAssetType, assetsTypesWithKey } from '../../../../utils/assetTypes'
import { numberWithCommas, applicationFormat, capitalize } from '../../../../utils/numbers'
import { timelineOptions, timelineWithoutClusterOptions } from '../../../../utils/options'
 

import useStyles from './styles'
import { setTimelineSelectedItem, setTimelineSelectedAsset } from '../../../../actions/uiActions'
import clsx from 'clsx';
import { IconButton } from '@mui/material';
import { updateHashLocation } from '../../../../utils/hashLocation';
 

/**
 * 
 * @param {*} assetsCustomer 
 * item data to dsplay for the timeline and for the tooltip
 */

const dateDifference = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1))
  return numberWithCommas(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}


const TIME_INTERVAL = 1000
var tootlTip = ''
const TimelineContainer = ({ data, assignmentBar, assignmentBarToggle, type, timelineData, updateTimelineRawData }) => {
  
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
  const [options, setTimelineOptions] = useState({
    ...timelineOptions,
    template: function(item, element, data) {
      if (data.isCluster) {
        return `<span class="cluster-header">${data.items[0].clusterHeading} (${data.items.length})</span>`
      } else { 
        if(data.category == 'late_recording' && ![5,12].includes(parseInt(data.rawData.tab_id))) {  
          return `<span class="${data.assetType} ${data.rawData.tab_id}"><span class="name">Assignor: ${data.customerName}</span><span class="recordby">Recorded by: ${data.recorded_by}</span><span class="recordby">Days from Execution to Recording: ${dateDifference(data.rawData.exec_dt, data.rawData.record_dt)} </span></span>`
        } else { 
          return `<span class="${data.assetType} ${data.rawData.tab_id}">${data.customerName}</span>`
        }
      }
    },
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
  const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)
  const setSelectedItem = useCallback((item) => {
    dispatch(setTimelineSelectedItem(item))
  }, [ dispatch ])

  const setSelectedAsset = useCallback((asset) => {
    dispatch(setTimelineSelectedAsset(asset))
  }, [ dispatch ])

  

  const [ timelineRemoveRelease, setTimelineRemoveRelease ] = useState(false)
  const [ timelineRawData, setTimelineRawData ] = useState([]) 
  const [ timelineItems, setTimelineItems ] = useState([])
  const [ timelineGroups, setTimelineRawGroups] = useState([])
  const [ tooltipItem, setToolTipItem] = useState([])
  const [ timeInterval, setTimeInterval] = useState(null)

  const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
  const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(false)
  const search_string = useSelector(state => state.patenTrack2.search_string)
  const search_rf_id = useSelector(state => state.patenTrack2.search_rf_id)
  const timelineRequest = useSelector(state => state.patenTrack2.timeline_request)
  const timelineRequestData = useSelector(state => state.patenTrack2.timeline_data)


  //Item for the timeline

  const convertDataToItem = (assetsCustomer) => {
    const assetType = Number.isInteger(assetsCustomer.tab_id) ? convertTabIdToAssetType(assetsCustomer.tab_id) : 'default'
    const companyName =  selectedWithName.filter( company => assetsCustomer.company == company.id ? company.name : '')
    const customerFirstName = assetsCustomer.tab_id == 10 ? assetsCustomer.customerName.split(' ')[0] : assetsCustomer.customerName
    const item = {
      type: 'point', 
      start: new Date(assetsCustomer.exec_dt),
      customerName: selectedCategory == 'proliferate_inventors' ? assetsCustomer.customerName : `${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`,
      assetType,
      clusterHeading:  assetsCustomer.customerName ,
      companyName,
      rawData: assetsCustomer,
      category: selectedCategory,
      className: `asset-type-${assetType} ${selectedCategory == 'late_recording' ? 'recordings' : ''} ${assetsCustomer.release_exec_dt != null && assetsCustomer.release_exec_dt != '' ? assetsCustomer.partial_transaction == 1 ? 'asset-type-security-release-partial' : 'asset-type-security-release' : ''}`,
      collection: [ { id: assetsCustomer.id, totalAssets: assetsCustomer.totalAssets } ],
      showTooltips: false
    }

    if([5,12].includes(parseInt(assetsCustomer.tab_id)) ||  selectedCategory == 'late_recording') {            
      item.type = 'range';
      item['end'] = selectedCategory == 'late_recording' ? assetsCustomer.record_dt != null && assetsCustomer.record_dt != '' ? assetsCustomer.record_dt : new Date() : assetsCustomer.release_exec_dt != null && assetsCustomer.release_exec_dt != ''? new Date(assetsCustomer.release_exec_dt) : new Date()
      if([5,12].includes(parseInt(assetsCustomer.tab_id))) {
        const securityPDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.reel_no}-${assetsCustomer.frame_no}.pdf`
        item['security_pdf'] = securityPDF
        /* let name = `<tt><img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></tt>${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`;
        if(assetsCustomer.release_exec_dt != null ) {
            const releasePDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.release_reel_no}-${assetsCustomer.release_frame_no}.pdf`
            item['release_pdf'] = releasePDF
            name += `<em>${assetsCustomer.partial_transaction == 1 ? `<span>(${numberWithCommas(assetsCustomer.releaseAssets)})</span>` : ''}<img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></em>`
        } */
        let name = `${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`
        item['customerName'] = name
      } else {
        item['recorded_by'] = assetsCustomer.recorded_by
        item['customerName'] = assetsCustomer.assignors.split(',')[0]
        item['clusterHeading'] = assetsCustomer.assignors
      }
      
    }
    return item
  }

  

  // Custom ToolTip 
  
  const showTooltip = (item, event) => {    
      setTimeout(() => {
        if(tootlTip === item.id) {
          if(selectedCategory == 'proliferate_inventors') {
            const checkFullScreen = document.getElementsByClassName('fullscreenModal'); 
            const element = checkFullScreen.length > 0 ? checkFullScreen[0].querySelector(`#all_timeline`) : document.getElementById(`all_timeline`);    
            const getPosition = element != null ? element.getBoundingClientRect() : {y: 0, x: 0};  
            const tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid #fff;top:${ getPosition.y }px;left:${ getPosition.x }px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'>
                                        <h4 style='text-align:left; margin:0;'>US${item.patent != '' ? numberWithCommas(item.patent) : applicationFormat(item.application)}</h4>
                                        <div>
                                          ${item.exec_dt != '' ? moment(item.exec_dt).format('ll') : ''}
                                        </div>
                                        <div>
                                          <h4>Inventors:</h4>
                                          ${item.all_inventors}
                                        </div> 
                                      </div>` 
              resetTooltipContainer() 
            if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
              document.body.insertAdjacentHTML('beforeend',tootltipTemplate) 
            } 
          } else {
            PatenTrackApi
            .cancelTimelineItemRequest()
            PatenTrackApi
            .getTimelineItemData(item.id)
            .then( response => {
              const { data } = response
              if( data != null && ( data.assignor.length > 0 || data.assignee.length > 0 ) && tootlTip === data.assignment.rf_id) {
                const executionDate = data.assignor.length > 0 ? data.assignor[0].exec_dt : ''
                const recordedDate = typeof data.assignment != 'undefined' ? data.assignment.record_dt  : ''
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
                    color = isDarkTheme ? themeMode.dark.palette.secondary.main : themeMode.light.palette.secondary.main
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
                    color = isDarkTheme ? themeMode.dark.palette.secondary.main : themeMode.light.palette.secondary.main
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
                const checkFullScreen = document.getElementsByClassName('fullscreenModal'); 
                const element = checkFullScreen.length > 0 ? checkFullScreen[0].querySelector(`#all_timeline`) : document.getElementById(`all_timeline`);   
                const getPosition = element.getBoundingClientRect();  
                let tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${ getPosition.y }px;left:${ getPosition.x }px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'>
                                            <h4 style='color:${color};text-align:left;margin:0'>${transactionType}</h4>
                                            <div>
                                              Exected: ${ executionDate != '' ? moment(executionDate).format('ll') : ''}
                                            </div> `
                if(selectedCategory == 'late_recording' ){
                  tootltipTemplate += `<div>Recorded: ${ recordedDate != '' ? moment(recordedDate).format('ll') : ''}
                  </div> <div>Lapsed: ${dateDifference(executionDate, recordedDate)} days</div>`
                }                       
                tootltipTemplate += `<div>
                                            <h4>${selectedCategory == 'collaterlized' ? 'Borrower' : 'Assignors'}:</h4>
                                              ${data.assignor.map(or => ( 
                                                '<div>'+or.original_name+'</div>'
                                              )).join('')}
                                            </div>
                                            <div>
                                              <h4>${selectedCategory == 'collaterlized' ? 'Lender' : 'Assignees'}:</h4>
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
          
        }                
      }, TIME_INTERVAL) 
  } 

  /**
   * When select an item from timeline
   */

  const onSelect = useCallback((properties) => {
    resetTooltipContainer()
    if (properties.items.length === 0) {
      setSelectedItem()
      history.push({
        hash: updateHashLocation(location, "assignments", []).join(
            "&",
        ),
      });
    } else {
      const item = items.current.get(properties.items[0])
      setSelectedAsset({ type: 'transaction', id: item.rawData.id })
      setSelectedItem(item) 
      history.push({
        hash: updateHashLocation(location, "assignments", [item.rawData.id]).join(
            "&",
        ),
      }); 
      if(['collaterlized', 'deflated_collaterals'].includes(selectedCategory)) {
        dispatch(setAssetTypesAssignmentsAllAssetsLoading( false ) )
        dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false)) 
      }
      dispatch(transactionRowClick(item.rawData.id, slack_channel_list, true, search_string))
      
      /* if(assignmentBar === false) {
        assignmentBarToggle()  
      } */
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

  const onRangeChange = useCallback((properties) => {
    
  }, [ timelineItems ])


  /**
   * this call when Timeline rangechanged
   */

  const onRangeChanged = useCallback( async(properties) => {
    items.current = new DataSet()
    items.current.add(timelineItems)
    timelineRef.current.setItems(items.current) 
    if(properties.byUser === true) {  
      let filter =  timelineItems.filter(row => new Date(row.start) < new Date(properties.start) )
      if(filter.length == 0) {
        filter =  timelineItems.filter(row => new Date(row.start) > new Date(properties.end) && new Date(properties.end) <= new Date() )
      }
      if(filter.length == 0 && timelineItems.length > 499) {
        await getTimelineRawData(moment(properties.start).format('YYYY-MM-DD'), moment(properties.end).format('YYYY-MM-DD'))  
      } 
    }
  }, [ timelineItems ])


  const getTimelineRawData = async(start, end) => { 
    let entered = true;
    if(['acquisition_transactions', 'divestitures_transactions', 'licensing_transactions', 'collateralization_transactions', 'inventing_transactions', 'litigation_transactions'].includes(selectedCategory) && assetTypesSelected.length == 0) {
      entered = false;
    }
    if(entered === true) {
      dispatch(setTimelineRequest(true))
      setIsLoadingTimelineData(true) 
      const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                customers = assetTypesCompaniesSelectAll === true ? [] :  assetTypesCompaniesSelected,
                rfIDs = selectedAssetAssignments.length > 0 ? selectedAssetAssignments : [];  
      const { data } = await PatenTrackApi.getActivitiesTimelineData(companies, tabs, customers, rfIDs, selectedCategory, (assetTypeInventors.length > 0 || tabs.includes(10)) ? true : undefined, start, end) 
      setIsLoadingTimelineData(false)
      let list = removeSecurityRelease(data.list)
        dispatch(setTimelineData(list)) //items
        if(typeof updateTimelineRawData !== 'undefined') {
          updateTimelineRawData(list)
        }
    }
  }

  const removeSecurityRelease = (releaseData) => {
    let removeRelease = []
    let list = [...releaseData]
    list.forEach( item => {
      if(parseInt(item.release_rf_id) > 0) {
        removeRelease.push(item.release_rf_id);
        const getOtherRelease = item.all_release_ids
        if(getOtherRelease != '') {
          const parseRelease = JSON.parse(getOtherRelease)
          if(parseRelease.length > 0 ) {
            parseRelease.forEach(row => removeRelease.push(Number(row.rf_id)))
          }
        }
      } 
    })
    if(removeRelease.length > 0) {
      removeRelease = [...new Set(removeRelease)];
      
      removeRelease.forEach( remove => {
        const findIndex = list.findIndex( item => item.id == remove)
        if(findIndex !== -1) {
          list.splice(findIndex, 1)
        }
      })  
    }
    return list;
  }

  useEffect(() => {
    if (!selectedItem && timelineRef.current) {
      timelineRef.current.setSelection([])
    }
  }, [ selectedItem, timelineRef ])

  useEffect(() => {
    timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
  }, [])

  useEffect(() => {
    setTimelineRawData(timelineRequestData)
  }, [timelineRequestData])

  //Timeline list from server
  useEffect(() => {
    let isSubscribed = true;  
    if((typeof timelineData !== 'undefined' &&  timelineData.length > 0 ) || timelineRequestData.length > 0) {
      setTimelineRawData(typeof timelineData !== 'undefined' &&  timelineData.length > 0 ? timelineData : timelineRequestData)
    } else {
      /**
           * return empty if no company selected
           */
      
      //redrawTimeline()
      //PatenTrackApi.cancelTimelineRequest()
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
              setTimelineRawGroups([]) //groups
              setTimelineRawData([]) //items
              const { data } = await PatenTrackApi.getActivitiesTimelineData([], [], [], search_rf_id) // empty array for company, tabs, customers
              //setIsLoadingTimelineData(false)
              //setTimelineRawGroups(data.groups) //groups
              let list = removeSecurityRelease(data.list)
              setTimelineRawData(list) //items
              if(typeof updateTimelineRawData !== 'undefined') {
                updateTimelineRawData(list)
              }
            }       
          } else { 
            if(type !== 9)  {
              if( ['PRO', 'KPI', 'STANDARD'].includes(process.env.REACT_APP_ENVIROMENT_MODE) && (selectedCompaniesAll === true || selectedCompanies.length > 0)) {
                //setIsLoadingTimelineData(true) 
                if(timelineRequest === false) { 
                  dispatch(setTimelineData([])) //items
                  setTimelineRawGroups([]) //groups
                  setTimelineRawData([]) //items
                  redrawTimeline()
                  getTimelineRawData();
                } 
                //setIsLoadingTimelineData(false)
                
              } else if( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null ) {
                //setIsLoadingTimelineData(true)
                setTimelineRawGroups([]) //groups
                setTimelineRawData([]) //items
                const { data } = await PatenTrackApi.getShareTimelineList(location.pathname.replace('/', ''))
                let list = removeSecurityRelease(data.list)
                setTimelineRawData(list) //items
                if(typeof updateTimelineRawData !== 'undefined') {
                  updateTimelineRawData(list)
                }      
                //setIsLoadingTimelineData(false)            
              }
            }
          } 
        }
      }
      getTimelineRawDataFunction()
    }
    return () => (isSubscribed = false)
    
  }, [ selectedCompanies, selectedCompaniesAll, selectedAssetsPatents, selectedAssetAssignments, assetTypesSelectAll, assetTypesSelected, assetTypesCompaniesSelectAll, assetTypesCompaniesSelected, search_string, assetTypeInventors, auth_token, switch_button_assets, selectedCategory, timelineRequest, timelineRequestData ])
 

  useEffect(() => {
    if(typeof timelineData !== 'undefined' && timelineData.length > 0) {
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
          let list = removeSecurityRelease(data.list)
          setTimelineRawData(list) //items
          if(typeof updateTimelineRawData !== 'undefined') {
            updateTimelineRawData(list)
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
    let constantOptions = {...options}
    if(['late_recording', 'incorrect_recording', 'collaterlized', 'deflated_collaterals', 'top_lenders'].includes(selectedCategory)){ 
      constantOptions = {...timelineWithoutClusterOptions}
    } 
    timelineRef.current.setOptions(constantOptions) 
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
        let endDate = typeof c.end != 'undefined' && c.end != null ? new Date(c.end) : newDate 
        if(index === 0) {
          end = endDate
        }
        if(newDate.getTime() < start.getTime()) {
          start = newDate
        }
        if(endDate.getTime() > end.getTime()) {
          end = endDate
        }
        return c
      })
      Promise.all(promise) 
      if(convertedItems.length > 100) {
        start = new Date(convertedItems[99].start)
      } else {
        start = new moment(start).subtract(3, 'year') 
      }  
      if(convertedItems.length > 0 && (selectedCategory != 'late_recording' && selectedCategory != 'incorrect_recording' && selectedCategory != 'top_lenders' /* && selectedCategory != 'collaterlized' */)) { 
        end = new moment(end).add(1, 'year')
      } else {
        end = new moment(end).add(3, 'year')
      }
      /* const startIndex = convertedItems.length < 201 ? (convertedItems.length - 1) : 199
      items.current.add(convertedItems.slice(0, startIndex))  */   
      
    }    
    const checkFullScreen = document.getElementsByClassName('fullscreenModal'); 
    
    if(checkFullScreen.length > 0) { 
      timelineRef.current.destroy()
      timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
      setTimeout(() => {
        drawTimeline(start, end, convertedItems)  
      }, 1)
    } else { 
      if(timelineRawData.length > 0 || previousLoad === false) {   
        items.current.add(convertedItems.slice(0, convertedItems.length > 50 ? 49 : convertedItems.length - 1))  
        let constantOptions = {...options}
        if(['late_recording', 'incorrect_recording'].includes(selectedCategory)){ 
          constantOptions = {...timelineWithoutClusterOptions}
        } 
        timelineRef.current.setOptions({ 
          ...constantOptions, 
          start, 
          end,
          min: new Date('1999-01-01'), 
          max: new moment().add(!['late_recording', 'incorrect_recording', 'top_lenders', 'collaterlized'].includes(selectedCategory) ? 2 : 4, 'year')
        })  
        timelineRef.current.setItems(items.current)   
        setPreviousLoad(true) 
      }
    }
    
    //checkCurrentDateStatus()
  }, [ timelineRawData ])

  const drawTimeline = (start, end, convertedItems) => {  
    items.current.add(convertedItems.slice(0, convertedItems.length > 50 ? 49 : convertedItems.length - 1)) 
    let constantOptions = {...options}
    if(['late_recording', 'incorrect_recording'].includes(selectedCategory)){ 
      constantOptions = {...timelineWithoutClusterOptions}
    } 
    timelineRef.current.setOptions({ 
      ...constantOptions, 
      start, 
      end,
      min: new Date('1999-01-01'), 
      max: new moment().add(!['late_recording', 'incorrect_recording', 'top_lenders', 'collaterlized'].includes(selectedCategory) ? 2 : 4, 'year')
    })  
    timelineRef.current.setItems(items.current)   
    setPreviousLoad(true) 
  }

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
          <div className="menu">
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

export default TimelineContainer