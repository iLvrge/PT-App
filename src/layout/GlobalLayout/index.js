import React, { useEffect, useLayoutEffect, useState, useCallback, createContext  } from "react"

import { ReactReduxContext, useDispatch, useSelector } from 'react-redux'

import { 
    useHistory, useLocation,
  } from 'react-router-dom'  

import { Button, Grid, Typography} from '@mui/material'

import { BrowserView, MobileView, isBrowser, isMobile, isTablet, isIOS, isAndroid } from 'react-device-detect'

import clsx from 'clsx'
import useStyles from './styles'

import NewHeader from '../../components/NewHeader'
import Loader from '../../components/common/Loader'

import MobileScreen from '../../components/MobileScreen'

import NavigationIcon from '../../components/NavigationIcon'
import MobileHeader from '../../components/MobileHeader'
import MobileFooter from '../../components/MobileFooter'

import { getTokenStorage, loginRedirect } from  '../../utils/tokenStorage'
import { editorBar } from  '../../utils/splitpane'

import { 
    setBreadCrumbs,
    setAssetTypesAssignmentsLoading,
    setAssetTypeAssignments,
    setSearchRfIDs,
    setAssetTypeInventor,
    setAssetTypeCompanies,
    setAllAssetTypes,
    setAssetTypesSelect,
    setMainCompaniesSelected,
    getCustomerAssets
} from '../../actions/patentTrackActions2' 

import { 
    getProfile,
    setConnectionBoxView,
    setPDFView,
} from '../../actions/patenTrackActions'

import { toggleUsptoMode, 
    toggleFamilyMode, 
    toggleFamilyItemMode, 
    toggleLifeSpanMode,
    setTimelineScreen,
    setDriveTemplateMode,
    setDashboardScreen, 
    setDashboardPanel,
    setViewDashboardIntial} from '../../actions/uiActions'

import PatenTrackApi from '../../api/patenTrack2' 
import { Box } from "@mui/system"

const GlobalLayout = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const BarContext = createContext()
    const [ openBar, setOpenBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? false : true)
    const [ openTypeBar, setTypeOpenBar ] = useState(false)
    const [ openOtherPartyBar, setOtherPartyOpenBar ] = useState(false)
    const [ openInventorBar, setInventorOpenBar ] = useState(false)
    const [ openAssignmentBar, setAssignmentOpenBar ] = useState(true) 
    const [ openCustomerBar, setCustomerOpenBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? true : false)
    const [ openIllustrationBar, setIllustrationBar ] = useState(true)
    const [ openCommentBar, setCommentBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? true : false/* isMobile ? false : true */)
    const [ openChartBar, setChartBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? true : false)
    const [ openAnalyticsBar, setAnalyticsBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? true : false)
    const [ openVisualizerBar, setVisualizeOpenBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? true : false)

    const [ toggleButtonType, setToggleButtonType ] = useState(true)
    const [ toggleTypeButtonType, setToggleTypeButtonType ] = useState(true)
    const [ toggleOtherPartyButtonType, setToggleOtherPartyButtonType ] = useState(true)
    const [ toggleAssignmentButtonType, setToggleAssignmentButtonType ] = useState(true)
    const [ toggleCustomerButtonType, setToggleCustomerButtonType ] = useState(true)  
    const [ securedTransactionAssets, setSecuredTransactionAssets ] = useState(false)
    const [ showMobileWarning, setShowMobileWarning ] = useState(false)
    const DEFAULT_SCREEN_SIZE = {
        companyBar: 210,
        typeBar: 0,
        otherPartyBar: 0,
        assignmentBar: 0,
        customerBar: 210,
        driveTemplateBar: 200,
        assetFileBar: 0,
        commentBar: '30%',
        illustrationBar: '50%',
        visualizeBar: '0%',
        bar100: '100%',
        bar50: '50%'
    } 
    
    const [ companyBarSize, setCompanyBarSize ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? 0 : 210) 
    const [ typeBarSize, setTypeBarSize ] = useState(0) 
    const [ otherPartyBarSize, setOtherPartyBarSize ] = useState(0)
    const [ partyBarSize, setPartyBarSize ] = useState('50%')
    const [ driveBarSize, setDriveBarSize ] = useState('50%')
    const [ assignmentBarSize, setAssignmentBarSize ] = useState(180)  
    const [ addressBarSize, setAddressBarSize ] = useState(450)
    const [ customerBarSize, setCustomerBarSize ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? 120 : 0)
    const [ commentBarSize , setCommentBarSize ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? '30%' : '0%')
    const [ illustrationBarSize , setIllustrationBarSize ] = useState('50%')
    const [ visualizerBarSize , setVisualizerBarSize ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? '40.1%' : '0%')

    const [ assetTableFocus, setAssetTableFocus ] = useState( false )
    const [ companyButtonVisible, setCompanyButtonVisible ] = useState(false)
    const [ typeButtonVisible, setTypeButtonVisible ] = useState(false)
    const [ otherPartyButtonVisible, setOtherPartyButtonVisible ] = useState(false)
    const [ assignmentButtonVisible, setAssignmentButtonVisible ] = useState(false)
    const [ customerButtonVisible, setCustomerButtonVisible ] = useState(false)

    const [ assetFilesBarSize, setAssetFilesBarSize ] = useState(0)
    const [ assetFilesBar, setAssetFilesBar ] = useState(false)
    const [ openGoogleDriveBar, setGoogleDriveBar] = useState(false)
    const [ toggleAssetFileButtonType, setToggleAssetFileButtonType ] = useState(true)

    const [ driveTemplateBarSize, setDriveTemplateBarSize ] = useState(200)

    const [ isDrag, setIsDrag ] = useState(false)
    const [ request, setRequest ] = useState(false)
    const [ size, setSize] = useState(0)
    const [ illustrationRecord, setIllustrationRecord ] = useState()
    const authenticated = useSelector(store => store.auth.authenticated)
    
    const auth_token = useSelector(state => state.patenTrack2.auth_token)

    const search_string = useSelector(state => state.patenTrack2.search_string)
    const driveTemplateFrameMode = useSelector(state => state.ui.driveTemplateFrameMode)
    const driveTemplateMode = useSelector(state => state.ui.driveTemplateMode)

    const usptoMode = useSelector(state => state.ui.usptoMode)
    const familyMode = useSelector(state => state.ui.familyMode)
    const familyItemMode = useSelector(state => state.ui.familyItemMode)
    const lifeSpanMode = useSelector(state => state.ui.lifeSpanMode)
    const pdfView = useSelector(state => state.patenTrack.pdfView)
    const connectionBoxView = useSelector(state => state.patenTrack.connectionBoxView)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const profile = useSelector(store => (store.patenTrack.profile))
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const companies = useSelector( state => state.patenTrack2.mainCompaniesList )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const assetTypesSelected = useSelector(
        state => state.patenTrack2.assetTypes.selected,
    );
    const selectedAssetCompanies = useSelector(
        state => state.patenTrack2.assetTypeCompanies.selected,
    );
    const selectedAssetCompaniesAll = useSelector(
        state => state.patenTrack2.assetTypeCompanies.selectAll,
    );
    const selectedAssetAssignments = useSelector(
        state => state.patenTrack2.assetTypeAssignments.selected,
    );
    const selectedAssetAssignmentsAll = useSelector(
        state => state.patenTrack2.assetTypeAssignments.selectAll,
    );
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
    const timelineScreen = useSelector(state => state.ui.timelineScreen)
    const patentScreen = useSelector(state => state.ui.patentScreen)

    
    const checkWidthBrowser = () => { 
        if(window.innerWidth < 800) { 
            setShowMobileWarning(true)
        } /* else {
            setShowMobileWarning(false)
        } */
    }

    useEffect(() => {
        checkWidthBrowser()
        window.addEventListener("resize", checkWidthBrowser) // add on resize window 
        return () => window.removeEventListener("resize", checkWidthBrowser)
    }, [])
    /**
   * Get the Loggedin User Profile data
   */

    useEffect(() => {
        if (!profile) {
            let token = process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' ?  getTokenStorage( 'token' ) :  getTokenStorage( 'auth_signature' )
            
            if(token !== '' || token !== null) {
                dispatch(getProfile(true))
            }     
        }
    }, [ dispatch, profile ])

    useEffect(() => {
        if(auth_token != null && typeof profile == 'undefined') {
            dispatch(getProfile(true))
        }
    }, [dispatch, auth_token, profile])
  
    useEffect(() => {
        if(openVisualizerBar === false && visualizerBarSize != '0%') {
            setVisualizerBarSize('0%')
        }
    }, [visualizerBarSize, openVisualizerBar])

    useEffect(() => {
        editorBar() // run to find editor width
        window.addEventListener("resize", editorBar) // add on resize window 
        return () => window.removeEventListener("resize", editorBar)
    }, [])

    useEffect(() => {
        if( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
            dispatch(toggleLifeSpanMode(true))
        }
    }, [])

    
    useEffect(() => {
        /* if(props.type !== 9) {
            window.addEventListener('keydown', handleKeyEvent)
            return () => window.removeEventListener("keydown", handleKeyEvent)
        } */
        window.addEventListener('keydown', handleKeyEvent)
        return () => window.removeEventListener("keydown", handleKeyEvent)
    }, [])

    /**
     * Only for Account Type: bank
     */

    useEffect(() => {
        if(profile?.user && profile.user?.organisation) {
            if(profile.user.organisation.organisation_type == 'Bank' && props.type != 9) {
                dispatch( setAssetTypesSelect([5, 81]) ) // always select by default lending activity
                setOpenBar( false ) //company
                setTypeOpenBar( false ) //activites
                setCustomerOpenBar( false ) //assets
                setCompanyBarSize(0) //company container
                setCustomerBarSize(0) // Assets Container                
                setOtherPartyOpenBar( true ) // parties
                setOtherPartyBarSize(150) // Parties Container
                setPartyBarSize('100%')
                /* dispatch(setTimelineScreen(false)) //Disable Timeline
                dispatch(setDashboardScreen(true)) //Show Dashboard */
                /* handleCommentBarOpen() */ //Close comment
            }
        }
    }, [profile])

    useEffect(() => {
        if(props.type == 9) {
            setDashboardScreen(false)
            setDashboardPanel(false)
        }  
    }, [props.type])

    useEffect(() => {
        if(dashboardScreen === false && patentScreen === true && openCustomerBar === false) {
            handleCustomersBarOpen()
        }
    }, [patentScreen])  

    useEffect(() => {
        if((dashboardScreen === true || location.pathname == '/dashboard' ) && profile?.user && profile.user?.organisation && profile.user.organisation.organisation_type == 'Bank' && props.type != 9 && openOtherPartyBar === false) {
            handleOtherPartyBarOpen()
        }
    }, [dashboardScreen]) 

    useEffect(() => {  
        if( location.pathname.indexOf('/dashboard') !== -1 || location.pathname == '') {   
            handleResetScreen('Dashboard', null)
        }
    }, [location, openCustomerBar])
    

    /**
     * Dashboard screen is true
     * And account type is Bank
     */

    useEffect(() => {
        if(profile?.user && profile.user?.organisation) {
            if(profile.user.organisation.organisation_type == 'Bank' && dashboardScreen === true && props.type != 9) {
                if(selectedCompanies.length === 0 && selectedAssetCompaniesAll === false && companies.list.length > 0 && request === false) {
                    const getSelectedCompanies = async() => {
                        /**
                         * Send Request to server
                         */
                        let activeItems = [], parentChild = []
                        companies.list.map(row => {
                            if(parseInt(row.type) === 1) {
                                const parseChild = JSON.parse(row.child_full_detail), parentChildIDs = JSON.parse(row.child)
                                parentChild.push({parent: parseInt(row.representative_id), child: [...parentChildIDs] })
                                const filters = parseChild.reduce((acc, item) => {
                                    if (!acc) acc = [];  
                                    if(item.status == 1){
                                        acc.push(parseInt(item.representative_id))
                                    }
                                    return acc
                                }, [])
                                if(filters.length > 0) {
                                    activeItems = [...activeItems, ...filters]
                                }
                            } else {
                                if(row.status == 1) {
                                    activeItems.push(parseInt(row.representative_id))
                                }
                            }
                        })
                        
                        const { data } = await PatenTrackApi.getUserCompanySelections();
                        setRequest(true)
                        if(data != null && data.list.length > 0) {
                            let oldItems = [], groups = []
                            if(selectedCategory === 'correct_names') { 
                                dispatch(setMainCompaniesSelected([data.list[0].representative_id], []))
                            } else {
                                const promise =  data.list.map( representative => {
                                    /**
                                     * If selected item is Group then select all the companies under group
                                     */
                                    if(parseInt(representative.type) === 1) {
                                        groups.push(parseInt(representative.representative_id))
                                        const parseChild = JSON.parse(representative.child)
                                        if(parseChild.length > 0) {
                                            const filterItems = parseChild.filter(c => activeItems.includes(parseInt(c.representative_id)) ? parseInt(c.representative_id) : '')

                                            oldItems = filterItems.length > 0 ? [parseInt(filterItems[0])] : []         
                                        }
                                    } else {
                                        if(activeItems.includes(parseInt(representative.representative_id))) {
                                            oldItems = [parseInt(representative.representative_id)]       
                                        }       
                                    }
                                })
                                await Promise.all(promise)
                                dispatch(setMainCompaniesSelected(oldItems, groups))
                            }
                        }       
                    }  
                    getSelectedCompanies()
                }
            }
        }
    }, [dispatch, dashboardScreen, profile, companies])

    

    /**
     * Dashboard screen is true
     * Get list of assets
     */

    /* useEffect(() => {
        if(dashboardScreen === true) {
            if(selectedCompanies.length > 0 && openCustomerBar === false) {
                const customers = selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies;
                const assignments = selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;    
                dispatch(getCustomerAssets(
                    selectedCategory == '' ? '' : selectedCategory,
                    selectedCompanies,
                    assetTypesSelected,
                    customers,
                    assignments,
                    false,
                    0,
                    1000,
                    `asset`,
                    `DESC`
                ))                    
            }
        }  
    }, [dispatch, dashboardScreen, selectedCompanies]) */

    /*
    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    */
   /* useEffect(() => {
        window.addEventListener('scroll', scrollInitial)
        return () => window.removeEventListener("load", scrollInitial)
    }, [])
    useEffect(() => {
        window.addEventListener('load', scrollInitial)
        return () => window.removeEventListener("load", scrollInitial)
    }, []) */

    useEffect(() => {
        if( openIllustrationBar === false && openCommentBar === false && openChartBar === false && openAnalyticsBar === false ) {  
            if( openGoogleDriveBar === true || assetFilesBar === true ) {
                setAssetFilesBarSize('100%')
                if(openCustomerBar === true && customerBarSize === '100%') {
                    setCustomerBarSize(180)
                }
                if(openAssignmentBar === true && assignmentBarSize === '100%') {
                    setAssignmentBarSize(120)
                }
                if ((openOtherPartyBar === true || openInventorBar === true) && otherPartyBarSize === '100%') {
                    setOtherPartyBarSize(120)
                }
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openCustomerBar === true) {
                setCustomerBarSize('100%')
                if(openAssignmentBar === true && assignmentBarSize === '100%') {
                    setAssignmentBarSize(120)
                }
                if ((openOtherPartyBar === true || openInventorBar === true) && otherPartyBarSize === '100%') {
                    setOtherPartyBarSize(120)
                }
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openAssignmentBar === true) {
                setAssignmentBarSize('100%')
                if ((openOtherPartyBar === true || openInventorBar === true) && otherPartyBarSize === '100%') {
                    setOtherPartyBarSize(120)
                }
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openOtherPartyBar === true || openInventorBar === true) {
                setOtherPartyBarSize('100%')
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openTypeBar === true ) {
                setTypeBarSize('100%')
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if(selectedCategory == 'correct_names' || selectedCategory == 'correct_address') {
                setAddressBarSize('100%')
            } else if (openBar === true ) {
                setCompanyBarSize('100%')                
            }
        }  else {      
            if(assetFilesBarSize === '100%' && (openGoogleDriveBar === true || assetFilesBar === true)){
                setAssetFilesBarSize(200)
            } else if(customerBarSize === '100%') {
                setCustomerBarSize(180)
            } else if(assignmentBarSize === '100%') {
                setAssignmentBarSize(120)
            } else if(otherPartyBarSize === '100%') {
                setOtherPartyBarSize(120)
            } else if(typeBarSize === '100%') {
                setTypeBarSize(120)
            } else if(addressBarSize === '100%' && (selectedCategory == 'correct_names' || selectedCategory == 'correct_address')) {
                setAddressBarSize(450)
            } else if(companyBarSize === '100%') {
                setCompanyBarSize(210)
            }
        }
    }, [ openIllustrationBar, openCommentBar, openChartBar, openAnalyticsBar, openGoogleDriveBar, assetFilesBar, openCustomerBar, openAssignmentBar, openOtherPartyBar, openInventorBar, openTypeBar, openBar  ])
    
    // When we are in search route disable company, activites, parties icons

    useEffect(() => {
        /* dispatch(setBreadCrumbs( props.type == 0 ? 'Maintenance > Pay Maintenance Fee' : props.type == 2 ? 'Search' : 'Due Dilligence > Review')) */
        if( props.type === 2 ) { 
            setOpenBar( false ) //company
            setTypeOpenBar( false ) //activites
            setOtherPartyOpenBar( false ) // parties
            setCustomerOpenBar( true ) //assets
            setAssignmentOpenBar( true ) //transactions
            setVisualizerBarSize('40.1%')
            setChartBar(true)
            setAnalyticsBar(true)
            setCompanyBarSize(0) // company bar size
            setCustomerBarSize(180)
            setAssignmentBarSize(120)


            dispatch(setConnectionBoxView( false ))
            dispatch(setPDFView( false ))
            dispatch(toggleUsptoMode( false ))
            dispatch(toggleFamilyMode( true ))
            dispatch(toggleFamilyItemMode( true ))
            dispatch(setBreadCrumbs( 'Search' ))
        }
    }, [ dispatch, props.type ])

    

// get search data from server
    useEffect(() => {
        const searchData = async () => {            
            if( search_string && search_string != '' ) {
                dispatch( setAssetTypesAssignmentsLoading( true ) )
                const { data } = await PatenTrackApi.getSearch(search_string)
                dispatch( setAssetTypesAssignmentsLoading( false ) )
                if( data && data != null ) {
                    dispatch(setAssetTypeAssignments( data, true ))      
                    dispatch(setSearchRfIDs( data.txn_ids ))  
                }
            }
        }        
        searchData()
    }, [ search_string ])

    /* useEffect(() => {
        console.log("USE EFFECT", openChartBar, openAnalyticsBar)
    }, [openChartBar, openAnalyticsBar]) */

    /* useEffect(() => {
        let barSize = '50%';
        if((openIllustrationBar === true || openCommentBar === true) && (openChartBar === false && openAnalyticsBar === false)) {
            barSize = 0
        } else if((openIllustrationBar === false && openCommentBar === false) || ( openChartBar === true || openAnalyticsBar === true )) {
            barSize = 0         
        }
        console.log('setIllustrationBarSize', openChartBar, openAnalyticsBar, openIllustrationBar, openCommentBar, barSize)
        setIllustrationBarSize(barSize) 
    }, [ openChartBar, openAnalyticsBar, openIllustrationBar, openCommentBar ]) */

    useEffect(() => {
        setDriveTemplateBarSize( driveTemplateMode === true ? 200 : 0)
        editorBar()
    }, [ driveTemplateMode ])





    useEffect(()=>{
        if(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO') {
            loginRedirect(authenticated)
        }        
        // Fetch data for logged in user using token
    },[authenticated]);

    /* const scrollInitial = () => {  
        if(isMobile) {
            alert(window.innerHeight)
        }
    } */

    /* const handleResize = () => {
        if(isMobile) {
            
            let vh = window.innerHeight * 0.01;
            console.log('Resize', vh)
            document.getElementById('mainContainer').style.setProperty('--vh', `${vh}px`);
        }        
    } */

    const getWindowDimensions = useCallback(() => { 
        const hasWindow = typeof window !== 'undefined';
        let percentage = '40%'
        if( location.pathname == '/patent_assets') { 
            percentage = '40%'
        } else { 
            const informationContainer = document.getElementById('information_container')
            const dashboardContainer = document.getElementById('dashboard')
            if(informationContainer != null && dashboardContainer !== null) {
                const parentContainer = informationContainer.parentNode.parentNode
                const parentWidth = parentContainer.clientWidth
                percentage = `${((parentWidth - 250) / parentWidth) * 100}%`
            } else {
                /* const width = hasWindow ? window.innerWidth : null;
                if(width > 1400) {
                    percentage = '76%'
                } else if(width < 1400 && width > 1279) {
                    percentage = '69%'
                } else if(width < 1280 && width > 1151) {
                    percentage = '67%'
                } else {
                    percentage = '64%'
                }   */
            }
        }
        return percentage      
    }, [dashboardScreen])

    const handleKeyEvent = (event) => {  
        //event.preventDefault()
        if(event.key === 'ArrowDown' || event.key === 'ArrowUp' ) {
            let tableContainer = document.getElementById('assets_type_assignment_all_assets'), findActiveRow = null
            if(tableContainer !== null) { 
                /* findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.highlightWithCol.Mui-selected') */
                findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.highlightRow.Mui-selected')
                if(findActiveRow === null) {
                    if(tableContainer.getAttribute('data_option') !== null && tableContainer.getAttribute('data_option') == 'single') {
                        findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.highlightRow.Mui-selected')
                    } else {
                        tableContainer = document.getElementById('assets_assignments')
                        if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                            findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                        } else {
                            tableContainer = document.getElementById('assets_type_companies')
                            if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                                findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                            } else {
                                tableContainer = document.getElementById('lawfirms_container')
                                if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                                    findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                                } else {
                                    tableContainer = document.getElementById('layout_templates')
                                    if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                                        findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                                    } else {
                                        tableContainer = document.getElementById('main_companies')
                                        if(tableContainer !== null) {
                                            findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                                        }
                                    }
                                }
                            }
                        } 
                    }                                      
                }
            } else {
                tableContainer = document.getElementById('assets_assignments')
                if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                    findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                } else {
                    tableContainer = document.getElementById('assets_type_companies')
                    if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                        findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                    } else {
                        tableContainer = document.getElementById('lawfirms_container')
                        if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                            findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                        } else {
                            tableContainer = document.getElementById('layout_templates')
                            if(tableContainer !== null && tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected') !== null) {
                                findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                            } else {
                                tableContainer = document.getElementById('main_companies')
                                if(tableContainer !== null) {
                                    findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')                            
                                }
                            }
                        }
                    }
                }
            }


            if(findActiveRow !== null) {
                const classList = findActiveRow.className.split(/\s+/);
                const findClass = classList.filter( c => c.indexOf('rowIndex_') !== -1 ? c : '')
                if(findClass.length > 0) {
                    let index = findClass[0].toString().replace('rowIndex_', '')
                    if(index !== '' && !isNaN(index)){
                        index = Number(index) 
                        if (event.key === 'ArrowUp' ) {
                            index = index - 1 
                        } else if(event.key === 'ArrowDown') {
                            index = index + 1 
                        }
                    }  
                    if(index >= 0) {
                        const findNextRow =  tableContainer.querySelector(`.rowIndex_${index}`)
                        if(findNextRow !== null) {
                            findNextRow.focus()
                            findNextRow.click()  
                        }
                    }
                }
            }
        }
    }

    /* useEffect(() => {
        console.log('Layout openChartBar BAR CHANGES', openChartBar, openAnalyticsBar)
    }, [ openChartBar])
    useEffect(() => {
        console.log('Layout openAnalyticsBar BAR CHANGES',  openChartBar, openAnalyticsBar)
    }, [ openAnalyticsBar]) */   

    const handleCompanyBarOpen = (event) => {
        if(props.type === 9) {
            history.push('/')
        }
        setToggleButtonType( !toggleButtonType )
        setOpenBar( !openBar )
        if(!openBar === false) {
            setCompanyBarSize(0)  
        } else {
            setCompanyBarSize(210)
            if(isMobile){ 
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )

            }
        }
        editorBar()
    }

    const handleTypeBarOpen = (event) => { 
        setToggleTypeButtonType( !toggleTypeButtonType )
        setTypeOpenBar( !openTypeBar )
        if(!openTypeBar === false) {
            setTypeBarSize(0)
        } else {
            setTypeBarSize(120)
            if(isMobile){
                setOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const handleOtherPartyBarOpen = (event) => {
        setToggleOtherPartyButtonType( !toggleOtherPartyButtonType )
        setOtherPartyOpenBar( !openOtherPartyBar )
        if(!openOtherPartyBar === false && openInventorBar === false) {
            setOtherPartyBarSize(0)
        } else {
            setOtherPartyBarSize(120)
            if(openInventorBar === false) {
                setPartyBarSize('100%')
            } else if(!openOtherPartyBar === false){
                setPartyBarSize('0%')
            } else {
                setPartyBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const updateAssetTypeSelected = async(activityID) => {
        const form = new FormData();
        form.append('activity_id', activityID)

        const { status } = await PatenTrackApi.updateAssetTypeSelected(form)
    }

    const handleInventorBarOpen = (event) => {
        setToggleOtherPartyButtonType( !toggleOtherPartyButtonType )
        setInventorOpenBar( !openInventorBar )
        if(!openInventorBar === false && openOtherPartyBar === false) {
            setOtherPartyBarSize(0)
            dispatch( setAssetTypeInventor({list: [], total_records: 0}))
        } else {
            setOtherPartyBarSize(120)
            if(openOtherPartyBar === false) {
                setPartyBarSize('0%')
            } else if(!openInventorBar === false){
                setPartyBarSize('100%')
            } else {
                setPartyBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
            /*dispatch( setAssetTypeInventor({list: [], total_records: 0}))
            dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
            dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
            dispatch( setAllAssetTypes( false ) )
            dispatch( setAssetTypesSelect([10]) )  
            updateAssetTypeSelected( 10 )  */
        }
        editorBar()
    }

    const handleAssignmentBarOpen = (event) => {
        setToggleAssignmentButtonType( !toggleAssignmentButtonType )
        setAssignmentOpenBar( !openAssignmentBar )
        if(!openAssignmentBar === false) {
            setAssignmentBarSize(0)
        } else {
            setAssignmentBarSize(180) 
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const handleCustomersBarOpen = (event) => {
        setToggleCustomerButtonType( !toggleCustomerButtonType )
        setCustomerOpenBar( !openCustomerBar )
        if(!openCustomerBar === false) {
            setCustomerBarSize(0)
            /* dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))
            dispatch(setMaintainenceAssetsList({list: [], total_records: 0}, false)) */
        } else {
            setCustomerBarSize(180)
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const handleAssetFileBarOpen = (event) => {
        setToggleAssetFileButtonType( !toggleAssetFileButtonType )
        setAssetFilesBar( !assetFilesBar )
        if(!assetFilesBar === false && openGoogleDriveBar === false) {
            setAssetFilesBarSize(0)
        } else {
            setAssetFilesBarSize(200)
            if(openGoogleDriveBar === false) {
                setDriveBarSize('100%')
            } else if(!assetFilesBar === false){
                setDriveBarSize('0%')
            } else {
                setDriveBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                //setCustomerOpenBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }   
 
    const handleGoogleDriveBarOpen = (event) => {
        setToggleAssetFileButtonType( !toggleAssetFileButtonType )
        setGoogleDriveBar( !openGoogleDriveBar )
        if(!openGoogleDriveBar === false && assetFilesBar === false) {
            setAssetFilesBarSize(0)
        } else {
            setAssetFilesBarSize(200)
            if(assetFilesBar === false) {
                setDriveBarSize('0%')
            } else if(!openGoogleDriveBar === false){
                setDriveBarSize('100%')
            } else {
                setDriveBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                //setCustomerOpenBar( false )
                setAssetFilesBar( false )                
            }
        }
        editorBar()
    }

    const changeVisualBar = (chart, analytics, comment, illustration) => {
        /* console.log("changeVisualBar", dashboardScreen, chart, analytics, comment, illustration) */
        let barOpen = true, barSize = '40.1%'    
        
        if(chart === false && analytics === false && (comment === true || illustration === true) && usptoMode === false && connectionBoxView === false){
            barSize = '0%'
            barOpen = false
        } else if (comment === false && illustration === false && ( chart === true ||  analytics === true )) {
            barSize = '100%'
        }
        if(barSize === '40.1%' && ((comment === true || illustration === true) || (chart === true || analytics === true)) ){
            if( visualizerBarSize !== '0%' &&  visualizerBarSize !== '40.1%' &&  visualizerBarSize !== '100%' ) {
                barSize = visualizerBarSize
            }
        }
        
        if(chart === true && barOpen === true && barSize == '40.1%') {
            checkPDFHeight()
        }     
        editorBar()
        setVisualizeOpenBar(barOpen)  
        setVisualizerBarSize(barSize)
    } 

    const handleIllustrationBarOpen = () => {
        let bar = openIllustrationBar, barSize = '30%'
        setIllustrationBar( !bar )
        if(!bar === false && openCommentBar === true) {
            barSize = '100%'

        } else if((!bar === false && openCommentBar === false) || (!bar === true && openCommentBar === false)) {
            barSize = '0%'  
            
        }
        if(!bar === true) {
            if(isMobile) {
                setCommentBar(false)
                setChartBar(false)
                setAnalyticsBar(false)
            }            
        }
        setCommentBarSize(barSize) 
        changeVisualBar(openChartBar, openAnalyticsBar, openCommentBar, !bar)
    }

    const handleCommentBarOpen = () => {
        /* console.log('handleCommentBarOpen 884') */
        let bar = openCommentBar, barSize = '30%'
        setCommentBar( !bar )
        if((!bar === false && openIllustrationBar === false) || (!bar === false && openIllustrationBar === true)) {
            barSize = '0%'    

        } else if(!bar === true && openIllustrationBar === false) {
            barSize = '100%'
        }
        
        if(!bar === true) {
            if(isMobile) {
                setIllustrationBar(false)
                setChartBar(false)
                setAnalyticsBar(false)
            }            
        } 
        setCommentBarSize(barSize) 
        changeVisualBar(openChartBar, openAnalyticsBar, !bar, openIllustrationBar)
    }  

    const handleChartBarOpen = () => {  
        let bar = openChartBar, barSize = '40.1%'
        setChartBar( !bar )
        if(!bar === false && openAnalyticsBar === true) {
            barSize = '100%'
        } else if((!bar === true && openAnalyticsBar === false) || ( !bar === false && openAnalyticsBar === false )) {
            if(usptoMode === false) {
                barSize = 0     
            }             
        }
        if(!bar === true) {
            if(isMobile) {
                setIllustrationBar(false)
                setCommentBar(false)
                setAnalyticsBar(false)
            }            
        }
        setIllustrationBarSize(barSize)  
        if(usptoMode === false && lifeSpanMode === false && familyItemMode === false && pdfView === false && !bar === true) {
            dispatch( toggleLifeSpanMode( true ) )
        } 
        changeHeight('analyticsBar', barSize == 0 ? '0px': barSize)
        changeVisualBar(!bar, openAnalyticsBar, openCommentBar, openIllustrationBar)
    }

    const handleAnalyticsBarOpen = () => {  
        /* console.log('handleAnalyticsBarOpen entered')   */
        let bar = openAnalyticsBar, barSize = '50%'
        setAnalyticsBar( !bar )
        if((!bar === false && openChartBar === false) || (openChartBar === true && !bar === false)) {
            if(usptoMode === false) {
                barSize = 0     
            } 
        } else if((!bar === false && openChartBar === true) || (!bar === true && openChartBar === false ) ) {
            barSize = '100%'
        }   
        if(!bar === true) {
            if(isMobile) {
                setIllustrationBar(false)
                setCommentBar(false)
                setChartBar(false)
            }            
        }
        if(usptoMode === false && lifeSpanMode === false && familyMode === false && pdfView === false && !bar === true) {
            dispatch( toggleLifeSpanMode( true ) )
        }    
        setIllustrationBarSize(barSize)
        changeHeight('analyticsBar', barSize == 0 ? '0px': barSize) 
        changeVisualBar(openChartBar, !bar, openCommentBar, openIllustrationBar)
    }

    const changeHeight = (container, height) => {
        const element = document.getElementById(container)
        if(element !== null) {
            element.parentElement.style.height = height
        }
    }

    const checkPDFHeight = () => {
        /* setTimeout(() => {
            const parentElement = document.getElementById('pdfViewer')
            if(parentElement != null) {
                const iframeElement = parentElement.querySelector(`iframe`)
                if(iframeElement != null) {
                    const height = parentElement.parentNode.clientHeight
                    iframeElement.style.height = height - 43 + 'px'
                    parentElement.style.height = '100%'
                }
            }
        }, 1000)  */        
    } 

    const openAnalyticsAndCharBar = () => { 
        setChartBar( true )
        setAnalyticsBar( true )
        setIllustrationBarSize( '50%' )
        changeVisualBar(true, true, openCommentBar, openIllustrationBar)
    }

    const closeAnalyticsAndCharBar = () => {   
        setChartBar( false )
        setAnalyticsBar( false )
        setIllustrationBarSize( '50%' )
        changeVisualBar(false, false, openCommentBar, openIllustrationBar)
    }

    const handleCompanyButton = (event, flag) => {
        event.preventDefault()
        setCompanyButtonVisible( flag )
    }

    const handleTypeButton = (event, flag) => {
        event.preventDefault()
        setTypeButtonVisible( flag )
    }

    const handleOtherPartyButton = (event, flag) => {
        event.preventDefault()
        setOtherPartyButtonVisible( flag )
    }

    const handleAssignmentButton = (event, flag) => {
        event.preventDefault()
        setAssignmentButtonVisible( flag )
    }

    const handleCustomerButton = (event, flag) => {
        event.preventDefault()
        setCustomerButtonVisible( flag )
    }

    const checkChartAnalytics = useCallback(async (pdfFile, connectionBoxData, usptoMode) => { 
        if( pdfFile != null && Object.keys(pdfFile).length > 0 ) {
            setChartBar( true )
            setVisualizeOpenBar( true )
            setVisualizerBarSize(prevItem =>{
                if(prevItem == '0%') {
                    return  '40.1%'
                } else {
                    return prevItem
                }
            })
        }

        if( connectionBoxData != null && Object.keys(connectionBoxData).length > 0 ) {
            setVisualizeOpenBar( true )
            setVisualizerBarSize(prevItem =>{
                if(prevItem == '0%') {
                    return  '40.1%'
                } else {
                    return prevItem
                }
            })

            setAnalyticsBar( true )
            setChartBar( true ) 
            setIllustrationBarSize('50%')

        }

        if( typeof usptoMode !== 'undefined' && usptoMode === true ) {
            setVisualizeOpenBar( true ) 
            setVisualizerBarSize(prevItem =>{
                if(prevItem == '0%') {
                    return  dashboardScreen === true ? getWindowDimensions() :'40.1%'
                } else {
                    return prevItem
                }
            })
            //setAnalyticsBar( true ) 
            if(openChartBar === false) {
                setIllustrationBarSize('100%')
            } else {
                setIllustrationBarSize('50%')
            }
        } else if( typeof usptoMode !== 'undefined' && usptoMode === false ) {
            /* console.log('usptoMode', usptoMode, openChartBar, openAnalyticsBar, openCommentBar, openIllustrationBar, illustrationBarSize) */
            let barSize = '0%', chartPrevItem = false, analyticsPrevItem = false, illustrationPrevItem = false, commentPrevItem = false
            await setChartBar(prevItem => {
                chartPrevItem = prevItem
                return prevItem
            })
            await setAnalyticsBar(prevItem => {
                analyticsPrevItem = prevItem
                return prevItem
            })
            await setIllustrationBar(prevItem => {
                illustrationPrevItem = prevItem
                return prevItem
            })
            await setCommentBar(prevItem => {
                commentPrevItem = prevItem
                return prevItem
            })
            if((chartPrevItem === true || analyticsPrevItem === true) && (commentPrevItem === true || illustrationPrevItem === true)){
                barSize = dashboardScreen === true ? getWindowDimensions() : visualizerBarSize !== '0%' ?  visualizerBarSize :  '40.1%'
            } else if (commentPrevItem === false && illustrationPrevItem === false && ( chartPrevItem === true ||  analyticsPrevItem === true )) {
                barSize = '100%'  
            } 
            if(barSize === '0%') {
                setVisualizeOpenBar( false )
            }
            setVisualizerBarSize(barSize)   
            
            /* if(chartPrevItem !== openChartBar ) {
                console.log("Tap")
                setChartBar(chartPrevItem)
            }
            if(analyticsPrevItem !== openAnalyticsBar ) {
                console.log("Tap")
                setAnalyticsBar(analyticsPrevItem)  
            }  */
            /* console.log("barSize", barSize, chartPrevItem, analyticsPrevItem)     */        
        } 
    }, [openChartBar, openAnalyticsBar, openCommentBar, openIllustrationBar, dashboardScreen])


    const handleOpenSettings = useCallback((event) => { 
        if(profile?.user && profile.user?.role && profile.user.role.name == 'Admin') {
            dispatch(setDashboardScreen(false)) 
            dispatch(setViewDashboardIntial(false)) 
            checkChartAnalytics(null, null, false)
            let codeShare = ''
            if(process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') {
                const locationShare = window.location.pathname
                codeShare = '/' + locationShare.split('/').pop()
            }  
            history.push(`/settings/companies/names${codeShare}`)
        } else {
            alert('Available for admin only'); 
        }
    }, [ history, profile ])

    const handleAlertPop = () => {
        alert('This is a shared view, the function you selected works in the main product.')
    }    

    const handleResetScreen = (type, event) => {
        if(type == 'Dashboard') { 
            /* console.log('RESET1108') */
            if(openCustomerBar === true){
                handleCustomersBarOpen(event)
            }  
            if(openTypeBar === true){
                handleTypeBarOpen(event)
            }
            if(openAssignmentBar === true){
                handleAssignmentBarOpen(event)
            }
            if(openOtherPartyBar === true && openInventorBar === true){
                setOtherPartyBarSize(0)
                setPartyBarSize('50%')
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false ) 
                editorBar()               
            } else {
                if(openOtherPartyBar === true){
                    handleOtherPartyBarOpen(event)
                }
                if(openInventorBar === true){
                    handleInventorBarOpen(event)
                }
            }
            if(assetFilesBar === true && openGoogleDriveBar === true){
                setGoogleDriveBar(false)
                setAssetFilesBar(false)
                setDriveBarSize('50%')
                setAssetFilesBarSize('0')
                editorBar()             
            } else {
                if(assetFilesBar === true){
                    handleAssetFileBarOpen(event)
                }
                if(openGoogleDriveBar === true){
                    handleGoogleDriveBarOpen(event)
                }
            }
            setCommentBarSize('0%')
            if(driveTemplateMode === true){
                dispatch(setDriveTemplateMode(false))
                setDriveTemplateBarSize(0)
            }
            if(openCommentBar === true){
                handleCommentBarOpen(event)
            }
            if(openChartBar === true){
                handleChartBarOpen(event)
            }
            if(openAnalyticsBar === true){
                handleAnalyticsBarOpen(event)
            }
        } else {
            if(openCustomerBar === false && timelineScreen === false && type !== 'Timeline'){ 
                handleCustomersBarOpen(event)
            }
            if(selectedCategory != 'top_law_firms' && selectedCategory != 'top_lenders' && openAssignmentBar === false && timelineScreen === false && type == 'Timeline'){
                handleAssignmentBarOpen(event)
            } 
            if((selectedCategory == 'top_law_firms' || selectedCategory == 'top_lenders') && openOtherPartyBar === false && timelineScreen === false && type == 'Timeline'){
                handleOtherPartyBarOpen(event)
                if(openAssignmentBar === true) {
                    handleAssignmentBarOpen(event)
                }
            }
            if(selectedCategory == 'proliferate_inventors' && openInventorBar === false && timelineScreen === false && type == 'Timeline'){
                handleInventorBarOpen(event) 
                if(openOtherPartyBar === true) {
                    handleOtherPartyBarOpen(event)
                }
            }
            /* if(openCommentBar === false){
                handleCommentBarOpen(event)
            } */
            if(openChartBar === true || openAnalyticsBar === true) {
                /* setVisualizeOpenBar(false)  
                setVisualizerBarSize('0%') */
                /* if(openChartBar === true){
                    handleChartBarOpen(event)
                }
                if(openAnalyticsBar === true){
                    handleAnalyticsBarOpen(event)
                }

                if(openChartBar === true && openAnalyticsBar === true){
                    changeVisualBar(false, false, true, true)
                } */
            }
        }
    }

    const handleSecuredTransactionAssets = () => {
        if(!securedTransactionAssets === false){
            setPartyBarSize('100%')
        } else {
            setPartyBarSize('50%')
        }
        setSecuredTransactionAssets(!securedTransactionAssets)
    }

    const topToolBar = [
        /* {
            tooltip: 'Settings',
            bar: false,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD'  ? handleAlertPop : handleOpenSettings,
            t: 0,
            label: 'Settings',
            margin: true,
        }, */
        {
            tooltip: 'Filter by Companies',
            bar: props.type === 9 ? false : openBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'  ? handleAlertPop : handleCompanyBarOpen,
            t: 1,
            label: 'Companies',
            ...(props.type === 9 && {highlight: false})
        },
        {
            tooltip: 'Filter by Activities',
            bar: openTypeBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleTypeBarOpen,
            t: 2,
            label: 'Filter by Activities',
            ...((props.type === 9 || dashboardScreen === true) && {disabled: true})
        },
        {
            tooltip: selectedCategory === 'top_law_firms' ? 'Filter by Law Firms' : selectedCategory == 'top_lenders' ? 'Filter by Lenders' : 'Filter by Parties',
            bar: openOtherPartyBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleOtherPartyBarOpen,
            t: 3,
            label: selectedCategory === 'top_law_firms' ? 'Filter by Law Firms' : selectedCategory == 'top_lenders' ? 'Filter by Lenders'  : 'Filter by Parties',
            ...((props.type === 9 || (dashboardScreen === true && profile?.user?.organisation?.organisation_type !== 'Bank')) && {disabled: true})
        },
        {
            tooltip:  selectedCategory === 'proliferate_inventors' ? 'Filter by Inventors' : 'Filter by Employees', 
            bar: openInventorBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD'  ? handleAlertPop : handleInventorBarOpen,
            t: 11,
            margin: true,
            label: selectedCategory === 'proliferate_inventors' ? 'Filter by Inventors' : 'Filter by Employees', 
            ...((props.type === 9 || (dashboardScreen === true && profile?.user?.organisation?.organisation_type !== 'Bank')) && {disabled: true})
        },
        {
            tooltip: 'Filter by Transactions',
            bar: openAssignmentBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' ? handleAlertPop : handleAssignmentBarOpen,
            t: 4,
            label: 'Transactions',
            ...((props.type === 9 || dashboardScreen === true) && {disabled: true})
        },
        {
            tooltip: 'Assets',
            bar: openCustomerBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' ? handleAlertPop : handleCustomersBarOpen,
            t: 5,
            margin: true,
            label: 'Assets' ,
            ...((props.type === 9 || dashboardScreen === true) && {disabled: true})
        },
        {
            tooltip: 'Recorded Documents',
            bar: assetFilesBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD'  ? handleAlertPop : handleAssetFileBarOpen,
            t: 10,
            label: 'Recorded Documents',
            ...((props.type === 9 || dashboardScreen === true) && {disabled: true})
        },
        /* {
            tooltip: 'Initiated Documents',
            bar: openGoogleDriveBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' ? handleAlertPop : handleGoogleDriveBarOpen,
            t: 12,
            label: 'Initiated Documents',
            ...((props.type === 9 || dashboardScreen === true) && {disabled: true})
        }, */
    ]

    const bottomToolBar = [
        {
            tooltip: 'Illustration',
            bar: openIllustrationBar,
            click: handleIllustrationBarOpen,
            t: 6,
            label: 'Illustration'
        },
        {
            tooltip: 'Team Discussion',
            bar: openCommentBar,
            click: handleCommentBarOpen,
            t: 7,
            label: 'Team Discussion'
        },
        {
            tooltip: 'Charts',
            bar: openChartBar,
            click: handleChartBarOpen,
            t: 8,
            label: 'Charts',
            ...(dashboardScreen === true && {disabled: true})
        },
        {
            tooltip: 'Analytics',
            bar: openAnalyticsBar,
            click: handleAnalyticsBarOpen,
            t: 9,
            label: 'Analytics',
            ...(dashboardScreen === true && {disabled: true})
        }
    ]

    const externalToolBar = [
        {
            tooltip: 'Create a New Secured Transaction',
            bar: false,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD'  ? handleAlertPop : handleSecuredTransactionAssets,
            t: 45,
            label: 'Create a New Secured Transaction',
            margin: true,
        },
    ]

    const mobileWrapper = [{
        component: MobileScreen,
        type: props.type,
        isMobile: isMobile,
        companyBarSize,
        setCompanyBarSize,
        handleCompanyButton,
        handleCompanyBarOpen,
        toggleButtonType,
        companyButtonVisible,
        visualizerBarSize,
        setVisualizerBarSize,
        setVisualizeOpenBar,
        openBar,
        openTypeBar,
        typeBarSize,
        setTypeBarSize,
        handleTypeButton,
        handleTypeBarOpen,
        toggleTypeButtonType,
        typeButtonVisible,
        openOtherPartyBar,
        openInventorBar,
        openGoogleDriveBar,
        otherPartyBarSize,
        setOtherPartyBarSize,
        handleOtherPartyButton,
        handleOtherPartyBarOpen,
        partyBarSize,
        driveBarSize,
        toggleOtherPartyButtonType,
        otherPartyButtonVisible,
        assignmentBarSize,
        setAssignmentBarSize,
        addressBarSize,
        setAddressBarSize,
        handleAssignmentButton,
        openAssignmentBar,
        handleAssignmentBarOpen,
        toggleAssignmentButtonType,
        assignmentButtonVisible,
        customerBarSize,
        setCustomerBarSize,
        handleCustomerButton,
        openCustomerBar,
        handleCustomersBarOpen,
        handleCommentBarOpen,
        toggleCustomerButtonType,
        customerButtonVisible,
        commentBarSize,
        setCommentBarSize,
        openCommentBar,
        openIllustrationBar,
        handleIllustrationBarOpen,
        handleChartBarOpen,
        handleAnalyticsBarOpen,
        openInventorBar,
        handleInventorBarOpen,
        setIsDrag,
        isDrag,
        setSize, 
        size,
        illustrationRecord,
        setIllustrationRecord,
        illustrationBarSize,
        setIllustrationBarSize,
        openChartBar,
        openAnalyticsBar,
        openVisualizerBar,
        setAnalyticsBar,
        setChartBar,
        openAnalyticsAndCharBar,
        closeAnalyticsAndCharBar,
        checkChartAnalytics,
        setAssetFilesBarSize,
        changeVisualBar,
        assetFilesBarSize,
        assetFilesBar,
        driveTemplateBarSize,
        driveTemplateFrameMode,
        driveTemplateMode,
        securedTransactionAssets
    }]
 
    
    const childrenWithProps = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
                type: props.type,
                companyBarSize,
                setCompanyBarSize,
                handleCompanyButton,
                handleCompanyBarOpen,
                toggleButtonType,
                companyButtonVisible,
                visualizerBarSize,
                setVisualizerBarSize,
                setVisualizeOpenBar,
                openBar,
                openTypeBar,
                typeBarSize,
                setTypeBarSize,
                handleTypeButton,
                handleTypeBarOpen,
                toggleTypeButtonType,
                typeButtonVisible,
                openOtherPartyBar,
                openInventorBar,
                openGoogleDriveBar,
                otherPartyBarSize,
                setOtherPartyBarSize,
                handleOtherPartyButton,
                handleOtherPartyBarOpen,
                handleInventorBarOpen,
                partyBarSize,
                driveBarSize,
                toggleOtherPartyButtonType,
                otherPartyButtonVisible,
                assignmentBarSize,
                setAssignmentBarSize,
                addressBarSize,
                setAddressBarSize,
                handleAssignmentButton,
                openAssignmentBar,
                handleAssignmentBarOpen,
                toggleAssignmentButtonType,
                assignmentButtonVisible,
                customerBarSize,
                setCustomerBarSize,
                handleCustomerButton,
                openCustomerBar,
                handleCustomersBarOpen,
                handleCommentBarOpen,
                toggleCustomerButtonType,
                customerButtonVisible,
                commentBarSize,
                setCommentBarSize,
                openCommentBar,
                openIllustrationBar,
                handleIllustrationBarOpen,
                handleChartBarOpen,
                handleAnalyticsBarOpen,
                setIsDrag,
                isDrag,
                setSize,
                size,
                illustrationRecord,
                setIllustrationRecord,
                illustrationBarSize,
                setIllustrationBarSize,
                openChartBar,
                openAnalyticsBar,
                openVisualizerBar,
                setAnalyticsBar,
                setChartBar,
                changeVisualBar,
                openAnalyticsAndCharBar,
                closeAnalyticsAndCharBar,
                checkChartAnalytics,
                setAssetFilesBarSize,
                assetFilesBarSize,
                assetFilesBar,
                driveTemplateBarSize,
                driveTemplateFrameMode,
                driveTemplateMode,
                securedTransactionAssets
            }) 
        }
        return child
    })

    const originalWarn = console.warn;

    console.warn = function (...args) {
        const arg = args && args[0] 
        const messageQuill = 'quill:toolbar', messageGoogleChart = 'Attempting to load version \'51\' of Google Charts', messageCellPosition = 'Rendered cell should include style property for positioning.'
        if (arg && (arg.includes(messageQuill) || arg.includes(messageGoogleChart) || arg.includes(messageCellPosition))) return;
        originalWarn(...args);
    };

    const closeWindow = (event) => {
        history.goBack()
    }


    if(profile == undefined) return null  
    return ( 
            <div className={classes.root} id='main'>
    
            {
                isMobile || isTablet || showMobileWarning
                ?
                    <MobileHeader/>
                :
                    <NewHeader 
                        openIllustrationBar={openIllustrationBar}
                        openCommentBar={openCommentBar}
                        openCustomerBar={openCustomerBar}
                        openChartBar={openChartBar}
                        openAnalyticsBar={openAnalyticsBar}
                        handleIllustrationBarOpen={handleIllustrationBarOpen}
                        handleCommentBarOpen={handleCommentBarOpen}
                        handleCustomersBarOpen={handleCustomersBarOpen}
                        checkChartAnalytics={checkChartAnalytics}
                        handleAnalyticsBarOpen={handleAnalyticsBarOpen}
                        handleChartBarOpen={handleChartBarOpen}
                        resetScreen={handleResetScreen}
                    />
            }
            <Grid container className={clsx(classes.dashboardWarapper, {[classes.mobileDashboardWrapper]: isMobile})} id="mainContainer">
                <Grid container className={clsx(classes.dashboard)}>       
                    {
                        isMobile || isTablet || showMobileWarning || isAndroid || isIOS
                        ?
                            <Box className={classes.infoMessage}>
                                <Typography
                                    variant="h4" 
                                    align="center" 
                                >
                                    This content is currently not supported on mobile
                                </Typography>
                                <Typography 
                                    mt={1}
                                    variant="h5"  
                                    align="center"  
                                >
                                    In the meanwhile, you can access it on your desktop
                                </Typography> 
                            </Box>
                        :
                            <React.Fragment>
                                <div className={clsx(classes.filterToolbar)}> 
                                    <div className={clsx(classes.flex)}>                            
                                        {
                                            topToolBar.map( (item, index) => (
                                                <NavigationIcon key={index} {...item} />
                                            ))
                                        }

                                        {
                                            profile?.user && profile.user?.organisation && profile.user.organisation.organisation_type == 'Bank' && props.type != 9
                                            ?
                                                externalToolBar.map( (item, index) => (
                                                    <NavigationIcon key={index} {...item} />
                                                ))
                                            :
                                                ''
                                        }
                                    </div>
                                    <div className={clsx(classes.flex, classes.bottom)}>
                                        {
                                            bottomToolBar.map( (item, index) => (
                                                <NavigationIcon key={index} {...item}/>
                                            ))
                                        }
                                    </div>
                                </div>
                                {
                                    childrenWithProps
                                }
                            </React.Fragment>
                    } 
                </Grid>
            </Grid>
            {/* {
                isMobile && (
                    <MobileFooter
                        bottomToolBar={bottomToolBar}
                        topToolBar={topToolBar}   
                    />
                )
            } */}
        </div> 
       
    )
}
export default GlobalLayout;