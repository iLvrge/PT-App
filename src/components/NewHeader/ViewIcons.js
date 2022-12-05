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
import { AppsOutage, AutoGraph, Public, Speed, ViewTimeline, Search, NotificationsNone, ManageSearch, SupportAgent } from '@mui/icons-material'
import PatenTrackApi from '../../api/patenTrack2'
import { copyToClipboard } from '../../utils/html_encode_decode'
import { setSwitchAssetButton } from '../../actions/patentTrackActions2'
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
    const assetButton = useSelector(state => state.ui.assetButton) 
    const transactionButton = useSelector(state => state.ui.transactionButton) 
    const loadingDashboardData = useSelector( state => state.ui.loadingDashboardData);
    const category = useSelector(state => state.patenTrack2.selectedCategory)
    const maintainencePatentsList = useSelector(state => state.patenTrack2.maintainenceAssetsList.list)
    const mainCompaniesSelected = useSelector(state => state.patenTrack2.mainCompaniesList.selected)
    const assetTypeAssignmentAssetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list)
    const selectedAssetsTransactions = useSelector(state => state.patenTrack2.assetTypeAssignments.selected)
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
    const assetTypeAssignmentAssetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const SHARE_URL_MESSAGE = 'A sharing URL was added to your clipboard.'
    const path = location.pathname
 

    const changeGraph = async(flag) => {
        //setCardList(LIST)
        onHandleDashboard()
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
        onHandleDashboard()
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
        onHandleDashboard()
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

    const onHandleDashboard = () => {
        
        if(path.indexOf('/dashboard') == -1) {
            history.push('/dashboard') 
        }
        setPatentView(false)
        setTimelineView(false)
        dispatch(setAssetButton(false))
        dispatch(setTransactionButton(false))
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

    const shareDashboard = async() => {
        /**
         * get selected companies and selected transaction types
         * and create shareable dashboard url
         */ 
        if(mainCompaniesSelected.length > 0) {
            const formData = new FormData()
            formData.append('selectedCompanies', JSON.stringify(mainCompaniesSelected));
            formData.append('tabs', profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? 5 : JSON.stringify(assetTypesSelected));
            formData.append('customers', JSON.stringify(selectedAssetCompanies));
            formData.append('share_button', viewDashboard.kpi === true ? 1 : viewDashboard.gauge === true ? 2 : 0);
            const {data} = await PatenTrackApi.shareDashboard(formData)
            if( data !== null){
                copyToClipboard(data, SHARE_URL_MESSAGE)
            }
        } else {
            alert("Please select a company first")
        }
    }

    const onShare = useCallback(async () => {
        if (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'){
            alert('Message..')
        } else {
            if(props.dashboardScreen === true) { 
                shareDashboard()
            } else {
                let selectAssetsList = [], selectedTransactions = []
    
                let list = maintainencePatentsList.length > 0 ? [...maintainencePatentsList] : [...assetTypeAssignmentAssetsList]
        
                let selectedItems = selectedMaintainencePatents.length > 0 ? [...selectedMaintainencePatents] : [...assetTypeAssignmentAssetsSelected]
        
                if(selectedItems.length > 0) {
                    selectedItems.forEach( item => {
                        const findIndex = list.findIndex( row => row.asset == item)
                        if(findIndex !== -1) {
                        selectAssetsList.push({asset: item, flag: list[findIndex].grant_doc_num !== '' && list[findIndex].grant_doc_num !== null ? 4 : 5})
                        }
                    }) 
                } else {
                    selectedTransactions = [...selectedAssetsTransactions]
                }
                if( selectedTransactions.length == 0 &&  selectAssetsList.length == 0 ) {
                    alert(`Please select one or more ${props.timelineScreen === true ? 'transactions' : 'assets'} to share`)
                } else {
                    // Share list of assets and create share link 
                    let form = new FormData()
                    form.append('assets', JSON.stringify(selectAssetsList))
                    form.append('transactions', JSON.stringify(selectedTransactions))
                    form.append('type', 2)      
                    const {data} = await PatenTrackApi.shareIllustration(form)
                    if (data.indexOf('sample') >= 0) {
                        /**
                         * just for temporary replacing
                         * open share url new tab
                         */
                        //const shareURL = data.replace('https://share.patentrack.com','http://167.172.195.92:3000')
                        
                        /* if(window.confirm("Copy a sharing link to your clipboard.")){
                            copy(data)
                        } */
                        if( data !== null){
                            copyToClipboard(data, SHARE_URL_MESSAGE)
                        }
                        //window.open(data,'_BLANK')
                    } 
                }
            }
        }        
    }, [ dispatch, category, mainCompaniesSelected, selectedMaintainencePatents, assetTypeAssignmentAssetsSelected, selectedAssetsTransactions ])

    const onHandleAlert = () => {
        alert('Please activate your account.')
    }
     
    return(
        <React.Fragment>
            {/* <Button onClick={getUnCollatealized}>Uncollateralized</Button> */}
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
                                className={clsx(classes.actionIcon, {[classes.active]: props.dashboardScreen === true && viewDashboard.kpi})}
                                onClick={() => process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert() :  onHandleKPI()}
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
                        className={clsx(classes.actionIcon, {[classes.active]:  props.dashboardScreen === true && !viewDashboard.line && viewDashboard.jurisdictions == false && viewDashboard.invention === false && viewDashboard.sankey === false && viewDashboard.kpi === false && viewDashboard.timeline === false})}
                        onClick={() => process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert() :  changeGraph(false)}
                        disabled={loadingDashboardData}
                    >
                        <Speed/> 
                    </IconButton>
                </span>
            </AddToolTip>
            {/* <AddToolTip
                tooltip={'Changes in matters requiring attention along a timeline.'}
                placement='bottom'
            >
                <IconButton 
                    size="small"
                    className={clsx(classes.actionIcon, {[classes.active]: props.dashboardScreen === true && viewDashboard.line && viewDashboard.jurisdictions == false && viewDashboard.invention === false && viewDashboard.sankey === false && viewDashboard.kpi === false && viewDashboard.timeline === false})}
                    onClick={() => process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert() : changeGraph(true)}
                >
                    <AutoGraph/>
                </IconButton> 
            </AddToolTip> */}
            <AddToolTip
                tooltip={'Transactional activities such as acquisition, divestitures, collateralization and releases.'}
                placement='bottom'
            >
                <IconButton 
                    size="small"
                    className={clsx(classes.actionIcon, {[classes.active]: props.dashboardScreen === true && viewDashboard.timeline})}
                    onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onHandleTimeline}
                >
                    <ViewTimeline/>
                </IconButton> 
            </AddToolTip>
            {
                profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank'
                && (
                    <React.Fragment>
                        {/* <AddToolTip
                            tooltip={'Technologies covered by the patent portfolio as they evolved.'}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, {[classes.active]: props.dashboardScreen === true && viewDashboard.invention})}
                                onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onHandleInvention}
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
                                className={clsx(classes.actionIcon, {[classes.active]: props.dashboardScreen === true && viewDashboard.jurisdictions})}
                                onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onHandleJurisdiction}
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
                                className={clsx(classes.actionIcon, {[classes.active]: props.dashboardScreen === true && viewDashboard.sankey})}
                                onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onHandleSankey}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={clsx('MuiSvgIcon-root MuiSvgIcon-fontSizeMedium')} viewBox="0 0 24 24">
                                    <path d="M23,6l-4-3.969v2L1,4v9h5.5C6.776,13,7,13.224,7,13.5v6.531H6L8,22l2-1.969H9v-7C9,11.928,8.103,11,7,11h5	c1.105,0,2,0.895,2,2v2.031h-2l3.586,3.954L19,15.031h-2V12.5c0-2.481-2.019-4.5-4.5-4.5H19v2.031L23,6z"/>
                                </svg>
                            </IconButton>
                        </AddToolTip>  */}
                        <AddToolTip
                            tooltip={'All Assets (Since 1998)'}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, {[classes.active]: assetButton})}
                                onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onHandlePatentAssets}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`noStroke`}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"/></svg>
                            </IconButton>
                        </AddToolTip> 
                        <AddToolTip
                            tooltip={'All Transactions (Since 1998)'}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, {[classes.active]: transactionButton})}
                                onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onHandleTransactions}
                            >
                               <svg id="icons" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={`noStroke`}><path d="M52,7H12a6,6,0,0,0-6,6V51a6,6,0,0,0,6,6H52a6,6,0,0,0,6-6V13A6,6,0,0,0,52,7Zm2,44a2,2,0,0,1-2,2H12a2,2,0,0,1-2-2V13a2,2,0,0,1,2-2H52a2,2,0,0,1,2,2Z"/><path d="M45,29a2,2,0,0,0,0-4H22.83l2.58-2.59a2,2,0,0,0-2.82-2.82l-6,6a2,2,0,0,0-.44,2.18A2,2,0,0,0,18,29Z"/><path d="M47,36H20a2,2,0,0,0,0,4H42.17l-2.58,2.59a2,2,0,1,0,2.82,2.82l6-6a2,2,0,0,0,.44-2.18A2,2,0,0,0,47,36Z"/></svg>
                            </IconButton>
                        </AddToolTip> 
                        <AddToolTip
                            tooltip={'Share Dashboard/Transactions/Assets'}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, classes.shareIcon)}
                                onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : onShare}
                            >
                                <FontAwesomeIcon
                                    icon={faShareAlt}
                                />
                            </IconButton>
                        </AddToolTip> 
                        <IconButton
                            className={`${classes.buttonIcon} ${props.clipboard_assets.length > 0 ? classes.clipIconActive : ''} ${ props.display_clipboard === true ? classes.clipIconIsActive : ''}`}
                            onClick={ process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? onHandleAlert : props.handleClipboard}
                            size="large">
                            <Badge badgeContent={props.clipboard_assets.length} color="secondary">    
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M40,5c-3.3085938,0-6,2.6914062-6,6v3h-5c-0.4199219,0-0.7949219,0.262207-0.9394531,0.6567383l-0.880188,2.4077148	h-9.0836792C16.9404297,17.0644531,16,18.0048828,16,19.1611328v53.7421875C16,74.0595703,16.9404297,75,18.0966797,75h43.8066406
                                C63.0595703,75,64,74.0595703,64,72.9033203V19.1611328c0-1.15625-0.9404297-2.0966797-2.0966797-2.0966797H52.755188
                                L51.875,14.6567383C51.7304688,14.262207,51.3554688,14,50.9355469,14H46v-3C46,7.6914062,43.3085938,5,40,5z M53.1289062,22
                                c0.3261719,0,0.6328125-0.1591797,0.8193359-0.4267578c0.1875-0.2680664,0.2324219-0.6098633,0.1201172-0.9165039
                                l-0.5820923-1.5922852h8.4170532C61.9541016,19.0644531,62,19.1103516,62,19.1611328v53.7421875
                                C62,72.9541016,61.9541016,73,61.9033203,73H18.0966797C18.0458984,73,18,72.9541016,18,72.9033203V19.1611328
                                c0-0.0507812,0.0458984-0.0966797,0.0966797-0.0966797h8.3526001l-0.5820923,1.5922852
                                c-0.1123047,0.3066406-0.0673828,0.6484375,0.1201172,0.9165039C26.1738281,21.8408203,26.4804688,22,26.8066406,22H53.1289062z
                                M50.2363281,16l1.4619141,4H28.2373047l1.4619141-4H35c0.5527344,0,1-0.4477539,1-1v-4c0-2.2055664,1.7939453-4,4-4
                                s4,1.7944336,4,4v4c0,0.5522461,0.4472656,1,1,1H50.2363281z"  className="color000 svgShape"></path><path d="M23,38h8V28h-8V38z M25,30h4v6h-4V30z"  className="color000 svgShape"></path><rect width="23" height="2" x="34" y="32"  className="color000 svgShape"></rect><rect width="17" height="2" x="23" y="44"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="54"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="64"  className="color000 svgShape"></rect><rect width="2" height="4" x="38.968" y="9"  className="color000 svgShape"></rect></svg>
                            </Badge>
                        </IconButton> 
                        {/* <IconButton className={classes.buttonIcon} size="large">
                            <Badge badgeContent={0} color="secondary"> 
                                <NotificationsNone/>
                            </Badge>         
                        </IconButton>  */}
                        <AddToolTip
                            tooltip={`Search at USPTO`}
                            placement='bottom'
                        >  
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon, {[classes.active]: openSearch})}
                                /* onClick={onHandleSearch} */
                                onClick={() => window.open('https://ppubs.uspto.gov/pubwebapp/')}
                            >
                               <ManageSearch/>
                            </IconButton>
                        </AddToolTip> 
                        {/* <div className={clsx(classes.search, {[classes.searchEnable]: openSearch})}>
                            <InputBase
                                placeholder='Search…'
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                defaultValue={ props.search_string != null ? props.search_string : ''}
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyDown={props.handleKeyDown}
                                disabled 
                            />
                        </div> */}
                        <AddToolTip
                            tooltip={`Schedule a ${process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'd' : 'D' }emo ${process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'for Pro version' : '' }`}
                            placement='bottom'
                        >
                            <IconButton 
                                size="small"
                                className={clsx(classes.actionIcon)}
                                onClick={() => {props.setScheduling(!props.scheduling)}}
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