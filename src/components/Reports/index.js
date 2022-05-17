import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import { Grid, IconButton, Paper}  from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import useStyles from './styles'
import clsx from 'clsx'
import moment from 'moment'
import CardElement from './CardElement'
import { Fullscreen, Close, Public, BarChart, AutoGraph, BubbleChart, Speed} from '@mui/icons-material';
import { 
    setDashboardPanel,
    setTimelineScreen,
    setDashboardScreen,
    setPatentScreen } from '../../actions/uiActions'
import { setAssetsIllustration, setBreadCrumbsAndCategory, setSwitchAssetButton, setDashboardPanelActiveButtonId,  retrievePDFFromServer  } from '../../actions/patentTrackActions2'
import { assetLegalEvents, setAssetLegalEvents, setPDFView, setPDFFile, setConnectionData, setConnectionBoxView  } from '../../actions/patenTrackActions';
import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar'
import { controlList } from "../../utils/controlList"

import PatenTrackApi from '../../api/patenTrack2'
import routeList from '../../routeList'
import GeoChart from '../common/AssetsVisualizer/GeoChart'
import InventionVisualizer from '../common/AssetsVisualizer/InventionVisualizer'
import SankeyChart from './SankeyChart'

const Reports = (props) => {
    let LIST = [
        {
            title: 'Broken Chain-of-Title',
            sub_heading: 'broken', 
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1,
            list: []
        },
        {
            title: 'Incorrect Names',
            sub_heading: 'assignee has a typo',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17,
            list: []
        },
        {
            title: 'Encumbrances',
            sub_heading: 'irrelevant assignee recorded on your patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18,
            list: []
        },
        {
            title: 'Wrong Addresses',
            sub_heading: 'adress',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 19,
            list: []
        },
        {
            title: 'Wrong Lawyers',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 20,
            list: []
        },
        {
            title: 'Unecessary Patents',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 21,
            list: []
        },
        {
            title: 'Missed Monetization',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 22,
            list: []
        },
        {
            title: 'Late Maintainance',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 23
        },
        {
            title: 'Incorrect Recordings',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 24,
            list: []
        },
        {
            title: 'Late Recordings',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 25,
            list: []
        },
        {
            title: 'Deflated Collateral',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 26,
            list: []
        },
        {
            title: 'Challenged',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
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
            sub_heading: 'broken', 
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1,
            list: []
        },
        {
            title: 'Incorrect Names',
            sub_heading: 'assignee has a typo',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17,
            list: []
        },
        {
            title: 'Encumbrances',
            sub_heading: 'irrelevant assignee recorded on your patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18,
            list: []
        },
        {
            title: 'Other Banks',
            sub_heading: 'adress',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 19,
            list: []
        },
        {
            title: 'Invalid Collateral',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 20,
            list: []
        },
        {
            title: 'Unecessary Patents',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 21,
            list: []
        },
        {
            title: 'Expired Patents',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 22,
            list: []
        },
        {
            title: 'Recently Expired',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 23,
            list: []
        },
        {
            title: 'Incorrect Recordings',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 24,
            list: []
        },
        {
            title: 'Late Recordings',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 25,
            list: []
        },
        {
            title: 'Deflated Collateral',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 26,
            list: []
        },
        {
            title: 'Challenged',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 27,
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
    const classes = useStyles();
    const history = useHistory()
    const dispatch = useDispatch();
    const DATE_FORMAT = 'MMM DD, YYYY'
    const ref = useRef();
    let resizeObserver = null
    const [initial, setIntial] = useState(true)
    const [loading, setLoading] = useState(false)
    
    const [grid, setGrid] = useState(GRID_ITEM)
    const [smallScreen, setSmallScreen] = useState(false)
    const [activeId, setActiveId] = useState(-1)
    const profile = useSelector(state => (state.patenTrack.profile))    
    const [cardList, setCardList] = useState(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_LIST : LIST)
    const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
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
                setLoading(true)    
                let smallScreen = false         
                const { width } = entries[0].contentRect;
                if(width > 510 && width < 601 ) {
                    smallScreen = true
                    setGrid({
                        lg:6,
                        md:6,
                        sm:6,
                        xs:6,
                        xl:6
                    })
                } else if (width > 600 && width < 900) {
                    setGrid({
                        lg:4,
                        md:4,
                        sm:4,
                        xs:4,
                        xl:4
                    })
                } else if (width > 0 && width < 510) {
                    smallScreen = true
                    setGrid({
                        lg:12,
                        md:12,
                        sm:12,
                        xs:12,
                        xl:12
                    })  
                }  else {
                    setGrid(GRID_ITEM)
                }
                setLoading(false)  
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
                findDashboardData()
            } else {   
                addCardList()  
            }
        }
    }, [props.lineGraph])

    /**
     * Get Dashboard data
     */
    useEffect(() => {
        if(typeof props.dashboardData !== 'undefined' && props.dashboardData.length > 0) {
            setLoading(false)
            setCardList(props.dashboardData)
        } else {
            if(selectedCompanies.length > 0) {
                findDashboardData()
            } else {   
                addCardList()  
            }
        }
        
    }, [selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, assetTypeAssignmentAssets, assetTypeCompanies])


    const findDashboardData = async() => {
        if(loading === false) {                    
            const list = [];
            let totalRecords = 0;
            setLoading(true)
            resetAll(false)
            props.checkChartAnalytics(null, null, false)                
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
                
                const requestData = await PatenTrackApi.getDashboardData(formData)
                if( requestData !== null){
                    updateList(requestData, item.type)
                }
                return item
            })                
            await Promise.all(dashboardRequest)
            setLoading(false)
        }                
    }

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

    const addCardList = () => {
        setCardList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_LIST : LIST)
    }

    const updateList = useCallback((requestData, type) => {  
        let oldList = [...cardList]
        const findIndex = oldList.findIndex( item => item.type === type)
        if(findIndex !== -1) {
            if(props.lineGraph === true) {
                if( requestData !== null && requestData.data != null && requestData.data.length > 0) {
                    const list = [['Year', 'Assets']]
                    requestData.data.forEach( item => {
                        list.push([item.year, item.number])
                    })
                    
                    oldList[findIndex].list = list
                    oldList[findIndex].patent = requestData.data[0].patent
                    oldList[findIndex].application = requestData.data[0].patent
                    oldList[findIndex].rf_id = requestData.data[0].rf_id
                    console.log('list', list, oldList[findIndex])
                } else {
                    oldList[findIndex].list = []
                    oldList[findIndex].patent = ''
                    oldList[findIndex].application = ''
                    oldList[findIndex].rf_id = 0
                }
            } else {
                if( requestData !== null && requestData?.data && requestData?.data?.number){
                    oldList[findIndex].number = requestData.data.number
                    oldList[findIndex].patent = requestData.data.patent != '' ? requestData.data.patent : ''
                    oldList[findIndex].application = requestData.data.application != '' ? requestData.data.application : ''                            
                    oldList[findIndex].rf_id = requestData.data.rf_id != '' ? requestData.data.rf_id : ''                            
                    oldList[findIndex].total = requestData.data.total
                } else {
                    oldList[findIndex].number = 0
                    oldList[findIndex].patent = ''
                    oldList[findIndex].application = ''
                    oldList[findIndex].total = 0
                }
            }            
            setCardList(oldList)
            if(typeof props.updateDashboardData !== 'undefined') {
                props.updateDashboardData(oldList)
            }
        }      
    }, [cardList, props.lineGraph])

    useEffect(() => {
        if(activeId  !== -1 ) {
            //scrollToActive item
            const container = ref.current
            if(container !== null){
                setTimeout(() => {
                    const listItemsContainer = container.querySelector('.listItems')
                    listItemsContainer.scroll(0, listItemsContainer.querySelectorAll('.box_item')[activeId].offsetTop - 50)
                }, 1000)
            }
        }
    }, [activeId])

    const companyname = useMemo(() => {
        return selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
    }, [selectedCompanies, companiesList])

    const onHandleClick = useCallback(async(id) => {
        const card = cardList[id]
        
        if(card.number > 0) {
            let showItem = id != activeId ? true : false
            setActiveId(id != activeId ? id : -1)
            resetAll(showItem)       
            dispatch(setDashboardPanelActiveButtonId( id != activeId ? id : -1 ))        
            props.checkChartAnalytics(null, null, showItem)
            if(showItem === true) {
                if(card.type == 1 || card.type == 18) {
                    dispatch(
                        setAssetsIllustration({
                            type: "patent",
                            id: card.patent !== '' ? card.patent : card.application,
                            flag: card.patent !== '' ? 1 : 0
                        }),
                    );
                } else if (card.type == 17) {
                    dispatch(setAssetsIllustration({ type: "transaction", id: card.rf_id }));
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
        if( subscription === 2 || subscription === 3 ) {
            let findIndex = -1
            if(id === 0) {                
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
                patent = true
            } else if(id === 8 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'pay_maintainence_fee')
                patent = true
            } else if(id === 3 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'clear_encumbrances')
                timeline = true
            } else if(id === 4 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'correct_names')
                timeline = true
            }
            if( findIndex !== -1 ) {
                dispatch(setDashboardScreen(false))
                dispatch(setTimelineScreen(timeline))
                dispatch(setPatentScreen(patent))
                if(patent === true) {
                    history.push(routeList.patent_assets)  
                }
                if(props.openCustomerBar === false){
                    props.handleCustomersBarOpen()
                }
                if(props.openCommentBar === false){
                    props.handleCommentBarOpen()
                }
                resetAllRowSelect(dispatch, resetItemList.resetAll)
                resetAllRowSelect(dispatch, resetItemList.clearOtherItems)
                setTimeout(() => { 
                    dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))                
                    if(id === 0) {
                        dispatch(setSwitchAssetButton(1))
                    } 
                })                
            }
        }
    }, [dispatch, profile, activeId, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, props.openCustomerBar, props.openCommentBar])

    const changeGraph = (flag) => {
        setIntial(false)
        props.setJurisdiction(false)
        props.setInvention(false)
        props.setSankey(false)
        props.setLineGraph(flag)
    }

    const onHandleJurisdiction = () => {
        props.setLineGraph(false)
        props.setInvention(false)
        props.setSankey(false)
        props.setJurisdiction(true)
    }

    const onHandleInvention = () => {
        props.setLineGraph(false)
        props.setJurisdiction(false)
        props.setSankey(false)
        props.setInvention(true)
    }

    const onHandleSankey = () => {
        props.setLineGraph(false)
        props.setJurisdiction(false)
        props.setInvention(false)
        props.setSankey(true)
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
                lineGraph={props.lineGraph}
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
                    <span className={clsx('title', {['small']: smallScreen})}>{ moment(new Date()).format(DATE_FORMAT)}  <span>{companyname.length > 0 ? companyname[0].original_name : ''}</span></span>
                    <div className={classes.toolbar}> 
                        {/* <IconButton 
                            size="small"
                        >
                            <BubbleChart/>
                        </IconButton>  */}
                        <IconButton 
                            size="small"
                            className={clsx(classes.actionIcon, {[classes.active]: !props.lineGraph && props.jurisdictions == false && props.invention === false && props.sankey === false})}
                            onClick={() => changeGraph(false)}
                        >
                            <Speed/> 
                        </IconButton>
                        <IconButton 
                            size="small"
                            className={clsx(classes.actionIcon, {[classes.active]: props.lineGraph && props.jurisdictions == false && props.invention === false && props.sankey === false})}
                            onClick={() => changeGraph(true)}
                        >
                            <AutoGraph/>
                        </IconButton> 
                        <IconButton 
                            size="small"
                            className={clsx(classes.actionIcon, {[classes.active]: props.invention})}
                            onClick={onHandleInvention}
                        >
                            <BarChart/>
                        </IconButton> 
                        <IconButton 
                            size="small"
                            className={clsx(classes.actionIcon, {[classes.active]: props.jurisdictions})}
                            onClick={onHandleJurisdiction}
                        >
                            <Public/>
                        </IconButton>      
                        <IconButton 
                            size="small"
                            className={clsx(classes.actionIcon, {[classes.active]: props.sankey})}
                            onClick={onHandleSankey}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={clsx('MuiSvgIcon-root MuiSvgIcon-fontSizeMedium')} viewBox="0 0 24 24">
                                <path d="M23,6l-4-3.969v2L1,4v9h5.5C6.776,13,7,13.224,7,13.5v6.531H6L8,22l2-1.969H9v-7C9,11.928,8.103,11,7,11h5	c1.105,0,2,0.895,2,2v2.031h-2l3.586,3.954L19,15.031h-2V12.5c0-2.481-2.019-4.5-4.5-4.5H19v2.031L23,6z"/>
                            </svg>
                        </IconButton>
                        <IconButton size="small"
                            onClick={() => {props.handleFullScreen(!props.fullScreen)}}
                            className={clsx(classes.actionIcon, typeof props.standalone !== 'undefined' ? classes.fontStandalone : '' )}
                        >
                            { typeof props.standalone !== 'undefined' ? <Close/> : <Fullscreen /> }                            
                        </IconButton>   
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
                                />
                            :    
                                props.sankey === true
                                ?
                                    <SankeyChart />
                                :
                                    showItems
                    }
                </Grid>                
            </Grid>
        </Grid>
    );
}

export default Reports;