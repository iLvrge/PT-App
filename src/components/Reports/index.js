import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import { Grid, IconButton, Paper}  from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import useStyles from './styles'
import clsx from 'clsx'
import moment from 'moment'
import CardElement from './CardElement'
import { Fullscreen, Close, Reviews, Speed, ViewTimeline, AppsOutage } from '@mui/icons-material';

import { 
    setDashboardPanel,
    setTimelineScreen,
    setDashboardScreen,
    setPatentScreen, 
    setViewDashboardIntial,
    setLoadingDashboardData,
    setViewIntro} from '../../actions/uiActions'
import { setAssetsIllustration, setBreadCrumbsAndCategory, setSwitchAssetButton, setDashboardPanelActiveButtonId,  retrievePDFFromServer, setAssetTypesSelect, setSelectedAssetsPatents, getAssetDetails, setAllAssetTypes  } from '../../actions/patentTrackActions2'
import { assetLegalEvents, setAssetLegalEvents, setPDFView, setPDFFile, setConnectionData, setConnectionBoxView, assetFamily,   } from '../../actions/patenTrackActions';
import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar'
import { controlList } from "../../utils/controlList"

import PatenTrackApi from '../../api/patenTrack2'
import routeList from '../../routeList'
import GeoChart from '../common/AssetsVisualizer/GeoChart'
import InventionVisualizer from '../common/AssetsVisualizer/InventionVisualizer'
import SankeyChart from './SankeyChart'
import AddToolTip from './AddToolTip'
import { useIsMounted } from '../../utils/useIsMounted'

const Reports = (props) => {
    let LIST = [
        {
            title: 'Chain-of-Title',
            tooltip: 'Owned assets with defects along the chain-of-title that could impede their future use.',
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
            tooltip: 'Patent assets invented by the company\’s employees, the assignment of which to the company is yet to be recorded. 37 CFR § 1.46 Application for patent by an assignee: (b)(1) If the applicant is the assignee, documentary evidence of ownership ( e.g., assignment for an assignee, employment agreement for a person to whom the inventor is under an obligation to assign the invention) should be recorded as provided for in part 3 of this chapter no later than the date the issue fee is paid in the application.',
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
            tooltip: 'Patent assets covering subject matters presumably far from the company’s core business.',
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
            tooltip: 'Patent assets with a higher likelihood to license 3rd parties.',
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
            tooltip: 'Patent assets that were assigned under incorrect owner names, and are likely to not be found in a name search, preventing assignees from finding their own patent assets.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 17,
            list: [],
            id: 5
        },
        {
            title: 'To Collateralize',
            tooltip: 'Assets that have not been pledged as collateral under its security agreements.',
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
            tooltip: 'Collateralized patent assets that have expired or abandoned.  Most security agreements require borrowers to maintain the securing assets.',
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
            tooltip: 'Patent assets that are subject to third party rights, which could harm the patents’ liquidity, enforcement, and collateralization. ',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 18,
            list: [],
            id: 8
        },
        {
            title: 'Maintenance',
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
            tooltip: 'Patent assets the assignment of which was recorded later than 3 months from its date, and therefore exposed to a bona fide purchases for valuable consideration.',
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
            tooltip: 'Patent assets the assignments of which were recorded incorrectly, and required a subsequent correction.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 24,
            list: [],
            id: 11
        },
        {
            title: 'To Purchase',
            tooltip: 'Patent assets available for you to purchase directly from other PatenTrack\'s users. These assets were selected based on the innovative focus of your patent portfolio.',
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
            tooltip: 'USA assets invented by the company\'s employees and assets assigned to the company from 3rd parties. Excluding assets that were sold, abandoned or expired.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 30,
        },
        {
            title: 'Invented',
            tooltip: 'USA assets invented by the company’s employees. Excluding assets that have been sold, abandoned, or expired.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 31,
        }, 
        {
            title: 'Acquired',
            tooltip: 'USA assets, which have not been sold, abandoned, or expired, assigned to the company other than from its employees.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 32,
        },
        {
            title: 'Collateralized',
            tooltip: 'USA assets subject to unreleased security rights.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 34
        },
        {
            title: 'Maintenance Fee Due',
            tooltip: 'USA assets for which maintenance fee is due for payment in the next 12 months.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '', 
            type: 35,
            currency: true
        },
        {
            title: 'Challenged',
            tooltip: 'USA assets under past or present PTAB proceedings.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 37
        },
        {
            title: 'Divested',
            tooltip: 'USA assets assigned from the company to others.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 33
        },
        {
            title: 'Abandoned',
            tooltip: 'USA patent applications the prosecution of which discontinued, and USA patents expired due to non-payment of maintenance fees.',
            number: 0,
            other_number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 36
        },
        {
            title: 'Non-U.S.',
            tooltip: 'Owned USA assets, which have non-U.S.A. members.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 38,
            list: []
        },
        {
            title: 'Inventors',
            tooltip: 'Company\’s employees with the largest number of inventions.',
            number: 0,
            patent: '',
            application: '',
            rf_id: '',
            type: 39,
            list: []
        },
        {
            title: 'Managers',
            tooltip: 'The company\’s law firms with the largest number of recorded transactions.',
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
            tooltip: 'The most recent transactions and other assignments transferring patent ownership rights to the selected company.',
            standalone: false,
            button: true,
            rf_id: '',
            type: 1,
            list: [] 
        },
        {
            title: 'Divestitures',
            tooltip: 'The most recent transactions and other assignments transferring patent ownership rights from the selected company.',
            standalone: false,
            button: true,
            rf_id: '',
            type: 2,
            list: []
        },
        {
            title: 'Licensing',
            tooltip: 'The most recent transactions under which the selected company granted or was granted patent licenses.',
            standalone: false,
            button: true,
            rf_id: '',
            type: 3,
            list: []
        },
        {
            title: 'Collateralization',
            tooltip: 'The most recent transactions in which the selected company used patent and patent applications as collateral to secure loans. If the company defaults on the loan, the lender may seize and sell the patent asset to offset their loss. Green bars denote released security transactions.',
            standalone: false,
            button: true,
            rf_id: '',
            type: 4,
            list: []
        },
        {
            title: 'Inventing',
            tooltip: 'Most employment agreements obligate employees to assign their inventions to their employer. This timeline shows the most recent recorded transfers of ownership rights from the company’s employees-inventors to the company.',
            standalone: false,
            button: true,
            rf_id: '',
            type: 5,
            list: []
        },
        {
            title: 'Litigation',
            tooltip: 'US Courts and Patent Trial and Appeal Board (PTAB) proceedings involving patents owned by the selected company. ',
            standalone: false,
            button: true,
            rf_id: '',
            type: 6,
            list: []
        }
    ]

    const BANK_TIMELINE_LIST = [
        {
            title: '',
            tooltip: 'Tooltip',
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
    const KPI_TYPE = [30,31,32,33,34,35,36,37,38,39,40,41]
    const GAUGE_TYPE = [1, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    const STEPS = [
        { 
            title: 'Welcome to PatenTrack!', 
            intro: `<p>We are very happy you are here. 👋</p><p>For each of the companies in your account we created 3 dashboards with the most important aspects of its patents.</p><p>Let's start your walkthrough...</p>`, 
            tooltipClass: 'dashboardIntroTooltip', 
        },
        {
            element: document.querySelector('.step-1'),
            title: 'Your Companies',
            intro: `The Companies table lists the entities included in your account.
            You may add as many as you'd like, including competitors.`,
            position: 'right',
            tooltipClass: 'dashboardIntroTooltip',
            highlightClass: 'dashboardHighlightClass',
        },
        {
            element: document.querySelector('.step-2'),
            title: 'Your 3 Dashboards',
            intro: 'Select one of the three dashboards to see information relating to: <div><span><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AppsOutageIcon"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6 6h4v-4h-4v4zm3-20c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm.5 8h-1V7h1v1zm0-2h-1V2h1v4zM16 14h4v-2.07c-.33.05-.66.07-1 .07-1.07 0-2.09-.24-3-.68V14zM10 4v4h2.68c-.44-.91-.68-1.93-.68-3 0-.34.02-.67.07-1H10z"></path></svg></span>Key perfomance indicators</div><div><span><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SpeedIcon"><path d="m20.38 8.57-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"></path></svg></span>Matters calling for attention</div><div><span><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ViewTimelineIcon"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm3-4H9v-2h6v2zm3-4h-6V7h6v2z"></path></svg></span>Transactional activities</div>',
            position: 'bottom',
            tooltipClass: 'dashboardIntroTooltip',
            highlightClass: 'dashboardHighlightClass',
        },
        {
            element: document.querySelector('.dashboard_buttons'),
            title: 'What It\'s About',
            intro: `Hover over the headings to see explanations about each component. <p>Click it if you'd like to see the underlying data.</p><p>You can always return to the dashboards by clicking the buttons at the top right corner.</p>`,
            position: 'right',
            tooltipClass: 'dashboardIntroTooltip',
            highlightClass: 'dashboardHighlightClass',
        },
        {
            title: 'You Are Ready!',
            intro: `<div>That's it, take the helm!</div><p>You are now in full control over your organization's most strategic assets.</p><p>Just select a company from the Companies table on the left and check its dashboards.</p>`, 
            tooltipClass: 'dashboardIntroTooltip', 
        },
        {
            element: document.querySelector('.step-3'),
            title: 'Contact Us!',
            intro: `<div>Do not hesitate to schedule a quick call with any question.</div>`,
            position: 'bottom',
            tooltipClass: 'dashboardIntroTooltip',
            highlightClass: 'dashboardHighlightClass',
        },
    ]
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const DATE_FORMAT = 'MMM DD, YYYY'
    const ref = useRef();
    let resizeObserver = null
    const [loading, setLoading] = useState(false)    
    const [enableStep, setEnableStep] = useState(false)       
    const [timeLineLoading, setTimeLineLoading] = useState(false)    
    const [timelineGrid, setTimelineGrid] = useState(TIMELINE_ITEM)
    const [grid, setGrid] = useState(GRID_ITEM)
    const [smallScreen, setSmallScreen] = useState(false)
    const [activeId, setActiveId] = useState(-1)
    const profile = useSelector(state => (state.patenTrack.profile))    
    const [cardList, setCardList] = useState([])
    const [timelineList, setTimelineList] = useState(/* profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_TIMELINE_LIST : */ TIMELINE_LIST) 
    const viewDashboard = useSelector(state => state.ui.viewDashboard)
    const viewInitial = useSelector(state => state.ui.viewInitial)
    const viewIntro = useSelector(state => state.ui.viewIntro)
    const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected)
    const childID = useSelector( state => state.patenTrack2.mainCompaniesList.childID)
    const child_list = useSelector( state => state.patenTrack2.mainCompaniesList.child_list)
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected)
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected)
    const selectedAssetAssignments = useSelector(
        state => state.patenTrack2.assetTypeAssignments.selected,
    ) 
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
                /* console.log('newTimelineGrid', newTimelineGrid, profile) */
                if (isMounted.current) { 
                    setGrid(newGridItems)
                }
                if(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank'){
                    /* console.log('newTimelineGrid', newTimelineGrid) */
                    if (isMounted.current) { 
                        setTimelineGrid(newTimelineGrid)
                    }
                }
                if (isMounted.current) { 
                    setSmallScreen(smallScreen)  
                }
            })
                     
            resizeObserver.observe(ref.current)
            return () => {
                if(resizeObserver) {
                    resizeObserver.disconnect();
                }
            }
        }   
    }, [profile]) 

    useEffect(() => {
        if(dashboardPanelActiveButtonId != activeId) {
            if (isMounted.current) { 
                setActiveId(dashboardPanelActiveButtonId)
                if(dashboardPanelActiveButtonId != -1) {
                    props.checkChartAnalytics(null, null, dashboardPanelActiveButtonId != -1 ? true : false)
                }
            }
        } 
    }, [dashboardPanelActiveButtonId])

    useEffect(() => { 
        if (isMounted.current) { 
            if(viewDashboard.timeline === true) {
                /* setTimelineList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST]) */
                setTimelineList(TIMELINE_LIST)
            } else if(viewDashboard.kpi === true || viewDashboard.line === true || viewDashboard.gauge === true){ 
                addCardList(viewDashboard.kpi === true ? 1 : '')  
            }  
        }
    }, [viewDashboard])

    useEffect(() => {
        if(viewInitial === false) {
            if(selectedCompanies.length > 0) {
                if (isMounted.current) {
                    if(viewDashboard.timeline === true && timelineList.length > 0) { 
                        callTimelineData()
                    } else if(cardList.length > 0){
                        findDashboardData()
                    }
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
        if (isMounted.current) { 
            if(profile?.user?.organisation?.organisation_type) {
               /*  setTimelineList(profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST])
                setTimelineGrid(profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? BANK_TIMELINE_ITEM : TIMELINE_ITEM) */
                setTimelineList(TIMELINE_LIST)
                setTimelineGrid(TIMELINE_ITEM)
            } 
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
                    if (isMounted.current) { 
                        /* setTimelineList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST]) */
                        setTimelineList(TIMELINE_LIST)
                    }
                } else {
                    addCardList(!viewDashboard.line && viewDashboard.jurisdictions == false && viewDashboard.invention === false && viewDashboard.sankey === false && viewDashboard.kpi === false && viewDashboard.timeline === false ? 0 : viewDashboard.kpi === true ? 1 : '')  
                }
            }
        } 
    },  [
            selectedCompanies 
        ]
    )



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
        return (() => {})
    }, [activeId])

/* 
    const companyname = useMemo(() => {
        return selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
    }, [selectedCompanies, companiesList]) */ 

    const companyname = useMemo(() => {
        let filterList =  selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
        if(filterList.length == 0) { 
            filterList =  selectedCompanies.length > 0 && childID > 0 && child_list.length > 0 && child_list.filter( company => company.representative_id === selectedCompanies[0])
        }
        return filterList
    }, [selectedCompanies, companiesList])

    const formattedCompanyname = useMemo(() => {
        let name = ''
        let filterList =  selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0]) 
        if(filterList.length == 0) { 
            let findCompany = selectedCompanies.length > 0 && child_list.filter( company => company.representative_id === selectedCompanies[0]) 
            if(findCompany.length == 0) {
                companiesList.map( company => {
                    if(company.type == 1) {
                        if(company.child != '') { 
                            const companyChildIDs = JSON.parse(company.child)
                            if(companyChildIDs.includes(selectedCompanies[0])) {
                                const childs = JSON.parse(company.child_full_detail)
                                if(childs.length > 0) {
                                    findCompany = childs.filter( cmp => cmp.representative_id === selectedCompanies[0])
                                    if(findCompany.length > 0) {
                                        name = `${company.original_name} <i class="fa fa-sm fa-angle-double-right"></i> ${findCompany[0].original_name}`
                                    }
                                }
                            }
                        }
                    }
                })
            } else if(findCompany.length > 0) {
                if(childID > 0) { 
                    const findGroup =  companiesList.filter( company => company.representative_id === childID)
                    if(findGroup.length > 0) {
                        name = `${findGroup[0].original_name} <i class="fa fa-sm fa-angle-double-right"></i> ${findCompany[0].original_name}`
                    } else {
                        name = findCompany[0].original_name
                    }
                } else {
                    name = findCompany[0].original_name
                }
            }
        } else {
            name = filterList != false ? filterList[0].original_name : ''
        } 
        return name
    }, [selectedCompanies, companiesList])
    

    const partyName = useMemo(() => {
        return selectedAssetCompanies.length > 0 && assetTypeCompanies.filter( party => party.id === selectedAssetCompanies[0])
    }, [selectedAssetCompanies, assetTypeCompanies])

    
    const findDashboardData = async(invention, jurisdictions, sankey, kpi) => {        
        if(profile != undefined && profile.user != undefined && loading === false && ((typeof invention !== 'undefined' && invention === false) ||  viewDashboard.invention === false) && ((typeof jurisidictions !== 'undefined' && jurisdictions === false) || viewDashboard.jurisdictions === false ) && ((typeof sankey !== 'undefined' && sankey === false) || viewDashboard.sankey === false) ) { 
            const list = [];
            let totalRecords = 0; 
            setLoading(true)
            dispatch(setLoadingDashboardData(true))
            resetAll(false)
            props.checkChartAnalytics(null, null, false) 
            dispatch(setViewDashboardIntial(true)) 
            
            /* if(viewDashboard.line === true || (profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank')) {
                const cancelRequest = await PatenTrackApi.cancelAllDashboardToken()  
                
                const source = PatenTrackApi.generateCancelToken() 
                if (isMounted.current) { 
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
                        formData.append('company', companyname.length > 0 ? companyname[0].original_name : '' )              
                        const requestData = await PatenTrackApi.getDashboardData(formData, source)
                        if( requestData !== null){
                            updateList(requestData, item.type)
                        }
                        return item
                    })                
                    await Promise.all(dashboardRequest)

                }
            } else { */
                const type = viewDashboard.kpi === true ? [...KPI_TYPE] : [...GAUGE_TYPE]
                const cancelRequest = await PatenTrackApi.cancelAllDashboardCountToken()  
                
                const source = PatenTrackApi.generateCancelToken() 
                if (isMounted.current) { 
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
                    formData.append('company', companyname.length > 0 ? companyname[0].original_name : '' )              
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
                                    if( Array.isArray(other) ) {
                                        oldList[findIndex].list = other.length > 0 ? [...other] : []
                                        oldList[findIndex].patent = ''
                                        oldList[findIndex].application = ''
                                        oldList[findIndex].rf_id = ''
                                        oldList[findIndex].total = item.total  
                                        oldList[findIndex].number = 0           
                                    } else if( item.hasOwnProperty('number') ) { 
                                        oldList[findIndex].number = item.number == null || item.number == '' || item.number == undefined ? 0 : item.number
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
                            if(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' && viewDashboard.gauge === true){
                                if(oldList[2].title == 'To Divest') {
                                    oldList[2].title = 'To Collateralized';
                                }
                                if(oldList[5].title == 'To Collateralize') {
                                    oldList[5].title = 'Addresses';
                                }
                            }
                            setCardList(oldList)
                            if(viewIntro === false) {
                                dispatch(setViewIntro(true))
                                setEnableStep(true)
                            }
                            if(typeof props.updateDashboardData !== 'undefined') {
                                props.updateDashboardData(oldList)
                            }
                        }
                        
                        if(viewDashboard.kpi === true) {
                            formData.delete('type')
                            formData.append('type', 37)
                            
                            const source = PatenTrackApi.generateCancelToken() 
                            const newRequestData = await PatenTrackApi.getDashboardData(formData, source)
                            if( newRequestData !== null){
                                updateList(newRequestData, 37)
                            }
                        }
                    } 
                }
            /* }  */
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
        
        const source = PatenTrackApi.generateCancelToken() 
        dispatch(setViewDashboardIntial(true))
        const dashboardRequest = timelineList.map(async item => {
            const formData = new FormData()
            formData.append('selectedCompanies', JSON.stringify(selectedCompanies));
            formData.append('type', item.type)             
            formData.append('customers', JSON.stringify(selectedAssetCompanies));
            const requestData = await PatenTrackApi.getDashboardTimelineData(formData, source)
            if( requestData !== null){
                if (isMounted.current) { 
                    updateTimelineList(requestData, item.type)
                }
            }
            return item
        })                
        Promise.allSettled(dashboardRequest).then((dashboardRequest) => {
            /* const newTimeline = profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [...BANK_TIMELINE_LIST] : [...TIMELINE_LIST] */
            const newTimeline = [...TIMELINE_LIST]
            newTimeline.forEach( (item, index) => {
                const findIndex = dashboardRequest.findIndex( row => row.status === "fulfilled" && row.value.type === item.type ) 

                if(findIndex !== -1) {
                    newTimeline[index].list = [...dashboardRequest[findIndex].value.list]
                }
            })
            if (isMounted.current) { 
                setTimelineList(newTimeline)
            }
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
        /* setCardList(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'? BANK_LIST : typeof t != 'undefined' && t === 1 ? KPI_LIST : LIST) */
        const cardList = profile?.user?.organisation?.organisation_type && typeof t != 'undefined' && t === 1 ? KPI_LIST : LIST 
        if(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' && viewDashboard.gauge === true){
            if(cardList[2].title == 'To Divest') {
                cardList[2].title = 'To Collateralized';
            }
        }
        setCardList(cardList)
    }

    const updateTimelineList =  useCallback((requestData, type) => {  
        let oldList = [...timelineList]
        const findIndex = oldList.findIndex( item => item.type === type)
        if(findIndex !== -1) {
            if( requestData !== null && requestData.data != null /* && requestData.data.length > 0 */) { 
                oldList[findIndex].list = [...requestData.data]
            }
        }
        if (isMounted.current) { 
            setTimelineList(oldList)
        }
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
                    oldList[findIndex].number = requestData.data.number == null ? 0 : requestData.data.number
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
            if (isMounted.current) {         
                setCardList(oldList)
            }
            if(typeof props.updateDashboardData !== 'undefined') {
                props.updateDashboardData(oldList)
            }
        }      
    }, [cardList, viewDashboard])

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
                formData.append('company', companyname.length > 0 ? companyname[0].original_name : '' )              
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
                        PatenTrackApi.cancelFamilyCounterRequest()
                        PatenTrackApi.cancelClaimsCounterRequest()
                        PatenTrackApi.cancelFiguresCounterRequest()
                        PatenTrackApi.cancelPtabCounterRequest()
                        PatenTrackApi.cancelCitationCounterRequest()
                        PatenTrackApi.cancelFeesCounterRequest()
                        PatenTrackApi.cancelStatusCounterRequest()
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

    const onHandleList = useCallback((id, boxType, gridType) => {
        if(process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD'/*  || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' */) {
            alert('Please activate your account.')
        } else {
            let subscription = parseInt(profile?.user?.organisation?.subscribtion), timeline = false, patent = false, maintainence = false
            
            if( subscription === 2 || subscription === 3 ) {
                let findIndex = -1
                let activityIDs = [], transactionCategory = ''
                if(typeof gridType != 'undefined') {
                    switch(parseInt(boxType)) {
                        case 1:
                            activityIDs = [1, 6]
                            transactionCategory = 'acquisition_transactions'
                            break
                        case 2:
                            activityIDs = [2, 7]
                            transactionCategory = 'divestitures_transactions'
                            break
                        case 3:
                            activityIDs = [3, 4]
                            transactionCategory = 'licensing_transactions'
                            break
                        case 4:
                            activityIDs = [5, 12]
                            transactionCategory = 'collateralization_transactions'
                            break
                        case 5:
                            activityIDs = [10]
                            transactionCategory = 'inventing_transactions'
                            break
                        case 6:
                            activityIDs = [9]
                            transactionCategory = 'litigation_transactions'
                            break
                        case 7:
                            activityIDs = [1,6,2,7,3,4,5,12,13,11,9]
                            transactionCategory = ''
                            break
                    }
                    timeline = true
                    if(transactionCategory != '') {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == transactionCategory)  
                    } 
                } else {
                    if(id === 1 && viewDashboard.kpi === false) {                
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
                        patent = true
                    } else if(id === 17 /* && subscription > 2 */  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_names')
                        patent = true
                    } else if(id === 18 /* && subscription > 2 */  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'clear_encumbrances')
                        patent = true
                    } else if(id === 19 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_address')
                        //timeline = true
                        patent = true
                    } else if(id === 20 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'to_be_monitized')
                        patent = true
                    } else if(id === 21 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'unnecessary_patents')
                        patent = true
                    } else if(id === 22 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'missed_monetization')
                        patent = true
                    } else if(id === 23 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'late_maintainance')
                        patent = true
                    } else if(id === 24 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'incorrect_recording')
                        timeline = true
                    } else if(id === 25 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
                        findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'late_recording')
                        timeline = true
                    } else if(id === 26 /*&& subscription > 2*/  && viewDashboard.kpi === false) {
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
                }
                
                if( findIndex !== -1 ) {
                    dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))   
                    resetAllRowSelect(dispatch, resetItemList.resetAll, profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [1, 9, 10] :  [])
                    resetAllRowSelect(dispatch, resetItemList.clearOtherItems, profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? [14, 15] :  controlList[findIndex].category == 'proliferate_inventors' || controlList[findIndex].category == 'top_lenders' ? [14, 15] : activityIDs.length > 0 ? [13, 14] : [])
                    setTimeout(() => { 
                        dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))                
                        if(id === 0) {
                            dispatch(setSwitchAssetButton(1))
                        } 
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
                        if(activityIDs.length > 0) {
                            dispatch( setAllAssetTypes(false) )
                            dispatch( setAssetTypesSelect(activityIDs) )
                        }
                        dispatch(setDashboardScreen(false))
                        dispatch(setTimelineScreen(timeline))
                        dispatch(setPatentScreen(patent))
                        let location = window.location.pathname
                            location = location.split('/').pop()

                        if(patent === true) {
                            history.push(`${routeList.patent_assets}/${controlList[findIndex].mainHeading.toLowerCase()}${process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? location != '' ? '/'+location : '' : ''}`)  
                        }
                        if(timeline === true) {
                            history.push(`${routeList.assignments}/${controlList[findIndex].mainHeading.toLowerCase()}${process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? location != '' ? '/'+location : '' : ''}`)  
                        }
                        if(maintainence === true) {
                            history.push(`${routeList.pay_maintainence_fee}${process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? location != '' ? '/'+location : '' : ''}`)  
                        }
                        if(props.openCustomerBar === false && timeline === false){
                            props.handleCustomersBarOpen()
                        }

                       
                        /* if(props.openCommentBar === false){
                            props.handleCommentBarOpen()
                        }  */  
                    })
                                            
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
        /* if(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank'){
            if(card.display_type == 'gauge') {
                displayItems['lineGraph'] = false 
            } else if(card.display_type == 'numbers'){
                displayItems['kpiEnable'] = true 
            } else if(card.display_type == 'timeline'){
                displayItems['timeline'] = true 
            }
        } */
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
                /* {...(profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank') ? {...displayItems} : ''} */
            />
        </Grid>
    })

    const showTimelineItems = timelineList.map( (card, index) => {
        return <Grid
            item  {...timelineGrid}
            className={clsx(classes.flexColumn, /* {[classes.flexColumnFullHeight]: profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' ? true : false} , */ `box_item`, {['activeItem']: index === activeId})}
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

    const onExit = () => {
        setEnableStep(false)
    }
    
    const ShowDahboardLayout = (props) => {
        return (
            <span className={classes.breadcrumbHeadingIcon}>
                <i className="fa fa-sm fa-angle-double-right"></i> {props.icon}  <span>{props.layout_name}</span>
            </span> 
        )
    }

    return (
        <Grid
            container
            className={classes.container}
            justifyContent="flex-start"
            alignItems="flex-start"
            ref={ref}
            id="dashboard"
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
                    <span className={clsx('title', {['small']: smallScreen})}><span dangerouslySetInnerHTML={{__html: formattedCompanyname}}/>
                        <span className={clsx(classes.headingName, 'step-1')}>
                            {/* {
                                profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() == 'bank' && selectedAssetCompanies.length == 1 && (
                                    partyName[0].entityName
                                ) 
                            }  */}
                            { 
                                viewDashboard.gauge === true
                                ?
                                    <ShowDahboardLayout 
                                        icon = {<Speed/>}
                                        layout_name = 'Matters Calling for Attention'
                                    />
                                :
                                    viewDashboard.timeline === true
                                    ?
                                        <ShowDahboardLayout 
                                            icon = {<ViewTimeline/>}
                                            layout_name = 'Transactional Activities'
                                        /> 
                                    :
                                        <ShowDahboardLayout 
                                            icon = {<AppsOutage/>}
                                            layout_name = 'Key Perfomance Indicators'
                                        />  
                            }  
                        </span>
                    </span>
                    <div className={classes.toolbar}> 
                        {
                            loading && (
                                <span>Loading...</span>
                            )
                        }
                        <span className={clsx('title', {['small']: smallScreen})}>{ moment(new Date()).format(DATE_FORMAT)}</span>
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
            <Steps 
                enabled={enableStep}
                steps={STEPS}
                initialStep={0}
                onExit={onExit}
            />
        </Grid>
    );
}

export default Reports;