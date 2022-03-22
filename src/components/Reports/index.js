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
import { setDashboardPanel,
    setTimelineScreen,
    setDashboardScreen } from '../../actions/uiActions'
import { setAssetsIllustration, setBreadCrumbsAndCategory, setSwitchAssetButton  } from '../../actions/patentTrackActions2'
import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar'
import { controlList } from "../../utils/controlList"

import PatenTrackApi from '../../api/patenTrack2'


const Reports = (props) => {
    const LIST = [
        {
            title: 'Chain-of-Title',
            sub_heading: 'patents ad ad d ad ad ad', 
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 1
        },
        {
            title: 'Lost Patents',
            sub_heading: 'assignee has a typo',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 2
        },
        {
            title: 'Encumbrances',
            sub_heading: 'irrelevant assignee recorded on your patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 3
        },
        {
            title: 'Wrong addresses',
            sub_heading: 'adress',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 4
        },
        {
            title: 'Wrong Lawyers',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 5
        },
        {
            title: 'Unecessary Patents',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 6
        },
        {
            title: 'Missed monetization',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 7
        },
        {
            title: 'Late Maintainance',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 8
        },
        {
            title: 'Incorrect Recordings',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 9
        },
        {
            title: 'Late recordings',
            sub_heading: 'patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 10
        },
        {
            title: 'Deflated Collateral',
            sub_heading: 'abandoned patents',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 11
        },
        {
            title: 'Challenged',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 12
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
    const [loading, setLoading] = useState(true)
    const [grid, setGrid] = useState(GRID_ITEM)
    const [activeId, setActiveId] = useState(-1)
    const profile = useSelector(store => (store.patenTrack.profile))    
    const [cardList, setCardList] = useState(LIST)
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

    const assetsTotal = useSelector(
        state => state.patenTrack2.assetTypeAssignmentAssets.total_records,
    );
    useEffect(() => {
        if(ref.current !== null) {
            resizeObserver = new ResizeObserver(entries => {   
                setLoading(true)             
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
            })
                     
            resizeObserver.observe(ref.current)
            return () => {
                if(resizeObserver) {
                    resizeObserver.disconnect();
                }
            }
        }        
    }, []) 
    /**
     * Get Dashboard data
     */
    useEffect(() => {
        if(selectedCompanies.length > 0) {
            setLoading(true)
            const findDashboardData = async() => {
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
                setLoading(false)
                props.checkChartAnalytics(null, null, false)
                const formData = new FormData()
                formData.append('list', JSON.stringify(list));
                formData.append('total', totalRecords);
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies));
                formData.append('tabs', JSON.stringify(assetTypesSelected));
                formData.append('customers', JSON.stringify(selectedAssetCompanies));
                formData.append('assignments', JSON.stringify(selectedAssetAssignments));
                formData.append('type', 'restore_ownership')
                const brokenChain = await PatenTrackApi.getDashboardData(formData)
                let oldList = [...cardList]
                const findIndexBroken = oldList.findIndex( item => item.type === 1)
                if(findIndexBroken !== -1) {
                    if( brokenChain !== null && brokenChain?.data && brokenChain?.data?.number){
                        oldList[findIndexBroken].number = brokenChain.data.number
                        oldList[findIndexBroken].patent = brokenChain.data.patent != '' ? brokenChain.data.patent : ''
                        oldList[findIndexBroken].application = brokenChain.data.patent == '' && brokenChain.data.application != '' ? brokenChain.data.application : ''                            
                    } else {
                        oldList[findIndexBroken].number = 0
                        oldList[findIndexBroken].patent = ''
                        oldList[findIndexBroken].application = ''
                    }
                    setCardList(oldList)
                }
                /* formData.delete('type')
                formData.append('type', 'lost_patents') */
            }
            findDashboardData()
        } else {   
            setCardList([...LIST])
        }
    }, [selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, assetTypeAssignmentAssets, assetsSelected, assetsTotal])

    const companyname = useMemo(() => {
        return selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
    }, [selectedCompanies, companiesList])

    const onHandleClick = useCallback((id) => {
        const card = cardList[id]
        if(card.number > 0) {
            let showItem = id != activeId ? true : false
            setActiveId(id != activeId ? id : -1)
            dispatch(setDashboardPanel( showItem ))        
            props.checkChartAnalytics(null, null, showItem)
            if(showItem === true) {
                if(card.type == 1) {
                    dispatch(
                        setAssetsIllustration({
                            type: "patent",
                            id: card.patent !== '' ? card.patent : card.application,
                            flag: card.patent !== '' ? 1 : 0
                        }),
                    );
                }       
            } else {
                dispatch(setAssetsIllustration(null))
            }
        }
    }, [dispatch, activeId, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, cardList])

    const onHandleList = useCallback((id) => {
        /* process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' */
        let subscription = parseInt(profile?.user?.organisation?.subscribtion)
        if( subscription === 2 || subscription === 3 ) {
            let findIndex = -1
            if(id === 0) {                
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
            } else if(id === 8 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'pay_maintainence_fee')
            } else if(id === 3 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'clear_encumbrances')
            } else if(id === 4 && subscription > 2) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'correct_names')
            }
            if( findIndex !== -1 ) {
                dispatch(setDashboardScreen(false))
                dispatch(setTimelineScreen(true))
                if(props.openCustomerBar === false){
                    props.handleCustomersBarOpen()
                }
                if(props.openCommentBar === false){
                    props.handleCommentBarOpen()
                }
                resetAllRowSelect(dispatch, resetItemList.resetAll)
                resetAllRowSelect(dispatch, resetItemList.clearOtherItems)
                dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))                
                if(id === 0) {
                    dispatch(setSwitchAssetButton(1))
                }
            }
        }
    }, [dispatch, activeId, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, props.openCustomerBar, props.openCommentBar])

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
            { 
                !loading && (
                    <React.Fragment>
                        <Grid
                            item lg={12} md={12} sm={12} xs={12} 
                        >
                            <Paper className={classes.titleContainer} square>
                                <span className={'title'}>{ moment(new Date()).format(DATE_FORMAT)}  <span>{companyname.length > 0 ? companyname[0].original_name : ''}</span></span>
                                <div className={classes.toolbar}>
                                    <IconButton  size="small" className={classes.shareIcon}>
                                        <Tooltip 
                                            title={
                                                <Typography color="inherit" variant='body2'>Share Dashboard</Typography>
                                            } 
                                            className={classes.tooltip}  
                                            placement='right'
                                            enterDelay={0}
                                            TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                                        >
                                            <FontAwesomeIcon
                                                icon={faShareAlt}
                                            />
                                        </Tooltip>
                                    </IconButton>                            
                                    <IconButton size="small"
                                        onClick={() => {props.handleFullScreen(!props.fullScreen)}}
                                        className={clsx(classes.actionIcon, typeof props.standalone !== 'undefined' ? classes.fontStandalone : '' )}
                                    >
                                        <Tooltip 
                                            title={
                                                <Typography color="inherit" variant='body2'> { typeof props.standalone !== 'undefined' ? 'Close' : 'Fullscreen' }</Typography>
                                            } 
                                            className={classes.tooltip}      
                                            placement='right'
                                            enterDelay={0}
                                            TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                                        >
                                            { typeof props.standalone !== 'undefined' ? <Close/> : <Fullscreen /> }
                                        </Tooltip>                            
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
                    </React.Fragment>
                )
            }
        </Grid>
    );
}

export default Reports;