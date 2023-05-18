import React, 
        { useCallback, 
          useEffect, 
          useState,
        } from 'react'
import { useDispatch, 
          useSelector 
        } from 'react-redux'
import {  
          useHistory,
          useLocation
        } from 'react-router-dom'
import { 
        AppBar, 
        Toolbar, 
        IconButton,  
        Avatar, 
        Drawer,
        List,
        ListItem,
        ListItemIcon,
        ListItemText,
        Divider, 
        Typography,
        Tooltip,
        Zoom,
        Badge,
        Box, 
      } from '@mui/material'

import { Menu as MenuIcon,  
        Business as BusinessIcon,  
        LockOpen as LockOpenIcon,  
        LightModeOutlined as LightModeOutlinedIcon,
        DarkModeOutlined as DarkModeOutlinedIcon,
        Settings as SettingsIcon,
        PendingActionsOutlined,
        ManageSearch, 
        DescriptionOutlined as DescriptionOutlinedIcon,
        HandshakeOutlined as HandshakeOutlinedIcon,
        ShareOutlined as ShareOutlinedIcon
      } from '@mui/icons-material'

import routeList from '../../routeList'

import { controlList } from '../../utils/controlList'
import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar' 
import useStyles from './styles'
 
import CompanySummary from '../common/CompanySummary'
import ActionMenu from './ActionMenu'
/* import ClipboardAssets from './ClipboardAssets' */
import FullScreen from '../common/FullScreen'
import AddToolTip from '../Reports/AddToolTip'
import { signOut, deleteCookie } from '../../actions/authActions'
import { getTokenStorage, removeTokenStorage } from '../../utils/tokenStorage'
 

import { setAssetTypeAssignments, 
  setSelectedAssetsTransactions, 
  setSelectedAssetsPatents, 
  setAssetsIllustration, 
  setBreadCrumbsAndCategory, 
  setBreadCrumbs, 
  setSearchString, 
  setResetAll,
  getSlackProfile,
  setGoogleProfile,
  setClipboardAssetsDisplay,  
  setIsSalesAssetsDisplay,
  setChannelID,
  setAssetTypeAssignmentAllAssets,
  setSwitchAssetButton,
  setAssetTypes,
  setAssetTypeInventor,
  setAssetTypeCompanies,
  setAssetsIllustrationData,
  setAllAssetTypes,
  setAssetTypesSelect,
  setAllAssignmentCustomers,
  setSelectAssignmentCustomers,
  setAssetTypesPatentsSelected,
  setAssetTypesPatentsSelectAll,
  setAllAssignments, 
  setSelectAssignments,
  setSlackMessages,  
  setSlackAuthToken,
  setChannelLoading,
  setChannelsList,
  setSlackProfileData,
  setSlackUsers,
  setSocialMediaConnectPopup,
  setSelectedMaintainenceAssetsList,
  setCPCRequest, 
  setJurisdictionRequest, 
  setTimelineData, 
  setTimelineRequest
 } from '../../actions/patentTrackActions2'

 import {  
  setAssetFamily,
  setConnectionBoxView,
  setPDFView,
  setFamilyItemDisplay,
  setPDFFile
 } from '../../actions/patenTrackActions'

import { 
  setControlModal, 
  setTimelineSelectedItem, 
  setTimelineSelectedAsset, 
  setDriveTemplateFrameMode,
  toggleFamilyMode,
  toggleFamilyItemMode,
  toggleUsptoMode,
  toggleLifeSpanMode,
  toggleThemeMode,
  setTimelineScreen,
  setDashboardScreen,
  setPatentScreen,
  setAssetButton, 
  setTransactionButton,
  setMaintainenceFeeFrameMode,
  setViewDashboardIntial
} from '../../actions/uiActions'
import Scheduling from './Scheduling'
import ViewIcons from './ViewIcons'
import SocialMediaConnect from '../common/SocialMediaConnect'
import { stubTrue } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { copyToClipboard } from '../../utils/html_encode_decode'
 
import PatenTrackApi from '../../api/patenTrack2' 
import { ASSET } from '../../utils/icons'
import clsx from 'clsx'

const NewHeader = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation();
  const isDarkTheme = useSelector( state => state.ui.isDarkTheme )
  const viewDashboard = useSelector(state => state.ui.viewDashboard) 
  const slack_profile_data = useSelector( state => state.patenTrack2.slack_profile_data )
  const google_profile = useSelector( state => state.patenTrack2.google_profile )
  const slack_auth_token = useSelector(state => state.patenTrack2.slack_auth_token)
  const auth_token = useSelector(state => state.patenTrack2.auth_token)
  const profile = useSelector(store => (store.patenTrack.profile))
  const user = useSelector(store => (store.patenTrack.profile ? store.patenTrack.profile.user : {}))
  const siteLogo = useSelector(state => (state.patenTrack.siteLogo.site_logo ? state.patenTrack.siteLogo.site_logo.logo_big : 'https://s3.us-west-1.amazonaws.com/static.patentrack.com/logo/PatenTrack.png'))
  const siteLogoLightMode = 'https://s3.us-west-1.amazonaws.com/static.patentrack.com/logo/PatenTrack_Light.png'
  const controlModal = useSelector(state => state.ui.controlModal)
  const breadcrumbs = useSelector(state =>  state.patenTrack2.breadcrumbs )
  const selectedCategory = useSelector(state =>  state.patenTrack2.selectedCategory )
  const search_string = useSelector(state => state.patenTrack2.search_string)
  const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
  const timelineScreen = useSelector(state => state.ui.timelineScreen)
  const patentScreen = useSelector(state => state.ui.patentScreen)
  const [timelineView, setTimelineView] = useState(false)
  const [patentView, setPatentView] = useState(false)

  const socialMediaConnectPopup = useSelector(state => state.patenTrack2.socialMediaConnectPopup)

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

  
  const [layoutName, setLayoutName] = useState(null)
  const [ isClipboardActive, setIsClipboardActive ] = useState(false)
  const [ isCompanyMenuOpen, setCompanyMenuOpen ] = useState(false)
  const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
  const [ slackAuthLogin, setSlackAuthLogin ] = useState( true )
  const [ scheduling, setScheduling ] = useState( false )

  const connectMenuItems = [
    {
      id: 2,
      label: 'Connect',
      component: SocialMediaConnect,
      standalone: true,
    }
  ]
  
  const schedulingMenuItems = [
    {
      id: 2,
      label: 'Scheduling',
      component: Scheduling,
      standalone: true,
    }
  ]
  const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)
  const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
  const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)
  const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)

  const [ openDrawer, setDrawerState] = useState({
      top: false,
      left: false, 
      bottom: false,
      right: false,
  })

  /**
   * This function is deprecated now
   * @param {data, link} param0 
   */

  
  const ShowLink = ({data, link}) =>{
    return (
        <>
            {
                data.split('\n').map((text, index) => (
                    <span key={index}>
                      {text}
                    </span> 
                ))
            }
        </>
    ) 
  }  


  /**
   * After user loggedin with Slack then enable slack logout button
   */
  useEffect(() => {
    if(slack_profile_data == null) {
      const slackToken = getTokenStorage( 'slack_auth_token_info' )
      if(slackToken && slackToken != null && slackToken!= '') {
        const { access_token, id} = slackToken
        if( access_token != null && id != null ) {
          dispatch(getSlackProfile(access_token, id))
        }
      }
    } else {
      checkButtons() 
    }
  }, [dispatch, slack_profile_data])

  useEffect(() => {
    if(google_profile == null) {
      const getGoogleProfile = getTokenStorage('google_profile_info')
      if( getGoogleProfile != '' && getGoogleProfile != null ) {
        const profileInfo = JSON.parse(getGoogleProfile)
        dispatch(setGoogleProfile(profileInfo))
      }
    } else {
      checkButtons() 
    }
  }, [dispatch, google_profile])

  

  /**
   * If use refresh screen then check Google and Slack buttons
   */

  useEffect(() => {
    checkButtons()
  }, [])

   /**
   * After user loggedin with Google then enable google logout button
   * After user loggedin with Slack then enable slack logout button
   */

  useEffect(() => {
    checkButtons() 
  }, [ google_auth_token, slack_auth_token ])

 
  /**
   * Set Layout with breadcrumbs
   */

  useEffect(() => {
    setLayoutName(breadcrumbs)
  }, [ breadcrumbs ])


  useEffect(() => {
    const findIndex =  controlList.findIndex( item => item.type == 'menu' && item.category == selectedCategory)
    setLayoutName(dashboardScreen === true ? 'Dashboard' : patentScreen === true  || (timelineScreen === true && ['acquisition_transactions', 'divestitures_transactions', 'licensing_transactions', 'collateralization_transactions', 'inventing_transactions', 'litigation_transactions'].includes(selectedCategory) ) ? breadcrumbs !== '' ? breadcrumbs : 'Patent Assets' : selectedCategory != 'due_dilligence' ? findIndex !== -1 ? controlList[findIndex].mainHeading : '' : '')
  }, [ dashboardScreen, patentScreen,  selectedCategory ])    

  

  /**
   * To check buttons for the Google and Slack
   */

  const checkButtons = () => {
    try {      
      const  googleToken = getTokenStorage( 'google_auth_token_info' ), slackToken = getTokenStorage( 'slack_auth_token_info' )
      let googleLoginButton = true, slackLoginButton = true
      
      if(googleToken && googleToken != '' && googleToken != null) {
        const tokenParse = JSON.parse( googleToken )
        const { access_token } = tokenParse
        if( access_token ) {
          googleLoginButton =  false 
        } 
      }
      setGoogleAuthLogin(googleLoginButton)
      
      if(slackToken && slackToken != null && slackToken!= 'null' && slackToken != '') {
        const token = JSON.parse(slackToken) 
        if( token.access_token != null && token.id != null ) {
          slackLoginButton = false
        }
      }
      setSlackAuthLogin(slackLoginButton)
    } catch ( err ) {
      console.error( err )
    }
  }

  /**
   * Calling this function to hide the Hexagon Menu
   * and Set the Breacrumbs bases on selected layout
   */

  const hideMenu = useCallback((e, item) => {
    if( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
      alert('Message.....')
    } else {
      dispatch(setResetAll(1, item))    
      handleControlModal(e, false)
      setTimeout(()=>{
        dispatch(setBreadCrumbsAndCategory(item))
      }, 500)
    }
    
  }, [ dispatch ])

  /***
   * Deprecated
   */

  const handleCompanyMenuOpen = (event) => {
    setCompanyMenuOpen(!isCompanyMenuOpen)
    if(!isCompanyMenuOpen === true) toggleDrawer( event, true )
  }

  /**
   * This is to set the flag for the menu to show or disable
   */

  const handleControlModal = useCallback((e, flag) => { 
    e.stopPropagation()
    if (flag !== 'backdropClick') {
      dispatch(setControlModal( flag )) 
    }
  }, [ dispatch ]) 


  /**
   * When the setting menu is open then disable the list of keyboard events
   * @param {} event 
   * @param {*} open 
   */

  
  const toggleDrawer = (event, open) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift') || event.target.classList.contains('children')  || event.target.parentNode.classList.contains('children') || event.target.parentNode.parentNode.classList.contains('children')) {
      return;
    }

    setDrawerState({ ...openDrawer, right: open });
  };

  /**
   * Deprecated
   */

  const onRedirect =  useCallback((e, path) => {
    dispatch(setTimelineSelectedAsset(null))
    dispatch(setTimelineSelectedItem(null))
    dispatch(setAssetsIllustration(null))
    dispatch(setAssetTypeAssignments({list:[], total_records: 0}, false))
    dispatch(setSelectedAssetsPatents([]))
    dispatch(setSelectedAssetsTransactions([]))
    handleControlModal(e, false)
    history.push(path)
  }, [ dispatch, history ])

  /**
   * Call the function for search by pressing enter key
   */
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      dispatch(setResetAll())
      dispatch(setAssetsIllustration(null))
      dispatch(setSelectedAssetsTransactions([]))
      dispatch(setSelectedAssetsPatents([]))      
      dispatch(setSearchString(event.target.value))
      history.push("/search")
    }
  }, [ dispatch, history ])

  const onHandleGoogleSignout = () => {
    if(window.confirm('Log Out?')){
      removeTokenStorage('google_auth_token_info')
      setGoogleAuthLogin(true)
    }
  }

  const onHandleSlackSignout = () => {
    if(window.confirm('Log Out?')){
      removeTokenStorage('slack_auth_token_info')
      removeTokenStorage('slack_profile_data')
      deleteCookie('slack_auth_token_info')
      setSlackAuthLogin(true)
      dispatch(setSlackMessages({messages: [], users: []}))
      dispatch(setChannelID(null))
      dispatch(setSlackAuthToken(null))
      dispatch(setChannelLoading(false))
      dispatch(setChannelsList([]))
      dispatch(setSlackProfileData(null))
      dispatch(setSlackUsers([]))
    }
  }

  const onHandleSaleAssets = useCallback((type) => {
    if(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO') {
      /* dispatch(setBreadCrumbs(!display_sales_assets === true ? type == 1 ? 'Our Assets for Sale' : 'Patent Marketplace' : ''))
      dispatch(setIsSalesAssetsDisplay(!display_sales_assets)) */
      /* dispatch(setSalesAssetsType(type)) */      

      dispatch(setBreadCrumbs(type == 1 ? 'Our Assets for Sale' : 'Patent Marketplace'))
      dispatch(setIsSalesAssetsDisplay(1))
      dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
      dispatch(setSelectedAssetsPatents([]))
      dispatch(setAssetFamily([]))
      dispatch(setFamilyItemDisplay({}))
      dispatch(setChannelID(null))
      dispatch(setConnectionBoxView(false))
      dispatch(setPDFView(false))
      dispatch(toggleUsptoMode(false))
      dispatch(toggleLifeSpanMode(false))
      dispatch(toggleFamilyMode(false))
      dispatch(toggleFamilyItemMode(false))
      dispatch(setDriveTemplateFrameMode(false))
    }
  }, [dispatch, display_sales_assets])

  const handleClipboard = useCallback(() => {
    if( clipboard_assets.length > 0 ) {
      setIsClipboardActive(true)
      dispatch(setClipboardAssetsDisplay( !display_clipboard ))

      if( !display_clipboard === false ) {
        dispatch(setAssetsIllustration(null))
        dispatch(setSelectedAssetsPatents([]))
        if(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO') {
          dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
        }
        dispatch(setAssetFamily([]))
        dispatch(setFamilyItemDisplay({}))
        dispatch(setChannelID(null))
        dispatch(setConnectionBoxView(false))
        dispatch(setPDFView(false))
        dispatch(toggleUsptoMode(false))
        dispatch(toggleLifeSpanMode(false))
        dispatch(toggleFamilyMode(false))
        dispatch(toggleFamilyItemMode(false))
        dispatch(setDriveTemplateFrameMode(false))
      }
    }
  }, [ dispatch, clipboard_assets, display_clipboard ])

  const handleChangeLayout = (event) => {
    let findIndex = -1
    if(selectedCategory == 'due_dilligence') {
      findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
    } else {
      findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'due_dilligence')
    }
    if( findIndex !== -1 ) {
      resetAllRowSelect(dispatch, resetItemList.resetAll)
      resetAllRowSelect(dispatch, resetItemList.clearOtherItems)
      setTimeout(() => { 
        dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))      
        dispatch(setSwitchAssetButton(controlList[findIndex].category == 'due_dilligence' ? 0 : 1)) 
      })
    }
  }

  const resetAll = () => {
  dispatch(setAssetTypes([]))
  dispatch(setAssetTypeCompanies({ list: [], total_records: 0 }))
  dispatch(setAssetTypeInventor({ list: [], total_records: 0 }))
  dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }))
  dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
  dispatch(setAssetTypesPatentsSelected([]))
  dispatch(setAssetTypesPatentsSelectAll(false))
  dispatch(setAllAssignments(false))
  dispatch(setSelectAssignments([]))	
  dispatch(setSelectAssignmentCustomers([]))
  dispatch(setAllAssignmentCustomers(false))
  dispatch(setIsSalesAssetsDisplay(0))
  dispatch(setSelectedMaintainenceAssetsList([]))
}

const clearOtherItems = () => {
  dispatch(setAssetsIllustration(null))
  dispatch(setAssetsIllustrationData(null))
  dispatch(setChannelID(null))
  dispatch(setSelectedAssetsTransactions([]))
  dispatch(setSelectedAssetsPatents([]))
  dispatch(setSlackMessages({messages: [], users: [] }))
  dispatch(
      setPDFFile(
      { 
          document: '',  
          form: '', 
          agreement: '' 
      }
      )
  )
  dispatch(
      setPDFView(false)
  )
  dispatch(setAssetsIllustration(null)) 
  dispatch(toggleLifeSpanMode(true))
  dispatch(toggleFamilyMode(false))
  dispatch(toggleUsptoMode(false))
  dispatch(toggleFamilyItemMode(false))	
  dispatch( setAllAssetTypes( false ) )
  dispatch( setAssetTypesSelect([]))	
  dispatch( setAllAssignmentCustomers( false ))
  dispatch( setSelectAssignmentCustomers([]))														
}

const onHandleForeignAssets = useCallback((event) => {
  if(process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ) {
    alert('Message')
  } else {
    const path = location.pathname
    toggleDrawer(event, false)
    resetAllRowSelect(dispatch, resetItemList.resetAll)
    resetAllRowSelect(dispatch, resetItemList.clearOtherItems)
    
    if(path.indexOf('/review_external_assets') !== -1) {
      history.push('/') 
    } else {
      history.push('/review_external_assets') 
    }
  }  
}, [dispatch])

const handleThemeMode = useCallback(event => {
  dispatch(toggleThemeMode(!isDarkTheme))
},[dispatch, isDarkTheme])


const onHandleDashboardScreen = /* useCallback( */(event) => {
  dispatch(setTimelineScreen(false))
  dispatch(setPatentScreen(false))
  dispatch(setDashboardScreen(true))
  
  dispatch(setAssetsIllustration(null))
  dispatch(setAssetsIllustrationData(null))
  /* resetAllRowSelect(dispatch, resetItemList.resetAll)
  resetAllRowSelect(dispatch, resetItemList.clearOtherItems) */
  if(typeof props.checkChartAnalytics == 'function' && typeof props.resetScreen == 'function') { 
    props.checkChartAnalytics(null, null, false)
    props.resetScreen('Dashboard', event)
  }
  //history.push("/")
}/* , [dispatch]) */

const onHandleTimelineScreen = /* useCallback( */(event) => {  
  dispatch(setPatentScreen(false))
  dispatch(setDashboardScreen(false))
  dispatch(setTimelineScreen(true))
  dispatch(setAssetsIllustration(null))
  dispatch(setAssetsIllustrationData(null))
  /* resetAllRowSelect(dispatch, resetItemList.resetAll)
  resetAllRowSelect(dispatch, resetItemList.clearOtherItems) */
  props.checkChartAnalytics(null, null, false)
  props.resetScreen('Timeline', event)
  history.push(routeList.assignments)
  
}/* , [dispatch]) */

const onHandlePatentAssetsScreen = (breadcrumb) => {    
  dispatch(setPatentScreen(true))
  dispatch(setTimelineScreen(false))
  dispatch(setDashboardScreen(false))
  dispatch(setAssetsIllustration(null))
  dispatch(setAssetsIllustrationData(null))
  dispatch(setBreadCrumbs(typeof breadcrumb !== 'undefined' ? breadcrumb : 'Assets')) 
  history.push(routeList.patent_assets)  
}

const onHanldeMaintainencePatentAssetScreen = () => {
  dispatch(setPatentScreen(true))
  dispatch(setTimelineScreen(false))
  dispatch(setDashboardScreen(false))
  dispatch(setAssetsIllustration(null))
  dispatch(setAssetsIllustrationData(null))
  /* dispatch(setMaintainenceFeeFrameMode(true)) */
  //dispatch(setBreadCrumbs(typeof breadcrumb !== 'undefined' ? breadcrumb : 'Assets')) 
  history.push(routeList.pay_maintainence_fee)  
}

const resetAllActivity = (category) => {
  /* let findIndex = -1 */
  /* if(category == 'due_dilligence') {
      findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
  } else if(category != '' && category != 'restore_ownership') {
      
  } else {
      findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'due_dilligence')
  } */
  const findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == category)
  if( findIndex !== -1 ) {
    //hideMenu(event, controlList[findIndex])
    resetAll()
    clearOtherItems()
    dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))  
    if(category == 'due_dilligence' || category == 'restore_ownership') {
      dispatch(setSwitchAssetButton(controlList[findIndex].category == 'due_dilligence' ? 0 : 1))
    }
  }
}

const onHandlleSetSocialMediaPopup = (flag) => {
  dispatch(setSocialMediaConnectPopup(flag))
}

const onHandleAlert = () => {
  alert('Please activate your account.')
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
    if(dashboardScreen === true) { 
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
}, [ dispatch, dashboardScreen, category, mainCompaniesSelected, selectedMaintainencePatents, assetTypeAssignmentAssetsSelected, selectedAssetsTransactions ])

const onHandleTransactions = () => {
  dispatch(setAssetButton(false))
  dispatch(setTransactionButton(true))
  setPatentView(false)
  setTimelineView(true)
  resetAllActivity('due_dilligence')
  onHandleTimelineScreen()
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
  resetAllActivity('due_dilligence')
  onHandlePatentAssetsScreen()
}

const handleOpenSettings = useCallback((event) => { 
  if(profile?.user && profile.user?.role && profile.user.role.name == 'Admin') {
      dispatch(setDashboardScreen(false)) 
      dispatch(setViewDashboardIntial(false)) 
      props.checkChartAnalytics(null, null, false)
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

  return (
    <AppBar className={classes.root} color='transparent' position='relative'>
      <Toolbar className={classes.toolbar}>
        <span className={classes.logoContainer}>
          <img src={isDarkTheme ? siteLogo : siteLogoLightMode} className={isDarkTheme ? classes.siteLogo: classes.siteLogoLight} alt={''} />          
        </span>
        <span onClick={(e) => handleControlModal( e, !controlModal )} className={classes.companyLogoCon}>
          {
            user.organisation 
            ?
              user.organisation.logo != ''
                ?
                  <img src={user.organisation.logo} className={classes.userLogoOfficial} alt={''} />
                :
                  <span className={classes.organizationName}>{user.organisation.name}</span>
            :
            ''
          } 
        </span>

        <ActionMenu 
          t={0}  
          onClickSale={onHandleSaleAssets}  
          patentScreen={patentScreen}
          dashboardScreen={dashboardScreen}
          setDashboardScreen={onHandleDashboardScreen}
          setActivityTimeline={onHandleTimelineScreen}
          setPatentAssets={onHandlePatentAssetsScreen}
          setMaintaincePatentAssets={onHanldeMaintainencePatentAssetScreen}
          timelineScreen={timelineScreen} 
          resetAll={resetAll}
          clearOtherItems={clearOtherItems}
          layoutName={layoutName}
          breadcrumbs={breadcrumbs}
          selectedCategory={selectedCategory}
          display_sales_assets={display_sales_assets}
          resetAllActivity={resetAllActivity}
        />
         
        <div className={classes.rightPanel}>  
            {/* <Switch  
              color="secondary" 
              {...( isDarkTheme == 'dark' ? {checked: true} : {})} 
              onChange={handleThemeMode}
            /> */}
             
            
            <ViewIcons
              resetAllActivity={resetAllActivity}
              setDashboardScreen={onHandleDashboardScreen}
              setActivityTimeline={onHandleTimelineScreen}
              setPatentAssets={onHandlePatentAssetsScreen}
              patentScreen={patentScreen}
              dashboardScreen={dashboardScreen}
              timelineScreen={timelineScreen} 
              display_sales_assets={display_sales_assets}
              setScheduling={setScheduling}
              scheduling={scheduling}
              handleClipboard={handleClipboard}
              clipboard_assets={clipboard_assets}
              display_clipboard={display_clipboard}
              handleKeyDown={handleKeyDown}
              search_string={search_string}
              openIllustrationBar={props.openIllustrationBar}
              handleIllustrationBarOpen={props.handleIllustrationBarOpen}
            />

            

            {
              !googleAuthLogin
              ?
                <IconButton
                  className={`${classes.buttonIcon} ${classes.padding0} ${classes.slackIcon}`}
                  aria-label="Google Logout"
                  component="span"
                  onClick={onHandleGoogleSignout}
                  size="small">
                  <Tooltip 
                    title={
                      <Typography color="inherit" variant='body2'>
                      {
                        google_profile != null && Object.keys(google_profile).length > 0
                        ?
                          <span className={classes.googleTooltip}>
                            <span>{google_profile.name}</span>
                            <span>{google_profile.email}</span>
                          </span>
                        :
                        '' 
                      }
                      </Typography>
                    } 
                    className={classes.tooltip}  
                    placement='bottom'
                    enterDelay={0}
                    TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{width: '100%', height: '100%', transform: 'translate(25%, 22%)'}}><g fill="#000" fillRule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg>
                  </Tooltip>
                  
                </IconButton>
              :
              ''
            } 
            {
              !slackAuthLogin
              ?
              <div className={classes.slackContainer}>
                <IconButton
                  className={`${classes.buttonIcon} ${classes.padding0} ${classes.slackIcon}`}
                  aria-label="Slack Logout"
                  component="span"
                  onClick={onHandleSlackSignout}
                  style={{marginRight: 6}}
                  size="small">
                  <Tooltip 
                    title={
                      <Typography color="inherit" variant='body2'>
                      {
                        slack_profile_data != null && Object.keys(slack_profile_data).length > 0
                        ?
                          slack_profile_data.real_name  != '' ? slack_profile_data.real_name : slack_profile_data.name
                        :
                        '' 
                      }
                      </Typography>
                    } 
                    className={classes.tooltip}  
                    placement='bottom'
                    enterDelay={0}
                    TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                  >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270">
                      <g>	                    
                        <g>		
                          <path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"/>		
                          <path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"/>	
                        </g>	
                        <g>		
                          <path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"/>		
                          <path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"/>	
                        </g>	
                        <g>	
                          <path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"/>		
                          <path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"/>	
                        </g>
                        <g>	
                          <path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"/>		
                          <path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"/>
                        </g>
                      </g>
                    </svg>
                  </Tooltip>
                </IconButton>
              </div>
              :
              ''
            }
            {
              slack_profile_data != null && Object.keys(slack_profile_data).length > 0
              ?
                <Avatar className={clsx(classes.actionIcon)} alt={`${slack_profile_data.real_name != '' ? slack_profile_data.real_name : slack_profile_data.profile.real_name != '' ? slack_profile_data.profile.real_name : slack_profile_data.profile.display_name}`} src={slack_profile_data.profile != null && slack_profile_data.profile.hasOwnProperty('image_24') && slack_profile_data.profile.image_24 != '' ? slack_profile_data.profile.image_24 : user && user.logo != '' ? user.logo : slack_profile_data.real_name.toString().substring(0,1).toLocaleUpperCase() } />
              :
                user && user.logo != ''
                ?
                <Avatar className={clsx(classes.actionIcon)} alt={`${user ? user.first_name + ' ' + user.last_name : ''}`} src={user.logo} />
                : 
                <Avatar className={clsx(classes.actionIcon)}>
                  {user.first_name.toString().substring(0,1).toLocaleUpperCase()}
                </Avatar>
            }
            <IconButton
              className= {clsx(classes.actionIcon)}
              color='inherit'
              aria-label='open drawer'
              onClick={(event) => {
                return ['PRO', 'KPI'].includes(process.env.REACT_APP_ENVIROMENT_MODE) ? toggleDrawer(event, !openDrawer.right) :  null
              }}
              size="small">
              <MenuIcon  className={'menuButton'}/>
            </IconButton>
            <Drawer anchor={'right'} open={openDrawer['right']} onClose={(event) => {toggleDrawer(event, false)}} className={classes.drawer}>
              <div
                onClick={(event) => { toggleDrawer(event, false)}}
                onKeyDown={(event) => { toggleDrawer(event, false)}} 
                className={classes.rightMenu}
              >
                
                <List component='nav'>
                  {
                    process.env.REACT_APP_ENVIROMENT_MODE == 'PRO' && ( 
                    <ListItem onClick={() => {
                          dispatch(signOut())
                      }} button>
                      <ListItemIcon  color='inherit' >
                          <LockOpenIcon /> 
                      </ListItemIcon>
                      <ListItemText primary={`Sign Out`} />
                    </ListItem>)
                  }
                  
                  
                  {
                profile?.user?.organisation?.organisation_type && profile.user.organisation.organisation_type.toString().toLowerCase() != 'bank' &&  process.env.REACT_APP_ENVIROMENT_MODE !== 'KPI'
                && (
                    <React.Fragment>
                      <AddToolTip
                        tooltip={'Share Dashboard/Transactions/Assets'}
                        placement='bottom'
                      >
                        <ListItem 
                          onClick={ ['STANDARD', 'SAMPLE', 'DASHBOARD'].includes(process.env.REACT_APP_ENVIROMENT_MODE) ? onHandleAlert : onShare}
                          button>
                          <ListItemIcon  color='inherit' >
                            <ShareOutlinedIcon/>
                          </ListItemIcon>
                          <ListItemText primary={`Share Dashboard/Transactions/Assets`} />
                        </ListItem>   
                      </AddToolTip> 
                      <ListItem 
                        className={`${clipboard_assets.length > 0 ? classes.clipIconActive : ''} ${ props.display_clipboard === true ? classes.clipIconIsActive : ''}`}
                        onClick={ ['STANDARD', 'SAMPLE', 'DASHBOARD'].includes(process.env.REACT_APP_ENVIROMENT_MODE) ? onHandleAlert : handleClipboard}
                        button>
                          <ListItemIcon  color='inherit' >
                            <Badge badgeContent={clipboard_assets.length} color="secondary">    
                              <PendingActionsOutlined/>
                            </Badge>
                          </ListItemIcon>
                          <ListItemText primary={`Clipboard`} />
                      </ListItem> 
                      <AddToolTip
                          tooltip={'All Assets (Since 1999)'}
                          placement='bottom'
                      >
                        <ListItem 
                            className={classes.borderItem}
                            onClick={ ['STANDARD', 'SAMPLE', 'DASHBOARD'].includes(process.env.REACT_APP_ENVIROMENT_MODE) ? onHandleAlert : onHandlePatentAssets} 
                            button>
                          <ListItemIcon  color='inherit' >
                            <ASSET />
                          </ListItemIcon>
                          <ListItemText primary={`All Assets (Since 1999)`} />
                        </ListItem> 
                      </AddToolTip> 
                      <AddToolTip
                          tooltip={'All Transactions (Since 1998)'}
                          placement='bottom'
                      >
                        <ListItem 
                          onClick={ ['STANDARD', 'SAMPLE', 'DASHBOARD'].includes(process.env.REACT_APP_ENVIROMENT_MODE) ? onHandleAlert : onHandleTransactions}
                          button>
                          <ListItemIcon  color='inherit' >
                            <HandshakeOutlinedIcon />
                          </ListItemIcon>
                          <ListItemText primary={`All Transactions (Since 1998)`} />
                        </ListItem>  
                      </AddToolTip> 
                      <ListItem  
                        className={classes.borderItem}
                        onClick={handleOpenSettings}
                        button>
                        <ListItemIcon  color='inherit' >
                          <SettingsIcon className={`noStroke`}/>
                        </ListItemIcon>
                        <ListItemText primary={`Settings`} />
                      </ListItem>  
                      <ListItem   
                        onClick={() => window.open('https://ppubs.uspto.gov/pubwebapp/')}
                        button>
                        <ListItemIcon  color='inherit' >
                          <ManageSearch/>
                        </ListItemIcon>
                        <ListItemText primary={`Search at USPTO`} />
                      </ListItem>    
                    </React.Fragment>
                )
            } 
                  {/* <ListItem onClick={handleThemeMode} button disabled>
                    <ListItemIcon  color='inherit' >
                        {
                          isDarkTheme ?
                            <LightModeOutlinedIcon/>  
                          :
                          <DarkModeOutlinedIcon/>
                        }
                    </ListItemIcon>
                    <ListItemText primary={isDarkTheme ? `Light Mode` : `Dark Mode` } />
                  </ListItem> */}
                  
                  {
                    !googleAuthLogin
                    ?
                    <ListItem button onClick={onHandleGoogleSignout}>
                      <ListItemIcon  color='inherit' >
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fillRule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg>
                      </ListItemIcon>
                      <ListItemText primary={`Sign Out`} />
                    </ListItem>
                    :
                    ''
                  }
                  {/* <ListItem button onClick={onHandleForeignAssets}>
                    <ListItemIcon  color='inherit' >
                      <svg width="18" height="18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M16 288c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h112v-64zm489-183L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H152c-13.3 0-24 10.7-24 24v264h128v-65.2c0-14.3 17.3-21.4 27.4-11.3L379 308c6.6 6.7 6.6 17.4 0 24l-95.7 96.4c-10.1 10.1-27.4 3-27.4-11.3V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24z" class=""></path></svg>
                    </ListItemIcon>
                    <ListItemText primary={`Review External Assets`} />
                  </ListItem>   */}
                  {
                    process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' 
                    ?
                      <Box className={classes.settingsContainer}>
                        <Box style={{position: 'absolute', bottom: 0}}>
                          <ListItem className={`children`} button style={{marginTop: 50}}>
                            <ListItemIcon aria-label='Account Scope' color='inherit' className={`children`}>
                                <BusinessIcon className={`children`}/>
                            </ListItemIcon>
                            <ListItemText primary={`Account Scope`} className={`children`}/>                                            
                          </ListItem>   
                          <Divider />   
                          <CompanySummary />
                        </Box>
                      </Box>
                    :
                    ''
                  }
                </List>    
              </div>
            </Drawer>
        </div>
      </Toolbar>
      {  
        scheduling === true && (
          <FullScreen 
            componentItems={schedulingMenuItems} 
            showScreen={scheduling}  
            setScreen={setScheduling}
            paper={false} 
            full={false}   
          />
        )
      }
      {
        socialMediaConnectPopup === true && process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && (
          <FullScreen 
            componentItems={connectMenuItems} 
            showScreen={socialMediaConnectPopup}  
            setScreen={onHandlleSetSocialMediaPopup}
            paper={false} 
            full={false}   
          />
        )
      }
      {/* <Modal
        open={controlModal}
        onClose={(e) => handleControlModal( e, false )}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className={classes.modal}
        style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        <React.Fragment>
          <Home click={hideMenu} closeModal={handleControlModal}/> 
        </React.Fragment>
      </Modal> */}
      
    </AppBar>
  ); 
}

export default NewHeader
