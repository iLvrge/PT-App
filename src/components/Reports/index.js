import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import { Grid, IconButton, Paper}  from '@mui/material'
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux'
import useStyles from './styles'
import clsx from 'clsx'
import moment from 'moment'
import CardElement from './CardElement'
import { Fullscreen, Close, Public, BarChart, AutoGraph, BubbleChart, Speed, AppsOutage, ViewTimeline, TryRounded} from '@mui/icons-material';

import { 
    setDashboardPanel,
    setTimelineScreen,
    setDashboardScreen,
    setPatentScreen, 
    toggleFamilyItemMode,
    updateViewDashboard,
    setViewDashboardIntial,
    setLoadingDashboardData} from '../../actions/uiActions'
import { setAssetsIllustration, setBreadCrumbsAndCategory, setSwitchAssetButton, setDashboardPanelActiveButtonId,  retrievePDFFromServer, setAssetTypesSelect, setSelectedAssetsPatents, getAssetDetails  } from '../../actions/patentTrackActions2'
import { assetLegalEvents, setAssetLegalEvents, setPDFView, setPDFFile, setConnectionData, setConnectionBoxView, assetFamilySingle, assetFamily,   } from '../../actions/patenTrackActions';
import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar'
import { controlList } from "../../utils/controlList"

import PatenTrackApi from '../../api/patenTrack2'
import routeList from '../../routeList'
import GeoChart from '../common/AssetsVisualizer/GeoChart'
import InventionVisualizer from '../common/AssetsVisualizer/InventionVisualizer'
import SankeyChart from './SankeyChart'
import Loader from '../common/Loader'
import AddToolTip from './AddToolTip'

const Reports = (props) => {
    let LIST = [
        {
            title: 'Chain-of-Title',
            tooltip: 'Patent assets owned by the company, with ownership defects along the chain of title, such as rights not transferred by inventors.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1,
            list: [],
            id: 1
        },
        {
            title: 'To Record',
            tooltip: '37 CFR § 1.46 Application for patent by an assignee: (b)(1) If the applicant is the assignee, documentary evidence of ownership ( e.g., assignment for an assignee, employment agreement for a person to whom the inventor is under an obligation to assign the invention) should be recorded as provided for in part 3 of this chapter no later than the date the issue fee is paid in the application.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 22,
            list: [],
            id: 2
        },
        {
            title: 'To Divest',
            tooltip: 'Patent assets covering technological areas which are far from the company\’s core technology.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 21,
            list: [],
            id: 3
        },
        {
            title: 'To Monetize',
            tooltip: 'Patent assets that are assigned to the company under a stated corresponding agent which is different from those currently employed by the company.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 20,
            list: [],
            id: 4
        },
        {
            title: 'Names',
            tooltip: 'Patent assets assigned under incorrect names, and unlikely to be found in a name search.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17,
            list: [],
            id: 5
        },
        {
            title: 'Addresses',
            tooltip: 'Patent assets assigned under incorrect addresses.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 19,
            list: [],
            id: 6
        },
        {
            title: 'Deflated Collateral',
            tooltip: 'The list of collateralized patent assets that have expired since the collateralization day.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 26,
            list: [],
            id: 7
        },
        {
            title: 'Encumbrances',
            tooltip: 'Patent assets subject to third party rights, which could harm the patents’ liquidity.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18,
            list: [],
            id: 8
        },
        {
            title: 'Maintainance',
            tooltip: 'Patents for which the company paid surcharge fees due to late payment of maintenance fees.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 23,
            id: 9
        },
        {
            title: 'Recordings',
            tooltip: 'Patent assets exposed to third party\'s rights due to recording that was beyond 45 days from the transaction\’s execution date.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 25,
            list: [],
            id: 10
        },
        {
            title: 'Corrections',
            tooltip: 'Patent assets with recording that later on were corrected.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 24,
            list: [],
            id: 11
        },
        {
            title: 'Challenged',
            tooltip: 'The list of patents the validity of which has been challenged.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 27,
            list: [],
            id: 12
        }
    ];

    let BANK_LIST = [
        {
            title: 'Client Transactions',
            tooltip: 'Patent assets owned by the company, with ownership defects along the chain of title, such as rights not transferred by inventors.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 21,
            display_type: 'timeline',
            list: []
        },
        {
            title: 'Collteralized Assets',
            tooltip: 'Patent assets assigned under incorrect names, and unlikely to be found in a name search.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17,
            display_type: 'numbers'
        },
        {
            title: 'Non-Expired Collaterals',
            tooltip: 'Patent assets subject to third party rights, which could harm the patents’ liquidity.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Non-Client\'s Collaterals',
            tooltip: 'Patent assets assigned under incorrect addresses.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 19,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Invalid Collateral',
            tooltip: 'Patent assets that are assigned to the company under a stated corresponding agent which is different from those currently employed by the company.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 20,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Broken Chain of Title',
            tooltip: 'Patent assets covering technological areas which are far from the company’s core technology.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Expired Collaterals',
            tooltip: 'Abandoned, yet acknowledged, patent assets which could be sold to interested parties.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 22,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Conflicting Transactions',
            tooltip: 'Patents for which the company paid surcharge fees due to late payment of maintenance fees.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 23,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Encumbtrances',
            tooltip: 'Patent assets with recording that later on were corrected.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 24,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Late Recordings',
            tooltip: 'Patent assets exposed to third party\'s rights due to recording that was beyond 45 days from the transaction\’s execution date.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 25,
            display_type: 'gauge',
            list: []
        },
        {
            title: 'Client Current Assets',
            tooltip: 'The list of collateralized patent assets that have expired since the collateralization day.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 26,
            display_type: 'numbers'
        },
        {
            title: 'Other Banks',
            tooltip: 'The list of patents the validity of which has been challenged.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 27,
            display_type: 'timeline',
            list: []
        }
    ]

    const KPI_LIST = [
        {
            title: 'Owned',
            tooltip: 'The USA assets assigned to the company from its inventors, plus assets acquired by the company, minus those that were sold, expired  and abandoned.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 30,
        },
        {
            title: 'Invented',
            tooltip: 'The USA assets acquired by the company, minus those that were sold, expired and abandoned',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 31,
        }, 
        {
            title: 'Acquired',
            tooltip: 'The USA assets assigned to the company from its inventors and others, minus those that were sold, expired or abandoned',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 32,
        },
        {
            title: 'Collateralized',
            tooltip: 'Patents the company abandoned, i.e. for which the company has not paid maintenance fees.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 34
        },
        {
            title: 'Maintenance Fee Due',
            tooltip: 'Maintenance fees to be paid in the next twelve months.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '', 
            type: 35,
            currency: true
        },
        {
            title: 'Challenged (PTAB)',
            tooltip: 'Non-abandoned patents applications the company acquired from third parties.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 37
        },
        {
            title: 'Divested',
            tooltip: 'Patent applications which are still in the process of prosecution.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 33
        },
        {
            title: 'Abandoned',
            tooltip: 'Non-abandoned patent applications filed by the company\’s employees.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 36
        },
        {
            title: 'Non-U.S. Members',
            tooltip: 'Countries in which the company has the largest number of patents.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 38,
            list: []
        },
        {
            title: 'Proliferate Inventors',
            tooltip: 'Company\’s employees with the largest number of inventions.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 39,
            list: []
        },
        {
            title: 'Law Firms',
            tooltip: 'The company\’s law firms with the largest number of registered transactions.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 40,
            list: []
        },
        {
            title: 'Lenders',
            tooltip: 'Banks and lending institutions to which the company secured its patents as collateral.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 41,
            list: [] 
        }
    ]
    const TIMELINE_LIST = [
        {
            title: 'Acquisitions',
            standalone: false,
            rf_id: '',
            type: 1,
            list: [] 
        },
        {
            title: 'Divestitures',
            standalone: false,
            rf_id: '',
            type: 2,
            list: []
        },
        {
            title: 'Licensing',
            standalone: false,
            rf_id: '',
            type: 3,
            list: []
        },
        {
            title: 'Collateralization',
            standalone: false,
            rf_id: '',
            type: 4,
            list: []
        },
        {
            title: 'Invention',
            standalone: false,
            rf_id: '',
            type: 5,
            list: []
        },
        {
            title: 'Litigation',
            standalone: false,
            rf_id: '',
            type: 6,
            list: []
        }
    ]

    const BANK_TIMELINE_LIST = [
        {
            title: '',
            standalone: false,
            rf_id: '',
            type: 7,
            list: []
        }
    ]

    const GRID_ITEM = {
        lg:3,
        md:3,
        sm:3,
        xs:3,
        xl:3
    }
    const TIMELINE_ITEM = {
        lg:6,
        md:6,
        sm:6,
        xs:6,
        xl:6
    }

    const BANK_TIMELINE_ITEM = {
        lg: 12,
        md: 12,
        sm: 12,
        xs: 12,
        xl: 12,
    }
    const KPI_TYPE = [30,31,32,33,34,35,36,37,38,39,40,41];
    const GAUGE_TYPE = [1, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
    const classes = useStyles();
    const history = useHistory()
    const dispatch = useDispatch();
    const DATE_FORMAT = 'MMM DD, YYYY'
    const ref = useRef();
    let resizeObserver = null
    const [loading, setLoading] = useState(false)    
    const [timeLineLoading, setTimeLineLoading] = useState(false)    
    const [timelineGrid, setTimelineGrid] = useState(TIMELINE_ITEM)
    const [grid, setGrid] = useState(GRID_ITEM)
    const [smallScreen, setSmallScreen] = useState(false)
    const [activeId, setActiveId] = useState(-1)
    const profile = useSelector(state => (state.patenTrack.profile))    
    const [cardList, setCardList] = useState([])
    const [timelineList, setTimelineList] = useState(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_TIMELINE_LIST : TIMELINE_LIST)
    const viewDashboard = useSelector(state => state.ui.viewDashboard)
    const viewInitial = useSelector(state => state.ui.viewInitial)
    const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected); 
    const selectedAssetAssignments = useSelector(
        state => state.patenTrack2.assetTypeAssignments.selected,
    ); 
    const assetTypeAssignmentAssets = useSelector(
        state => state.patenTrack2.assetTypeAssignmentAssets.list,
    ); //Assets List 
    const dashboardPanelActiveButtonId = useSelector(state => state.patenTrack2.dashboardPanelActiveButtonId) 
    
    useEffect(() => {
        if(ref.current !== null) {
            resizeObserver = new ResizeObserver(entries => {  
                let smallScreen = false         
                const { width } = entries[0].contentRect;
                let newGridItems = {...GRID_ITEM}, newTimelineGrid = {...TIMELINE_ITEM}
                if(width > 510 && width < 601 ) {
                    smallScreen = true
                    newGridItems = {
                        lg:6,
                        md:6,
                        sm:6,
                        xs:6,
                        xl:6
                    }
                } else if (width > 600 && width < 900) {
                    newGridItems = {
                        lg:4,
                        md:4,
                        sm:4,
                        xs:4,
                        xl:4
                    }
                } else if (width > 0 && width < 510) {
                    smallScreen = true
                    newGridItems = {
                        lg: 12,
                        md: 12,
                        sm: 12,
                        xs: 12,
                        xl: 12
                    }  
                    newTimelineGrid = {...newGridItems}
                } 
                setGrid(newGridItems)
                if(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank'){
                    setTimelineGrid(newTimelineGrid)
                }
                setSmallScreen(smallScreen)  
            })
                     
            resizeObserver.observe(ref.current)
            return () => {
                if(resizeObserver) {
                    resizeObserver.disconnect();
                }
            }
        }        
    }, []) 

    useEffect(() => {
        if(dashboardPanelActiveButtonId != activeId) {
            setActiveId(dashboardPanelActiveButtonId)
            if(dashboardPanelActiveButtonId != -1) {
                props.checkChartAnalytics(null, null, dashboardPanelActiveButtonId != -1 ? true : false)
            }
        }
    }, [dashboardPanelActiveButtonId])

    useEffect(() => { 
        if(viewDashboard.timeline === true) {
            setTimelineList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST])
        } else if(viewDashboard.kpi === true || viewDashboard.line === true || viewDashboard.gauge === true){ 
            addCardList(viewDashboard.kpi === true ? 1 : '')  
        } 
    }, [viewDashboard])

    useEffect(() => {
        if(viewInitial === false) {
            if(selectedCompanies.length > 0) {
                if(viewDashboard.timeline === true && timelineList.length > 0) {
                    callTimelineData()
                } else if(cardList.length > 0){
                    findDashboardData()
                }
            }
        }
    }, [cardList, timelineList])

    

    /* useEffect(() => {
        if(viewInitial === false) {
            if(selectedCompanies.length > 0) {
                console.log('SECOND')
                if(viewDashboard.timeline === true) {
                    callTimelineData()
                } else {
                    findDashboardData()
                }                
            } else {   
                if(viewDashboard.timeline === true) {
                    setTimelineList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST])
                } else {
                    addCardList(viewDashboard.kpi === true ? 1 : '')  
                }                
            }
        }
    }, [viewInitial]) */


    useEffect(() => {
        if(profile?.user?.organisation?.organisation_type) {
            setTimelineList(profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST])
            setTimelineGrid(profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? BANK_TIMELINE_ITEM : TIMELINE_ITEM)
        }
    }, [profile])
   
    /**
     * Get Dashboard data
     */
    useEffect(() => {
        if(typeof props.dashboardData !== 'undefined' && props.dashboardData.length > 0) {
            setLoading(false)
            dispatch(setLoadingDashboardData(false))
            setCardList(props.dashboardData)
            if(typeof props.dashboardTimelineData !== 'undefined' && props.dashboardTimelineData.length > 0) {
                setTimelineList(props.dashboardTimelineData)
            }
        }  else {
            if(selectedCompanies.length > 0 ) {
                if(viewDashboard.timeline === true && timelineList.length > 0) {
                    callTimelineData()
                } else if(cardList.length > 0){
                    findDashboardData()
                }
            } else {   
                if(viewDashboard.timeline === true) {
                    setTimelineList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST])
                } else {
                    addCardList(!viewDashboard.line && viewDashboard.jurisdictions == false && viewDashboard.invention === false && viewDashboard.sankey === false && viewDashboard.kpi === false && viewDashboard.timeline === false ? 0 : viewDashboard.kpi === true ? 1 : '')  
                }
            }
        }
        return (() => {})
    },  [
            selectedCompanies, 
            assetTypesSelected, 
            selectedAssetCompanies, 
            selectedAssetAssignments, 
            assetTypeAssignmentAssets, 
            assetTypeCompanies
        ]
    )


    const companyname = useMemo(() => {
        return selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
    }, [selectedCompanies, companiesList])

    const partyName = useMemo(() => {
        return selectedAssetCompanies.length > 0 && assetTypeCompanies.filter( party => party.id === selectedAssetCompanies[0])
    }, [selectedAssetCompanies, assetTypeCompanies])

    
    const findDashboardData = async(invention, jurisdictions, sankey, kpi) => {        
        if(loading === false && ((typeof invention !== 'undefined' && invention === false) ||  viewDashboard.invention === false) && ((typeof jurisidictions !== 'undefined' && jurisdictions === false) || viewDashboard.jurisdictions === false ) && ((typeof sankey !== 'undefined' && sankey === false) || viewDashboard.sankey === false) ) { 
            const list = [];
            let totalRecords = 0;
            setLoading(true)
            dispatch(setLoadingDashboardData(true))
            resetAll(false)
            props.checkChartAnalytics(null, null, false) 
            dispatch(setViewDashboardIntial(true))
            if(viewDashboard.line === true || (profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank')) {
                const cancelRequest = await PatenTrackApi.cancelAllDashboardToken()  
                const CancelToken = PatenTrackApi.generateCancelToken() 
                const source = CancelToken.source()
                const dashboardRequest = cardList.map(async item => {
                    const formData = new FormData()
                    formData.append('list', JSON.stringify(list));
                    formData.append('total', totalRecords);
                    formData.append('selectedCompanies', JSON.stringify(selectedCompanies));
                    formData.append('tabs', JSON.stringify(assetTypesSelected));
                    formData.append('customers', JSON.stringify(selectedAssetCompanies));
                    formData.append('assignments', JSON.stringify(selectedAssetAssignments));
                    formData.append('type', item.type)
                    formData.append('data_format',  profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? 0 : 1)
                    formData.append('format_type', profile.user.organisation.organisation_type)  
                    formData.append('company', companyname[0].original_name )              
                    const requestData = await PatenTrackApi.getDashboardData(formData, source)
                    if( requestData !== null){
                        updateList(requestData, item.type)
                    }
                    return item
                })                
                await Promise.all(dashboardRequest)
            } else {
                const type = viewDashboard.kpi === true ? [...KPI_TYPE] : [...GAUGE_TYPE]
                const cancelRequest = await PatenTrackApi.cancelAllDashboardCountToken()  
                const CancelToken = PatenTrackApi.generateCancelToken() 
                const source = CancelToken.source()
                const formData = new FormData()
                formData.append('list', JSON.stringify(list));
                formData.append('total', totalRecords);
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies));
                formData.append('tabs', JSON.stringify(assetTypesSelected));
                formData.append('customers', JSON.stringify(selectedAssetCompanies));
                formData.append('assignments', JSON.stringify(selectedAssetAssignments));
                formData.append('type', JSON.stringify(type))
                formData.append('data_format',  0)
                formData.append('format_type', profile.user.organisation.organisation_type)  
                formData.append('company', companyname[0].original_name )              
                const requestData = await PatenTrackApi.getDashboardDataCount(formData, source)
                if( requestData !== null){
                    const {data} = requestData
                    let oldList = [...cardList]
                    if(data.length == 0) {
                        oldList.map((item, index) => {
                            oldList[index].patent = ''
                            oldList[index].application = ''
                            oldList[index].rf_id = ''
                            oldList[index].total = 0 
                            oldList[index].number = 0  
                            if(typeof oldList[index].other_number !== 'undefined'){
                                oldList[index].other_number = 0
                            }
                            if(typeof oldList[index].list !== 'undefined'){
                                oldList[index].list = []
                            }
                        })
                    } else {
                        const dashboardPromise = data.map( item => {
                            const findIndex = oldList.findIndex( row => row.type == item.type)
                            if(findIndex !== -1) {
                                let {other} = item
                                if(other != '' && other !== null) {
                                    other = JSON.parse(other)
                                }
                                if( Array.isArray(other) && other.length > 0) {
                                    oldList[findIndex].list = [...other]
                                    oldList[findIndex].patent = ''
                                    oldList[findIndex].application = ''
                                    oldList[findIndex].rf_id = ''
                                    oldList[findIndex].total = item.total  
                                    oldList[findIndex].number = 0           
                                } else if( item?.number) {
                                    oldList[findIndex].number = item.number
                                    oldList[findIndex].patent = ''
                                    oldList[findIndex].application = ''                            
                                    oldList[findIndex].rf_id = ''                            
                                    oldList[findIndex].total = item.total
                                    if(typeof item.other_number !== 'undefined') {
                                        oldList[findIndex].other_number = item.other_number          
                                    }
                                } else {
                                    oldList[findIndex].number = 0
                                    oldList[findIndex].patent = ''
                                    oldList[findIndex].application = ''
                                    oldList[findIndex].total = 0
                                    if(typeof oldList[findIndex].other_number !== 'undefined'){
                                        oldList[findIndex].other_number = 0
                                    }
                                }
                            }
                        })
                        await Promise.all(dashboardPromise)
                        setCardList(oldList)
                        if(typeof props.updateDashboardData !== 'undefined') {
                            props.updateDashboardData(oldList)
                        }
                    }
                    
                    if(viewDashboard.kpi === true) {
                        formData.delete('type')
                        formData.append('type', 37)
                        const CancelToken = PatenTrackApi.generateCancelToken() 
                        const source = CancelToken.source()
                        const newRequestData = await PatenTrackApi.getDashboardData(formData, source)
                        if( newRequestData !== null){
                            updateList(newRequestData, 37)
                        }
                    }
                } 
            }
            setLoading(false)           
            dispatch(setLoadingDashboardData(false))
        }
    }

    const callTimelineData = useCallback(async() => {
        setLoading(true)
        dispatch(setLoadingDashboardData(true))
        resetAll(false)
        setTimeLineLoading(true)
        const cancelRequest = await PatenTrackApi.cancelAllDashboardTimelineToken()  
        const CancelToken = PatenTrackApi.generateCancelToken() 
        const source = CancelToken.source()
        dispatch(setViewDashboardIntial(true))
        const dashboardRequest = timelineList.map(async item => {
            const formData = new FormData()
            formData.append('selectedCompanies', JSON.stringify(selectedCompanies));
            formData.append('type', item.type)             
            formData.append('customers', JSON.stringify(selectedAssetCompanies));
            const requestData = await PatenTrackApi.getDashboardTimelineData(formData, source)
            if( requestData !== null){
                updateTimelineList(requestData, item.type)
            }
            return item
        })                
        Promise.allSettled(dashboardRequest).then((dashboardRequest) => {
            const newTimeline = profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST]
            newTimeline.forEach( (item, index) => {
                const findIndex = dashboardRequest.findIndex( row => row.status === "fulfilled" && row.value.type === item.type ) 

                if(findIndex !== -1) {
                    newTimeline[index].list = [...dashboardRequest[findIndex].value.list]
                }
            })
            setTimelineList(newTimeline)
            if(typeof props.updateDashboardTimelineData !== 'undefined') {
                props.updateDashboardTimelineData(newTimeline)
            }
            setTimeLineLoading(false)
        })
        setLoading(false)   
        dispatch(setLoadingDashboardData(false))
    }, [timelineList, selectedCompanies, selectedAssetCompanies, profile] )

    const resetAll = (flag) => {
        dispatch(setDashboardPanel( flag ))
        dispatch(setAssetsIllustration(null))
        dispatch(setAssetLegalEvents([]))
        dispatch(setConnectionBoxView(false))
        dispatch(setPDFView(false))
        dispatch(setPDFFile({ 
            document: '', 
            form: '', 
            agreement: ''
        }))
        if(flag === false) {
            setActiveId(-1)
        }
    }

    const addCardList = (t) => {
        setCardList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_LIST : typeof t != 'undefined' && t === 1 ? KPI_LIST : LIST)
    }

    const updateTimelineList =  useCallback((requestData, type) => {  
        let oldList = [...timelineList]
        const findIndex = oldList.findIndex( item => item.type === type)
        if(findIndex !== -1) {
            if( requestData !== null && requestData.data != null && requestData.data.length > 0) {
                oldList[findIndex].list = [...requestData.data]
            }
        }
        setTimelineList(oldList)
        if(typeof props.updateDashboardTimelineData !== 'undefined') {
            props.updateDashboardTimelineData(oldList)
        }        
    })

    const updateList = useCallback((requestData, type) => {  
        let oldList = [...cardList]
        const findIndex = oldList.findIndex( item => item.type === type) 
        if(findIndex !== -1) {
            if(viewDashboard.line === true ) {
                if( requestData !== null && requestData.data != null && requestData.data.length > 0) {
                    const list = [['Year', 'Assets']]
                    requestData.data.forEach( item => {
                        list.push([typeof item.name !== 'undefined' ? item.name : item.year, parseInt(item.number)])
                    })                    
                    oldList[findIndex].list = list
                    oldList[findIndex].patent = requestData.data[0].patent
                    oldList[findIndex].application = requestData.data[0].application
                    oldList[findIndex].rf_id = requestData.data[0].rf_id
                } else {
                    oldList[findIndex].list = []
                    oldList[findIndex].patent = ''
                    oldList[findIndex].application = ''
                    oldList[findIndex].rf_id = 0
                }
            } else { 
                if( requestData !== null && requestData.data != null && Array.isArray(requestData.data) && requestData.data.length > 0) {
                    oldList[findIndex].list = [...requestData.data]
                    oldList[findIndex].patent = requestData.data[0].patent
                    oldList[findIndex].application = requestData.data[0].application
                    oldList[findIndex].rf_id = requestData.data[0].rf_id
                    oldList[findIndex].total = requestData.data[0].total  
                    oldList[findIndex].number = 0           
                } else if( requestData !== null && requestData?.data && requestData?.data?.number){
                    oldList[findIndex].number = requestData.data.number
                    oldList[findIndex].patent = requestData.data.patent != '' ? requestData.data.patent : ''
                    oldList[findIndex].application = requestData.data.application != '' ? requestData.data.application : ''                            
                    oldList[findIndex].rf_id = requestData.data.rf_id != '' ? requestData.data.rf_id : ''                            
                    oldList[findIndex].total = requestData.data.total
                    if(typeof requestData.data.other_number !== 'undefined') {
                        oldList[findIndex].other_number = requestData.data.other_number          
                    }
                } else {
                    oldList[findIndex].number = 0
                    oldList[findIndex].patent = ''
                    oldList[findIndex].application = ''
                    oldList[findIndex].total = 0
                    if(typeof oldList[findIndex].other_number !== 'undefined'){
                        oldList[findIndex].other_number = 0
                    }
                }
            }            
            setCardList(oldList)
            if(typeof props.updateDashboardData !== 'undefined') {
                props.updateDashboardData(oldList)
            }
        }      
    }, [cardList, viewDashboard])

    useEffect(() => {
        if(activeId  !== -1 ) {
            //scrollToActive item when the right pane open
            const container = ref.current
            if(container !== null){
                setTimeout(() => {
                    const listItemsContainer = container.querySelector('.listItems')
                    const findIndex = cardList.findIndex( item => item.type == activeId) 
                    if(findIndex !== -1) {
                        listItemsContainer.scroll(0, listItemsContainer.querySelectorAll('.box_item')[findIndex].offsetTop - 50)
                    }
                }, 1000)
            }
        }
    }, [activeId])

    const onHandleClick = useCallback(async(id) => {
        const findIndex = cardList.findIndex( item => item.type == id) 
        let card = {}
        if(findIndex !== -1) {
            card = cardList[findIndex]
        } 
        if(card.number > 0 || (card?.list && card.list.length > 0)) {
            
            let showItem = id != activeId ? true : false
            setActiveId(id != activeId ? id : -1)
            resetAll(showItem)       
            dispatch(setDashboardPanelActiveButtonId( id != activeId ? id : -1 ))        
            props.checkChartAnalytics(null, null, showItem)
            if(showItem === true) {
                const type = viewDashboard.kpi === true ? [...KPI_TYPE] : [...GAUGE_TYPE]
                const formData = new FormData()
                formData.append('list', []);
                formData.append('total', 0);
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies));
                formData.append('tabs', JSON.stringify(assetTypesSelected));
                formData.append('customers', JSON.stringify(selectedAssetCompanies));
                formData.append('assignments', JSON.stringify(selectedAssetAssignments));
                formData.append('type', JSON.stringify(type))
                formData.append('data_format',  0)
                formData.append('format_type', profile.user.organisation.organisation_type)  
                formData.append('company', companyname[0].original_name )              
                const {data} = await PatenTrackApi.findDashboardExample(formData)
                if(data != null) {
                    if(card.type == 38 && profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank'){
                        /**
                         * Family
                         */
                        dispatch(setSelectedAssetsPatents([data.patent, '']));
                        dispatch(assetFamily(data.patent));
                    } else  if(card.type == 1 || card.type == 18 || card.type == 21 || card.type == 22 || card.type > 25 ) {
                        dispatch(
                            setAssetsIllustration({
                                type: "patent",
                                id: data.patent !== '' ? data.patent : data.application,
                                flag: data.patent !== '' ? 1 : 0
                            }),
                        );
                    } else if (card.type == 17) {
                        dispatch(setAssetsIllustration({ type: "transaction", id: data.rf_id }));
                    } else if(card.type == 20 || card.type == 23) {
                        dispatch(getAssetDetails(data.application, data.patent))
                        dispatch(assetLegalEvents(data.application, data.patent));
                    } else if(card.type == 19 || card.type == 24 || card.type == 25) {
                        const { data } = await PatenTrackApi.getCollectionIllustration(data.rf_id)
                        if(data != null) {                        
                            const obj = data.line.length > 0 ? data.line[0] : null
                            if(obj != null) {
                                dispatch(
                                    setConnectionData(obj)
                                ) 
                                dispatch(
                                    setPDFView(true)
                                )
                                dispatch(
                                    setConnectionBoxView(true)
                                )
                                if(obj.document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document1 == "" && obj.ref_id > 0)) {
                                    obj.rf_id =  obj.ref_id
                                    dispatch(retrievePDFFromServer(obj))   
                                } else {
                                    dispatch(
                                        setPDFFile(
                                          { 
                                            document: obj.document1, 
                                            form: obj.document1, 
                                            agreement: obj.document1 
                                          }
                                        )
                                    ) 
                                }                         
                            }                        
                        } 
                    }  
                } 
            }
        }
    }, [dispatch, activeId, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, cardList])

    const onHandleList = useCallback((id) => {
        /* process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' */
        let subscription = parseInt(profile?.user?.organisation?.subscribtion), timeline = false, patent = false, maintainence = false
        
        if( subscription === 2 || subscription === 3 ) {
            let findIndex = -1
            if(id === 1 && viewDashboard.kpi === false) {                
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
                patent = true
            } else if(id === 17 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_names')
                patent = true
            } else if(id === 18 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'clear_encumbrances')
                patent = true
            } else if(id === 19 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_address')
                timeline = true
            } else if(id === 20 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'to_be_monitized')
                patent = true
            } else if(id === 21 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'unnecessary_patents')
                patent = true
            } else if(id === 22 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'missed_monetization')
                patent = true
            } else if(id === 23 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'late_maintainance')
                patent = true
            } else if(id === 24 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_recording')
                timeline = true
            } else if(id === 25 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'late_recording')
                timeline = true
            } else if(id === 26 && subscription > 2  && viewDashboard.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'deflated_collaterals')
                patent = true
            } else if(id === 30 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'assigned')
                patent = true
            } else if(id === 31 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'filled')
                patent = true
            } else if(id === 32 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'acquired')
                patent = true
            } else if(id === 33 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'divested')
                patent = true
            } else if(id === 34 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'collaterlized')
                patent = true
            } else if(id === 36 && subscription > 1 && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'abandoned')
                patent = true
            } else if(id === 37 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'ptab')
                patent = true
            } else if(id === 35 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'pay_maintainence_fee')
                maintainence = true
            } else if(id === 38 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'top_non_us_members')
                patent = true
            } else if(id === 39 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'proliferate_inventors')
                timeline = true
            } else if(id === 40 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'top_law_firms')
                timeline = true
            } else if(id === 41 && subscription > 1  && viewDashboard.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'top_lenders')
                timeline = true
            } /*else if(id === 8 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'pay_maintainence_fee')
                patent = true
            } else if(id === 3 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'clear_encumbrances')
                timeline = true
            } else if(id === 4 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'correct_names')
                timeline = true
            }*/
            
            if( findIndex !== -1 ) {
                resetAllRowSelect(dispatch, resetItemList.resetAll, profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [1, 9, 10] :  [])
                resetAllRowSelect(dispatch, resetItemList.clearOtherItems, profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [14, 15] :  controlList[findIndex].category == 'proliferate_inventors' || controlList[findIndex].category == 'top_lenders' ? [14, 15] :  [])
                setTimeout(() => { 
                    dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))                
                    if(id === 0) {
                        dispatch(setSwitchAssetButton(1))
                    } 
                })
                if(controlList[findIndex].category == 'proliferate_inventors') {
                    /**
                     * Inventor
                     * select Inventor activity type
                     * Open Inventor Table
                     * 
                     */
                    dispatch( setAssetTypesSelect([10]) )
                    if(props.openInventorBar === false) {
                        props.handleInventorBarOpen()
                    }
                    if(props.assignmentBar === true) {
                        props.assignmentBarToggle()
                    }
                }  
                if(controlList[findIndex].category == 'top_lenders') {
                    /**
                     * Select Lending activity type
                     */
                    dispatch( setAssetTypesSelect([81]) )
                    if(props.openOtherPartyBar === false) {
                        props.handleOtherPartyBarOpen()
                    }
                }
                dispatch(setDashboardScreen(false))
                dispatch(setTimelineScreen(timeline))
                dispatch(setPatentScreen(patent))
                if(patent === true) {
                    history.push(routeList.patent_assets)  
                }
                if(maintainence === true) {
                    history.push(routeList.pay_maintainence_fee)  
                }
                if(props.openCustomerBar === false && timeline === false){
                    props.handleCustomersBarOpen()
                }
                if(props.openCommentBar === false){
                    props.handleCommentBarOpen()
                }                             
            }
        }
    }, [dispatch, profile, activeId, selectedAssetCompanies, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, props.openCustomerBar, props.openCommentBar, viewDashboard, props.openInventorBar, props.assignmentBar, props.openOtherPartyBar])

    

    const handleTimelineFullScreen = (type) => {
        const list = [...timelineList]
        const findIndex = list.findIndex( item => item.type === type)

        if(findIndex !== -1) {
            list[findIndex].standalone = !list[findIndex].standalone
        }
        setTimelineList(list)
    }

    const showItems = cardList.map( (card, index) => {
        let displayItems = {kpiEnable: false,  timeline: false}
        if(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'){
            if(card.display_type == 'gauge') {
                displayItems['lineGraph'] = false 
            } else if(card.display_type == 'numbers'){
                displayItems['kpiEnable'] = true 
            } else if(card.display_type == 'timeline'){
                displayItems['timeline'] = true 
            }
        }
        return <Grid
            item  {...grid}
            className={clsx(classes.flexColumn, `box_item`, {['activeItem']: index === activeId})}
            key={`card_${index}`}
        >
            <CardElement 
                card={card}
                id={card.type}
                active={activeId}
                handleClick={onHandleClick}
                handleList={onHandleList}
                type={card.type}  
                grid={grid}
                checkChartAnalytics={props.checkChartAnalytics}
                {...(viewDashboard.kpi === true ? {kpiEnable: true} : {lineGraph: viewDashboard.line})}
                {...(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank') ? {...displayItems} : ''}
            />
        </Grid>
    })

    const showTimelineItems = timelineList.map( (card, index) => {
        return <Grid
            item  {...timelineGrid}
            className={clsx(classes.flexColumn, {[classes.flexColumnFullHeight]: profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? true : false}, `box_item`, {['activeItem']: index === activeId})}
            key={`card_${index}`}
        >
            <CardElement 
                card={card}
                id={card.type}
                active={activeId}
                handleClick={onHandleClick}
                handleList={onHandleList}
                handleFullScreen={handleTimelineFullScreen}
                type={card.type} 
                grid={timelineGrid} 
                timeline={true}
                checkChartAnalytics={props.checkChartAnalytics}
            />
        </Grid>
    })
    
    return (
        <Grid
            container
            className={classes.container}
            justifyContent="flex-start"
            alignItems="flex-start"
            ref={ref}
        >
            {/* <Grid
                item lg={2} md={2} sm={2} xs={2}  
                style={{height: '100%'}}
            >
                <div 
                    className={classes.companyBar}
                    id={`client_container`} >
                    {   
                        <ClientList />
                    }
                </div>
            </Grid> */}
            <Grid
                item lg={12} md={12} sm={12} xs={12} 
            >
                <Paper className={classes.titleContainer} square>
                    <span className={clsx('title', {['small']: smallScreen})}>{ moment(new Date()).format(DATE_FORMAT)}  <span>{companyname.length > 0 ? companyname[0].original_name : ''}</span> {
                        profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' && selectedAssetCompanies.length == 1 && (
                            <span className={classes.headingName}>{partyName[0].entityName}</span>
                        ) 
                    }</span>
                    <div className={classes.toolbar}> 

                        {
                            loading && (
                                <span>Loading...</span>
                            )
                        }
                        
                        <AddToolTip
                            tooltip={'Big screen view.'}
                            placement='bottom'
                        >
                            <IconButton size="small"
                                onClick={() => {props.handleFullScreen(!props.fullScreen)}}
                                className={clsx(classes.actionIcon, typeof viewDashboard.standalone !== 'undefined' ? classes.fontStandalone : '' )}
                            >
                                { typeof props.standalone !== 'undefined' ? <Close/> : <Fullscreen /> }                            
                            </IconButton>   
                        </AddToolTip>
                    </div>
                </Paper>
            </Grid>
            <Grid
                item lg={12} md={12} sm={12} xs={12} 
                className={clsx(classes.list, 'listItems')}
            >
                <Grid  
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    className={classes.container}
                >
                    {
                        viewDashboard.jurisdictions === true
                        ?
                            <GeoChart
                                chartBar={props.chartBar} 
                                openCustomerBar={props.openCustomerBar} 
                                visualizerBarSize={props.visualizerBarSize}
                                type={props.type}
                                tab={false}
                                standalone={true}
                                titleBar={true}
                            />
                        :
                            viewDashboard.invention === true
                            ?
                                <InventionVisualizer 
                                    defaultSize={props.defaultSize} 
                                    visualizerBarSize={props.visualizerBarSize} 
                                    analyticsBar={props.analyticsBar} 
                                    openCustomerBar={props.openCustomerBar} 
                                    commentBar={props.openCommentBar} 
                                    illustrationBar={props.illustrationBar} 
                                    customerBarSize={props.customerBarSize} 
                                    companyBarSize={props.companyBarSize}
                                    type={props.type} 
                                    standalone={true}
                                    tab={false}
                                    titleBar={true}
                                />
                            :    
                                viewDashboard.sankey === true
                                ?
                                    <SankeyChart />
                                :
                                    viewDashboard.timeline === true
                                    ?
                                        showTimelineItems
                                    :
                                        showItems
                    }
                </Grid>                
            </Grid>
        </Grid>
    );
}

export default Reports;