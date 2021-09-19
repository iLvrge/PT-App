import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useLocation} from 'react-router-dom'
import { Paper, Dialog, DialogContent, DialogTitle, IconButton  } from '@material-ui/core'
import Draggable from "react-draggable"
import CloseIcon from '@material-ui/icons/Close'
import {ResizableBox} from "react-resizable"
import { DataSet } from 'vis-data/esnext'
import { Graph3d } from 'vis-graph3d/esnext'

import FilterListIcon from '@material-ui/icons/FilterList'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
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
    getCustomerSelectedAssets
} from '../../../../actions/patentTrackActions2'
import { setPDFFile, setPdfTabIndex } from '../../../../actions/patenTrackActions' 
import PatenTrackApi from '../../../../api/patenTrack2'
import useStyles from './styles'

import { capitalize } from "../../../../utils/numbers";

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

var newRange = [1,2]

const InventionVisualizer = ({ defaultSize, visualizerBarSize, analyticsBar, openCustomerBar, commentBar, illustrationBar, customerBarSize, companyBarSize, standalone }) => {
    
    const classes = useStyles()
    const dispatch = useDispatch()
    const graphRef = useRef()
    const location = useLocation()
    const graphContainerRef = useRef()  
    const items = useRef(new DataSet())

    const [ isLoadingCharts, setIsLoadingCharts ] = useState(false)
    const [ openModal, setModalOpen ] = useState(false)
    const [ assetLoading, setAssetsLoading ] = useState(false)
    const [ openFilter, setOpenFilter ] = useState(false)
    const [ showContainer, setShowContainer ] = useState(true)
    const [ assets, setAssets ] = useState([])
    const [ filterList, setFilterList ] = useState([])
    const [ filterYear, setFilterYear ] = useState([])
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ resizableWidthHeight, setResizableWidthHeight ] = useState([665, 350])
    const [ filterDrag, setFilterDrag ] =  useState([0, 0])
    const [ valueYear, setValueYear ] = useState([1, 2])
    const [ valueScope, setValueScope ] = useState([1, 2])
    const [ valueRange, setValueRange ] = useState(3)
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

    const menuItems = [
        {
            id: 1,
            label: 'Invention Data',
            component: InventionVisualizer,
            standalone: true,
            defaultSize, 
            visualizerBarSize, 
            analyticsBar, 
            openCustomerBar, 
            commentBar, 
            illustrationBar, 
            customerBarSize, 
            companyBarSize
        }
    ]

    const [ inventionTabs, setInventionTabs ] = useState(['Innovation'])

    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const selectedAssetsTransactionLifeSpan = useSelector( state => state.patenTrack2.transaction_life_span )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected ) //companies
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll )
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected )
    const assetTypesSelectAll = useSelector( state => state.patenTrack2.assetTypes.selectAll )
    const selectedAssetCompanies = useSelector( state => state.patenTrack2.assetTypeCompanies.selected )
    const selectedAssetCompaniesAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const assetIllustration = useSelector( state => state.patenTrack2.assetIllustration )
    const assetIllustrationData = useSelector( state => state.patenTrack2.assetIllustrationData )
    const selectedRow = useSelector( state => state.patenTrack2.selectedAssetsTransactions )
    const connectionBoxView = useSelector( state => state.patenTrack.connectionBoxView)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    const [ graphRawData, setGraphRawData ] = useState([])
    const [ graphRawGroupData, setGraphRawGroupData ] = useState([])
    let interval;
    
    let options = {
        height: '100%',
        width: '100%',
        style: 'bar-color',
        axisFontSize: 18,
        /* yBarWidth:  30, */
        xStep: 1,
        yStep: 1,
        zStep: 3,
        yCenter: '30%',
        showPerspective: false,
        showGrid: true,
        axisColor: '#fff',
        keepAspectRatio: false,
        verticalRatio: 0.5,
        xLabel: '',
        yLabel: '',
        zLabel: '',
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
                origin = origin.split('@@').join('<br/>') 
            }

            return `<div class="graphTooltip"><ul class="tootlip_data"><li><strong>Filling Year</strong>: ${point.x}</li><li><strong>Patents</strong>: ${point.data.patent}</li>${point.data.application_number > 0 ? '<li><strong>Applications</strong>: '+ point.data.application_number +'</li>' : ''}<li><strong>Origin</strong>: ${origin != null ? origin : ''}</li><li><div class='noWrapText'><strong>Subject Matter</strong>: ${capitalize(defination)}</div></li></div>`
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
        gridColor: '#e5e5e51c',
        tooltipStyle: {
            content: {
              padding       : '10px',
              border        : '0px',
              borderRadius  : '0px',
              color         : '#fff',
              background    : '#000',
              boxShadow     : 'none',
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
            form.append(`range`, valueRange)
            const {data} = await PatenTrackApi.getAssetsByCPCCode(point.x, encodeURIComponent(code), form) 
            setAssetsLoading(false)
            setAssets(data.list)
        }  
    },[ graphRawGroupData, filterList ])

    const onCameraPositionChange = useCallback(async (event) => {
        
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
        if(selectedRow.length  === 0) {
            setInventionTabs([ 'Innovation'])
            setSelectedTab(0)
        } else if( connectionBoxView === true || selectedRow.length > 0 ) {
            setInventionTabs([ 'Innovation', 'Agreement', 'Form', 'Main' ])
            setSelectedTab(1)
        }
        
    }, [ connectionBoxView, selectedRow ])

    useEffect(() => {
        const getChartData = async () => {
            setGraphRawData([])
            setGraphRawGroupData([])      
            setShowContainer(true)      
            if (process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && selectedCompanies.length === 0){
                setShowContainer(false)
                return null
            } else if ((process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE') && auth_token === null){
                setShowContainer(false)
                return null
            }
            setIsLoadingCharts(true)   
            const list = [];
            
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
                }                
            } else {
                
                if( assetsList.length > 0 || maintainenceAssetsList.length > 0 ) {
                    if( assetsList.length > 0 ) {
                        const promise = assetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
                    } else if ( maintainenceAssetsList.length > 0 ) {
                        const promise = maintainenceAssetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
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
                            if (openCustomerBar === false && (selectedCompaniesAll === true || selectedCompanies.length > 0)) {
                                dispatch(
                                    getCustomerAssets(
                                      selectedCategory == '' ? '' : selectedCategory,
                                      companies,
                                      tabs,
                                      customers,
                                      assignments,
                                      false,
                                    ),
                                );
                            }
                        }                        
                    }
                }                
            }            

            if( list.length > 0 ) {
                setFilterList(list)
                findCPCList([...scopeRange], list)
            }
        }
        getChartData()
        //console.log( "getChartData", selectedCategory, selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments )
    }, [selectedCategory, selectedCompanies, assetsList, maintainenceAssetsList, selectedMaintainencePatents, assetsSelected, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, selectedCompaniesAll, assetTypesSelectAll, selectedAssetCompaniesAll, selectedAssetAssignmentsAll, auth_token, display_clipboard ]) 


    const findCPCList = async(oldScopeRange, list, year, range, scope) => {       
        const form = new FormData()
        form.append("list", JSON.stringify(list))
        if(typeof range !== 'undefined') {
            form.append("range", range)
        }

        if(typeof scope !== 'undefined') {
            form.append("scope", JSON.stringify(scope))  
        }

        if(typeof year !== 'undefined') {
            form.append('year', JSON.stringify(year))
        }

        PatenTrackApi.cancelCPCRequest()
        const {data} = await PatenTrackApi.getCPC(form) 
        setIsLoadingCharts(false)
        setGraphRawData(data.list)
        setGraphRawGroupData(data.group)

        if( typeof year === 'undefined' &&  data.list.length > 0 ) {
            let yearList = [], yearLabelList = []
            const promiseYear = data.list.map( item => yearList.push(item.fillingYear))
            await Promise.all(promiseYear)
            yearList = [...new Set(yearList)]
            yearList.sort(function(a, b) {
                return a > b ? -1 : 0
            });
            console.log('yearList', yearList)
            const promiseYearLabel = yearList.map( (item, index) => yearLabelList.push({ value: index + 1, label: item }) )
            await Promise.all(promiseYearLabel)
            setFilterYear(yearLabelList)            
            setValueYear([yearLabelList[0].value, yearLabelList[yearLabelList.length - 1].value]) 
        }

        if( typeof range === 'undefined' && typeof scope ===  'undefined'  && data.group.length > 0) {
            setValueScope([ data.group[0].id, data.group[data.group.length - 1].id ])
        }    
        if(typeof scope == 'undefined') {
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
                    setValueScope([Math.min(...selectScope), Math.max(...selectScope)])
                    const scopeList = []
                    const promise = scopeGroup.map( r => {
                        if(r.value >= newRange[0] && r.value <= newRange[1]){
                            scopeList.push(r.code)
                        }
                    })
                    await Promise.all(promise)
                    findCPCList(oldScopeRange, list, year, range, scopeList)
                }
            }
        }
    }



    const generateChart = async () => {
        if (isLoadingCharts || graphRawData.length == 0 || graphRawGroupData.length == 0) return null
        
        items.current = new DataSet()
        const colors = ['#70A800', '#00a9e6', '#E69800', '#ff0000'], codeList = []
        let xMin = 0, xMax = 0, years=[];
        /* console.log('valueScope', valueScope)
        const codePromise = graphRawGroupData.map( group => {
            if((valueScope.length == 1 && valueScope.includes(group.id)) || (valueScope.length == 2 && group.id >= valueScope[0] &&  group.id <= valueScope[1])){
                codeList.push(group.cpc_code)
            }
        })
        await Promise.all(codePromise)
        console.log('codeList', codeList) */
        let tap = 0;
        const promises = graphRawData.map( (data, index) => {
            /*if(codeList.includes(data.cpc_code)) {
                
            }*/
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
                //const col = colors[Math.floor((Math.random()*colors.length))]
                items.current.add({
                    x: year,
                    y: graphRawGroupData[findIndex].id,
                    z: data.countAssets,
                    style: {
                        stroke: '#50719C',
                        fill: '#395270'
                    },
                    patent: data.patent_number,
                    application_number: data.application_number,   
                    origin: data.group_name
                })

                if( tap === 0 ) {
                    items.current.add({
                        x: year,
                        y: graphRawGroupData[findIndex].id,
                        z: 0,
                        style: {
                            stroke: '#50719C',
                            fill: '#395270'
                        }, 
                        patent: data.patent_number,
                        application_number: data.application_number,   
                        origin: data.group_name
                    })
                    tap = 1
                }
            }                
        })

        await Promise.all(promises)            
        const height = graphContainerRef.current != null && graphContainerRef.current.clientHeight > 0 ? graphContainerRef.current.parentNode !== null && graphContainerRef.current.parentNode.parentNode !== null ? `${graphContainerRef.current.parentNode.parentNode.clientHeight - 50 }px` : `${graphContainerRef.current.clientHeight - 50 }px` : '100%'
        //TODO height 100% not working well, created allot of isues when we resize pane, 
        if(graphContainerRef.current != null && graphContainerRef.current.clientHeight > 0) {
           options = {...options, height: `${graphContainerRef.current.parentNode.parentNode.clientHeight - 50 }px`, axisFontSize: visualizerBarSize == '30%' ? 18 : 18, yStep:  visualizerBarSize == '30%' ? 8 : 1, zStep: graphRawData.length > 2 ? 3 : 1 }
        }     

        graphRef.current = new Graph3d(graphContainerRef.current, items.current, options)
        graphRef.current.on('click', graphClickHandler)      
        graphRef.current.on('cameraPositionChange', onCameraPositionChange)
        if(graphContainerRef.current != null ) {
            graphContainerRef.current.removeEventListener('mouseover', onHandleMouseOver)
            graphContainerRef.current.addEventListener('mouseout', onHandleMouseOut)
            graphContainerRef.current.addEventListener('mouseover', onHandleMouseOver)            
        }
    }

    useEffect(() => { 
        generateChart()
    }, [ isLoadingCharts, graphRawData, graphRawGroupData, graphContainerRef, defaultSize, valueScope ])


    useEffect(() => {
        if( !isLoadingCharts && graphRawData.length > 0 && graphRawGroupData.length > 0 && graphContainerRef.current !== null ) {
            if( graphContainerRef.current.childNodes.length == 0 ) { // if comes from different tab
                generateChart()
            }
        }
    })

    useEffect(() => {
        if( graphRef.current != undefined &&  graphRef.current !== null && graphRawGroupData.length > 0 && graphRawData.length > 0 && !isLoadingCharts ) {
            let fontSize = 18, step = 1, verticalRatio = 0.5
            if( visualizerBarSize == '100%' ) {
                if(defaultSize != '0') {
                    step = 3
                    verticalRatio = 0.2
                } 
            } else if(visualizerBarSize == '30%') {
                fontSize = 18
                step = 8
            }
            const height = graphContainerRef.current.parentNode !== null ? graphContainerRef.current.parentNode.parentNode !== null ? `${graphContainerRef.current.parentNode.parentNode.clientHeight - 50 }px` : `${graphContainerRef.current.parentNode.clientHeight - 50 }px` : '100%'
            options = { ...options, axisFontSize: fontSize, height, yStep: step, verticalRatio }
            graphRef.current.setOptions(options)
            graphRef.current.redraw()
        }
    }, [ visualizerBarSize, analyticsBar, defaultSize, commentBar, illustrationBar, customerBarSize, companyBarSize ]) 


    useEffect(() => {
        if(assetIllustration != null && Object.keys(assetIllustration).length > 0) {
            /* if((selectedAssetAssignments.length == 1 && selectedCategory == 'correct_details') || selectedRow.length == 1) { */
                if((selectedAssetAssignments.length == 1 ) || selectedRow.length == 1) {
                setAssets(assetIllustration)
                if(assetIllustrationData != null ) {                    
                    dispatch(
                        setPDFFile(
                          { 
                            document: assetIllustrationData.line[0].document1, 
                            form: assetIllustrationData.line[0].document1_form, 
                            agreement: assetIllustrationData.line[0].document1_agreement 
                          }
                        )
                    )
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

    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)

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
        console.log('range, year', range, year)
        setValueYear(year)
        setScopeRange([])
        const yearList = []
        const promise = filterYear.map( r => {
            if(r.value >= year[0] && r.value <= year[1]){
                yearList.push(parseInt(r.label))
            }
        })
        await Promise.all(promise)
        findCPCList([...scopeRange], filterList, yearList, range)      
    }, [filterList])

    const onChangeRangeSlider = useCallback(async (range) => {
        // Depth
        setPreValueRange(prevItem => prevItem != valueRange ? valueRange : prevItem)
        setValueRange(range) 
        setScopeRange([])
        findCPCList([...scopeRange], filterList, valueYear, range)      
    }, [ filterList, scopeRange, valueRange ] )

    
    const onChangeScopeSlider = useCallback(async (year, range, scope) => {
        // A, B, .... H
        newRange = scope
        setValueScope(scope)
        const scopeList = []
        const promise = scopeRange.map( r => {
            if(r.value >= scope[0] && r.value <= scope[1]){
                scopeList.push(r.code)
            }
        })
        await Promise.all(promise)
        findCPCList([...scopeRange], filterList, year, range, scopeList)        
    }, [ filterList, scopeRange ] )

    if(showContainer === false) return null 

    return (
        <Paper className={classes.root} square>  
            <div className={classes.graphContainer}>                
                {
                    selectedTab === 0
                    ?
                        !isLoadingCharts
                        ?
                            <>
                                <div className={classes.sliderContainer}>
                                    {
                                        typeof standalone === 'undefined' && (
                                            <FullScreen componentItems={menuItems}/>
                                        )
                                    }
                                    
                                    <IconButton onClick={handleOpenFilter} className={classes.settingBtn}>
                                        <svg style={{width: '24px', fill: '#fff'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M5 11.86V29a1 1 0 0 0 2 0V11.86A4 4 0 0 0 7 4.14V3A1 1 0 0 0 5 3V4.14a4 4 0 0 0 0 7.72zM6 6A2 2 0 1 1 4 8 2 2 0 0 1 6 6zM27 12.14V3a1 1 0 0 0-2 0v9.14a4 4 0 0 0 0 7.72V29a1 1 0 0 0 2 0V19.86a4 4 0 0 0 0-7.72zM26 18a2 2 0 1 1 2-2A2 2 0 0 1 26 18zM16 30a1 1 0 0 0 1-1V23.86a4 4 0 0 0 0-7.72V3a1 1 0 0 0-2 0V16.14a4 4 0 0 0 0 7.72V29A1 1 0 0 0 16 30zM14 20a2 2 0 1 1 2 2A2 2 0 0 1 14 20z" /></svg> 
                                    </IconButton>                                    
                                </div>
                                <div
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    filter: `blur(${isLoadingCharts ? '4px' : 0})`,
                                    }}
                                    ref={graphContainerRef}
                                    className={classes.timeline}
                                />
                            </>
                        :
                            <Loader />
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
                            label={tab}
                            classes={{ root: classes.tab }}
                        />
                    )) 
                }
            </Tabs> 
            <Dialog
                open={openModal}
                onClose={handleClose}
                className={classes.modal}
                PaperComponent={PaperComponent}
                aria-labelledby="year-cpc-assets"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title"></DialogTitle>
                <DialogContent>
                    <AssetsList loading={assetLoading} assets={assets} remoteAssetFromList={remoteAssetFromList}/>
                </DialogContent>
            </Dialog>    
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
                    <FilterCPC onClose={handleClose} depthRange={depthRange} scopeRange={scopeRange} yearRange={filterYear} yearRangeText={yearRangeText} depthRangeText={depthRangeText} scopeRangeText={scopeRangeText} valueScope={valueScope} valueRange={valueRange} valueYear={valueYear} onChangeRangeSlider={onChangeRangeSlider} onChangeScopeSlider={onChangeScopeSlider} onChangeYearSlider={onChangeYearSlider}/>
                </DialogContent>
            </Dialog>   
        </Paper> 
    )
}




export default InventionVisualizer