import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux' 

import { Box, Button, Paper, Tooltip, Typography, Zoom } from '@mui/material'

import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest, graphConfig } from "./authConfig";

import useStyles from './styles'

import {
    getSlackProfile,
    getMicrosoftProfile,
    setSocialMediaConnectPopup,
    getMicrosoftChannels
} from '../../../actions/patentTrackActions2'

import { getAuthConnectToken, getTokenStorage, removeTokenStorage, setTokenStorage } from '../../../utils/tokenStorage'

import PatenTrackApi from '../../../api/patenTrack2';

import TitleBar from '../TitleBar'
import clsx from 'clsx';

function base64UrlEncode(str) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(digest);
}

function generateCodeVerifier() {
    const array = new Uint32Array(32);
    window.crypto.getRandomValues(array);
    return base64UrlEncode(array);
}


const SocialMediaConnect = () => {

    const classes = useStyles()
    const dispatch = useDispatch();
    const [boxOpened, setBoxOpened] = useState(false)
    const msalInstance = new PublicClientApplication(msalConfig);
    const MICROSOFT_SCOPES = ['https://graph.microsoft.com/Team.Create', 'https://graph.microsoft.com/Directory.ReadWrite.All', 'https://graph.microsoft.com/Group.ReadWrite.All', 'https://graph.microsoft.com/Channel.Create', 'https://graph.microsoft.com/Channel.ReadBasic.All', 'https://graph.microsoft.com/Team.ReadBasic.All', 'https://graph.microsoft.com/TeamMember.ReadWrite.All', 'https://graph.microsoft.com/User.Read']
    const SCOPES = "openid profile offline_access";
    const CLIENT_ID = `${process.env.REACT_APP_MICROSOFT_CLIENTID}`;
    const TENANT_ID = `${process.env.REACT_APP_MICROSOFT_TENANTID}`;
    const REDIRECT_URI = `${process.env.REACT_APP_MICROSOFT_REDIRECT_URL}`;
    const AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
    const TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

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
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY
    
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height
    
        const systemZoom = width / window.screen.availWidth
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
        const codeVerifier = generateCodeVerifier();
        generateCodeChallenge(codeVerifier).then((codeChallenge) => {
            const authorizeUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?response_type=code` +
                `&client_id=${CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
                `&scope=${encodeURIComponent(SCOPES)}` +
                `&code_challenge=${codeChallenge}` +
                `&code_challenge_method=S256`;
        
            // Store the code verifier in local storage to use it later during token exchange
            localStorage.setItem('code_verifier', codeVerifier);
        
            // Redirect the user to the Microsoft login page
            const windowOpen =window.open(authorizeUrl, 'Micosoft Login', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`);

            if(windowOpen != null) {
                checkWindowClosedStatus(windowOpen)
            } 
        });
    
        // const windowOpen = window.open(`https://login.microsoftonline.com/${process.env.REACT_APP_MICROSOFT_TENANTID}/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_MICROSOFT_CLIENTID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REACT_APP_MICROSOFT_REDIRECT_URL)}&response_mode=query&scope=${encodeURIComponent(SCOPES)}`, 'Micosoft Login', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)


        
        /* msalInstance.loginPopup(loginRequest).then(handleResponse).catch(e => {
            console.log(e);
        }); */
        
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

    const onUpdateMicrosoftTeamID =  useCallback( async(token, refreshToken) => {
        const {data} = await PatenTrackApi.getMicrosoftTeam(token, refreshToken)
        console.log('onUpdateMicrosoftTeamID', data)
        if(data != null) {  
            dispatch(getMicrosoftChannels(token, refreshToken, data.teamId))
            setTokenStorage('microsoft_auth_team', JSON.stringify(data)) 
        } else {
            removeTokenStorage('microsoft_auth_team') 
        }
    },[dispatch, getMicrosoftChannels])
    
    const checkWindowClosedStatus = (windowRef) => {
        setTimeout(() => {
            if(windowRef.closed === true) {
                /**
                 * CHECK SOCIAL MEDIA CONNECT AUTH TOKEN
                 */
                const connectionType = getAuthConnectToken()
                console.log('ConnectionType', connectionType)
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
                    } else if(connectionType == 2) {
                        const microsoftTeamToken = getTokenStorage('microsoft_auth_token_info')
                        if(microsoftTeamToken) {
                            const { access_token, refresh_token } = JSON.parse( microsoftTeamToken )
                            if( access_token && access_token != null ) {
                                onUpdateMicrosoftTeamID(access_token, refresh_token)
                                dispatch(getMicrosoftProfile(access_token, refresh_token))
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

    const onClickHandler = (flag) => {
        setBoxOpened(flag)
    }
    return (
        <Paper className={classes.root} square>
            <Box className={clsx(classes.boxTitle, {[classes.flexBox]: boxOpened})}> 
                <TitleBar
                    title={`Log in will enable you to create and manage a team conversation channel dedicated to each patent asset, transaction, and company. All your team members' input will be secured within these channels.`}
                    enablePadding={true} 
                    underline={false} 
                    typography={true}
                    callback={onClickHandler}
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
                    Microsoft
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