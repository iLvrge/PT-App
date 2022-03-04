import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useLocation} from 'react-router-dom'
import Paper from '@mui/material/Paper'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@mui/material/CircularProgress'
import moment from 'moment'
import PatenTrackApi from '../../../../api/patenTrack2'
import { getCustomerAssets, getCustomerSelectedAssets } from '../../../../actions/patentTrackActions2'
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


const Acknowledgements = () => {
    const classes = useStyles()
    const timelineRef = useRef()
    const timelineContainerRef = useRef()
    const dispatch = useDispatch()
    const location = useLocation()
    const items = useRef(new DataSet())
    const [ display, setDisplay] = useState('block')
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
    const [ tooltipItem, setToolTipItem] = useState([])
    const [ timeInterval, setTimeInterval] = useState(null)  

    const selectedCategory = useSelector( state => state.patenTrack2.selectedCategory )
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll )
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const assetsTotal = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.total_records) //Assets records
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const maintainenceAssetsTotal = useSelector(state => state.patenTrack2.maintainenceAssetsList.total_records) //Assets records
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected )
    const assetTypesSelectAll = useSelector( state => state.patenTrack2.assetTypes.selectAll )
    const selectedAssetCompanies = useSelector( state => state.patenTrack2.assetTypeCompanies.selected )
    const selectedAssetCompaniesAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const connectionBoxView = useSelector( state => state.patenTrack.connectionBoxView)
    const display_sales_assets = useSelector( state => state.patenTrack2.display_sales_assets)


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
                const tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${event.clientY}px;left:${event.clientX + 20 }px;'>
                                            <h4 style='color:${color};text-align:left;margin:0'>${numberWithCommas(item.number)}</h4>
                                            <div>
                                                <h4>Grant Date: </h4>${moment(new Date(item.start)).format(DATE_FORMAT)}
                                            </div>
                                            <div>
                                                <h4>Assignees:</h4>
                                                <div>${item.all_assignee}</div>
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
        const getAcknowledgementData = async() => {
            setIsLoadingTimelineRawData(true)
            PatenTrackApi.cancelAllAssetsCitationData()   
            if ((process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && selectedCompanies.length === 0) || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token === null)){
                setIsLoadingTimelineRawData(false)
                setTimelineRawData([])
                return null
            }  
            const list = [];
            let totalRecords = 0;
            if( (assetsList.length > 0 && assetsSelected.length > 0 && assetsList.length != assetsSelected.length ) || ( maintainenceAssetsList.length > 0 &&  selectedMaintainencePatents.length > 0 && selectedMaintainencePatents.length != maintainenceAssetsList.length ) ) {  
                if( assetsSelected.length > 0 ) {
                    const promise = assetsSelected.map(asset => {
                        const findIndex = assetsList.findIndex( row => row.appno_doc_num.toString() == asset.toString() || row.grant_doc_num != null && row.grant_doc_num.toString() == asset.toString() )
                        if( findIndex !== -1 ) {
                            if( assetsList[findIndex].appno_doc_num != '' ) {
                                list.push(assetsList[findIndex].appno_doc_num.toString())
                            }
                        }
                    })
                    await Promise.all(promise)
                    totalRecords = list.length
                } else {
                    const promise = selectedMaintainencePatents.map(asset => {
                        const findIndex = maintainenceAssetsList.findIndex( row => row.appno_doc_num.toString() == asset[1].toString() || row.grant_doc_num != null && row.grant_doc_num.toString() == asset[0].toString() )
                        if( findIndex !== -1 ) {
                            if( maintainenceAssetsList[findIndex].appno_doc_num != '' ) {
                                list.push(maintainenceAssetsList[findIndex].appno_doc_num.toString())
                            }
                        }
                    })
                    await Promise.all(promise)
                    totalRecords = list.length
                }                
            } else {
                if( assetsList.length > 0 || maintainenceAssetsList.length > 0 ) {
                    if( assetsList.length > 0 ) {
                        const promise = assetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
                        totalRecords = assetsTotal
                    } else if ( maintainenceAssetsList.length > 0 ) {
                        const promise = maintainenceAssetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
                        totalRecords = maintainenceAssetsTotal
                    }
                } else {
                    /**
                     * Check which layout and get the assets list first and then 
                     */
                    if( selectedCategory == '' ) { //pay_maintenece_fee

                    } else {
                        const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                        tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                        customers =
                          selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies,
                        assignments =
                          selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;  

                        if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
                             if( auth_token != null ) {
                                dispatch(
                                    process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ? 
                                    getCustomerAssets(
                                      selectedCategory == '' ? '' : selectedCategory,
                                      companies,
                                      tabs,
                                      customers,
                                      assignments,
                                      false,
                                      0,
                                      0,
                                      'asset',
                                      'DESC'
                                    )
                                    : 
                                    getCustomerSelectedAssets(location.pathname.replace('/', ''))
                                );
                            } 
                        } else {
                            dispatch(
                                getCustomerAssets(
                                  selectedCategory == '' ? '' : selectedCategory,
                                  companies,
                                  tabs,
                                  customers,
                                  assignments,
                                  false,
                                  0,
                                  0, 
                                  'asset',
                                  'DESC',
                                  -1, 
                                  display_sales_assets
                                ),
                            );
                        }
                    }
                }                
            }
            if( list.length > 0 ) {
                const form = new FormData()
                form.append("list", JSON.stringify(list)) 
                form.append("total", totalRecords)
                form.append('selectedCompanies', JSON.stringify(selectedCompanies))
                form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
                form.append('customers', JSON.stringify(selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies))
                form.append('assignments', JSON.stringify(selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments))
                form.append('type', selectedCategory)
                form.append('other_mode', display_sales_assets)
                const { data } = await PatenTrackApi.getAllAssetsCitationData(form)
                setIsLoadingTimelineRawData(false)
                if(data !== null ) {
                    setTimelineRawData(data)
                }
            }            
        }
        getAcknowledgementData()
    }, [selectedCategory,  selectedCompanies, assetsList, maintainenceAssetsList, selectedMaintainencePatents, assetsSelected, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, selectedCompaniesAll, assetTypesSelectAll, selectedAssetCompaniesAll, selectedAssetAssignmentsAll, auth_token, display_sales_assets])


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
        <Paper className={classes.root}>   
            <div className={classes.root}>
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
            </div>
        </Paper>
    )
}

export default Acknowledgements;