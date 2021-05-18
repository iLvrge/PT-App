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
        } from 'react-router-dom'
import { 
        AppBar, 
        Toolbar, 
        IconButton, 
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


import useStyles from './styles'

import Home from '../Home'
import CompanySummary from '../common/CompanySummary'
import { signOut } from '../../actions/authActions'
import { getTokenStorage, removeTokenStorage } from '../../utils/tokenStorage'
import { 
        getProfile, 
      } from '../../actions/patenTrackActions'

import { setAssetTypeAssignments, setSelectedAssetsTransactions, setSelectedAssetsPatents, setAssetsIllustration, setBreadCrumbsAndCategory, setSearchString, setResetAll } from '../../actions/patentTrackActions2'
import { setControlModal, setTimelineSelectedItem, setTimelineSelectedAsset } from '../../actions/uiActions'

const NewHeader = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  let history = useHistory()
  const slack_profile_data = useSelector( state => state.patenTrack2.slack_profile_data )
  const profile = useSelector(store => (store.patenTrack.profile))
  const user = useSelector(store => (store.patenTrack.profile ? store.patenTrack.profile.user : {}))
  const siteLogo = useSelector(state => (state.patenTrack.siteLogo.site_logo ? state.patenTrack.siteLogo.site_logo.logo_big : 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/logo/patentrack_new_logo.png'))
  const controlModal = useSelector(state => state.ui.controlModal)
  const breadcrumbs = useSelector(state =>  state.patenTrack2.breadcrumbs )
  const search_string = useSelector(state => state.patenTrack2.search_string)
  const [layoutName, setLayoutName] = useState(null)
  const [ isCompanyMenuOpen, setCompanyMenuOpen ] = useState(false)
  const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
  const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)

  const [ openDrawer, setDrawerState] = useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
  })

  
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

  useEffect(() => {
    checkButtons()
  }, [])

  useEffect(() => {
    checkButtons() 
  }, [ google_auth_token ])

  useEffect(() => {
    setLayoutName(breadcrumbs)
  }, [ breadcrumbs ])

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile(true))
    }
  }, [ dispatch, profile ])

  const checkButtons = () => {
    try {      
      const  googleToken = getTokenStorage( 'google_auth_token_info' )
      let googleLoginButton = true
      
      if(googleToken && googleToken != '' && googleToken != null) {
        const tokenParse = JSON.parse( googleToken )
        const { access_token } = tokenParse
        if( access_token ) {
          googleLoginButton =  false 
          //dispatch(getGoogleProfile(tokenParse))  
        } 
      }
      setGoogleAuthLogin(googleLoginButton)
    } catch ( err ) {
      console.error( err )
    }
  }

  const hideMenu = useCallback((e, item) => {
    dispatch(setResetAll(1, item))    
    handleControlModal(e, false)
    setTimeout(()=>{
      dispatch(setBreadCrumbsAndCategory(item))
    }, 500)
  }, [ dispatch ])

  const handleCompanyMenuOpen = (event) => {
    setCompanyMenuOpen(!isCompanyMenuOpen)
    if(!isCompanyMenuOpen === true) toggleDrawer( event, true )
  }

  const handleControlModal = useCallback((e, flag) => { 
    e.stopPropagation()
    dispatch(setControlModal( flag )) 
  }, [ dispatch ]) 

  
  const toggleDrawer = (event, open) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift') || event.target.classList.contains('children')  || event.target.parentNode.classList.contains('children') || event.target.parentNode.parentNode.classList.contains('children')) {
      return;
    }

    setDrawerState({ ...openDrawer, right: open });
  };

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
    removeTokenStorage('google_auth_token_info')
    setGoogleAuthLogin(true)
  }

  return (

    <AppBar className={classes.root} color='transparent' position='relative'>
      <Toolbar className={classes.toolbar}>
        <img src={siteLogo} className={classes.siteLogo} alt={''} />
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
        <div className={classes.grow} style={{position: 'relative'}}>  
          <div className={classes.breadcrumbs}>{layoutName}</div>   
        </div> 
        <div className={classes.rightPanel}>
            {/* <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
            >
              <Link to='/due'>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tasks" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-tasks fa-w-16 fa-2x" ><path fill="currentColor" d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" ></path></svg>
              </Link>
            </IconButton> */}
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
            <NotificationsIcon className={classes.notification}/>
            {
              slack_profile_data != null
              ?
              <Avatar className={classes.small} alt={`${slack_profile_data.real_name != '' ? slack_profile_data.real_name : slack_profile_data.profile.real_name != '' ? slack_profile_data.profile.real_name : slack_profile_data.profile.display_name}`} src={slack_profile_data.profile != null && slack_profile_data.profile.hasOwnProperty('image_24') && slack_profile_data.profile.image_24 != '' ? slack_profile_data.profile.image_24 : user && user.logo != '' ? user.logo : slack_profile_data.real_name.toString().substring(0,1).toLocaleUpperCase() } />
              :
              <Avatar className={classes.small} alt={`${user ? user.first_name + ' ' + user.last_name : ''}`} src={user && user.logo != '' ? user.logo : user.first_name.toString().substring(0,1).toLocaleUpperCase() } />
            }
            <IconButton
                edge='start'
                className={classes.menuButton}
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
                  <ListItem className={`children`} button style={{marginTop: '50px'}}>
                    <ListItemIcon aria-label='Account Scope' color='inherit' className={`children`}>
                        <BusinessIcon className={`children`}/>
                    </ListItemIcon>
                    <ListItemText primary={`Account Scope`} className={`children`}/>                                            
                  </ListItem>   
                  <Divider />   
                  <CompanySummary />
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
        tabIndex={-1}
      >
        <Home click={hideMenu} closeModal={handleControlModal}/>
      </Modal>
    </AppBar>
  ) 
}

export default NewHeader
