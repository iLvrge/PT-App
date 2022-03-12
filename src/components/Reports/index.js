import React, {useMemo, useState, useCallback, useEffect} from 'react'
import { Grid, Typography, IconButton, Paper, Tooltip, Zoom }  from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import useStyles from './styles'
import moment from 'moment'
import CardElement from './CardElement'
import ClientList from './ClientList'
import { Fullscreen, Close, Share } from '@mui/icons-material';
import { setDashboardPanel } from '../../actions/uiActions'
import { setAssetsIllustration } from '../../actions/patentTrackActions2'
const Reports = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const DATE_FORMAT = 'MMM DD, YYYY'
    const [activeId, setActiveId] = useState(-1)
    const cardsList = [
        {
            title: 'Broken Chain of Title',
            sub_heading: 'patents ad ad d ad ad ad',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Lost Patents',
            sub_heading: 'assignee has a typo',
            number: 20,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Encumbrances',
            sub_heading: 'irrelevant assignee recorded on your patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Wrong address',
            sub_heading: 'adress',
            number: 124,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Wrong Lawyer',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Unecessary Patents',
            sub_heading: 'patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Missed monetization opportunities',
            sub_heading: 'abandoned patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Late Maintainance',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Corrections',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Late recordings',
            sub_heading: 'patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Deflated Collateral',
            sub_heading: 'abandoned patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Challenged',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
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
        
    }, [dispatch, props.chartsBar, props.analyticsBar, props.checkChartAnalytics])
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
                        <IconButton  size="small" >
                            <Tooltip 
                                title={
                                    <Typography color="inherit" variant='body2'>Share Dashboard</Typography>
                                } 
                                className={classes.tooltip}  
                                placement='right'
                                enterDelay={0}
                                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                            >
                                <Share/>
                            </Tooltip>
                        </IconButton>                            
                        <IconButton size="small"
                            onClick={() => {props.handleFullScreen(!props.fullScreen)}}
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