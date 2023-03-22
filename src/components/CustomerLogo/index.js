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
} from '@mui/material'

import { 
    Business as BusinessIcon, 
    LockOpen as LockOpenIcon, 
  } from '@mui/icons-material'

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
                </span>{/* 
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
                } */}
            </Box> 
    )

}


export default CustomerLogo;