import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  
    useHistory,
    useLocation
} from 'react-router-dom'
import { setAssetButton, setTransactionButton, setViewDashboardIntial, updateViewDashboard } from '../../actions/uiActions'
import useStyles from './styles'
import clsx from 'clsx'
import AddToolTip from '../Reports/AddToolTip'
import { IconButton, Badge, InputBase, Button } from '@mui/material'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShareAlt, faCalendar
} from "@fortawesome/free-solid-svg-icons"
import { AppsOutage, AutoGraph, Public, Speed, ViewTimeline, Search, NotificationsNone, ManageSearch, SupportAgent, PendingActionsOutlined } from '@mui/icons-material' 
import PatenTrackApi from '../../api/patenTrack2'
import { copyToClipboard } from '../../utils/html_encode_decode'
import { setCPCRequest, setJurisdictionRequest, setSwitchAssetButton, setTimelineData, setTimelineRequest } from '../../actions/patentTrackActions2'
import { setCompanies } from '../../actions/patenTrackActions'
import Maintainance from '../common/Maintainence'

const ViewIcons = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory()
    const [timelineView, setTimelineView] = useState(false)
    const [patentView, setPatentView] = useState(false)
    const [openSearch, setOpenSearch] = useState(false) 
    const profile = useSelector(state => (state.patenTrack.profile))  
    const viewDashboard = useSelector(state => state.ui.viewDashboard)  
    const loadingDashboardData = useSelector( state => state.ui.loadingDashboardData); 
    const path = location.pathname
 

    useEffect(() => {
        const {pathname} = location; 
        if(pathname == '/dashboard/attention' ||  pathname ==  '/dashboard/activity' ||  pathname ==  '/dashboard' ||  pathname ==  '') { 
            if(props.dashboardScreen === false) {
                console.log("IN LOCATION")
                pathname == '/dashboard/attention' ? changeGraph(false) : pathname ==  '/dashboard/activity' ? onHandleTimeline() : onHandleKPI()
            }
        }
    }, [location])

    const changeGraph = async(flag) => {
        //setCardList(LIST)
        onHandleDashboard('attention')
        const oldViewScreen = {
            ...viewDashboard, 
            line: flag, 
            gauge: !flag,
            jurisdictions: false,
            invention: false,
            sankey: false,
            kpi: false,
            timeline: false
        }
        dispatch(updateViewDashboard(oldViewScreen))
        dispatch(setViewDashboardIntial(false))
        //findDashboardData(false, false, false, false)
    }

    const onHandleJurisdiction = () => {
        onHandleDashboard()
        const oldViewScreen = {
            ...viewDashboard, 
            line: false, 
            gauge: false,
            jurisdictions: true,
            invention: false,
            sankey: false,
            kpi: false,
            timeline: false
        }
        dispatch(updateViewDashboard(oldViewScreen))
    }  

    const onHandleInvention = () => {
        onHandleDashboard()
        const oldViewScreen = {
            ...viewDashboard, 
            line: false, 
            gauge: false,
            jurisdictions: false,
            invention: true,
            sankey: false,
            kpi: false,
            timeline: false
        }
        dispatch(updateViewDashboard(oldViewScreen))
    }

    const onHandleSankey = () => {
        onHandleDashboard()
        const oldViewScreen = {
            ...viewDashboard, 
            line: false, 
            gauge: false,
            jurisdictions: false,
            invention: false,
            sankey: true,
            kpi: false,
            timeline: false
        }
        dispatch(updateViewDashboard(oldViewScreen))
    }

    const onHandleKPI = async() => {
        onHandleDashboard('')
        const oldViewScreen = {
            ...viewDashboard, 
            line: false, 
            gauge: false,
            jurisdictions: false,
            invention: false,
            sankey: false,
            kpi: true,
            timeline: false
        }
        dispatch(updateViewDashboard(oldViewScreen))
        dispatch(setViewDashboardIntial(false))
    }

    const onHandleTimeline = () => {
        setPatentView(false)
        setTimelineView(false)
        onHandleDashboard('activity')
        const oldViewScreen = {
            ...viewDashboard, 
            line: false, 
            gauge: false,
            jurisdictions: false,
            invention: false,
            sankey: false,
            kpi: false,
            timeline: true
        }
        dispatch(updateViewDashboard(oldViewScreen))
        dispatch(setViewDashboardIntial(false))
    }

    const onHandleTransactions = () => {
        dispatch(setAssetButton(false))
        dispatch(setTransactionButton(true))
        setPatentView(false)
        setTimelineView(true)
        props.resetAllActivity('due_dilligence')
        props.setActivityTimeline()
    }

    const onHandleDashboard = (btn) => {
        let location = window.location.pathname
            location = location.split('/').pop() 
        if(path.indexOf('/dashboard') == -1) { 
            history.push(`/dashboard${process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? location != '' ? '/' + location : typeof btn !== 'undefined' && btn != '' ? '/' + btn : '' : typeof btn !== 'undefined' && btn != '' ? '/' + btn : '' }`) 
        } else {
            if(typeof btn !== 'undefined') {
                history.push(`/dashboard${btn != '' ? '/' + btn : ''}`)
            }
        }
        setPatentView(false)
        setTimelineView(false)
        dispatch(setAssetButton(false))
        dispatch(setTransactionButton(false))
        dispatch(setJurisdictionRequest(false))
        dispatch(setCPCRequest(false))
        dispatch(setTimelineRequest(false))
        dispatch(setTimelineData([]))
        if(props.openIllustrationBar === false) {
            props.handleIllustrationBarOpen()
        }
        if(props.dashboardScreen === false) {
            props.resetAllActivity('due_dilligence')
            props.setDashboardScreen()
        }
    }

    const onHandlePatentAssets = () => {
        dispatch(setAssetButton(true))
        dispatch(setTransactionButton(false))
        setPatentView(true)
        setTimelineView(false)
        dispatch(setJurisdictionRequest(false))
        dispatch(setCPCRequest(false))
        dispatch(setTimelineRequest(false))
        dispatch(setTimelineData([]))
        props.resetAllActivity('due_dilligence')
        props.setPatentAssets()
    }

    const getUnCollatealized = () => {
        dispatch(setAssetButton(true))
        dispatch(setTransactionButton(false))
        setPatentView(true)
        setTimelineView(false)
        props.resetAllActivity('uncollateralized')
        props.setPatentAssets() 
    }

    const onHandleSearch = () => {
        setOpenSearch(!openSearch)
    }

    const onHandleAlert = () => {
        alert('Please activate your account.')
    }
     
    return(
        <React.Fragment>
           {/*  <Button onClick={getUnCollatealized}>Uncollateralized</Button> */}
            <Maintainance/>
            {
                profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank'
                && (
                    <AddToolTip
                        tooltip={'Key Performance Indicators such as the number of patents owned by the company.'}
                        placement='bottom'
                    >
                        <span>
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, classes.actionIconDashboard, {[classes.active]: props.dashboardScreen === true && viewDashboard.kpi})}
                                onClick={() => process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' ? onHandleAlert() :  onHandleKPI()}
                                disabled={loadingDashboardData}
                            >
                                <AppsOutage/>
                            </IconButton> 
                        </span>
                    </AddToolTip>
                )
            }
            
            <AddToolTip
                tooltip={'Matters that require attention such as patents with defective ownership.'}
                placement='bottom'
            >
                <span>
                    <IconButton 
                        size="small"
                        className={clsx(classes.actionIcon, classes.actionIconDashboard, {[classes.active]:  props.dashboardScreen === true && !viewDashboard.line && viewDashboard.jurisdictions == false && viewDashboard.invention === false && viewDashboard.sankey === false && viewDashboard.kpi === false && viewDashboard.timeline === false})}
                        onClick={() => process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' ? onHandleAlert() :  changeGraph(false)}
                        disabled={loadingDashboardData}
                    >
                        <Speed/> 
                    </IconButton>
                </span>
            </AddToolTip>
            {
                process.env.REACT_APP_ENVIROMENT_MODE !== 'KPI' && (
                    <AddToolTip
                        tooltip={'Transactional activities such as acquisition, divestitures, collateralization and releases.'}
                        placement='bottom'
                    >
                        <IconButton 
                            size="small"
                            className={clsx(classes.actionIcon, classes.actionIconDashboard, {[classes.active]: props.dashboardScreen === true && viewDashboard.timeline})}
                            onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onHandleTimeline}
                        >
                            <ViewTimeline/>
                        </IconButton> 
                    </AddToolTip>
                )
            }
            {
                profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank' &&  process.env.REACT_APP_ENVIROMENT_MODE !== 'KPI'
                && (
                    <React.Fragment>
                        <AddToolTip
                            tooltip={`Schedule a ${process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'd' : 'D' }emo ${process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'for Pro version' : '' }`}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon)}
                                onClick={() => {props.setScheduling(!props.scheduling)}}
                                style={{marginLeft: 62}}
                            >
                               <SupportAgent/>
                            </IconButton>
                        </AddToolTip> 
                    </React.Fragment>
                )
            } 
        </React.Fragment>
    )

}


export default ViewIcons;