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
        Badge 
      } from '@material-ui/core'

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
        ExpandLess,
        ExpandMore,
        Close
      } from '@material-ui/icons'

  import { controlList } from '../../utils/controlList'

import useStyles from './styles'

import Home from '../Home'
import CompanySummary from '../common/CompanySummary'
import AssetSwitchButton from './AssetSwitchButton'
import ActionMenu from './ActionMenu'
/* import ClipboardAssets from './ClipboardAssets' */
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
} from '../../actions/uiActions'

const NewHeader = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation();
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
  const [layoutName, setLayoutName] = useState(null)
  const [ isClipboardActive, setIsClipboardActive ] = useState(false)
  const [ isCompanyMenuOpen, setCompanyMenuOpen ] = useState(false)
  const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
  const [ slackAuthLogin, setSlackAuthLogin ] = useState( true )
  const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)
  const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
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
      dispatch(getProfile(true))
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
    dispatch(setControlModal( flag )) 
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

  const handleScheduleViaHubspot = () => {
    const elementContainer = document.getElementById('bookMeeting')
    elementContainer.querySelector('.MuiBackdrop-root').addEventListener('click', function() {
      if(this.parentElement.style.visibility == 'visible') {
        this.parentElement.style.visibility = 'hidden'
      }
    })
    elementContainer.style.visibility = elementContainer.style.visibility === 'hidden' ? 'visible' : 'hidden'
    elementContainer.style.top = '42px'
  }

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

  return (
    <AppBar className={classes.root} color='transparent' position='relative'>
      <Toolbar className={classes.toolbar}>
        <span className={classes.logoContainer}><img src={siteLogo} className={classes.siteLogo} alt={''} /></span>
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

        <AssetSwitchButton
          click={handleChangeLayout}
          category={selectedCategory}
        />  
        
        <ActionMenu/>
        
              
        <div className={classes.rightPanel}>  
            <Button className={classes.calendly} onClick={handleScheduleViaHubspot}>
              Schedule a {process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'd' : 'D' }emo {process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'for Pro version' : '' }
            </Button>    
            <IconButton className={`${classes.buttonIcon} ${clipboard_assets.length > 0 ? classes.clipIconActive : ''} ${ display_clipboard === true ? classes.clipIconIsActive : ''}`} onClick={handleClipboard}>
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
          <IconButton className={classes.buttonIcon}>
            <Badge badgeContent={0} color="secondary"> 
              <NotificationsIcon/>
            </Badge>         
          </IconButton>  
           
            {
              !googleAuthLogin
              ?
                <IconButton className={`${classes.padding0}`} aria-label="Google Logout" component="span" onClick={onHandleGoogleSignout}>
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
              <IconButton className={`${classes.buttonIcon} ${classes.padding0}`} aria-label="Slack Logout" component="span" onClick={onHandleSlackSignout} style={{marginRight: 6}}>
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
            >
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
      <Modal 
        open={controlModal}
        disableBackdropClick={false}
        onClose={(e) => handleControlModal( e, false )}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className={classes.modal}
        style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}
      >
        <>
          <Home click={hideMenu} closeModal={handleControlModal}/> 
        </>
      </Modal>
    </AppBar>
  ) 
}

export default NewHeader
