import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import GoogleLogin from 'react-google-login'
import useStyles from './styles'
import {
    getGoogleAuthToken,
  } from '../../../actions/patentTrackActions2'

import { setTokenStorage } from '../../../utils/tokenStorage'

const Googlelogin = () => {

    const classes = useStyles()
    const dispatch = useDispatch()

    const responseGoogle = useCallback((response) => {
        const { code } = response
        console.log("response", response)
        if(code != undefined) {
            setTokenStorage( 'google_auth_token_info', code )
            dispatch( getGoogleAuthToken( code ) )
        }
    }, [ dispatch ])

    return(
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
            buttonText="Login with Google"
            offline={true}
            accessType="offline"
            approvalPrompt="force"
            scope={process.env.REACT_APP_GOOGLE_SCOPE}
            responseType="code"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            className={`${classes.googleButton} googleButton`}  
            style={{width: '800px'}}            
        >
        </GoogleLogin> 
    )
}

export default Googlelogin



/*
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import GoogleLogin from 'react-google-login'
import useStyles from './styles'
import {
    getGoogleAuthToken,
  } from '../../../actions/patentTrackActions2'

import { setTokenStorage } from '../../../utils/tokenStorage'
import clsx from 'clsx'

const Googlelogin = (props) => {
    console.log("props", props)
    const classes = useStyles()
    const dispatch = useDispatch()

    const responseGoogle = useCallback((response) => {
        const { code } = response
        console.log(response)
        if(code != undefined) {
            setTokenStorage( 'google_auth_token_info', code )
            dispatch( getGoogleAuthToken( code ) )
        }
    }, [ dispatch ])

    return(
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
            buttonText="Login with Google"
            offline={true}
            accessType="offline"
            approvalPrompt="force"
            uxMode={props.standalone === 1 ? 'redirect' :  'popup'}
            scope={process.env.REACT_APP_GOOGLE_SCOPE}
            responseType="code"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            className={clsx({[classes.googleWindowButton]: props.standalone === 1 ? true :  false}, {[classes.googleButton]: props.standalone === 1 ? false :  true}, {['googleButton']: props.standalone === 1 ? false :  true})}  
            style={{width: '800px'}}            
        >
        </GoogleLogin> 
    )
}

export default Googlelogin
 */