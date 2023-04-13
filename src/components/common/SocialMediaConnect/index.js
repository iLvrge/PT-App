import React from 'react'
import { useDispatch } from 'react-redux' 

import { Box, Button, Paper, Tooltip, Typography, Zoom } from '@mui/material'

import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest, graphConfig } from "./authConfig";

import useStyles from './styles'

import {
    getSlackProfile,
    setSocialMediaConnectPopup
} from '../../../actions/patentTrackActions2'

import { getAuthConnectToken, getTokenStorage } from '../../../utils/tokenStorage'

import PatenTrackApi from '../../../api/patenTrack2';

import TitleBar from '../TitleBar'




const SocialMediaConnect = () => {

    const classes = useStyles()
    const dispatch = useDispatch();
    const msalInstance = new PublicClientApplication(msalConfig);
    const MICROSOFT_SCOPES = ['https://graph.microsoft.com/Team.Create', 'https://graph.microsoft.com/Directory.ReadWrite.All', 'https://graph.microsoft.com/Group.ReadWrite.All', 'https://graph.microsoft.com/Channel.Create', 'https://graph.microsoft.com/Channel.ReadBasic.All', 'https://graph.microsoft.com/Team.ReadBasic.All', 'https://graph.microsoft.com/TeamMember.ReadWrite.All', 'https://graph.microsoft.com/User.Read']
    const onHandleSlackLogin = (w,h) => {    
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY
    
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height
    
        const systemZoom = width / window.screen.availWidth
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
    
        const windowOpen = window.open(`https://slack.com/oauth/v2/authorize?scope=${process.env.REACT_APP_SLACK_SCOPE}&user_scope=${process.env.REACT_APP_SLACK_USER_SCOPE}&client_id=${process.env.REACT_APP_SLACK_CLIENTID}&redirect_uri=${process.env.REACT_APP_SLACK_REDIRECT_URL}`, 'Slack Login', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)
    
        if(windowOpen != null) {
            checkWindowClosedStatus(windowOpen)
        } 
    }

    const handleResponse = (response) => {
        console.log('handleResponse', response)
    }

    const onHandleMicrosoftLogin = (w,h) => {    
        /* const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY
    
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height
    
        const systemZoom = width / window.screen.availWidth
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
    
        const windowOpen = window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_MICROSOFT_CLIENTID}&scope=${MICROSOFT_SCOPES}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fmicrosoft&client-request-id=c8dddcc9-1925-49ed-8678-444998d243ee&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=2.34.0&client_info=1&code_challenge=MhiCfYJ_NJ9odwPB99U5Q58Cczv4-jmNYG6XwMJsSD8&code_challenge_method=S256&nonce=5e7f20b1-394b-4aa4-980e-bf651f688e72&state=eyJpZCI6IjU3ZDhjY2M3LTdjMzgtNGRkYS1iMWMzLWE1MDUzMTJkOWU5NyIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicG9wdXAifX0%3D`, 'Micosoft Login', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`) */


        
        msalInstance.loginPopup(loginRequest).then(handleResponse).catch(e => {
            console.log(e);
        });
        
    }

    /* const onHandleMicrosoftLogin = (err, data) => {
        console.log('onHandleMicrosoftLogin', err, data);
    }  */

    const onUpdateTeamID = async(team) => {
        const form = new FormData()
        form.append('team',  team )
        const { status } = await PatenTrackApi.updateSlackTeam(form)
        if (status === 200) {
          /* console.log("Team updated") */
          
        }
    }
    
    const checkWindowClosedStatus = (windowRef) => {
        setTimeout(() => {
            if(windowRef.closed === true) {
                /**
                 * CHECK SOCIAL MEDIA CONNECT AUTH TOKEN
                 */
                const connectionType = getAuthConnectToken()
                if(connectionType > 0) {
                    if(connectionType == 1) {
                        const slackToken = getTokenStorage( 'slack_auth_token_info' )
                        if(slackToken && slackToken != '') {
                            const { access_token, team, id } = JSON.parse( slackToken )
                            if( access_token && access_token != null ) {
                                /**
                                 * Set team ID
                                 */
                                onUpdateTeamID(team)
                                dispatch(getSlackProfile(access_token, id))
                            }
                        }
                    }
                    dispatch(setSocialMediaConnectPopup(false))
                }
            } else {
                checkWindowClosedStatus(windowRef)
            }
        }, 500)
    }

    const SlackIcon = () => {
        return (
            <img 
                alt='Sign in with Slack' 
                src='https://patentrack.com/wp-content/uploads/2022/01/slack-logo.svg' 
            />              
        )
    }

    const MicrosoftIcon = () => {
        return (
            <img 
                alt='Sign in with Microsoft' 
                src='https://patentrack.com/wp-content/uploads/2022/01/microsoft-logo.svg' 
            />              
        )
    }
    console.log("MICROSOFT_SCOPES", MICROSOFT_SCOPES)
    return (
        <Paper className={classes.root} square>
            <Box style={{width: '100%'}}> 
                <TitleBar
                    title={`Log in will enable you to create and manage a team conversation channel dedicated to each patent asset, transaction, and company. All your team members' input will be secured within these channels.`}
                    enablePadding={true} 
                    underline={false} 
                    typography={true}
                />
            </Box>
            <Box className={classes.box}>
                <Button
                    color="inherit" 
                    onClick={() => onHandleSlackLogin(900, 830) }
                    className={classes.button}
                    startIcon={<SlackIcon className={classes.icon} />} 
                >
                    Slack
                </Button>
                <Button
                    color="inherit" 
                    onClick={() => onHandleMicrosoftLogin(900, 830) }
                    className={classes.button}
                    startIcon={<MicrosoftIcon className={classes.icon} />} 
                >
                    Slack
                </Button>
                {/* <MicrosoftLogin 
                    clientId={process.env.REACT_APP_MICROSOFT_CLIENTID} 
                    authCallback={onHandleMicrosoftLogin} 
                    withUserData={true}
                    buttonTheme={'dark'} 
                    graphScopes={MICROSOFT_SCOPES}
                    prompt={'consent'}
                /> */}
            </Box>
        </Paper>
    )
}




export default SocialMediaConnect