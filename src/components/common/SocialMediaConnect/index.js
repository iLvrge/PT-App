import React from 'react'
import { Button, Paper, Tooltip, Typography, Zoom } from '@mui/material'

import useStyles from './styles'
import { getAuthConnectToken } from '../../../utils/tokenStorage'




const SocialMediaConnect = () => {

    const classes = useStyles()

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
    
    const checkWindowClosedStatus = (windowRef) => {
        setTimeout(() => {
            if(windowRef.closed === true) {
                /**
                 * CHECK SOCIAL MEDIA CONNECT AUTH TOKEN
                 */
                const getConnection = getAuthConnectToken()
                console.log('getConnection', getConnection)
            } else {
                checkWindowClosedStatus(windowRef)
            }
        }, 500)
    }

    return (
        <Paper className={classes.root} square>
            <Tooltip 
                title={
                  <Typography color="inherit" variant='body2'>{/* Once you sign in to your Slack Workspace, we will create for you a dedicated channel in your Workspace for each of the patents and application in the Assets list. Just select an asset and start writing to your Workspace members in the text bar below.<br/>Whatever you write will be saved only in your Slack Workspace. */}Sign in to your Slack account</Typography>
                } 
                className={classes.tooltip}  
                placement='left'
                enterDelay={0}
                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
            >
                <Button 
                    onClick={() => onHandleSlackLogin(900, 830) }
                >
                    <img 
                        alt='Sign in with Slack' 
                        src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/sign_in_with_slack_new.png' 
                    />
                </Button>
            </Tooltip>
            <Tooltip 
                title={
                  <Typography color="inherit" variant='body2'>{/* Once you sign in to your Slack Workspace, we will create for you a dedicated channel in your Workspace for each of the patents and application in the Assets list. Just select an asset and start writing to your Workspace members in the text bar below.<br/>Whatever you write will be saved only in your Slack Workspace. */}Sign in to your Microsoft account</Typography>
                } 
                className={classes.tooltip}  
                placement='left'
                enterDelay={0}
                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
            >
                <Button 
                    onClick={() => onHandleSlackLogin(900, 830) }
                >
                    <img 
                        alt='Sign in with Microsoft' 
                        src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/sign_in_microsoft_new.png' 
                    />
                </Button>
            </Tooltip>
        </Paper>
    )
}




export default SocialMediaConnect