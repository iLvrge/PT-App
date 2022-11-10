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
  transactionRowClick
} from '../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../api/patenTrack2'
import { convertTabIdToAssetType, assetsTypesWithKey } from '../../../../utils/assetTypes'
import { numberWithCommas, capitalize, capitalAllWords, applicationFormat} from '../../../../utils/numbers'



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
  cluster: {
    titleTemplate: 'Cluster containing {count} events.\nZoom in to see the individual events.',
    showStipes: false,
    clusterCriteria: (firstItem, secondItem) => {
      return (  (typeof  firstItem.rawData.type == 'undefined' && typeof  secondItem.rawData.type == 'undefined'  && firstItem.rawData.law_firm_id === secondItem.rawData.law_firm_id)  || (typeof  firstItem.rawData.type !== 'undefined' && typeof  secondItem.rawData.type !== 'undefined'  && firstItem.rawData.lawfirm === secondItem.rawData.lawfirm ) || ( firstItem.rawData.repID > 0 && secondItem.rawData.repID > 0 && firstItem.rawData.repID == secondItem.rawData.repID))
    }
  }, 
  template: function(item, element, data) {
    if (data.isCluster) {
      return `<span class="cluster-header">${data.items[0].rawData.lawfirm}(${data.items.length})</span>`
    } else { 
      return `<span class="lawfirm">${data.customerName}</span>`
    }
  },
}



const TIME_INTERVAL = 1000
var tootlTip = ''
const LawFirmTimeline = ({ data, assignmentBar, assignmentBarToggle, type, timelineData, updateTimelineRawData }) => {
  
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
    const assetType = Number.isInteger(assetsCustomer.tab_id) ? convertTabIdToAssetType(assetsCustomer.tab_id) : 'default'
    const companyName =  selectedWithName.filter( company => assetsCustomer.company == company.id ? company.name : '')
    const customerFirstName =  assetsCustomer.lawfirm
    const item = {
      type: 'point',
      start: new Date(assetsCustomer.exec_dt),
      customerName: `${customerFirstName}`,
      assetType,
      companyName,
      rawData: assetsCustomer,
      className: `lawfirm ${typeof assetsCustomer.type !== 'undefined' ? 'filled' : ''}`,
      collection: [ { id: assetsCustomer.id, totalAssets: assetsCustomer.totalAssets } ],
      showTooltips: false
    }

    if([5,12].includes(parseInt(assetsCustomer.tab_id))){            
      item.type = 'range';
      item['end'] = assetsCustomer.release_exec_dt != null ? new Date(assetsCustomer.release_exec_dt) : new Date();
      
      const securityPDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.reel_no}-${assetsCustomer.frame_no}.pdf`
      item['security_pdf'] = securityPDF
      let name = `<tt><img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></tt>${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`;
      if(assetsCustomer.release_exec_dt != null ) {
          const releasePDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.release_reel_no}-${assetsCustomer.release_frame_no}.pdf`
          item['release_pdf'] = releasePDF
          name += `<em>${assetsCustomer.partial_transaction == 1 ? `<span>(${numberWithCommas(assetsCustomer.releaseAssets)})</span>` : ''}<img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></em>`
      }
      item['customerName'] = name
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
          .cancelTimelineItem()
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
              const tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${getPosition.y + 5}px;left:${getPosition.x }px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'>
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

  const onSelect = useCallback((properties) => {
    resetTooltipContainer()
    if (properties.items.length === 0) {
      setSelectedItem()
    } else {
      const item = items.current.get(properties.items[0])
      setSelectedAsset({ type: 'transaction', id: item.rawData.id })
      setSelectedItem(item)
      dispatch(transactionRowClick(item.rawData.id, slack_channel_list, false, search_string))
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
    PatenTrackApi.cancelTimelineItem()
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
      PatenTrackApi.cancelTimelineActivity()
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
                //setIsLoadingTimelineData(true)
                const { data } = await PatenTrackApi.getActivitiesTimelineData(companies, tabs, customers, rfIDs, selectedCategory, (assetTypeInventors.length > 0 || tabs.includes(10)) ? true : undefined)
                const mainList = data.list
                //setIsLoadingTimelineData(false)
                setTimelineRawData(mainList)
                if(typeof updateTimelineRawData !== 'undefined') {
                  updateTimelineRawData(mainList)
                }

                if(selectedCategory == 'top_law_firms') {
                  /**
                   * Filling Assets
                   */
                  const { data } = await PatenTrackApi.getFilledAssetsTimelineData(companies, tabs, customers, rfIDs, selectedCategory, (assetTypeInventors.length > 0 || tabs.includes(10)) ? true : undefined)

                  if( data != null && data.length > 0 ) { 
                    const oldItems = [...mainList, ...data] 
                    setTimelineRawData(oldItems)
                    if(typeof updateTimelineRawData !== 'undefined') {
                      updateTimelineRawData(oldItems) 
                    }
                  }
                }
              } else if( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null ) {
                //setIsLoadingTimelineData(true)
                const { data } = await PatenTrackApi.getShareTimelineList(location.pathname.replace('/', ''))
                setTimelineRawData(data.list)     
                if(typeof updateTimelineRawData !== 'undefined') {
                  updateTimelineRawData(data.list)
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
          PatenTrackApi.cancelForeignAssetTimeline()
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
    /* timelineRef.current.on('select', onSelect) */
    timelineRef.current.on('itemover', onItemover)
    timelineRef.current.on('itemout', onItemout) 
    timelineRef.current.on('rangechanged', onRangeChanged)
    timelineRef.current.on('rangechange', onRangeChange)    
    return () => {
      /* timelineRef.current.off('select', onSelect) */
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
 
  /**
   * return component 
   */    

  return (
      <Paper className={classes.root}>        
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