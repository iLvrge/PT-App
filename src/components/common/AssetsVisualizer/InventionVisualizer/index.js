import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useLocation} from 'react-router-dom'
import { Paper, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, ListItemIcon, Menu, Divider, Button  } from '@mui/material'
import Draggable from "react-draggable"
import CloseIcon from '@mui/icons-material/Close'
import {ResizableBox} from "react-resizable"
import { DataSet } from 'vis-data/esnext'
import { Graph3d } from 'vis-graph3d/esnext'

import FilterListIcon from '@mui/icons-material/FilterList'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import FilterCPC from './FilterCPC'
import AssetsList from './AssetsList'
import PdfViewer from '../../PdfViewer'
import FullScreen from '../../FullScreen'
import Loader from '../../Loader'
import {
    setAssetTypeAssignmentAllAssets,
    setMaintainenceAssetsList,
    getCustomerAssets,
    setAssetsIllustrationData,
    getCustomerSelectedAssets,
    retrievePDFFromServer,
    setIsSalesAssetsDisplay,
    setCPCRequest,
    setCPCData,
    setCPCSecondData,
    setSocialMediaConnectPopup
} from '../../../../actions/patentTrackActions2'
import { setPDFFile, setPdfTabIndex } from '../../../../actions/patenTrackActions' 
import PatenTrackApi from '../../../../api/patenTrack2'
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../../api/patenTrack2";
import useStyles from './styles'

import { capitalize } from "../../../../utils/numbers";
import themeMode from '../../../../themes/themeMode';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import { Close } from '@mui/icons-material'
import FilterDashboardCPC from './FilterDashboardCPC'
import TitleBar from '../../TitleBar'
import clsx from 'clsx'
import { setFamilyActiveTab } from '../../../../actions/uiActions'
import AssetsTable from '../../AssetsTable'
import LabelWithIcon from '../../LabelWithIcon'
import { Box } from '@mui/system'
import Fees from '../LegalEventsContainer/Fees'
import { getTokenStorage } from '../../../../utils/tokenStorage'

var newRange = [1,2]

const InventionVisualizer = ({ defaultSize, visualizerBarSize, analyticsBar, openCustomerBar, commentBar, illustrationBar, customerBarSize, companyBarSize, standalone, tab, type, gRawData, gRawGroupData, sData, fYear, vYear, vScope, sRange, fList, fTotal, titleBar, middle, openChartBar, handleChartBarOpen, salable, licensable, onSelect, top, side, pad }) => {
    
    const classes = useStyles()
    const dispatch = useDispatch()
    const graphRef = useRef()
    const settingRef = useRef()
    const location = useLocation()
    const graphContainerRef = useRef()  
    const items = useRef(new DataSet())
    const dashboardScope = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const [offsetWithLimit, setOffsetWithLimit] = useState([0, DEFAULT_CUSTOMERS_LIMIT])
    const [ isLoadingCharts, setIsLoadingCharts ] = useState(false)
    const [ openModal, setModalOpen ] = useState(false)
    const [ assetLoading, setAssetsLoading ] = useState(false)
    const [ openFilter, setOpenFilter ] = useState(false)       
    const [ showContainer, setShowContainer ] = useState(true)
    const [ sendAssetRequest, setSentAssetRequest ] = useState(false)
    const [ anchorEl, setAnchorEl ] = useState(null)
    const [ sliderValue, setSliderValue ] = useState(50)
    const [ abandonedTimeline, setAbandonedTimeline ] = useState([])
    const [ assets, setAssets ] = useState([])
    const [ filterList, setFilterList ] = useState([])
    const [ filterTotal, setFilterTotal ] = useState(0)
    const [ filterYear, setFilterYear ] = useState([])
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ resizableWidthHeight, setResizableWidthHeight ] = useState([665, 350])
    const [ filterDrag, setFilterDrag ] =  useState([0, 0])
    const [ valueYear, setValueYear ] = useState([1, 2])
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
    const [ xy, setXY] = useState({x: dashboardScreen === true ? '0px' : '-85px', y: '35px'})
    const [ valueScope, setValueScope ] = useState(dashboardScreen === true ? [...dashboardScope] : [1, 2])
    const [ valueScopeLabel, setValueScopeLabel ] = useState([])
    const [ valueRange, setValueRange ] = useState(3)/**dashboardScreen === true ? 4 : 3 */
    const [ preValueRange, setPreValueRange ] = useState(3)
    const [ scopeRange, setScopeRange ] = useState([])
    const [ depthRange, setDepthRange ] = useState([
        {
            value: 1,
            label: 'Sub Group',
        },
        { 
            value: 2,
            label: 'Main Group',
        },
        {
            value: 3,
            label: 'Sub Class',
        },
        {
            value: 4,
            label: 'Class',
        },
        {
          value: 5,
          label: 'Section',
        }
    ])

    
    const [ inventionTabs, setInventionTabs ] = useState(['Innovation'])
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected ) //companies
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const assetsTotal = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.total_records) //Assets records
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const maintainenceAssetsTotal = useSelector(state => state.patenTrack2.maintainenceAssetsList.total_records) //Assets records
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected )
    const assetTypesSelectAll = useSelector( state => state.patenTrack2.assetTypes.selectAll )
    const selectedAssetCompanies = useSelector( state => state.patenTrack2.assetTypeCompanies.selected )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const assetIllustration = useSelector( state => state.patenTrack2.assetIllustration )
    const assetIllustrationData = useSelector( state => state.patenTrack2.assetIllustrationData )
    const selectedLawFirm = useSelector(state => state.patenTrack2.selectedLawFirm)
    const selectedRow = useSelector( state => state.patenTrack2.selectedAssetsTransactions )
    const connectionBoxView = useSelector( state => state.patenTrack.connectionBoxView)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets) 
    const cpc_request = useSelector(state => state.patenTrack2.cpc_request) 
    const cpcData = useSelector(state => state.patenTrack2.cpcData) 
    const cpcSecondData = useSelector(state => state.patenTrack2.cpcSecondData) 
    const [ graphRawData, setGraphRawData ] = useState([])
    const [ salesData, setSalesData ] = useState([])
    const [ graphRawGroupData, setGraphRawGroupData ] = useState([])  
    let interval;
    const menuItems = [
        {
            id: 1,
            label: 'Invention Data',
            component: InventionVisualizer,
            tab,
            type,
            standalone: true,
            defaultSize, 
            visualizerBarSize, 
            analyticsBar, 
            openCustomerBar, 
            commentBar, 
            illustrationBar, 
            customerBarSize, 
            companyBarSize,
            titleBar,
            middle,
            salable, 
            licensable,
            gRawData: graphRawData, 
            gRawGroupData: graphRawGroupData, 
            sData: salesData, 
            fYear: filterYear,
            vYear: valueYear, 
            vScope: valueScope, 
            sRange: scopeRange,
            fList: filterList,
            fTotal: filterTotal,
        }
    ]

    let options = {
        height: '100%',
        width: '100%',
        style: 'bar-color',
        axisFontSize: 22,
        cameraPosition: {
            distance: 1.9,
            horizontal: 0.69,
            vertical: 0.2
        }, 
        xStep: 1,
        yStep: 1,
        zStep: 3,
        /* rotateAxisLabels: false, */
        yCenter: '35.5%',
        xCenter: '55%',
        axisColor: '#ffffff',
        gridColor: '#e5e5e51c',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: false,
        verticalRatio: 0.4,
        xLabel: 'Filling',
        yLabel: 'Technologies',
        zLabel: 'Assets',
        animationAutoStart: true,
        tooltip: function (point) {
            // parameter point contains properties x, y, z, and data
            // data is the original object passed to the point constructor
            const findIndex = graphRawGroupData.findIndex( row => row.id == point.y )
            let code = '', defination = '', origin = point.data.origin
            if(findIndex !== -1) {
                code = graphRawGroupData[findIndex].cpc_code
                defination = graphRawGroupData[findIndex].defination
            }
            if( origin != null ) {
                origin = origin.split('@@')
                origin = Array.from(new Set(origin)).join('<br/>')  
            }

            return `<div class="graphTooltip"><table class="tooltip_data"><tr><th>Filling Year:</th><td>${point.x}</td></tr>${point.data.patent > 0 ? '<tr><th>Patents:</th><td>'+ point.data.patent +'</td></tr>' : ''}${point.data.application_number > 0 ? '<tr><th>Applications:</th><td>'+ point.data.application_number +'</td></tr>' : ''}<tr><th>Origin:</th><td>${origin != null ? origin : ''}</td></tr><tr><th>Subject Matter:</th><td class='noWrapText'>${capitalize(defination)}</td></tr></table></div>`
        },
        yValueLabel: function(value) {
            const findIndex = graphRawGroupData.findIndex( row => row.id == value)
            if( findIndex !== -1 ) {
                return graphRawGroupData[findIndex].cpc_code
            }  
            return value;
        },
        xValueLabel: function(value) {
            return parseInt(value)
        },
        zValueLabel: function(value) {
            return parseInt(value)
        },
        tooltipStyle: {
            content: {
              padding       : '10px',
              border        : '0px',
              borderRadius  : '0px',
              color         : '#fff',
              background    : 'rgba(0, 0, 0, 0.8)',
              boxShadow     : 'none',    
              /* bottom        : '0px', */
              /* width         : '90%', */
              /* left          : '0px' */
              /* maxWidth      : '40%' */
            },
            line: {
              borderLeft    : '0px dotted #e60000',
              height        : '0px'
            },
            dot: {
              border        : '0px solid rgba(230, 0, 0, 0.5)'
            }
        }
    }

    const graphClickHandler = useCallback(async (point) => {
        const findIndex = graphRawGroupData.findIndex( row => row.id == point.y )

        if(findIndex !== -1) {
            const code = graphRawGroupData[findIndex].cpc_code
            setModalOpen(true)
            setAssetsLoading(true)
            const form = new FormData()
            form.append("list", JSON.stringify(filterList))
            form.append("total", maintainenceAssetsList.length > 0 ? maintainenceAssetsTotal : assetsTotal)
            form.append('selectedCompanies', JSON.stringify(selectedCompanies))
            form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
            form.append('customers', JSON.stringify(selectedAssetCompanies))
            form.append('assignments', JSON.stringify(selectedAssetAssignments))
            form.append('other_mode', display_sales_assets)
            form.append('type', typeof side != 'undefined' && side === true ? 'assigned' : selectedCategory)
            form.append(`range`, valueRange)
            form.append('data_type', dashboardScreen === true ? 1 : 0)
            const {data} = await PatenTrackApi.getAssetsByCPCCode(point.x, encodeURIComponent(code), form) 
            setAssetsLoading(false)
            setAssets(data.list)
        }  
    },[ graphRawGroupData, filterList ])

    const onCameraPositionChange = useCallback(async (event) => {
        /* console.log(event) */
    })

    const checkToolTip = () => {
        const elementFound = document.getElementsByClassName('graphTooltip')
        if(elementFound !== null && elementFound.length > 0) {
            const parentElement = elementFound[0].parentElement,
            computedStyle = window.getComputedStyle(parentElement),
            left = computedStyle.left, top = computedStyle.top

            if(left !== '' && parseInt(left) < 0) {
                parentElement.style.left = '0px'
            }

            if(top !== '' && parseInt(top) < 0) {
                parentElement.style.top = '0px'
            }
        } 
    }

    const onHandleMouseOver = (event) => {
        interval = setInterval(checkToolTip, 100)
    }

    const onHandleMouseOut = (event) => {
        clearInterval(interval)
    } 
    useEffect(() => {
        let tabName = 'Innovation'
        if(typeof side == 'undefined') { 
            switch (selectedCategory) {
                case 'filled':
                    tabName = 'Invented'
                    break
                case 'acquired':
                    tabName = 'Acquired'
                    break;
                case 'maintenance_budget':
                    tabName = 'Maintenance Fee Due'
                    break; 
                case 'abandoned':
                    tabName = 'Innovation'
                    break; 
                case 'restore_ownership':
                    tabName = 'Title'
                    break; 
                case 'unnecessary_patents':
                    tabName = 'To Divest'
                    break; 
                case 'top_lenders':
                case 'top_law_firms':
                    tabName = 'Owned'
                    break;
            }
        } else if(selectedCategory == 'top_lenders' || (selectedCategory == 'top_law_firms' && typeof side != 'undefined')) {
            tabName = 'Owned'
        } 
        if((selectedCategory == 'assigned' && selectedRow.length == 0) || selectedRow.length  === 0) {
            const tabArray = [ tabName ]
           /*  setInventionTabs([ 'Innovation', 'For Sale', 'To License Out']) */

            if(selectedCategory == 'abandoned') {
                tabArray.push('Timeline')
            } else {
                /* tabArray.push('With Products') */
            }
            setInventionTabs(tabArray)
            if(selectedRow.length  === 0) { 
                setSelectedTab(0)
            }
        } else if(( connectionBoxView === true || selectedRow.length > 0 ) && selectedCategory != 'top_law_firms') {
            /* setInventionTabs([ 'Innovation', 'Agreement', 'Form', 'Main' ]) */
            setInventionTabs([])
            setSelectedTab(1)
        }
    }, [ connectionBoxView, selectedRow, selectedCategory ])

 
    useEffect(() => {        
        const getChartData = async () => {
            let getNewData = true;
            if(typeof onSelect != 'undefined') {
                if(onSelect === false && graphRawData.length > 0 && cpc_request === true) {
                    getNewData = false;
                }
            } 
            if(getNewData === true) {   
                setShowContainer(true)              
                if (['PRO', 'KPI'].includes(process.env.REACT_APP_ENVIROMENT_MODE) && selectedCompanies.length === 0 && type !== 9){
                    setShowContainer(false)
                    return null
                } else if ( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token === null){
                    setShowContainer(false)
                    return null
                }
                
                const list = [];
                let totalRecords = 0;
                if(dashboardScreen === false && selectedCategory != 'top_law_firms' && typeof salable == 'undefined' && typeof licensable == 'undefined') {
                    if(selectedTab === 0 || ((selectedTab === 1 || selectedTab === 2) && (selectedCategory == 'assigned' && selectedRow.length == 0))) {
                        if( (assetsList.length > 0 && assetsSelected.length > 0 && assetsList.length != assetsSelected.length ) || ( maintainenceAssetsList.length > 0 &&  selectedMaintainencePatents.length > 0 && selectedMaintainencePatents.length != maintainenceAssetsList.length ) ) {
                        
                            if( assetsSelected.length > 0 ) {
                                const promise = assetsSelected.map(asset => {
                                    const findIndex = assetsList.findIndex( row => row.appno_doc_num.toString() == asset.toString() || row.grant_doc_num.toString() == asset.toString() )
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
                                    const findIndex = maintainenceAssetsList.findIndex( row => row.appno_doc_num.toString() == asset[1].toString() || row.grant_doc_num.toString() == asset[0].toString() )
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
                                    const companies =  selectedCompanies,
                                    tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                                    customers = selectedAssetCompanies,
                                    assignments = selectedAssetAssignments;
                                      
                                    if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
                                        /* if( auth_token != null ) {
                                            dispatch(
                                                process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ? 
                                                getCustomerAssets(
                                                  selectedCategory == '' ? '' : selectedCategory,
                                                  companies,
                                                  tabs,
                                                  customers,   
                                                  assignments,
                                                  false,
                                                )
                                                : 
                                                getCustomerSelectedAssets(location.pathname.replace('/', ''))
                                            );
                                        } */
                                    } else {
                                        /* if (openCustomerBar === false && (selectedCompaniesAll === true || selectedCompanies.length > 0) && selectedCategory != 'top_law_firms') { 
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
                                        } */
                                    }                        
                                }
                            }                
                        }
                    }
                } 
                if( selectedCategory == 'top_law_firms' || (typeof licensable != 'undefined' && licensable === true) || (typeof salable != 'undefined' && salable === true)) {  
                    if(cpc_request === false || (cpcData.list.length == 0 || (typeof side != 'undefined' && side === true && cpcSecondData.list.length == 0))) {  
                        setGraphRawData([])
                        setGraphRawGroupData([])    
                        setIsLoadingCharts(true)   
                        dispatch(setCPCRequest(true))
                        setFilterList([])
                        setFilterTotal(0)
                        findCPCList([...scopeRange], [], 0)
                    } else if(cpcData.list.length > 0 || cpcSecondData.list.length > 0) { 
                        updateCPCData([...scopeRange], list, totalRecords)
                    } else if (cpcData.list.length == 0 && cpcSecondData.list.length == 0){
                        setGraphRawData([])
                        setGraphRawGroupData([])  
                        setIsLoadingCharts(false)
                        setSalesData([])  
                    }
                } else if(dashboardScreen === true  ||   /* list.length > 0 */ selectedCategory != 'due_dilligence'  || (dashboardScreen === false && selectedCategory == 'due_dilligence')) { 
                    if(cpc_request === false || (cpcData.list.length == 0 || (typeof side != 'undefined' && side === true && cpcSecondData.list.length == 0))) { 
                        setGraphRawData([])
                        setGraphRawGroupData([])    
                        setIsLoadingCharts(true)   
                        dispatch(setCPCRequest(true))
                        setFilterList(list)
                        setFilterTotal(totalRecords)
                        findCPCList([...scopeRange], list, totalRecords)
                    } else if(cpcData.list.length > 0 || cpcSecondData.list.length > 0) { 
                        updateCPCData([...scopeRange], list, totalRecords)
                    }
                } else { 
                    setGraphRawData([])
                    setGraphRawGroupData([])
                    setSalesData([])
                    setIsLoadingCharts(false)                
                }
            }
        }
        if(typeof gRawData !== 'undefined') {
            setGraphRawData(gRawData)
            setGraphRawGroupData(gRawGroupData)
            setSalesData(sData)
            setIsLoadingCharts(false) 
            setFilterYear(fYear)
            setValueYear(vYear)
            setValueScope(vScope)
            setScopeRange(sRange)
            setFilterList(fList)
            setFilterTotal(fTotal)
        } else {
            getChartData()
        }
        //console.log( "getChartData", selectedCategory, selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments )
    }, [/* openCustomerBar,  */selectedCompanies, selectedMaintainencePatents, assetsSelected, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, auth_token, display_clipboard, salable, licensable ]) 


    useEffect(() => { 
        if(selectedTab == 1 && selectedCategory == 'abandoned') {
            console.log('Request for the timeline event')
            const getAllAbandonedAssetsEvents = async () => { 
                const {data} = await PatenTrackApi.getAllAbandonedAssetsEvents(selectedCompanies)
                setAbandonedTimeline(data)
            }
            getAllAbandonedAssetsEvents() 
        } else {
            if(selectedCompanies.length > 0 && selectedCategory == 'due_dilligence' && cpc_request === true && cpcData.list.length == 0) { 
                setFilterList([])
                setFilterTotal(0)
                findCPCList([...scopeRange], [], 0)
            } else {
                updateCPCData([...scopeRange], [], 0)
            }
        }
    }, [assetTypesSelectAll, selectedTab, selectedCompanies])


    

    useEffect(() => {
        if(selectedCompanies.length > 0  && cpc_request === true && cpcData.list.length > 0 && graphRawData.length == 0) { 
            updateCPCData([...scopeRange], [], 0)
        }
    }, [cpcData])

    useEffect(() => {
        if(selectedCompanies.length > 0  && cpc_request === true && typeof side != 'undefined' && side === true && cpcSecondData.list.length > 0 && graphRawData.length == 0) { 
            updateCPCData([...scopeRange], [], 0)
        }
    }, [cpcSecondData])

    

    const updateCPCData = async(oldScopeRange, list, totalRecords, year, range, scope) => {  
        const data = typeof side != 'undefined' && side === true ? { ...cpcSecondData } : { ...cpcData }
        if( typeof year === 'undefined' &&  data.list.length > 0 ) {
            let yearList = [], yearLabelList = []
            const promiseYear = data.list.map( item => yearList.push(item.fillingYear))
            await Promise.all(promiseYear)
            yearList = [...new Set(yearList)]
            if(dashboardScreen !== true) {
                yearList.sort(function(a, b) {
                    return a > b ? -1 : 0
                }); 
            }                       
            const promiseYearLabel = yearList.map( (item, index) => yearLabelList.push({ value: index + 1, label: item }) )
            await Promise.all(promiseYearLabel)
            setFilterYear(yearLabelList)            
            setValueYear([yearLabelList[0].value, yearLabelList[yearLabelList.length - 1].value]) 
        }
        if( typeof range === 'undefined' && typeof scope ===  'undefined'  && data.group.length > 0 && dashboardScreen === false) {
            setValueRange(3) 
            setValueScope([ data.group[0].id, data.group[data.group.length - 1].id ])
            newRange = [ data.group[0].id, data.group[data.group.length - 1].id ]
        }    
        if(typeof scope == 'undefined' && dashboardScreen === false) {
            
            const findOldRange = []
            if(oldScopeRange.length > 0 && typeof range !== 'undefined') {
                const promiseScope = newRange.map( scope => {
                    const findIndex = oldScopeRange.findIndex( s => s.value === scope)
                    if(findIndex !== -1) {
                        findOldRange.push(oldScopeRange[findIndex])
                    }
                })
                await Promise.all(promiseScope)
            } 
            /* console.log('valueScopeLabel', valueScopeLabel, 'oldScopeRange', oldScopeRange, 'findOldRange', findOldRange, 'newRange', newRange)  */
            const scopeGroup = []
            /* let i = data.group.length + 1 */
            let i = data.group.length + 1
            const promise = data.group.map( group => {
                i -= 1
                scopeGroup.push({
                    value: group.id,
                    label: `${group.cpc_code} - ${group.defination}`,
                    code: group.cpc_code,
                    section: group.section, 
                    class: group.class, 
                    sub_class: group.sub_class, 
                    main_group: group.main_group, 
                    sub_group: group.sub_group
                })
            })    
            await Promise.all(promise)
            /*setScopeRange([...scopeGroup].reverse())*/
            setScopeRange(scopeGroup)
            if(findOldRange.length > 0) {
                const selectScope = []
                const promiseSelect = findOldRange.map( r => {
                    scopeGroup.map( scope => {                        
                        if(scope.section === r.section) {
                            if(!selectScope.includes(scope.value)) {
                                selectScope.push(scope.value)
                            }
                        }
                    })
                })
                await Promise.all(promiseSelect) 
                if(selectScope.length > 0) {
                    newRange = [Math.min(...selectScope), Math.max(...selectScope)]      // useState still gives oldValue
                    setValueScope(newRange)
                    const scopeList = []
                    const promise = scopeGroup.map( r => {
                        if(r.value >= newRange[0] && r.value <= newRange[1]){
                            scopeList.push(r.code)
                        }
                    })
                    await Promise.all(promise)
                    dispatch(setCPCData({list: [], group: [], sales: []}))
                    findCPCList(oldScopeRange, list, totalRecords, year, range, scopeList) 
                }  
            } else { 
                setGraphRawData(data.list)
                setGraphRawGroupData(data.group)
                setSalesData(data.sales)
            }
        } else { 
            setGraphRawData(data.list)
            setGraphRawGroupData(data.group)
            setSalesData(data.sales)
        }
    }


    const findCPCList = async(oldScopeRange, list, totalRecords, year, range, scope) => {   
        if(selectedCompanies.length > 0 || (process.env.REACT_APP_ENVIROMENT_MODE != 'PRO' && list.length > 0)) {
            const form = new FormData()
            form.append("list", JSON.stringify(list))
            form.append("total", totalRecords)
            form.append('selectedCompanies', JSON.stringify(selectedCompanies))
            form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
            form.append('customers', JSON.stringify( selectedAssetCompanies))
            form.append('assignments', JSON.stringify( selectedAssetAssignments))
            form.append('lawfirm', selectedLawFirm)
            form.append('other_mode', display_sales_assets)
            form.append('type', typeof side != 'undefined' && side === true ? 'assigned' : selectedCategory)
            form.append('data_type', dashboardScreen === true ? 1 : 0)
            if(typeof top != 'undefined') {
                form.append('primary', 1)
            }
            if(typeof salable != 'undefined' && salable === true) {
                form.append('sale', 1)
            }
            if(typeof licensable != 'undefined' && licensable === true) {
                form.append('license', 1)
            }
            if(typeof range !== 'undefined') {
                form.append("range", range)
            }
    
            if(typeof scope !== 'undefined') {
                form.append("scope", JSON.stringify(scope))  
            }
    
            if(typeof year !== 'undefined') {
                form.append('year', JSON.stringify(year))
            }
    
            //PatenTrackApi.cancelCPCRequest()
            const {data} = await PatenTrackApi.getCPC(form)  
            setIsLoadingCharts(false) 
            if(typeof side != 'undefined' && side === true) { 
                dispatch(setCPCSecondData(data)) 
            } else {  
                dispatch(setCPCData(data)) 
            }
            if( typeof year === 'undefined' &&  data.list.length > 0 ) {
                let yearList = [], yearLabelList = []
                const promiseYear = data.list.map( item => yearList.push(item.fillingYear))
                await Promise.all(promiseYear)
                yearList = [...new Set(yearList)]
                if(dashboardScreen !== true) {
                    yearList.sort(function(a, b) {
                        return a > b ? -1 : 0
                    }); 
                }                       
                const promiseYearLabel = yearList.map( (item, index) => yearLabelList.push({ value: index + 1, label: item }) )
                await Promise.all(promiseYearLabel)
                setFilterYear(yearLabelList)            
                setValueYear([yearLabelList[0].value, yearLabelList[yearLabelList.length - 1].value]) 
            }
             
            if( typeof range === 'undefined' && typeof scope ===  'undefined'  && data.group.length > 0 && dashboardScreen === false) {
                setValueRange(3) 
                setValueScope([ data.group[0].id, data.group[data.group.length - 1].id ])
                newRange = [ data.group[0].id, data.group[data.group.length - 1].id ]
            }    
            if(typeof scope == 'undefined' && dashboardScreen === false) {
                
                const findOldRange = []
                if(oldScopeRange.length > 0 && typeof range !== 'undefined') {
                    const promiseScope = newRange.map( scope => {
                        const findIndex = oldScopeRange.findIndex( s => s.value === scope)
                        if(findIndex !== -1) {
                            findOldRange.push(oldScopeRange[findIndex])
                        }
                    })
                    await Promise.all(promiseScope)
                } 
                /* console.log('valueScopeLabel', valueScopeLabel, 'oldScopeRange', oldScopeRange, 'findOldRange', findOldRange, 'newRange', newRange)  */
                const scopeGroup = []
                /* let i = data.group.length + 1 */
                let i = data.group.length + 1
                const promise = data.group.map( group => {
                    i -= 1
                    scopeGroup.push({
                        value: group.id,
                        label: `${group.cpc_code} - ${group.defination}`,
                        code: group.cpc_code,
                        section: group.section, 
                        class: group.class, 
                        sub_class: group.sub_class, 
                        main_group: group.main_group, 
                        sub_group: group.sub_group
                    })
                })    
                await Promise.all(promise)
                /*setScopeRange([...scopeGroup].reverse())*/
                setScopeRange(scopeGroup)
                if(findOldRange.length > 0) {
                    const selectScope = []
                    const promiseSelect = findOldRange.map( r => {
                        scopeGroup.map( scope => {                        
                            if(scope.section === r.section) {
                                if(!selectScope.includes(scope.value)) {
                                    selectScope.push(scope.value)
                                }
                            }
                        })
                    })
                    await Promise.all(promiseSelect) 
                    if(selectScope.length > 0) {
                        newRange = [Math.min(...selectScope), Math.max(...selectScope)]      // useState still gives oldValue
                        setValueScope(newRange)
                        const scopeList = []
                        const promise = scopeGroup.map( r => {
                            if(r.value >= newRange[0] && r.value <= newRange[1]){
                                scopeList.push(r.code)
                            }
                        })
                        await Promise.all(promise)
                        dispatch(setCPCData({list: [], group: [], sales: []}))
                        findCPCList(oldScopeRange, list, totalRecords, year, range, scopeList) 
                    }  
                } else { 
                    setGraphRawData(data.list)
                    setGraphRawGroupData(data.group)
                    setSalesData(data.sales)
                }
            } else { 
                setGraphRawData(data.list)
                setGraphRawGroupData(data.group)
                setSalesData(data.sales)
            }
        }
    }
 

    const generateChart = async () => {
        try {
            if (isLoadingCharts || graphRawData.length == 0 || graphRawGroupData.length == 0) return null
                
            items.current = new DataSet()
            const colors = ['#70A800', '#00a9e6', '#E69800', '#ff0000'], codeList = []
            let xMin = 0, xMax = 0, years = [], zMax = [];
            /* console.log('valueScope', valueScope)
            const codePromise = graphRawGroupData.map( group => {
                if((valueScope.length == 1 && valueScope.includes(group.id)) || (valueScope.length == 2 && group.id >= valueScope[0] &&  group.id <= valueScope[1])){
                    codeList.push(group.cpc_code)
                }
            })
            await Promise.all(codePromise)
            console.log('codeList', codeList) */
            const promises = graphRawData.map( (data, index) => {
                const findIndex = graphRawGroupData.findIndex( row => row.cpc_code == data.cpc_code )
                if(findIndex !== -1) {
                    const year = parseInt(data.fillingYear)
                    if(xMin == 0) {
                        xMin = year     
                    }
                    if(xMax == 0) {
                        xMax = year
                    }
                    if(!years.includes(year)){
                        years.push(year)
                    }

                    if(year < xMin){
                        xMin = year
                    } else  if(year > xMax){
                        xMax = year
                    }
                    zMax.push(data.countAssets)
                    const appNums = data.appNum;
                    let style = {
                            /* stroke: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider,
                            fill: isDarkTheme ? themeMode.dark.palette.background.default : themeMode.light.palette.background.default */
                            fill: '#1565C0',
                            stroke: '#2196F3'
                        };
                    /* if(data.appNum !== null && data.appNum !== '') {
                        const appList = data.appNum.toString().split(',')
                        let salesFind = false
                        if(salesData.length > 0) {
                            appList.map( number => {
                                if(salesData.includes(number) && salesFind === false) {
                                    salesFind = true;
                                    style = {
                                        stroke: '#8EB93B',
                                        fill: '#8EB93B'
                                    };
                                }
                            })
                        }                       
                    } */
                    
                    //const col = colors[Math.floor((Math.random()*colors.length))]
                    
                    items.current.add({
                        x: year,
                        y: graphRawGroupData[findIndex].id,
                        z: parseInt(data.countAssets),
                        style: style,
                        patent: data.patent_number,
                        application_number: data.application_number,   
                        origin: data.group_name
                    })

                    /* if( index === 0 ) {
                        items.current.add({
                            x: year,
                            y: graphRawGroupData[findIndex].id,
                            z: 0,
                            style: 5
                        })
                    }  */
                }                
            })

            await Promise.all(promises)            
            //TODO height 100% not working well, created allot of isues when we resize pane, 
            if(graphContainerRef.current != null && graphContainerRef.current.clientHeight > 0) {
                options = {...options, axisFontSize: visualizerBarSize == '30%' ? 22 : 22, yStep:  visualizerBarSize == '30%' ? 8 : 1, zStep: Math.max(...zMax) > 10 ? parseInt(Math.max(...zMax) / 10) : graphRawData.length > 2 ? 3 : 1, zMax: Math.max(...zMax) }
            }     
            /* options.axisColor = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary */
            graphRef.current = new Graph3d(graphContainerRef.current, items.current, options)
            graphRef.current.on('click', graphClickHandler)      
            graphRef.current.on('cameraPositionChange', onCameraPositionChange)
            if(graphContainerRef.current != null ) {
                graphContainerRef.current.removeEventListener('mouseover', onHandleMouseOver)
                graphContainerRef.current.addEventListener('mouseout', onHandleMouseOut)
                graphContainerRef.current.addEventListener('mouseover', onHandleMouseOver)            
            }
        } catch (err) {
            //console.log(err)
        }
    }

    useEffect(() => {
        
        if(selectedTab === 0 && selectedCategory == 'assigned' && selectedRow.length == 0 && display_sales_assets > 0) {
            dispatch(setIsSalesAssetsDisplay(0))
            dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
        } else if (selectedTab === 1 && selectedCategory == 'assigned' && selectedRow.length == 0) {
            /**
             * Get data from slack and find assigned assets products
             * first check user is login with slack. if not then prompt
             * get all the channels and find all the channel IDs
             * send request for converstations for each channel to get the list of products
             * make a cube based on the products
             */
            const getSearchedMessages = async () => {
                const getSlackToken = getTokenStorage("slack_auth_token_info");
                if(!getSlackToken || getSlackToken == '' || getSlackToken == null){
                    dispatch(setSocialMediaConnectPopup(true))
                } else {
                    const { access_token, bot_token, bot_user_id } = JSON.parse(getSlackToken)
                    if(access_token != '' && access_token != null && access_token != undefined) { 
                        const {data} = await PatenTrackApi.getSearchAssignedMessages(access_token)
        
                        if(data.length > 0) {
                            /**
                             * Check Messages and make a product group 
                             * and assets product group
                             */

                        }
                    } else {
                        dispatch(setSocialMediaConnectPopup(true))
                    }
                } 
            }
            getSearchedMessages()
        }
    }, [selectedTab])

    useEffect(() => { 
        generateChart()
    }, [ isLoadingCharts, graphRawData, graphRawGroupData, graphContainerRef, defaultSize, valueScope, isDarkTheme ])


    useEffect(() => {
        if( !isLoadingCharts && graphRawData.length > 0 && graphRawGroupData.length > 0 && graphContainerRef.current !== null && graphContainerRef.current != undefined ) { 
            if(  graphContainerRef.current != undefined &&  typeof  graphContainerRef.current.childNodes != 'undefined' && graphContainerRef.current.childNodes.length == 0 ) { // if comes from different tab
                generateChart()
            }
        }
    })

    useEffect(() => {
        if( graphRef.current != undefined &&  graphRef.current !== null && graphRawGroupData.length > 0 && graphRawData.length > 0 && !isLoadingCharts ) {
            let fontSize = 22, step = 1, verticalRatio = 0.4
            if( visualizerBarSize == '100%' ) {
                if(defaultSize != '0') {
                    step = 3
                    verticalRatio = 0.2
                } 
            } else if(visualizerBarSize == '30%') {
                fontSize = 22
                step = 7
            }
            try {
                const height = graphContainerRef.current.parentNode !== null ? graphContainerRef.current.parentNode.parentNode !== null ? `${graphContainerRef.current.parentNode.parentNode.clientHeight - 50 }px` : `${graphContainerRef.current.parentNode.clientHeight - 50 }px` : '100%'
                options = { ...options, axisFontSize: fontSize, height, yStep: step, verticalRatio }
                graphRef.current.setOptions(options)
                graphRef.current.redraw()
            } catch (e) {
                console.log(`error container ${e}`)
            }
        }
    }, [ visualizerBarSize, analyticsBar, defaultSize, commentBar, illustrationBar, customerBarSize, companyBarSize ]) 


    useEffect(() => {
        if(assetIllustration != null && Object.keys(assetIllustration).length > 0) {
            /* if((selectedAssetAssignments.length == 1 && selectedCategory == 'correct_details') || selectedRow.length == 1) { */
                
                if((selectedAssetAssignments.length == 1 ) || selectedRow.length == 1) {
                setAssets(assetIllustration)
                if(assetIllustrationData != null ) {   
                    if(assetIllustrationData.line[0].document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (assetIllustrationData.line[0].document1 == "" && assetIllustrationData.line[0].ref_id > 0)) {
                        const obj = assetIllustrationData.line[0]
                        obj.rf_id = obj.ref_id
                        dispatch(retrievePDFFromServer(obj))
                    } else {
                        dispatch(
                            setPDFFile(
                              { 
                                document: assetIllustrationData.line[0].document1, 
                                form: assetIllustrationData.line[0].document1, 
                                agreement: assetIllustrationData.line[0].document1 
                              }
                            )
                        )
                    }             
                    
                    dispatch(
                        setPdfTabIndex(0)
                    )
                } else {
                    (async() => {
                        const { data } = await PatenTrackApi.getCollectionIllustration(assetIllustration.id)
                        dispatch(
                            setAssetsIllustrationData(data != '' ? data : null)
                        )
                    })();
                }
                
            }
        }
    }, [ assetIllustration, assetIllustrationData, selectedAssetAssignments, selectedRow, selectedCategory ])

    const handleOpenFilter = () => {
        setOpenFilter(true);
        //onChangeScopeSlider(valueRange, valueScope)
    };
    
    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    
    

    const remoteAssetFromList = useCallback(async (asset) => {
        const list = maintainenceAssetsList.length > 0 ? [...maintainenceAssetsList] : [...assetsList]

        if( list.length > 0 ) {
            const findIndex = list.findIndex( row => row.asset == asset)
            if(findIndex !== -1) {
                list.splice(findIndex, 1)
                if( maintainenceAssetsList.length > 0 ) {
                    dispatch(setMaintainenceAssetsList({list, total_records: list.length }, { append: false }))
                } else {
                    dispatch( setAssetTypeAssignmentAllAssets({list, total_records: list.length }, false) )
                }
            }
        }

    },[ dispatch, assetsList, maintainenceAssetsList ])

    const handleClose = () => {
        setModalOpen(false);
        dispatch(setFamilyActiveTab(0))
    }

    const handleResize = (event, {element, size, handle}) => {
        setResizableWidthHeight([size.width, size.height])
    }

    const handleDragStop = (e, position) => {
        const {x, y} = position;
        const {availWidth, availHeight} = window.screen
        const calcHeight = ((availHeight - 105) - resizableWidthHeight[1]) 
        setFilterDrag([x < 0 ? 0 : x > availWidth - resizableWidthHeight[0] ? availWidth - resizableWidthHeight[0] : x, y < 0 ? 0 : y > calcHeight ? calcHeight : y])
        //setFilterDrag([x < 0 ? 0 : availWidth - resizableWidthHeight[0] < x ? availWidth - resizableWidthHeight[0] : x, y > 0 ? 0 : calcHeight > y ? calcHeight : y])
    }

    const PaperComponent = (props) => {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper square={true} {...props} />
            </Draggable>
        );
    }

    const PaperComponentFilter = (props) => {
        return (
            <Draggable handle="#draggable-dialog-filter" defaultPosition={{x: filterDrag[0], y: filterDrag[1]}} cancel={'[class*="MuiDialogContent-root"]'} onStop={handleDragStop}>
                <ResizableBox
                    height={resizableWidthHeight[1]}
                    width={resizableWidthHeight[0]}
                    minConstraints={[420, 350]} 
                    maxConstraints={[1500, 800]}
                    className={classes.resizable}
                    onResizeStop={handleResize}
                ><Paper square={true} {...props} /></ResizableBox>                
            </Draggable>
        );
    }

    /* const handleChangeTab = (e, newTab) => setSelectedTab(previousTab => (newTab == 1 || newTab == 2 ) && (selectedCategory == 'assigned' && selectedRow.length == 0) ? previousTab : newTab) */
    const handleChangeTab = (e, newTab) => setSelectedTab( newTab )

    const yearRangeText = (value)=> {
        const findIndex = filterYear.findIndex( range => range.value === value)
        if(findIndex !== -1) {
            return filterYear[findIndex].label;
        } else {
            return ''
        }        
    }

    const depthRangeText = (value)=> {
        const findIndex = depthRange.findIndex( range => range.value === value)
        if(findIndex !== -1) {
            return depthRange[findIndex].label;
        } else {
            return ''
        }        
    }

    const scopeRangeText = (value) => {
        const findIndex = scopeRange.findIndex( range => range.value === value)
        if(findIndex !== -1) {
            return scopeRange[findIndex].label;
        } else {
            return ''
        } 
    }    

    const onChangeYearSlider = useCallback(async (range, year) => {
        setValueYear(year)
        /* if(dashboardScreen !== true) {
            setScopeRange([])
            setValueScope([1, 2])
        }  */
        const yearList = []
        filterYear.forEach( r => {
            if(r.value >= year[0] && r.value <= year[1]){
                yearList.push(parseInt(r.label))
            }
        })
        
        findCPCList([...scopeRange], filterList, filterTotal, yearList, range)      
    }, [filterList, filterTotal, filterYear])

    const onChangeRangeSlider = useCallback(async (year, range, ) => {
        // Depth
        setPreValueRange(prevItem => prevItem != valueRange ? valueRange : prevItem)
        setValueRange(range) 
        //setScopeRange([])
        const yearList = []
        filterYear.forEach( r => {
            if(r.value >= year[0] && r.value <= year[1]){
                yearList.push(parseInt(r.label))
            }
        })
        findCPCList([...scopeRange], filterList, filterTotal, yearList, range)      
    }, [ filterList, filterTotal, scopeRange, valueRange ] )

    
    const onChangeScopeSlider = useCallback(async (year, range, scope) => {
        // A, B, .... H0
        newRange = scope
        setValueScope(scope)
        const scopeList = [], yearList = []
        const promise = scopeRange.map( r => {
            if(r.value >= scope[0] && r.value <= scope[1]){
                scopeList.push(r.code)
            }
        })
        await Promise.all(promise)
        filterYear.forEach( r => {
            if(r.value >= year[0] && r.value <= year[1]){  
                yearList.push(parseInt(r.label))
            }
        })
        setValueScopeLabel(scopeList)
        findCPCList([...scopeRange], filterList, filterTotal, yearList, range, scopeList)        
    }, [ filterList, filterTotal, scopeRange, filterYear ] )


    const onChangeDashboardScopeSlider = useCallback(async (year, range, scope) => {
        // A, B, .... H
        newRange = scope
        setValueScope(scope)
        if(scope.length > 0) {
            const yearList = []
            filterYear.forEach( r => {
                if(r.value >= year[0] && r.value <= year[1]){  
                    yearList.push(parseInt(r.label))
                }
            })
            findCPCList([...scopeRange], filterList, filterTotal, yearList, range, scope)  
        } else {
            setGraphRawData([])
        }
              
    }, [ filterList, filterTotal, scopeRange, filterYear ] )

    const toggleDrawer = (event, open) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift') ) {
          return;
        }
        setAnchorEl(open === true ? event.currentTarget : null)
    }

    const handleDashboardDragStop = (e, position) => {
        const {x, y} = position;
        setXY({x,y})
    }

    const onHandleFilterAssets = (label) => {   
        if(label === 'For Sale') {
            dispatch(setIsSalesAssetsDisplay(1))
            dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
        } else if(label === 'To License Out') {
            dispatch(setIsSalesAssetsDisplay(3))
            dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
        }
    }

    const TabLabel = ({label}) => {
        return (
            label === 'For Sale' || label === 'To License Out'
            ?
                selectedCategory == 'assigned' && selectedRow.length == 0
                ?
                    <span 
                        className={classes.button}
                        onClick={() => {onHandleFilterAssets(label)}}>
                        {label}
                    </span>
                :
                    <LabelWithIcon label={label} showLabel={true}/>
            :
                <LabelWithIcon label={label} showLabel={true}/>
        )
    } 

    const onHandleResetSettings = () => { 
        setFilterYear([])
        setFilterDrag([0,0])
        setValueYear([1,2])
        setValueScope([1,2])
        setValueRange(3)
        setPreValueRange(3)
        setScopeRange([])
        findCPCList([], filterList, filterTotal)  
    }
 
    
    return (
        <Paper 
            /* {...(typeof titleBar !== 'undefined' && titleBar === true ? {sx: {p: 2}} : {})} */
            className={classes.root} square>  
            {
                (typeof tab == 'undefined' || tab === true ) && inventionTabs.length > 0
                ?
                    <Tabs
                        value={selectedTab}
                        variant="scrollable"
                        scrollButtons="auto"
                        onChange={handleChangeTab}
                        className={classes.tabs}
                    >
                        {
                            inventionTabs.map((tab) => (
                                <Tab
                                    key={tab}
                                    label={tab == 'For Sale' || tab == 'To License Out' ? <TabLabel label={tab} /> : tab}
                                    {...(typeof tab != 'For Sale' && tab != 'To License Out'  ? {icon: <LabelWithIcon label={tab} otherName={true}/>} : {})} 
                                    iconPosition='start'
                                    classes={{ root: classes.tab }}
                                />
                            )) 
                        }
                    </Tabs> 
                :
                    ''
            } 
            <Box {...(((typeof tab != 'undefined' && tab === true) || typeof pad != 'undefined' && pad === true) ? {sx: {p: 2}} : {})}  className={classes.boxContainer}>
            {
                showContainer === true && (
                    <React.Fragment>  
                        {/* {
                            typeof titleBar !== 'undefined' && titleBar === true && (
                                <TitleBar title={`Technologies and filling years of all non-expired patents and applications filed after 1999:`} enablePadding={false} underline={false} typography={true} relative={true}/>   
                            )
                        }  */}
                        {
                            selectedTab === 0 && (
                                <React.Fragment>  
                                    <TitleBar title={`Hover over the bars for details. Select a bar to see the list of the underlying patents, and to act upon them. Click the menu icon to filter the results.`} enablePadding={typeof titleBar !== 'undefined' && titleBar === true ? false : false} underline={false} typography={true} relative={true} button={
                                        {
                                            dashboardScreen: dashboardScreen, 
                                            click: dashboardScreen === true ? toggleDrawer  :  handleOpenFilter,
                                            class: classes.btnSetting
                                        }
                                    }/>
                                </React.Fragment>
                            )
                        } 
                        {
                            typeof standalone === 'undefined' && (
                                <FullScreen componentItems={menuItems}/>
                            )
                        } 
                        <div className={classes.graphContainer}> 
                            {
                                selectedTab === 0 || ((selectedTab === 1 || selectedTab === 2) && (selectedCategory == 'assigned' && selectedRow.length == 0))
                                ?
                                    !isLoadingCharts
                                    ?
                                        graphRawData.length > 0
                                        ?
                                            <div
                                                style={{
                                                height: '90%',
                                                width: '100%',
                                                filter: `blur(${isLoadingCharts ? '4px' : 0})`,
                                                }}
                                                ref={graphContainerRef}
                                                className={classes.timeline}
                                            />
                                        :
                                            ''
                                    :
                                        <Loader />
                                :
                                    selectedTab === 1 && selectedCategory == 'abandoned' && selectedRow.length === 0
                                    ?
                                        <Fees
                                            standalone={true}
                                            events={abandonedTimeline} 
                                            showTabs={false}
                                            showAbandoned={true}
                                        />
                                    :
                                        
                                        selectedTab === 1
                                        ?
                                            <PdfViewer display={true} pdfTab={0} show_tab={false}/>         
                                        :
                                            selectedTab === 2
                                            ?
                                                <PdfViewer display={true} pdfTab={1} show_tab={false}/>        
                                            :
                                                selectedTab === 3
                                                ?
                                                    <PdfViewer display={true} pdfTab={2} show_tab={false}/>
                                                :
                                                ''
                            }
                        </div>  
                      
                        <Dialog
                            open={openModal}
                            onClose={handleClose}
                            className={classes.modal}
                            PaperComponent={PaperComponent}
                            aria-labelledby="draggable-dialog-title"
                        >
                            <DialogTitle style={{ cursor: 'move' }} ></DialogTitle>
                            <DialogContent>
                                <AssetsList 
                                    loading={assetLoading} 
                                    assets={assets} 
                                    remoteAssetFromList={remoteAssetFromList}
                                    openChartBar={openChartBar}
                                    handleChartBarOpen={handleChartBarOpen}
                                />
                            </DialogContent>
                        </Dialog>  
                        <Draggable 
                            handle="#draggable-dashboard-filter-menu-item" 
                            cancel={'[class*="zoom_slider"]'}
                            onStop={handleDashboardDragStop}
                        >    
                            <Menu
                                id='draggable-dashboard-filter-menu-item'
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                onClose={(event) => toggleDrawer(event, false)}              
                                disableAutoFocusItem
                                PaperProps={{    
                                    style: {
                                    width: dashboardScreen === true ? 450 : 250,  
                                    left: '50%',
                                    transform: `translateX(${xy.x}) translateY(${xy.y})`,
                                    }
                                }}
                            >
                                <MenuItem className={`listIconItem illustration_menu_close_btn`}>
                                    <ListItemIcon onClick={(event) => toggleDrawer(event, false)}>
                                        <Close/>
                                    </ListItemIcon>
                                </MenuItem>
                                <FilterDashboardCPC depthRange={depthRange} scopeRange={scopeRange} yearRange={filterYear} yearRangeText={yearRangeText} depthRangeText={depthRangeText} scopeRangeText={scopeRangeText} valueScope={valueScope} valueRange={valueRange} valueYear={valueYear} onChangeRangeSlider={onChangeRangeSlider} onChangeScopeSlider={onChangeDashboardScopeSlider} onChangeYearSlider={onChangeYearSlider}/>
                            </Menu>
                        </Draggable>   

                        <Dialog
                            open={openFilter}
                            onClose={handleCloseFilter}
                            className={`${classes.modal} ${classes.modalFilter}`}
                            PaperComponent={PaperComponentFilter}
                            aria-labelledby="filter-cpc"
                        >                
                            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-filter">
                                
                            </DialogTitle>
                            <DialogContent className={classes.filterContent}>
                                <CloseIcon onClick={handleCloseFilter} className={classes.close}/>
                                <Button onClick={onHandleResetSettings} className={classes.reset}>Reset</Button>
                                <FilterCPC onClose={handleClose} depthRange={depthRange} scopeRange={scopeRange} yearRange={filterYear} yearRangeText={yearRangeText} depthRangeText={depthRangeText} scopeRangeText={scopeRangeText} valueScope={valueScope} valueRange={valueRange} valueYear={valueYear} onChangeRangeSlider={onChangeRangeSlider} onChangeScopeSlider={onChangeScopeSlider} onChangeYearSlider={onChangeYearSlider}/>
                            </DialogContent>
                        </Dialog> 
                    </React.Fragment>
                )
            } 
            </Box>              
        </Paper>
    );
}




export default InventionVisualizer