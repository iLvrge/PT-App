import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react'
import { Grid, Typography, IconButton, Paper, Tooltip, Zoom }  from '@mui/material'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons"
import { useSelector, useDispatch } from 'react-redux'
import useStyles from './styles'
import clsx from 'clsx'
import moment from 'moment'
import CardElement from './CardElement'
import ClientList from './ClientList'
import { Fullscreen, Close, Share } from '@mui/icons-material';
/* import { useMeasure } from 'react-use'; */
import { 
    setDashboardPanel,
    setTimelineScreen,
    setDashboardScreen,
    setPatentScreen } from '../../actions/uiActions'
import { setAssetsIllustration, setBreadCrumbsAndCategory, setSwitchAssetButton, setDashboardPanelActiveButtonId, setAssetsIllustrationData, retrievePDFFromServer  } from '../../actions/patentTrackActions2'
import { assetLegalEvents, setAssetLegalEvents, setPDFView, setPDFFile, setConnectionData, setConnectionBoxView  } from '../../actions/patenTrackActions';
import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar'
import { controlList } from "../../utils/controlList"

import PatenTrackApi from '../../api/patenTrack2'


const Reports = (props) => {
    let LIST = [
        {
            title: 'Broken Chain-of-Title',
            sub_heading: 'broken', 
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1
        },
        {
            title: 'Incorrect Names',
            sub_heading: 'assignee has a typo',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17
        },
        {
            title: 'Encumbrances',
            sub_heading: 'irrelevant assignee recorded on your patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18
        },
        {
            title: 'Wrong Addresses',
            sub_heading: 'adress',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 19
        },
        {
            title: 'Wrong Lawyers',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 20
        },
        {
            title: 'Unecessary Patents',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 21
        },
        {
            title: 'Missed Monetization',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 22
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
            type: 24
        },
        {
            title: 'Late Recordings',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 25
        },
        {
            title: 'Deflated Collateral',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 26
        },
        {
            title: 'Challenged',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 27
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
    const dispatch = useDispatch();
    const DATE_FORMAT = 'MMM DD, YYYY'
    const ref = useRef();
    let resizeObserver = null
    const [loading, setLoading] = useState(false)
    const [grid, setGrid] = useState(GRID_ITEM)
    const [smallScreen, setSmallScreen] = useState(false)
    const [activeId, setActiveId] = useState(-1)
    const profile = useSelector(state => (state.patenTrack.profile))    
    const [cardList, setCardList] = useState([])
    const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
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
        addCardList()
        return (() =>{

        })
    }, [profile])
    useEffect(() => {
        if(ref.current !== null) {
            resizeObserver = new ResizeObserver(entries => {   
                setLoading(true)    
                let smallScreen = false         
                const { width } = entries[0].contentRect;
                if(width > 401 && width < 601 ) {
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
                } else if (width > 0 && width < 400) {
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

    /**
     * Get Dashboard data
     */
    useEffect(() => {
        if(selectedCompanies.length > 0) {
            
            const findDashboardData = async() => {
                if(loading === false) {                    
                    const list = [];
                    let totalRecords = 0;
                    if( assetsSelected.length > 0 ) {
                        const promise = assetsSelected.map(asset => {
                            const findIndex = assetTypeAssignmentAssets.findIndex( row => row.appno_doc_num.toString() == asset.toString() || row.grant_doc_num != null && row.grant_doc_num.toString() == asset.toString() )
                            if( findIndex !== -1 ) {
                                if( assetTypeAssignmentAssets[findIndex].appno_doc_num != '' ) {
                                    list.push(assetTypeAssignmentAssets[findIndex].appno_doc_num.toString())
                                }
                            }
                        })
                        await Promise.all(promise)
                        totalRecords = list.length
                    } else if( assetTypeAssignmentAssets.length > 0 ) {
                        const promise = assetTypeAssignmentAssets.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
                        totalRecords = assetsTotal
                    }  
                    if(list.length > 0) {
                        setLoading(true)
                        resetAll(false)
                        props.checkChartAnalytics(null, null, false)                
                        const dashboardRequest = LIST.map(async item => {
                            const formData = new FormData()
                            formData.append('list', JSON.stringify(list));
                            formData.append('total', totalRecords);
                            formData.append('selectedCompanies', JSON.stringify(selectedCompanies));
                            formData.append('tabs', JSON.stringify(assetTypesSelected));
                            formData.append('customers', JSON.stringify(selectedAssetCompanies));
                            formData.append('assignments', JSON.stringify(selectedAssetAssignments));
                            formData.append('type', item.type)
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
            }
            findDashboardData()
        } else {   
            addCardList()  
        }
    }, [selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, assetTypeAssignmentAssets, assetsSelected, assetsTotal])

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
        if(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank') {
            const bankList = [...LIST]
            bankList.forEach( (bank, index) => {
                switch(parseInt(bank.type)) {
                    case 19:
                        bankList[index].title = 'Other Banks'
                        break;
                    case 20:  
                        bankList[index].title = 'Invalid Collateral'
                        bankList[index].display_value = '%'
                        break;
                    case 21:
                        bankList[index].title = 'Expired Patents'
                        break;
                    case 22:
                        bankList[index].title = 'Recently Expired'
                        break;
                }  
            })  
            setCardList([...bankList])
        } else {
            setCardList([...LIST])
        }
    }

    const updateList = useCallback((requestData, type) => {  
        let oldList = [...cardList]
        const findIndex = oldList.findIndex( item => item.type === type)
        if(findIndex !== -1) {
            if( requestData !== null && requestData?.data && requestData?.data?.number){
                oldList[findIndex].number = requestData.data.number
                oldList[findIndex].patent = requestData.data.patent != '' ? requestData.data.patent : ''
                oldList[findIndex].application = requestData.data.application != '' ? requestData.data.application : ''                            
                oldList[findIndex].rf_id = requestData.data.rf_id != '' ? requestData.data.rf_id : ''                            
            } else {
                oldList[findIndex].number = 0
                oldList[findIndex].patent = ''
                oldList[findIndex].application = ''
            }
            setCardList(oldList)
        }      
    }, [cardList])

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

    const showItems = cardList.map( (card, index) => {
        return <Grid
            item  {...grid}
            className={classes.flexColumn}
            key={`card_${index}`}
        >
            <CardElement 
                card={card}
                id={index}
                active={activeId}
                handleClick={onHandleClick}
                handleList={onHandleList}
                type={card.type}  
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
                        <IconButton  size="small" className={classes.shareIcon}>
                            <FontAwesomeIcon
                                icon={faShareAlt}
                            />
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
                className={classes.list}
            >
                <Grid  
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {showItems}
                </Grid>                
            </Grid>
        </Grid>
    );
}

export default Reports;