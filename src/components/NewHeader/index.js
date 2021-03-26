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

import { getProfile, 
         } from '../../actions/patenTrackActions'

import { setAssetTypeAssignments, setSelectedAssetsTransactions, setSelectedAssetsPatents, setAssetsIllustration, setBreadCrumbsAndCategory, setSearchString, setResetAll } from '../../actions/patentTrackActions2'
import { setControlModal, setTimelineSelectedItem, setTimelineSelectedAsset } from '../../actions/uiActions'

const NewHeader = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  let history = useHistory()
  
  const profile = useSelector(store => (store.patenTrack.profile))
  const user = useSelector(store => (store.patenTrack.profile ? store.patenTrack.profile.user : {}))
  const siteLogo = useSelector(state => (state.patenTrack.siteLogo.site_logo ? state.patenTrack.siteLogo.site_logo.logo_big : '/assets/images/logos/patentrack_logo.png'))
  const controlModal = useSelector(state => state.ui.controlModal)
  const breadcrumbs = useSelector(state =>  state.patenTrack2.breadcrumbs )
  const search_string = useSelector(state => state.patenTrack2.search_string)
  const [layoutName, setLayoutName] = useState(null)
  const [ isCompanyMenuOpen, setCompanyMenuOpen ] = useState(false)

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
    setLayoutName(breadcrumbs)
  }, [ breadcrumbs ])

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile(true))
    }
  }, [ dispatch, profile ])

  const hideMenu = useCallback((e, item) => {
    dispatch(setResetAll(1))
    dispatch(setBreadCrumbsAndCategory(item))
    handleControlModal(e, false)
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
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
            >
              <Link to='/due'>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tasks" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-tasks fa-w-16 fa-2x" ><path fill="currentColor" d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" ></path></svg>
              </Link>
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
            <NotificationsIcon className={classes.notification}/>
            <Avatar className={classes.small} alt={`${user ? user.first_name + ' ' + user.last_name : ''}`} src={user && user.logo != '' ? user.logo : user.first_name.toString().substring(0,1).toLocaleUpperCase() } />
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
                  <ListItem button>
                      <ListItemIcon  color='inherit' >
                          <HomeIcon /> 
                      </ListItemIcon>
                      <ListItemText primary={`Back to PatenTrack`} />
                  </ListItem>
                  <ListItem className={`children`} button>
                    <ListItemIcon aria-label='Settings' color='inherit' className={`children`}>
                        <SettingsIcon className={`children`}/>
                    </ListItemIcon>
                    <ListItemText primary={`Settings`} className={`children`}/>                                            
                  </ListItem>   
                  <Divider />  
                  <List className={classes.childMenu} component='nav'>      
                    <ListItem onClick={(e) => onRedirect(e, '/settings/slacks')} button>
                        <ListItemIcon  color='inherit' >
                          <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="slack" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="MuiSvgIcon-root"><path fill="currentColor" d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z" class=""></path></svg> 
                        </ListItemIcon>
                        <ListItemText primary={`Slack`} />
                    </ListItem>                              
                    <ListItem onClick={(e) => onRedirect(e, '/settings/users')} button>
                        <ListItemIcon aria-label='Users' color='inherit' >
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Users`} />
                    </ListItem>
                    <ListItem onClick={(e) => onRedirect(e, '/settings/professionals')} button>
                        <ListItemIcon aria-label='Professionals' color='inherit'  >
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Professionals`} />
                    </ListItem>
                    <ListItem  onClick={(e) => onRedirect(e, '/settings/documents')} button>
                        <ListItemIcon aria-label='Documents' color='inherit' >
                            <InsertDriveFileIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Documents`} />
                    </ListItem>
                    <ListItem onClick={handleCompanyMenuOpen} className={`children`} button>
                        <ListItemIcon aria-label='Company' color='inherit' className={`children`}>
                            <BusinessIcon className={`children`}/>
                        </ListItemIcon>
                        <ListItemText primary={`Company`} className={`children`}/>                                            
                    </ListItem>
                    <Divider />
                      <List className={classes.childMenu} component='nav'>
                        <ListItem onClick={(e) => onRedirect(e, '/settings/companies/names')} button>
                            <ListItemIcon aria-label='Companies' color='inherit'  >
                                <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText primary={`Names`} />
                        </ListItem>
                        <ListItem onClick={(e) => onRedirect(e, '/settings/companies/addresses')} button>
                            <ListItemIcon aria-label='Companies Address' color='inherit'  >
                                <ContactsIcon />
                            </ListItemIcon>
                            <ListItemText primary={`Address`} />
                        </ListItem>
                        <ListItem onClick={(e) => onRedirect(e, '/settings/companies/lawFirms')} button>
                            <ListItemIcon aria-label='Companies Law Firms' color='inherit'  >
                                <GavelIcon />
                            </ListItemIcon>
                            <ListItemText primary={`Law Firms`} />
                        </ListItem>
                      </List>
                    <Divider />
                    <ListItem onClick={(e) => onRedirect(e, '/settings/lawFirms')} button>
                        <ListItemIcon aria-label='Law Firms' color='inherit'  >
                            <GavelIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Law Firms`} />
                    </ListItem> 
                  </List> 
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
        
      >
        <Home click={hideMenu} closeModal={handleControlModal}/>
      </Modal>
    </AppBar>
  ) 
}

export default NewHeader
