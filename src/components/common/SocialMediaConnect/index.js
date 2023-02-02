import React from 'react'
import { useDispatch } from 'react-redux'

import { Box, Button, Paper, Tooltip, Typography, Zoom } from '@mui/material'

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
    const dispatch = useDispatch()
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

    const onHandleMicrosoftLogin = (w,h) => {
        
    }

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
                    dispatch(setSocialMediaConnectPopup(true))
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

    return (
        <Paper className={classes.root} square>
            <Box style={{width: '100%'}}>
                <TitleBar
                    title={`Please log in: `}
                    enablePadding={true} 
                    underline={false} 
                />
            </Box>
            <Box className={classes.box}>
                <Tooltip 
                    title={
                    <Typography color="inherit" variant='body2'>{/* Once you sign in to your Slack Workspace, we will create for you a dedicated channel in your Workspace for each of the patents and application in the Assets list. Just select an asset and start writing to your Workspace members in the text bar below.<br/>Whatever you write will be saved only in your Slack Workspace. */}Sign in to your Slack account</Typography>
                    } 
                    className={classes.tooltip}  
                    placement='top'
                    enterDelay={0}
                    TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                > 
                    <Button
                        color="inherit" 
                        onClick={() => onHandleSlackLogin(900, 830) }
                        className={classes.button}
                        startIcon={<SlackIcon className={classes.icon} />} 
                    >
                        Slack
                    </Button>
                </Tooltip>
                <Tooltip 
                    title={
                    <Typography color="inherit" variant='body2'>{/* Once you sign in to your Slack Workspace, we will create for you a dedicated channel in your Workspace for each of the patents and application in the Assets list. Just select an asset and start writing to your Workspace members in the text bar below.<br/>Whatever you write will be saved only in your Slack Workspace. */}Sign in to your Microsoft account</Typography>
                    } 
                    className={classes.tooltip}  
                    placement='top'
                    enterDelay={0}
                    TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                >
                    <Button
                        color="inherit" 
                        onClick={() => onHandleMicrosoftLogin(900, 830) }
                        className={classes.button}
                        startIcon={<MicrosoftIcon className={classes.icon} />} 
                    >
                        Microsoft
                    </Button>
                </Tooltip>
            </Box>
            <TitleBar
                title={`Log in will enable you to create and manage a team conversation channel dedicated to each patent asset, transaction, and company. All your team members' input will be secured within these channels.`}
                enablePadding={true} 
                underline={false} 
                typography={true}
            />
        </Paper>
    )
}




export default SocialMediaConnect