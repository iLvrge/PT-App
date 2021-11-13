import React, {useEffect, useState} from 'react'
import {  
    useDispatch,
    useSelector 
} from 'react-redux'
import { Link, 
    useHistory,
    useLocation
} from 'react-router-dom'
import { 
    Avatar, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, 
} from '@material-ui/core'

import { 
    Business as BusinessIcon, 
    LockOpen as LockOpenIcon, 
  } from '@material-ui/icons'

import useStyles from './styles' 

import { 
    getProfile, 
} from '../../actions/patenTrackActions'

import { 
    getSlackProfile,
} from '../../actions/patentTrackActions2'

import { signOut } from '../../actions/authActions'

import { getTokenStorage, removeTokenStorage } from '../../utils/tokenStorage'
import CompanySummary from '../common/CompanySummary'

const CustomerLogo = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
    const [ slackAuthLogin, setSlackAuthLogin ] = useState( true )    
    const [ openDrawer, setDrawerState] = useState({
        top: false,
        left: false, 
        bottom: false,
        right: false,
    })
    const profile = useSelector(store => (store.patenTrack.profile))
    const slack_profile_data = useSelector( state => state.patenTrack2.slack_profile_data )
    const user = useSelector(store => (store.patenTrack.profile ? store.patenTrack.profile.user : {}))
    

    /**
     * Get the Loggedin User Profile data
     */

    useEffect(() => {
        if (!profile) {
            dispatch(getProfile(true))
        }
    }, [ dispatch, profile ])

    
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
        }
    }, [dispatch, slack_profile_data])

    
    const onHandleForeignAssets = (event) => {
        if(process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ) {
            alert('Message')
        } else {
            const path = location.pathname
            toggleDrawer(event, false)
            /* resetAll()
            clearOtherItems() */
            if(path.indexOf('/review_foreign_assets') !== -1) {
                history.push('/') 
            } else {
                history.push('/review_foreign_assets') 
            }
        }  
    }
    const onHandleGoogleSignout = () => {
        if(window.confirm('Log Out?')){
            removeTokenStorage('google_auth_token_info')
            //setGoogleAuthLogin(true)
        }
    }
  
    const onHandleSlackSignout = () => {
        if(window.confirm('Log Out?')){
            removeTokenStorage('slack_auth_token_info')
            removeTokenStorage('slack_profile_data')
            //setSlackAuthLogin(true)
        }
    }
    
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


    return (
        <>
            <Box
                display="flex"
                onClick={(event) => {toggleDrawer(event, true)}}
            >
                <span /* onClick={(e) => handleControlModal( e, !controlModal )} */ className={classes.companyLogoCon}>
                    {
                        user.organisation 
                        ?  
                            user.organisation.logo != ''
                            ?
                                <img 
                                    src={user.organisation.logo} 
                                    className={classes.userLogoOfficial} 
                                    alt={''} 
                                />
                            :
                                <span 
                                    className={classes.organizationName}
                                >
                                    {user.organisation.name}
                                </span>
                        :
                        ''
                    } 
                </span>
                {
                    slack_profile_data != null && Object.keys(slack_profile_data).length > 0
                    ?
                        <Avatar 
                            className={classes.buttonIcon} 
                            alt={`${slack_profile_data.real_name != '' ? slack_profile_data.real_name : slack_profile_data.profile.real_name != '' ? slack_profile_data.profile.real_name : slack_profile_data.profile.display_name}`} 
                            src={slack_profile_data.profile != null && slack_profile_data.profile.hasOwnProperty('image_24') && slack_profile_data.profile.image_24 != '' ? slack_profile_data.profile.image_24 : user && user.logo != '' ? user.logo : slack_profile_data.real_name.toString().substring(0,1).toLocaleUpperCase() } 
                        />
                    :
                        <Avatar 
                            className={classes.buttonIcon} 
                            alt={`${user ? user.first_name + ' ' + user.last_name : ''}`} 
                            src={user && user.logo != '' ? user.logo : user.first_name.toString().substring(0,1).toLocaleUpperCase() } 
                        />
                }
            </Box>
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
        </>
    )

}


export default CustomerLogo;