import React, {useMemo, useState, useCallback, useEffect} from 'react'
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
import { setDashboardPanel,
    setTimelineScreen,
    setDashboardScreen } from '../../actions/uiActions'
import { setAssetsIllustration, setBreadCrumbsAndCategory, setSwitchAssetButton  } from '../../actions/patentTrackActions2'
import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar'
import { controlList } from "../../utils/controlList"


const Reports = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const DATE_FORMAT = 'MMM DD, YYYY'
    const [activeId, setActiveId] = useState(-1)
    const profile = useSelector(store => (store.patenTrack.profile))
    const cardsList = [
        {
            title: 'Chain-of-Title',
            sub_heading: 'patents ad ad d ad ad ad',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 1
        },
        {
            title: 'Lost Patents',
            sub_heading: 'assignee has a typo',
            number: 20,
            patent: '',
            application: '',
            rf_id: '',
            type: 2
        },
        {
            title: 'Encumbrances',
            sub_heading: 'irrelevant assignee recorded on your patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 3
        },
        {
            title: 'Wrong addresses',
            sub_heading: 'adress',
            number: 124,
            patent: '',
            application: '',
            rf_id: '',
            type: 4
        },
        {
            title: 'Wrong Lawyers',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 5
        },
        {
            title: 'Unecessary Patents',
            sub_heading: 'patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 6
        },
        {
            title: 'Missed monetization',
            sub_heading: 'abandoned patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 7
        },
        {
            title: 'Late Maintainance',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 8
        },
        {
            title: 'Incorrect Recordings',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 9
        },
        {
            title: 'Late recordings',
            sub_heading: 'patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 10
        },
        {
            title: 'Deflated Collateral',
            sub_heading: 'abandoned patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 11
        },
        {
            title: 'Challenged',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 72,
            patent: '',
            application: '',
            rf_id: '',
            type: 12
        }
    ]
    const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    useEffect(() => {
        console.log("activeId", activeId)
    }, [activeId])
    const companyname = useMemo(() => {
        return selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
    }, [selectedCompanies, companiesList])

    const onHandleClick = useCallback((id) => {
        let showItem = id != activeId ? true : false
        console.log("showItem", id, activeId, showItem)
        setActiveId(id != activeId ? id : -1)
        dispatch(setDashboardPanel( showItem ))        
        props.checkChartAnalytics(null, null, showItem)
        if(showItem === true) {
            dispatch(
                setAssetsIllustration({
                    type: "patent",
                    id: "8735067",
                    flag: 1
                }),
            );
        } else {
            dispatch(setAssetsIllustration(null))
        }
        
    }, [dispatch, activeId, props.chartsBar, props.analyticsBar, props.checkChartAnalytics])

    const onHandleList = useCallback((id) => {
        console.log("onHandleList", id) 
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
            console.log("findIndex", findIndex, resetItemList)
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
                setTimeout(() => {
                    dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))      
                }, 100)
                
                if(id === 0) {
                    dispatch(setSwitchAssetButton(1))
                }
            }
        }
    }, [dispatch, activeId, props.chartsBar, props.analyticsBar, props.checkChartAnalytics, props.openCustomerBar, props.openCommentBar])
    return (
        <Grid
            container
            className={classes.container}
            justifyContent="flex-start"
            alignItems="flex-start"
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
                    {
                        cardsList.map( (card, index) => (
                            <Grid
                                item lg={3} md={4} sm={6} 
                                className={classes.flexColumn}
                            >
                                <CardElement 
                                    key={`card_${index}`}
                                    card={card}
                                    id={index}
                                    active={activeId}
                                    handleClick={onHandleClick}
                                    handleList={onHandleList}
                                    type={card.type}  
                                />
                            </Grid>
                        ))
                    }
                </Grid>                
            </Grid>
        </Grid>
    );
}

export default Reports;