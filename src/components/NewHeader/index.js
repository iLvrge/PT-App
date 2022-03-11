import React, 
        { useCallback, 
          useEffect, 
          useState,
        } from 'react'
import { useDispatch, 
          useSelector 
        } from 'react-redux'
import { Link, 
          useHistory,
          useLocation
        } from 'react-router-dom'
import { 
        AppBar, 
        Toolbar, 
        IconButton, 
        Button,
        InputBase, 
        Avatar, 
        Drawer,
        List,
        ListItem,
        ListItemIcon,
        ListItemText,
        Divider,
        Modal,
        Backdrop,
        Typography,
        Tooltip,
        Zoom,
        Badge,
        Switch 
      } from '@mui/material'

import { Menu as MenuIcon, 
        Search as SearchIcon, 
        Person as PersonIcon, 
        People as PeopleIcon, 
        InsertDriveFile as InsertDriveFileIcon, 
        Business as BusinessIcon, 
        Gavel as GavelIcon, 
        LockOpen as LockOpenIcon, 
        Contacts as ContactsIcon, 
        Settings as SettingsIcon, 
        Dashboard as DashboardIcon, 
        NotificationsNone as NotificationsIcon,
        Home as HomeIcon,
        LightModeOutlined as LightModeOutlinedIcon,
        DarkModeOutlined as DarkModeOutlinedIcon,
        ExpandLess,
        ExpandMore,
        Close
      } from '@mui/icons-material'

import { controlList } from '../../utils/controlList'
import { useDarkMode } from '../../useDarkMode';
import useStyles from './styles'

import Home from '../Home'
import CompanySummary from '../common/CompanySummary'
import ActionMenu from './ActionMenu'
/* import ClipboardAssets from './ClipboardAssets' */
import FullScreen from '../common/FullScreen'
import Reports from '../Reports'
import { signOut } from '../../actions/authActions'
import { getTokenStorage, removeTokenStorage } from '../../utils/tokenStorage'
import { 
        getProfile, 
      } from '../../actions/patenTrackActions'

import { setAssetTypeAssignments, 
  setSelectedAssetsTransactions, 
  setSelectedAssetsPatents, 
  setAssetsIllustration, 
  setBreadCrumbsAndCategory,  
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
  setSlackMessages
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
  setDashboardScreen
} from '../../actions/uiActions'
import Scheduling from './Scheduling'

const NewHeader = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation();
  const isDarkTheme = useSelector( state => state.ui.isDarkTheme )
  const slack_profile_data = useSelector( state => state.patenTrack2.slack_profile_data )
  const google_profile = useSelector( state => state.patenTrack2.google_profile )
  const slack_auth_token = useSelector(state => state.patenTrack2.slack_auth_token)
  const profile = useSelector(store => (store.patenTrack.profile))
  const user = useSelector(store => (store.patenTrack.profile ? store.patenTrack.profile.user : {}))
  const siteLogo = useSelector(state => (state.patenTrack.siteLogo.site_logo ? state.patenTrack.siteLogo.site_logo.logo_big : 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/logo/patentrack_new_logo.png'))
  const controlModal = useSelector(state => state.ui.controlModal)
  const breadcrumbs = useSelector(state =>  state.patenTrack2.breadcrumbs )
  const selectedCategory = useSelector(state =>  state.patenTrack2.selectedCategory )
  const search_string = useSelector(state => state.patenTrack2.search_string)
  const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
  const timelineScreen = useSelector(state => state.ui.timelineScreen)
  const [layoutName, setLayoutName] = useState(null)
  const [ isClipboardActive, setIsClipboardActive ] = useState(false)
  const [ isCompanyMenuOpen, setCompanyMenuOpen ] = useState(false)
  const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
  const [ slackAuthLogin, setSlackAuthLogin ] = useState( true )
  const [ scheduling, setScheduling ] = useState( false )
  
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
      
      if(slackToken && slackToken != null && slackToken!= '') {
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
      setSlackAuthLogin(true)
    }
  }

  const onHandleSaleAssets = useCallback((type) => {
    if(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO') {
      dispatch(setIsSalesAssetsDisplay(!display_sales_assets))
      /* dispatch(setSalesAssetsType(type)) */
      dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
      dispatch(setSelectedAssetsPatents([]))
      dispatch(setAssetFamily([]))
      dispatch(setFamilyItemDisplay({}))
      dispatch(setChannelID(''))
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
        dispatch(setChannelID(''))
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
      //hideMenu(event, controlList[findIndex])
      resetAll()
      clearOtherItems()
      dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))      
      dispatch(setSwitchAssetButton(controlList[findIndex].category == 'due_dilligence' ? 0 : 1))
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
}

const clearOtherItems = () => {
  dispatch(setAssetsIllustration(null))
  dispatch(setAssetsIllustrationData(null))
  dispatch(setSelectedAssetsTransactions([]))
  dispatch(setSelectedAssetsPatents([]))
  dispatch(setSlackMessages([]))
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
  dispatch(setAssetsIllustrationData(null))
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

const onHandleForeignAssets = (event) => {
  if(process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ) {
    alert('Message')
  } else {
    const path = location.pathname
    toggleDrawer(event, false)
    resetAll()
    clearOtherItems()
    console.log("path.indexOf('/review_foreign_assets')", path.indexOf('/review_foreign_assets'))
    if(path.indexOf('/review_foreign_assets') !== -1) {
      history.push('/') 
    } else {
      history.push('/review_foreign_assets') 
    }
  }  
}

const handleThemeMode = useCallback(event => {
  dispatch(toggleThemeMode(!isDarkTheme))
},[dispatch, isDarkTheme])

const shareDashboard = () => {
  console.log("shareDashboard")
}

const onHandleDashboardScreen = () => {
  dispatch(setTimelineScreen(false))
  dispatch(setDashboardScreen(true))
}

const onHandleTimelineScreen = () => {
  dispatch(setTimelineScreen(true))
  dispatch(setDashboardScreen(false))
}

  return (
    <AppBar className={classes.root} color='transparent' position='relative'>
      <Toolbar className={classes.toolbar}>
        <span className={classes.logoContainer}>
          {/* <img src={siteLogo} className={classes.siteLogo} alt={''} /> */}
          <svg version="1.1" className={classes.siteLogo} viewBox="0.0 0.0 230.0 40.0" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l230.0 0l0 40.0l-230.0 0l0 -40.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path  fill-opacity="0.0" d="m0 0l230.0 0l0 40.0l-230.0 0z" fill-rule="evenodd"/><path  fill-opacity="0.0" d="m42.55643 0.002624672l190.07875 0l0 24.47244l-190.07875 0z" fill-rule="evenodd"/><path  d="m63.884556 8.570915q0 1.4375 -0.515625 2.8125q-0.5 1.359375 -1.421875 2.28125q-1.28125 1.265625 -2.84375 1.90625q-1.5625 0.640625 -3.90625 0.640625l-3.421875 0l0 6.953125l-5.5 0l0 -21.328125l9.046875 0q2.046875 0 3.4375 0.35937512q1.390625 0.34375 2.46875 1.046875q1.28125 0.84374976 1.96875 2.1718748q0.6875 1.3125 0.6875 3.15625zm-5.6875 0.125q0 -0.890625 -0.5 -1.546875q-0.484375 -0.65625 -1.125 -0.90625q-0.859375 -0.34375 -1.671875 -0.375q-0.8125 -0.046875 -2.171875 -0.046875l-0.953125 0l0 6.390625l1.578125 0q1.40625 0 2.3125 -0.171875q0.90625 -0.171875 1.53125 -0.6875q0.515625 -0.453125 0.75 -1.09375q0.25 -0.640625 0.25 -1.5625zm19.026134 10.265625l0 -3.34375q-1.046875 0.09375 -2.265625 0.25q-1.21875 0.140625 -1.84375 0.34375q-0.765625 0.234375 -1.1875 0.703125q-0.40625 0.46875 -0.40625 1.21875q0 0.5 0.078125 0.828125q0.09375 0.3125 0.4375 0.59375q0.328125 0.28125 0.78125 0.421875q0.46875 0.140625 1.4375 0.140625q0.78125 0 1.578125 -0.3125q0.796875 -0.328125 1.390625 -0.84375zm0 2.5q-0.421875 0.3125 -1.03125 0.765625q-0.609375 0.4375 -1.15625 0.6875q-0.765625 0.34375 -1.578125 0.5q-0.8125 0.171875 -1.796875 0.171875q-2.28125 0 -3.828125 -1.40625q-1.546875 -1.421875 -1.546875 -3.625q0 -1.765625 0.78125 -2.875q0.796875 -1.125 2.234375 -1.765625q1.4375 -0.640625 3.546875 -0.90625q2.125 -0.28125 4.40625 -0.40625l0 -0.09375q0 -1.328125 -1.09375 -1.828125q-1.078125 -0.515625 -3.203125 -0.515625q-1.28125 0 -2.734375 0.453125q-1.4375 0.453125 -2.0625 0.6875l-0.46875 0l0 -3.875q0.8125 -0.21875 2.640625 -0.515625q1.84375 -0.296875 3.703125 -0.296875q4.390625 0 6.34375 1.359375q1.953125 1.359375 1.953125 4.25l0 10.9375l-5.109375 0l0 -1.703125zm20.137146 1.5625q-0.828125 0.21875 -1.765625 0.328125q-0.921875 0.125 -2.28125 0.125q-3.0 0 -4.46875 -1.21875q-1.46875 -1.21875 -1.46875 -4.15625l0 -7.53125l-2.125 0l0 -3.484375l2.125 0l0 -4.59375l5.15625 0l0 4.59375l4.828125 0l0 3.484375l-4.828125 0l0 5.703125q0 0.84375 0.015625 1.484375q0.015625 0.625 0.234375 1.125q0.1875 0.5 0.6875 0.796875q0.515625 0.296875 1.5 0.296875q0.390625 0 1.046875 -0.171875q0.65625 -0.171875 0.90625 -0.328125l0.4375 0l0 3.546875zm18.907791 -6.953125l-11.796875 0q0.125 1.890625 1.4375 2.90625q1.328125 1.0 3.90625 1.0q1.640625 0 3.171875 -0.59375q1.53125 -0.59375 2.421875 -1.265625l0.5625 0l0 4.140625q-1.75 0.703125 -3.296875 1.015625q-1.546875 0.3125 -3.421875 0.3125q-4.828125 0 -7.40625 -2.171875q-2.578125 -2.171875 -2.578125 -6.203125q0 -3.96875 2.4375 -6.296875q2.4375 -2.328125 6.6875 -2.328125q3.9375 0 5.90625 1.984375q1.96875 1.984375 1.96875 5.703125l0 1.796875zm-5.125 -3.015625q-0.03125 -1.625 -0.796875 -2.4375q-0.765625 -0.8125 -2.359375 -0.8125q-1.5 0 -2.453125 0.78125q-0.953125 0.765625 -1.078125 2.46875l6.6875 0zm24.928833 10.109375l-5.1875 0l0 -7.96875q0 -0.984375 -0.109375 -1.953125q-0.09375 -0.96875 -0.34375 -1.421875q-0.28125 -0.53125 -0.828125 -0.765625q-0.546875 -0.25 -1.546875 -0.25q-0.703125 0 -1.421875 0.234375q-0.71875 0.21875 -1.5625 0.71875l0 11.40625l-5.15625 0l0 -16.078125l5.15625 0l0 1.765625q1.375 -1.0625 2.640625 -1.640625q1.265625 -0.578125 2.8125 -0.578125q2.609375 0 4.078125 1.53125q1.46875 1.515625 1.46875 4.53125l0 10.46875zm21.705933 -17.203125l-6.65625 0l0 17.203125l-5.5 0l0 -17.203125l-6.65625 0l0 -4.125l18.8125 0l0 4.125zm14.678741 6.03125l-0.453125 0q-0.34375 -0.109375 -1.078125 -0.171875q-0.71875 -0.0625 -1.203125 -0.0625q-1.109375 0 -1.953125 0.15625q-0.84375 0.140625 -1.8125 0.484375l0 10.765625l-5.15625 0l0 -16.078125l5.15625 0l0 2.359375q1.703125 -1.453125 2.953125 -1.9375q1.265625 -0.484375 2.328125 -0.484375q0.265625 0 0.609375 0.015625q0.34375 0.015625 0.609375 0.046875l0 4.90625zm12.656265 6.96875l0 -3.34375q-1.046875 0.09375 -2.265625 0.25q-1.21875 0.140625 -1.84375 0.34375q-0.765625 0.234375 -1.1875 0.703125q-0.40625 0.46875 -0.40625 1.21875q0 0.5 0.078125 0.828125q0.09375 0.3125 0.4375 0.59375q0.328125 0.28125 0.78125 0.421875q0.46875 0.140625 1.4375 0.140625q0.78125 0 1.578125 -0.3125q0.796875 -0.328125 1.390625 -0.84375zm0 2.5q-0.421875 0.3125 -1.03125 0.765625q-0.609375 0.4375 -1.15625 0.6875q-0.765625 0.34375 -1.578125 0.5q-0.8125 0.171875 -1.796875 0.171875q-2.28125 0 -3.828125 -1.40625q-1.546875 -1.421875 -1.546875 -3.625q0 -1.765625 0.78125 -2.875q0.796875 -1.125 2.234375 -1.765625q1.4375 -0.640625 3.546875 -0.90625q2.125 -0.28125 4.40625 -0.40625l0 -0.09375q0 -1.328125 -1.09375 -1.828125q-1.078125 -0.515625 -3.203125 -0.515625q-1.28125 0 -2.734375 0.453125q-1.4375 0.453125 -2.0625 0.6875l-0.46875 0l0 -3.875q0.8125 -0.21875 2.640625 -0.515625q1.84375 -0.296875 3.703125 -0.296875q4.390625 0 6.34375 1.359375q1.953125 1.359375 1.953125 4.25l0 10.9375l-5.109375 0l0 -1.703125zm18.230896 2.125q-2.109375 0 -3.84375 -0.5q-1.734375 -0.5 -3.03125 -1.546875q-1.28125 -1.03125 -1.984375 -2.625q-0.6875 -1.59375 -0.6875 -3.71875q0 -2.25 0.75 -3.875q0.75 -1.640625 2.09375 -2.71875q1.296875 -1.015625 3.0 -1.484375q1.71875 -0.484375 3.546875 -0.484375q1.640625 0 3.03125 0.359375q1.390625 0.359375 2.59375 0.9375l0 4.390625l-0.734375 0q-0.296875 -0.25 -0.71875 -0.59375q-0.421875 -0.34375 -1.03125 -0.671875q-0.59375 -0.328125 -1.296875 -0.53125q-0.703125 -0.203125 -1.625 -0.203125q-2.0625 0 -3.171875 1.3125q-1.109375 1.3125 -1.109375 3.5625q0 2.3125 1.125 3.515625q1.140625 1.203125 3.234375 1.203125q0.96875 0 1.75 -0.21875q0.78125 -0.21875 1.296875 -0.53125q0.5 -0.28125 0.859375 -0.59375q0.375 -0.3125 0.6875 -0.625l0.734375 0l0 4.40625q-1.21875 0.5625 -2.546875 0.890625q-1.3125 0.34375 -2.921875 0.34375zm25.943558 -0.421875l-6.0 0l-4.5 -7.0l-1.40625 1.703125l0 5.296875l-5.15625 0l0 -22.28125l5.15625 0l0 13.296875l5.546875 -7.09375l5.953125 0l-5.796875 6.921875l6.203125 9.15625z" fill-rule="nonzero"/><path  fill-opacity="0.0" d="m41.375328 24.475065l192.44095 0l0 18.267717l-192.44095 0z" fill-rule="evenodd"/><path  d="m56.96575 28.12069l-3.03125 5.046875l0 3.1875l-2.125 0l0 -3.09375l-3.09375 -5.140625l2.421875 0l1.78125 3.1875l1.71875 -3.1875l2.328125 0zm7.346756 5.125q0 1.53125 -0.90625 2.421875q-0.890625 0.875 -2.5 0.875q-1.625 0 -2.515625 -0.875q-0.890625 -0.890625 -0.890625 -2.421875q0 -1.53125 0.890625 -2.40625q0.90625 -0.890625 2.515625 -0.890625q1.625 0 2.515625 0.890625q0.890625 0.875 0.890625 2.40625zm-2.453125 1.515625q0.1875 -0.234375 0.28125 -0.5625q0.109375 -0.34375 0.109375 -0.9375q0 -0.546875 -0.109375 -0.90625q-0.09375 -0.375 -0.28125 -0.609375q-0.171875 -0.21875 -0.421875 -0.3125q-0.25 -0.09375 -0.53125 -0.09375q-0.296875 0 -0.515625 0.078125q-0.21875 0.078125 -0.421875 0.3125q-0.1875 0.21875 -0.296875 0.59375q-0.109375 0.375 -0.109375 0.9375q0 0.515625 0.09375 0.890625q0.09375 0.359375 0.28125 0.59375q0.171875 0.21875 0.421875 0.328125q0.25 0.09375 0.5625 0.09375q0.265625 0 0.515625 -0.09375q0.25 -0.09375 0.421875 -0.3125zm10.058273 1.59375l-1.984375 0l0 -0.6875q-0.5625 0.421875 -1.015625 0.640625q-0.453125 0.21875 -1.09375 0.21875q-1.03125 0 -1.59375 -0.59375q-0.546875 -0.59375 -0.546875 -1.75l0 -4.046875l2.0 0l0 3.09375q0 0.46875 0.03125 0.78125q0.03125 0.3125 0.140625 0.515625q0.109375 0.203125 0.3125 0.296875q0.21875 0.09375 0.609375 0.09375q0.25 0 0.546875 -0.09375q0.3125 -0.09375 0.609375 -0.28125l0 -4.40625l1.984375 0l0 6.21875zm6.3826904 -4.3125l-0.171875 0q-0.125 -0.046875 -0.40625 -0.0625q-0.28125 -0.03125 -0.46875 -0.03125q-0.4375 0 -0.765625 0.0625q-0.3125 0.046875 -0.6875 0.1875l0 4.15625l-2.0 0l0 -6.21875l2.0 0l0 0.921875q0.65625 -0.5625 1.140625 -0.75q0.484375 -0.1875 0.890625 -0.1875q0.109375 0 0.234375 0.015625q0.140625 0 0.234375 0l0 1.90625zm11.909042 -1.328125q0 0.5625 -0.1875 1.09375q-0.1875 0.515625 -0.546875 0.875q-0.5 0.484375 -1.109375 0.734375q-0.59375 0.25 -1.5 0.25l-1.328125 0l0 2.6875l-2.125 0l0 -8.234375l3.5 0q0.78125 0 1.3125 0.140625q0.546875 0.125 0.96875 0.40625q0.5 0.3125 0.75 0.828125q0.265625 0.515625 0.265625 1.21875zm-2.1875 0.046875q0 -0.34375 -0.1875 -0.59375q-0.1875 -0.25 -0.4375 -0.34375q-0.328125 -0.140625 -0.65625 -0.15625q-0.3125 -0.015625 -0.828125 -0.015625l-0.375 0l0 2.46875l0.609375 0q0.546875 0 0.890625 -0.0625q0.359375 -0.0625 0.59375 -0.265625q0.203125 -0.171875 0.296875 -0.421875q0.09375 -0.25 0.09375 -0.609375zm7.3493805 3.96875l0 -1.296875q-0.40625 0.046875 -0.875 0.109375q-0.46875 0.046875 -0.71875 0.125q-0.296875 0.09375 -0.453125 0.28125q-0.15625 0.171875 -0.15625 0.46875q0 0.1875 0.03125 0.3125q0.03125 0.125 0.171875 0.234375q0.125 0.109375 0.296875 0.171875q0.1875 0.046875 0.5625 0.046875q0.296875 0 0.59375 -0.125q0.3125 -0.125 0.546875 -0.328125zm0 0.96875q-0.15625 0.125 -0.40625 0.296875q-0.234375 0.171875 -0.4375 0.265625q-0.296875 0.125 -0.609375 0.1875q-0.3125 0.078125 -0.6875 0.078125q-0.890625 0 -1.5 -0.546875q-0.59375 -0.546875 -0.59375 -1.40625q0 -0.6875 0.296875 -1.109375q0.3125 -0.4375 0.875 -0.6875q0.5625 -0.25 1.375 -0.34375q0.8125 -0.109375 1.703125 -0.15625l0 -0.03125q0 -0.515625 -0.421875 -0.703125q-0.421875 -0.203125 -1.25 -0.203125q-0.484375 0 -1.046875 0.171875q-0.5625 0.171875 -0.796875 0.265625l-0.1875 0l0 -1.5q0.3125 -0.078125 1.015625 -0.1875q0.71875 -0.125 1.4375 -0.125q1.703125 0 2.453125 0.53125q0.75 0.515625 0.75 1.640625l0 4.21875l-1.96875 0l0 -0.65625zm7.7699585 0.59375q-0.3125 0.09375 -0.671875 0.140625q-0.359375 0.046875 -0.875 0.046875q-1.171875 0 -1.734375 -0.46875q-0.5625 -0.46875 -0.5625 -1.609375l0 -2.90625l-0.828125 0l0 -1.359375l0.828125 0l0 -1.765625l1.984375 0l0 1.765625l1.859375 0l0 1.359375l-1.859375 0l0 2.203125q0 0.328125 0 0.578125q0.015625 0.234375 0.09375 0.421875q0.078125 0.203125 0.265625 0.3125q0.203125 0.109375 0.578125 0.109375q0.15625 0 0.40625 -0.0625q0.25 -0.0625 0.359375 -0.125l0.15625 0l0 1.359375zm7.316971 -2.671875l-4.5625 0q0.046875 0.71875 0.546875 1.109375q0.515625 0.390625 1.515625 0.390625q0.625 0 1.21875 -0.21875q0.59375 -0.234375 0.9375 -0.5l0.21875 0l0 1.609375q-0.671875 0.265625 -1.265625 0.390625q-0.59375 0.125 -1.328125 0.125q-1.859375 0 -2.859375 -0.84375q-1.0 -0.84375 -1.0 -2.390625q0 -1.546875 0.9375 -2.4375q0.953125 -0.90625 2.59375 -0.90625q1.515625 0 2.28125 0.765625q0.765625 0.765625 0.765625 2.203125l0 0.703125zm-1.984375 -1.171875q-0.015625 -0.625 -0.3125 -0.9375q-0.296875 -0.3125 -0.90625 -0.3125q-0.578125 0 -0.953125 0.296875q-0.375 0.296875 -0.40625 0.953125l2.578125 0zm9.616333 3.90625l-2.0 0l0 -3.078125q0 -0.375 -0.046875 -0.75q-0.03125 -0.375 -0.125 -0.546875q-0.109375 -0.203125 -0.328125 -0.296875q-0.203125 -0.109375 -0.578125 -0.109375q-0.28125 0 -0.5625 0.09375q-0.265625 0.09375 -0.59375 0.28125l0 4.40625l-2.0 0l0 -6.21875l2.0 0l0 0.6875q0.53125 -0.40625 1.015625 -0.625q0.484375 -0.234375 1.078125 -0.234375q1.015625 0 1.578125 0.59375q0.5625 0.59375 0.5625 1.75l0 4.046875zm5.8045654 -0.0625q-0.3125 0.09375 -0.671875 0.140625q-0.359375 0.046875 -0.875 0.046875q-1.171875 0 -1.734375 -0.46875q-0.5625 -0.46875 -0.5625 -1.609375l0 -2.90625l-0.828125 0l0 -1.359375l0.828125 0l0 -1.765625l1.984375 0l0 1.765625l1.859375 0l0 1.359375l-1.859375 0l0 2.203125q0 0.328125 0 0.578125q0.015625 0.234375 0.09375 0.421875q0.078125 0.203125 0.265625 0.3125q0.203125 0.109375 0.578125 0.109375q0.15625 0 0.40625 -0.0625q0.25 -0.0625 0.359375 -0.125l0.15625 0l0 1.359375zm6.5982285 -1.90625q0 0.96875 -0.875 1.5625q-0.859375 0.578125 -2.3593826 0.578125q-0.828125 0 -1.5 -0.15625q-0.671875 -0.15625 -1.078125 -0.34375l0 -1.640625l0.171875 0q0.15625 0.109375 0.34375 0.234375q0.203125 0.125 0.5625 0.265625q0.3125 0.125 0.703125 0.21875q0.390625 0.09375 0.84375 0.09375q0.578125 0 0.8593826 -0.125q0.28125 -0.140625 0.28125 -0.390625q0 -0.21875 -0.171875 -0.328125q-0.15625 -0.109375 -0.6250076 -0.203125q-0.21875 -0.046875 -0.59375 -0.09375q-0.375 -0.0625 -0.6875 -0.140625q-0.84375 -0.234375 -1.265625 -0.6875q-0.40625 -0.46875 -0.40625 -1.171875q0 -0.890625 0.84375 -1.484375q0.859375 -0.609375 2.328125 -0.609375q0.7031326 0 1.3437576 0.15625q0.640625 0.140625 1.0 0.296875l0 1.5625l-0.171875 0q-0.453125 -0.296875 -1.015625 -0.484375q-0.5625 -0.203125 -1.1406326 -0.203125q-0.484375 0 -0.8125 0.140625q-0.328125 0.125 -0.328125 0.375q0 0.21875 0.140625 0.34375q0.15625 0.109375 0.703125 0.21875q0.3125 0.0625 0.6562576 0.125q0.359375 0.0625 0.703125 0.140625q0.796875 0.21875 1.171875 0.65625q0.375 0.4375 0.375 1.09375zm13.076843 -2.140625q0 1.15625 -0.53125 2.0625q-0.515625 0.90625 -1.3125 1.390625q-0.609375 0.375 -1.328125 0.515625q-0.71875 0.140625 -1.703125 0.140625l-2.90625 0l0 -8.234375l2.984375 0q1.015625 0 1.734375 0.171875q0.734375 0.15625 1.234375 0.46875q0.859375 0.53125 1.34375 1.421875q0.484375 0.875 0.484375 2.0625zm-2.1875 -0.015625q0 -0.8125 -0.296875 -1.390625q-0.296875 -0.578125 -0.9375 -0.90625q-0.328125 -0.15625 -0.671875 -0.21875q-0.34375 -0.0625 -1.015625 -0.0625l-0.546875 0l0 5.15625l0.546875 0q0.75 0 1.09375 -0.0625q0.359375 -0.078125 0.703125 -0.25q0.578125 -0.34375 0.84375 -0.890625q0.28125 -0.5625 0.28125 -1.375zm9.825104 1.390625l-4.5625 0q0.046875 0.71875 0.546875 1.109375q0.515625 0.390625 1.515625 0.390625q0.625 0 1.21875 -0.21875q0.59375 -0.234375 0.9375 -0.5l0.21875 0l0 1.609375q-0.671875 0.265625 -1.265625 0.390625q-0.59375 0.125 -1.328125 0.125q-1.859375 0 -2.859375 -0.84375q-1.0 -0.84375 -1.0 -2.390625q0 -1.546875 0.9375 -2.4375q0.953125 -0.90625 2.59375 -0.90625q1.515625 0 2.28125 0.765625q0.765625 0.765625 0.765625 2.203125l0 0.703125zm-1.984375 -1.171875q-0.015625 -0.625 -0.3125 -0.9375q-0.296875 -0.3125 -0.90625 -0.3125q-0.578125 0 -0.953125 0.296875q-0.375 0.296875 -0.40625 0.953125l2.578125 0zm8.788208 1.9375q0 0.96875 -0.875 1.5625q-0.859375 0.578125 -2.359375 0.578125q-0.828125 0 -1.5 -0.15625q-0.671875 -0.15625 -1.078125 -0.34375l0 -1.640625l0.171875 0q0.15625 0.109375 0.34375 0.234375q0.203125 0.125 0.5625 0.265625q0.3125 0.125 0.703125 0.21875q0.390625 0.09375 0.84375 0.09375q0.578125 0 0.859375 -0.125q0.28125 -0.140625 0.28125 -0.390625q0 -0.21875 -0.171875 -0.328125q-0.15625 -0.109375 -0.625 -0.203125q-0.21875 -0.046875 -0.59375 -0.09375q-0.375 -0.0625 -0.6875 -0.140625q-0.84375 -0.234375 -1.265625 -0.6875q-0.40625 -0.46875 -0.40625 -1.171875q0 -0.890625 0.84375 -1.484375q0.859375 -0.609375 2.328125 -0.609375q0.703125 0 1.34375 0.15625q0.640625 0.140625 1.0 0.296875l0 1.5625l-0.171875 0q-0.453125 -0.296875 -1.015625 -0.484375q-0.5625 -0.203125 -1.140625 -0.203125q-0.484375 0 -0.8125 0.140625q-0.328125 0.125 -0.328125 0.375q0 0.21875 0.140625 0.34375q0.15625 0.109375 0.703125 0.21875q0.3125 0.0625 0.65625 0.125q0.359375 0.0625 0.703125 0.140625q0.796875 0.21875 1.171875 0.65625q0.375 0.4375 0.375 1.09375zm7.4393005 -0.765625l-4.5625 0q0.046875 0.71875 0.546875 1.109375q0.515625 0.390625 1.515625 0.390625q0.625 0 1.21875 -0.21875q0.59375 -0.234375 0.9375 -0.5l0.21875 0l0 1.609375q-0.671875 0.265625 -1.265625 0.390625q-0.59375 0.125 -1.328125 0.125q-1.859375 0 -2.859375 -0.84375q-1.0 -0.84375 -1.0 -2.390625q0 -1.546875 0.9375 -2.4375q0.953125 -0.90625 2.59375 -0.90625q1.515625 0 2.28125 0.765625q0.765625 0.765625 0.765625 2.203125l0 0.703125zm-1.984375 -1.171875q-0.015625 -0.625 -0.3125 -0.9375q-0.296875 -0.3125 -0.90625 -0.3125q-0.578125 0 -0.953125 0.296875q-0.375 0.296875 -0.40625 0.953125l2.578125 0zm7.881958 -0.40625l-0.171875 0q-0.125 -0.046875 -0.40625 -0.0625q-0.28125 -0.03125 -0.46875 -0.03125q-0.4375 0 -0.765625 0.0625q-0.3125 0.046875 -0.6875 0.1875l0 4.15625l-2.0 0l0 -6.21875l2.0 0l0 0.921875q0.65625 -0.5625 1.140625 -0.75q0.484375 -0.1875 0.890625 -0.1875q0.109375 0 0.234375 0.015625q0.140625 0 0.234375 0l0 1.90625zm7.3964996 -1.90625l-2.40625 6.21875l-2.25 0l-2.375 -6.21875l2.09375 0l1.453125 4.28125l1.421875 -4.28125l2.0625 0zm7.2215576 3.484375l-4.5625 0q0.046875 0.71875 0.546875 1.109375q0.515625 0.390625 1.515625 0.390625q0.625 0 1.21875 -0.21875q0.59375 -0.234375 0.9375 -0.5l0.21875 0l0 1.609375q-0.671875 0.265625 -1.265625 0.390625q-0.59375 0.125 -1.328125 0.125q-1.859375 0 -2.859375 -0.84375q-1.0 -0.84375 -1.0 -2.390625q0 -1.546875 0.9375 -2.4375q0.953125 -0.90625 2.59375 -0.90625q1.515625 0 2.28125 0.765625q0.765625 0.765625 0.765625 2.203125l0 0.703125zm-1.984375 -1.171875q-0.015625 -0.625 -0.3125 -0.9375q-0.296875 -0.3125 -0.90625 -0.3125q-0.578125 0 -0.953125 0.296875q-0.375 0.296875 -0.40625 0.953125l2.578125 0z" fill-rule="nonzero"/><path fill="#e60000" d="m199.98567 36.355064l-2.109375 0l0 -5.515625l-1.53125 3.578125l-1.46875 0l-1.53125 -3.578125l0 5.515625l-2.0 0l0 -8.234375l2.46875 0l1.859375 4.125l1.84375 -4.125l2.46875 0l0 8.234375zm8.345657 -3.109375q0 1.53125 -0.90625 2.421875q-0.890625 0.875 -2.5 0.875q-1.625 0 -2.515625 -0.875q-0.890625 -0.890625 -0.890625 -2.421875q0 -1.53125 0.890625 -2.40625q0.90625 -0.890625 2.515625 -0.890625q1.625 0 2.515625 0.890625q0.890625 0.875 0.890625 2.40625zm-2.453125 1.515625q0.1875 -0.234375 0.28125 -0.5625q0.109375 -0.34375 0.109375 -0.9375q0 -0.546875 -0.109375 -0.90625q-0.09375 -0.375 -0.28125 -0.609375q-0.171875 -0.21875 -0.421875 -0.3125q-0.25 -0.09375 -0.53125 -0.09375q-0.296875 0 -0.515625 0.078125q-0.21875 0.078125 -0.421875 0.3125q-0.1875 0.21875 -0.296875 0.59375q-0.109375 0.375 -0.109375 0.9375q0 0.515625 0.09375 0.890625q0.09375 0.359375 0.28125 0.59375q0.171875 0.21875 0.421875 0.328125q0.25 0.09375 0.5625 0.09375q0.265625 0 0.515625 -0.09375q0.25 -0.09375 0.421875 -0.3125zm8.370773 -2.71875l-0.171875 0q-0.125 -0.046875 -0.40625 -0.0625q-0.28125 -0.03125 -0.46875 -0.03125q-0.4375 0 -0.765625 0.0625q-0.3125 0.046875 -0.6875 0.1875l0 4.15625l-2.0 0l0 -6.21875l2.0 0l0 0.921875q0.65625 -0.5625 1.140625 -0.75q0.484375 -0.1875 0.890625 -0.1875q0.109375 0 0.234375 0.015625q0.140625 0 0.234375 0l0 1.90625zm7.2558746 1.578125l-4.5625 0q0.046875 0.71875 0.546875 1.109375q0.515625 0.390625 1.515625 0.390625q0.625 0 1.21875 -0.21875q0.59375 -0.234375 0.9375 -0.5l0.21875 0l0 1.609375q-0.671875 0.265625 -1.265625 0.390625q-0.59375 0.125 -1.328125 0.125q-1.859375 0 -2.859375 -0.84375q-1.0 -0.84375 -1.0 -2.390625q0 -1.546875 0.9375 -2.4375q0.953125 -0.90625 2.59375 -0.90625q1.515625 0 2.28125 0.765625q0.765625 0.765625 0.765625 2.203125l0 0.703125zm-1.984375 -1.171875q-0.015625 -0.625 -0.3125 -0.9375q-0.296875 -0.3125 -0.90625 -0.3125q-0.578125 0 -0.953125 0.296875q-0.375 0.296875 -0.40625 0.953125l2.578125 0zm5.881958 -4.328125l-0.25 5.859375l-1.8125 0l-0.25 -5.859375l2.3125 0zm-0.046875 8.234375l-2.234375 0l0 -1.453125l2.234375 0l0 1.453125z" fill-rule="nonzero"/><path  fill-opacity="0.0" d="m0 0.002624672l42.556416 0l0 39.999992l-42.556416 0z" fill-rule="evenodd"/><g transform="matrix(0.28370944881889765 0.0 0.0 0.23668635170603672 0.0 0.0026246719160104987)"><clipPath id="p.1"><path d="m0 0l150.0 0l0 169.0l-150.0 0z" clip-rule="evenodd"/></clipPath><image clip-path="url(#p.1)" fill="#000" width="150.0" height="169.0" x="0.0" y="0.0" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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"/></g></g></svg>
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
          dashboardScreen={dashboardScreen}
          setDashboardScreen={onHandleDashboardScreen}
          seActivityTimeline={onHandleTimelineScreen}
          timelineScreen={timelineScreen} 
        />
              
        <div className={classes.rightPanel}>  
            {/* <Switch  
              color="secondary" 
              {...( isDarkTheme == 'dark' ? {checked: true} : {})} 
              onChange={handleThemeMode}
            /> */}
            <Button className={classes.calendly} onClick={() => {setScheduling(!scheduling)}}>
              Schedule a {process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'd' : 'D' }emo {process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'for Pro version' : '' }
            </Button>    
            <IconButton
              className={`${classes.buttonIcon} ${clipboard_assets.length > 0 ? classes.clipIconActive : ''} ${ display_clipboard === true ? classes.clipIconIsActive : ''}`}
              onClick={handleClipboard}
              size="large">
              <Badge badgeContent={clipboard_assets.length} color="secondary">    
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
          
          <div className={classes.search}>
            <div className={classes.searchIcon}> 
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
              }}
              defaultValue={ search_string != null ? search_string : ''}
              inputProps={{ 'aria-label': 'search' }}
              onKeyDown={handleKeyDown}
            />
          </div>
          <IconButton className={classes.buttonIcon} size="large">
            <Badge badgeContent={0} color="secondary"> 
              <NotificationsIcon/>
            </Badge>         
          </IconButton>  
           
            {
              !googleAuthLogin
              ?
                <IconButton
                  className={`${classes.padding0}`}
                  aria-label="Google Logout"
                  component="span"
                  onClick={onHandleGoogleSignout}
                  size="large">
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
              <IconButton
                className={`${classes.buttonIcon} ${classes.padding0}`}
                aria-label="Slack Logout"
                component="span"
                onClick={onHandleSlackSignout}
                style={{marginRight: 6}}
                size="large">
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
              :
              ''
            }
            {
              slack_profile_data != null && Object.keys(slack_profile_data).length > 0
              ?
                <Avatar className={classes.buttonIcon} alt={`${slack_profile_data.real_name != '' ? slack_profile_data.real_name : slack_profile_data.profile.real_name != '' ? slack_profile_data.profile.real_name : slack_profile_data.profile.display_name}`} src={slack_profile_data.profile != null && slack_profile_data.profile.hasOwnProperty('image_24') && slack_profile_data.profile.image_24 != '' ? slack_profile_data.profile.image_24 : user && user.logo != '' ? user.logo : slack_profile_data.real_name.toString().substring(0,1).toLocaleUpperCase() } />
              :
                <Avatar className={classes.buttonIcon} alt={`${user ? user.first_name + ' ' + user.last_name : ''}`} src={user && user.logo != '' ? user.logo : user.first_name.toString().substring(0,1).toLocaleUpperCase() } />
            }
            <IconButton
              className={`${classes.buttonIcon} ${classes.menuButton}`}
              color='inherit'
              aria-label='open drawer'
              onClick={(event) => {toggleDrawer(event, true)}}
              size="large">
              <MenuIcon />
            </IconButton>
            <Drawer anchor={'right'} open={openDrawer['right']} onClose={(event) => {toggleDrawer(event, false)}} className={classes.drawer}>
              <div
                onClick={(event) => { toggleDrawer(event, false)}}
                onKeyDown={(event) => { toggleDrawer(event, false)}} 
                className={classes.rightMenu}
              >
                
                <List component='nav'>
                  <ListItem onClick={() => {
                          dispatch(signOut())
                      }} button>
                      <ListItemIcon  color='inherit' >
                          <LockOpenIcon /> 
                      </ListItemIcon>
                      <ListItemText primary={`Sign Out`} />
                  </ListItem>
                  <ListItem onClick={handleThemeMode} button>
                    <ListItemIcon  color='inherit' >
                        {
                          isDarkTheme ?
                            <DarkModeOutlinedIcon/>
                          :
                            <LightModeOutlinedIcon/>
                        }
                    </ListItemIcon>
                    <ListItemText primary={isDarkTheme ? `Dark Mode` : `Ligh Mode`} />
                  </ListItem>
                  
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
                  <ListItem button onClick={onHandleForeignAssets}>
                    <ListItemIcon  color='inherit' >
                      <svg width="18" height="18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M16 288c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h112v-64zm489-183L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H152c-13.3 0-24 10.7-24 24v264h128v-65.2c0-14.3 17.3-21.4 27.4-11.3L379 308c6.6 6.7 6.6 17.4 0 24l-95.7 96.4c-10.1 10.1-27.4 3-27.4-11.3V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24z" class=""></path></svg>
                    </ListItemIcon>
                    <ListItemText primary={`Review External Assets`} />
                  </ListItem>  
                  {
                    process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' 
                    ?
                      <>
                        <ListItem className={`children`} button style={{marginTop: '50px'}}>
                          <ListItemIcon aria-label='Account Scope' color='inherit' className={`children`}>
                              <BusinessIcon className={`children`}/>
                          </ListItemIcon>
                          <ListItemText primary={`Account Scope`} className={`children`}/>                                            
                        </ListItem>   
                        <Divider />   
                        <CompanySummary />
                      </>
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
      <Modal
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
      </Modal>
      
    </AppBar>
  ); 
}

export default NewHeader
