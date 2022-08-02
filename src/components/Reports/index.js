import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import { Grid, IconButton, Paper}  from '@mui/material'
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux'
import useStyles from './styles'
import clsx from 'clsx'
import moment from 'moment'
import CardElement from './CardElement'
import { Fullscreen, Close, Public, BarChart, AutoGraph, BubbleChart, Speed, AppsOutage, ViewTimeline} from '@mui/icons-material';

import { 
    setDashboardPanel,
    setTimelineScreen,
    setDashboardScreen,
    setPatentScreen, 
    toggleFamilyItemMode} from '../../actions/uiActions'
import { setAssetsIllustration, setBreadCrumbsAndCategory, setSwitchAssetButton, setDashboardPanelActiveButtonId,  retrievePDFFromServer  } from '../../actions/patentTrackActions2'
import { assetLegalEvents, setAssetLegalEvents, setPDFView, setPDFFile, setConnectionData, setConnectionBoxView,   } from '../../actions/patenTrackActions';
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
            title: 'Broken Chain-of-Title',
            tooltip: 'Patent assets owned by the company, with ownership defects along the chain of title, such as rights not transferred by inventors.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1,
            list: []
        },
        {
            title: 'Incorrect Names',
            tooltip: 'Patent assets assigned under incorrect names, and unlikely to be found in a name search.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17,
            list: []
        },
        {
            title: 'Encumbrances',
            tooltip: 'Patent assets subject to third party rights, which could harm the patents’ liquidity.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18,
            list: []
        },
        {
            title: 'Wrong Addresses',
            tooltip: 'Patent assets assigned under incorrect addresses.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 19,
            list: []
        },
        {
            title: 'To Be Monitized',
            tooltip: 'Patent assets that are assigned to the company under a stated corresponding agent which is different from those currently employed by the company.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 20,
            list: []
        },
        {
            title: 'Unecessary Patents',
            tooltip: 'Patent assets covering technological areas which are far from the company\’s core technology.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 21,
            list: []
        },
        {
            title: 'Un-Assigned',
            tooltip: '37 CFR § 1.46 Application for patent by an assignee: (b)(1) If the applicant is the assignee, documentary evidence of ownership ( e.g., assignment for an assignee, employment agreement for a person to whom the inventor is under an obligation to assign the invention) should be recorded as provided for in part 3 of this chapter no later than the date the issue fee is paid in the application.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 22,
            list: []
        },
        {
            title: 'Late Maintainance',
            tooltip: 'Patents for which the company paid surcharge fees due to late payment of maintenance fees.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 23
        },
        {
            title: 'Corrected Recordings',
            tooltip: 'Patent assets with recording that later on were corrected.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 24,
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
            list: []
        },
        {
            title: 'Deflated Collateral',
            tooltip: 'The list of collateralized patent assets that have expired since the collateralization day.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 26,
            list: []
        },
        {
            title: 'Challenged',
            tooltip: 'The list of patents the validity of which has been challenged.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 27,
            list: []
        }
    ];

    let BANK_LIST = [
        {
            title: 'Broken Chain-of-Title',
            tooltip: 'Patent assets owned by the company, with ownership defects along the chain of title, such as rights not transferred by inventors.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1,
            list: []
        },
        {
            title: 'Incorrect Names',
            tooltip: 'Patent assets assigned under incorrect names, and unlikely to be found in a name search.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17,
            list: []
        },
        {
            title: 'Encumbrances',
            tooltip: 'Patent assets subject to third party rights, which could harm the patents’ liquidity.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18,
            list: []
        },
        {
            title: 'Other Banks',
            tooltip: 'Patent assets assigned under incorrect addresses.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 19,
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
            list: []
        },
        {
            title: 'Unecessary Patents',
            tooltip: 'Patent assets covering technological areas which are far from the company’s core technology.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 21,
            list: []
        },
        {
            title: 'Expired Patents',
            tooltip: 'Abandoned, yet acknowledged, patent assets which could be sold to interested parties.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 22,
            list: []
        },
        {
            title: 'Recently Expired',
            tooltip: 'Patents for which the company paid surcharge fees due to late payment of maintenance fees.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 23,
            list: []
        },
        {
            title: 'Corrected Recordings',
            tooltip: 'Patent assets with recording that later on were corrected.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 24,
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
            list: []
        },
        {
            title: 'Deflated Collateral',
            tooltip: 'The list of collateralized patent assets that have expired since the collateralization day.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 26,
            list: []
        },
        {
            title: 'Challenged',
            tooltip: 'The list of patents the validity of which has been challenged.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 27,
            list: []
        }
    ]

    const KPI_LIST = [
        {
            title: 'Assigned',
            tooltip: 'The USA patents assigned to the company from its inventors, and patents acquired by the company, minus those that were sold, expired  and abandoned.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 30,
        },
        {
            title: 'Filled',
            tooltip: 'The USA patents acquired by the company, minus those that were sold, expired and abandoned',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 31,
        }, 
        {
            title: 'Acquired',
            tooltip: 'The USA patents assigned to the company from its inventors, minus those that were sold, expired  and abandoned',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 32,
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
            title: 'Maintenance Budget',
            tooltip: 'Expected annual maintenance fees to be paid according to the company’s status and number of non-expired parents it currently owns.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '', 
            type: 35,
            currency: true
        },
        {
            title: 'Non-US Members',
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
            title: 'Employees',
            standalone: false,
            rf_id: '',
            type: 5,
            list: []
        },
        {
            title: 'Court',
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
    const classes = useStyles();
    const history = useHistory()
    const dispatch = useDispatch();
    const DATE_FORMAT = 'MMM DD, YYYY'
    const ref = useRef();
    let resizeObserver = null
    const [initial, setIntial] = useState(true)
    const [loading, setLoading] = useState(false)    
    const [timeLineLoading, setTimeLineLoading] = useState(false)    
    const [timelineGrid, setTimelineGrid] = useState(TIMELINE_ITEM)
    const [grid, setGrid] = useState(GRID_ITEM)
    const [smallScreen, setSmallScreen] = useState(false)
    const [activeId, setActiveId] = useState(-1)
    const profile = useSelector(state => (state.patenTrack.profile))    
    const [cardList, setCardList] = useState(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_LIST : KPI_LIST)
    const [timelineList, setTimelineList] = useState(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_TIMELINE_LIST : TIMELINE_LIST)
    const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const selectedPartyName = useSelector(state => state.patenTrack2.assetTypeCompanies.name);
    const selectedAssetCompaniesAll = useSelector(
        state => state.patenTrack2.assetTypeCompanies.selectAll,
    );
    const selectedAssetAssignments = useSelector(
        state => state.patenTrack2.assetTypeAssignments.selected,
    );
    const selectedAssetAssignmentsAll = useSelector(
        state => state.patenTrack2.assetTypeAssignments.selectAll,
    );

    const assetTypeAssignmentAssets = useSelector(
        state => state.patenTrack2.assetTypeAssignmentAssets.list,
    ); //Assets List
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected
    const dashboardPanelActiveButtonId = useSelector(state => state.patenTrack2.dashboardPanelActiveButtonId) 

    const assetsTotal = useSelector(
        state => state.patenTrack2.assetTypeAssignmentAssets.total_records,
    );


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
        if(initial === false) {
            if(selectedCompanies.length > 0) {
                if(props.timeline === true) {
                    callTimelineData()
                } else {
                    findDashboardData()
                }                
            } else {   
                if(props.timeline === true) {
                    setTimelineList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST])
                } else {
                    console.log('initial')
                    addCardList(props.kpi === true ? 1 : '')  
                }                
            }
        }
    }, [props.lineGraph, props.kpi, props.timeline])

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
            setCardList(props.dashboardData)
            if(typeof props.dashboardTimelineData !== 'undefined' && props.dashboardTimelineData.length > 0) {
                setLoading(false)           
                setTimelineList(props.dashboardTimelineData)
            }
        } else {
            if(selectedCompanies.length > 0) {
                if(props.timeline === true) {
                    callTimelineData()
                } else {
                    findDashboardData()
                }
            } else {   
                if(props.timeline === true) {
                    setTimelineList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST])
                } else {
                    console.log('addCardList2')
                    addCardList(!props.lineGraph && props.jurisdictions == false && props.invention === false && props.sankey === false && props.kpi === false && props.timeline === false ? 0 : props.kpi === true ? 1 : '')  
                }
            }
        }
        return (() => {})
    }, [selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, assetTypeAssignmentAssets, assetTypeCompanies])

    const companyname = useMemo(() => {
        return selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
    }, [selectedCompanies, companiesList])

    const partyName = useMemo(() => {
        return selectedAssetCompanies.length > 0 && assetTypeCompanies.filter( party => party.id === selectedAssetCompanies[0])
    }, [selectedAssetCompanies, assetTypeCompanies])

    
    const findDashboardData = async(invention, jurisdictions, sankey, kpi) => {        
        if(loading === false && ((typeof invention !== 'undefined' && invention === false) ||  props.invention === false) && ((typeof jurisidictions !== 'undefined' && jurisdictions === false) || props.jurisdictions === false ) && ((typeof sankey !== 'undefined' && sankey === false) || props.sankey === false) ) { 
            const list = [];
            let totalRecords = 0;
            setLoading(true)
            resetAll(false)
            props.checkChartAnalytics(null, null, false) 
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
                formData.append('data_format', props.lineGraph === true ? 1 : 0)
                formData.append('format_type', profile.user.organisation.organisation_type)  
                formData.append('company', companyname[0].original_name )              
                const requestData = await PatenTrackApi.getDashboardData(formData, source)
                if( requestData !== null){
                    updateList(requestData, item.type)
                }
                return item
            })                
            await Promise.all(dashboardRequest)
            setLoading(false)           
        }
    }

    const callTimelineData = useCallback(async() => {
        setLoading(true)
        resetAll(false)
        setTimeLineLoading(true)
        const cancelRequest = await PatenTrackApi.cancelAllDashboardTimelineToken()  
        const CancelToken = PatenTrackApi.generateCancelToken() 
        const source = CancelToken.source()
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
        console.log('addCardList', t)
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
            if(props.lineGraph === true) {
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
            if(typeof props.updateDashboardData !== 'undefined' && props.kpi === false) {
                props.updateDashboardData(oldList)
            }
        }      
    }, [cardList, props.lineGraph, props.kpi])

    useEffect(() => {
        if(activeId  !== -1 ) {
            //scrollToActive item when the right pane open
            const container = ref.current
            if(container !== null){
                setTimeout(() => {
                    const listItemsContainer = container.querySelector('.listItems')
                    listItemsContainer.scroll(0, listItemsContainer.querySelectorAll('.box_item')[activeId].offsetTop - 50)
                }, 1000)
            }
        }
    }, [activeId])

    

    const onHandleClick = useCallback(async(id) => {
        const card = cardList[id]
        if(card.number > 0 || (card?.list && card.list.length > 0)) {
            let showItem = id != activeId ? true : false
            setActiveId(id != activeId ? id : -1)
            resetAll(showItem)       
            dispatch(setDashboardPanelActiveButtonId( id != activeId ? id : -1 ))        
            props.checkChartAnalytics(null, null, showItem)
            if(showItem === true) {
                if(card.type == 1 || card.type == 18 || card.type > 29 || card.type > 21 || card.type > 22 || card.type > 26 ) {
                    dispatch(
                        setAssetsIllustration({
                            type: "patent",
                            id: card.patent !== '' ? card.patent : card.application,
                            flag: card.patent !== '' ? 1 : 0
                        }),
                    );
                } else if (card.type == 17) {
                    dispatch(setAssetsIllustration({ type: "transaction", id: card.rf_id }));
                } else if (card.type == 19) {
                    const { data } = await PatenTrackApi.getCollectionIllustration(card.rf_id)
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
                                setPDFView(false)
                            ) 
                        }
                    }
                } else if(card.type == 20 || card.type == 23) {
                    dispatch(assetLegalEvents(card.application, card.patent));
                } else if(card.type == 24 || card.type == 25) {
                    
                    const { data } = await PatenTrackApi.getCollectionIllustration(card.rf_id)
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
    }, [dispatch, activeId, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, cardList])

    const onHandleList = useCallback((id) => {
        /* process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' */
        let subscription = parseInt(profile?.user?.organisation?.subscribtion), timeline = false, patent = false
        console.log(subscription);
        if( subscription === 2 || subscription === 3 ) {
            console.log(id, props.kpi)
            let findIndex = -1
            if(id === 0 && props.kpi === false) {                
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
                patent = true
            } else if(id === 1 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_names')
                timeline = true
            } else if(id === 2 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'clear_encumbrances')
                patent = true
            } else if(id === 3 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_address')
                timeline = true
            } else if(id === 4 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'to_be_monitized')
                patent = true
            } else if(id === 5 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'unnecessary_patents')
                patent = true
            } else if(id === 6 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'missed_monetization')
                patent = true
            } else if(id === 7 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'late_maintainance')
                patent = true
            } else if(id === 8 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_recording')
                timeline = true
            } else if(id === 9 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'late_recording')
                timeline = true
            } else if(id === 10 && subscription > 2  && props.kpi === false) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'deflated_collaterals')
                timeline = true
            } else if(id === 0 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'assigned')
                console.log(findIndex)
                patent = true
            } else if(id === 1 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'filled')
                patent = true
            } else if(id === 2 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'acquired')
                patent = true
            } else if(id === 3 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'divested')
                patent = true
            } else if(id === 4 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'collaterlized')
                patent = true
            } else if(id === 5 && subscription > 1 && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'abandoned')
                patent = true
            } else if(id === 6 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'ptab')
                patent = true
            } else if(id === 7 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'maintenance_budget')
                patent = true
            } else if(id === 8 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'top_non_us_members')
                patent = true
            } else if(id === 9 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'proliferate_inventors')
                patent = true
            } else if(id === 10 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'top_law_firms')
                patent = true
            } else if(id === 11 && subscription > 1  && props.kpi === true) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'top_lenders')
                patent = true
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
                
                resetAllRowSelect(dispatch, resetItemList.resetAll, profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [1, 9, 10] : [])
                resetAllRowSelect(dispatch, resetItemList.clearOtherItems, profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [15, 16] : [])
                setTimeout(() => { 
                    dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))                
                    if(id === 0) {
                        dispatch(setSwitchAssetButton(1))
                    } 
                })
                dispatch(setDashboardScreen(false))
                dispatch(setTimelineScreen(timeline))
                dispatch(setPatentScreen(patent))
                if(patent === true) {
                    history.push(routeList.patent_assets)  
                }
                if(props.openCustomerBar === false && timeline === false){
                    props.handleCustomersBarOpen()
                }
                if(props.openCommentBar === false){
                    props.handleCommentBarOpen()
                }                                
            }
        }
    }, [dispatch, profile, activeId, selectedAssetCompanies, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, props.openCustomerBar, props.openCommentBar, props.kpi])

    const changeGraph = async(flag) => {
        setIntial(false)
        addCardList()
        props.setJurisdiction(false)
        props.setInvention(false)
        props.setSankey(false)
        props.setKpi(false)
        props.setTimeline(false)
        props.setLineGraph(flag)
        //findDashboardData(false, false, false, false)
    }

    const onHandleJurisdiction = () => {
        props.setLineGraph(false)
        props.setInvention(false)
        props.setSankey(false)
        props.setKpi(false)
        props.setTimeline(false)
        props.setJurisdiction(true)
    }  

    const onHandleInvention = () => {
        props.setLineGraph(false)
        props.setJurisdiction(false)
        props.setSankey(false)
        props.setKpi(false)
        props.setTimeline(false)
        props.setInvention(true)
    }

    const onHandleSankey = () => {
        props.setLineGraph(false)
        props.setJurisdiction(false)
        props.setInvention(false)
        props.setKpi(false)
        props.setTimeline(false)
        props.setSankey(true)
    }

    const onHandleKPI = async() => {
        setIntial(false)
        setCardList(KPI_LIST)
        props.setLineGraph(false)
        props.setJurisdiction(false)
        props.setInvention(false)
        props.setSankey(false)
        props.setTimeline(false)
        props.setKpi(true)
    }

    const onHandleTimeline = () => {
        props.setLineGraph(false)
        props.setJurisdiction(false)
        props.setInvention(false)
        props.setSankey(false)
        props.setKpi(false)
        props.setTimeline(true)
        callTimelineData()
    }

    const handleTimelineFullScreen = (type) => {
        const list = [...timelineList]
        const findIndex = list.findIndex( item => item.type === type)

        if(findIndex !== -1) {
            list[findIndex].standalone = !list[findIndex].standalone
        }
        setTimelineList(list)
    }

    const showItems = cardList.map( (card, index) => {
        return <Grid
            item  {...grid}
            className={clsx(classes.flexColumn, `box_item`, {['activeItem']: index === activeId})}
            key={`card_${index}`}
        >
            <CardElement 
                card={card}
                id={index}
                active={activeId}
                handleClick={onHandleClick}
                handleList={onHandleList}
                type={card.type}  
                grid={grid}
                {...(props.kpi === true ? {kpiEnable: true} : {lineGraph: props.lineGraph})}
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
                id={index}
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
                        {
                            profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank'
                            && (
                                <AddToolTip
                                    tooltip={'Key Performance Indicators such as the number of patents owned by the company.'}
                                    placement='bottom'
                                >
                                    <IconButton 
                                        size="small"
                                        className={clsx(classes.actionIcon, {[classes.active]: props.kpi})}
                                        onClick={onHandleKPI}
                                    >
                                        <AppsOutage/>
                                    </IconButton> 
                                </AddToolTip>
                            )
                        }
                        <AddToolTip
                            tooltip={'Matters that require attention such as patents with defective ownership.'}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, {[classes.active]: !props.lineGraph && props.jurisdictions == false && props.invention === false && props.sankey === false && props.kpi === false && props.timeline === false})}
                                onClick={() => changeGraph(false)}
                            >
                                <Speed/> 
                            </IconButton>
                        </AddToolTip>
                        <AddToolTip
                            tooltip={'Changes in matters requiring attention along a timeline.'}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, {[classes.active]: props.lineGraph && props.jurisdictions == false && props.invention === false && props.sankey === false && props.kpi === false && props.timeline === false})}
                                onClick={() => changeGraph(true)}
                            >
                                <AutoGraph/>
                            </IconButton> 
                        </AddToolTip>
                        <AddToolTip
                            tooltip={'Transactional activities such as acquisition, divestitures, collateralization and releases.'}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, {[classes.active]: props.timeline})}
                                onClick={onHandleTimeline}
                            >
                                <ViewTimeline/>
                            </IconButton> 
                        </AddToolTip>
                        {
                            profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank'
                            && (
                                <React.Fragment>
                                    <AddToolTip
                                        tooltip={'Technologies covered by the patent portfolio as they evolved.'}
                                        placement='bottom'
                                    >
                                        <IconButton 
                                            size="small"
                                            className={clsx(classes.actionIcon, {[classes.active]: props.invention})}
                                            onClick={onHandleInvention}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="M24.844,398.133l114.19,52.7a8.214,8.214,0,0,0,3.4.738,8.105,8.105,0,0,0,3.38-.738l110.17-50.885,110.163,50.885a8,8,0,0,0,6.714,0l114.291-52.7A8.188,8.188,0,0,0,492,390.871v-125.1a8.223,8.223,0,0,0-6.2-7.734L378,229.637V98.558a7.958,7.958,0,0,0-5.912-7.735L258.02,60.692a7.969,7.969,0,0,0-4.074,0L139.906,90.823A7.954,7.954,0,0,0,134,98.558V229.637l-107.8,28.4a8.223,8.223,0,0,0-6.2,7.734v125.1A8.186,8.186,0,0,0,24.844,398.133ZM36,276.112l98,25.407V431.065L36,385.754Zm105.1-31.826,82.461,21.777-81.075,21L60.013,265.7ZM248,134.849V255.967l-98-25.9V108.945ZM451.987,265.7l-82.475,21.362-81.075-21L370.9,244.286ZM150,301.519l98-25.257V386.021l-98,45.044Zm114-25.257,98,25.257V431.065l-98-45.044Zm98-46.2-98,25.9V134.849l98-25.9Zm16,201V301.519l98-25.407V385.754ZM256,76.7l82.76,21.856L256,120.413,173.24,98.558Z" /></g></svg>
                                        </IconButton>
                                    </AddToolTip>
                                    <AddToolTip
                                        tooltip={'The countries in which the company has filed patents.'}
                                        placement='bottom'
                                    >
                                        <IconButton 
                                            size="small"
                                            className={clsx(classes.actionIcon, {[classes.active]: props.jurisdictions})}
                                            onClick={onHandleJurisdiction}
                                        >
                                            <Public/>
                                        </IconButton>   
                                    </AddToolTip>  
                                    <AddToolTip
                                        tooltip={'Sources from which patents were obtained, and divestitures.'}
                                        placement='bottom'
                                    >
                                        <IconButton 
                                            size="small"
                                            className={clsx(classes.actionIcon, {[classes.active]: props.sankey})}
                                            onClick={onHandleSankey}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={clsx('MuiSvgIcon-root MuiSvgIcon-fontSizeMedium')} viewBox="0 0 24 24">
                                                <path d="M23,6l-4-3.969v2L1,4v9h5.5C6.776,13,7,13.224,7,13.5v6.531H6L8,22l2-1.969H9v-7C9,11.928,8.103,11,7,11h5	c1.105,0,2,0.895,2,2v2.031h-2l3.586,3.954L19,15.031h-2V12.5c0-2.481-2.019-4.5-4.5-4.5H19v2.031L23,6z"/>
                                            </svg>
                                        </IconButton>
                                    </AddToolTip> 
                                </React.Fragment>
                            )
                        }
                        
                        <AddToolTip
                            tooltip={'Big screen view.'}
                            placement='bottom'
                        >
                            <IconButton size="small"
                                onClick={() => {props.handleFullScreen(!props.fullScreen)}}
                                className={clsx(classes.actionIcon, typeof props.standalone !== 'undefined' ? classes.fontStandalone : '' )}
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
                        props.jurisdictions === true
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
                            props.invention === true
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
                                props.sankey === true
                                ?
                                    <SankeyChart />
                                :
                                    props.timeline === true
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