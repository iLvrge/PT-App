import React, {useEffect} from 'react'
import {  
    useDispatch,
    useSelector 
} from 'react-redux'

import { 
    Avatar, Box, 
} from '@material-ui/core'

import useStyles from './styles' 

import { 
    getProfile, 
} from '../../actions/patenTrackActions'

import { 
    getSlackProfile,
} from '../../actions/patentTrackActions2'

import { getTokenStorage, removeTokenStorage } from '../../utils/tokenStorage'

const CustomerLogo = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
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


    return (
        <Box
            display="flex"
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
    )

}


export default CustomerLogo;