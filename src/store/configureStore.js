import { applyMiddleware, createStore } from 'redux'
import logger from "redux-logger";
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

import jwt_decode from 'jwt-decode'
import { loginSuccess, getCookie } from '../actions/authActions'
import { setSlackAuthToken, getSlackProfile, setAuthenticateAuthToken } from '../../actions/patentTrackActions2'

import { setTokenStorage, getTokenStorage } from '../utils/tokenStorage'

import AuthApi from '../../api/authApi'

/* const store = createStore(rootReducer, applyMiddleware(thunk, logger)) */
const store = createStore(rootReducer, applyMiddleware(thunk))

if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
  let location = window.location.pathname

  if(location && location != 'blank') {
    (async() => {
      location = location.replace('/', '')
      if( location != '') {
        const { data } = await AuthApi.signInWithShareCode(location.replace('/', ''), process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ? 0 : 2)
      
        if( data && data != null ) { 
          if(data.accessToken != null ) {
            const decoded_token = jwt_decode(data.accessToken)            
            localStorage.setItem('auth_signature', data.accessToken)
            store.dispatch(setAuthenticateAuthToken(data.accessToken))
            store.dispatch(loginSuccess(decoded_token))
    
            let slackToken = null
            let slack_auth_token_info = getCookie('slack_auth_token_info')
            if( slack_auth_token_info != null ) {
              if(typeof slack_auth_token_info === 'string'){
                slack_auth_token_info = JSON.parse(slack_auth_token_info) 
              }
              setTokenStorage( 'slack_auth_token_info', slack_auth_token_info)
              store.dispatch(setSlackAuthToken(slack_auth_token_info))
              if(typeof slack_auth_token_info === 'string'){
                slackToken = JSON.parse(slack_auth_token_info)      
              }
            } else {
              slackToken = getTokenStorage('slack_auth_token_info')
              if( slackToken != '' && slackToken != null ) {
                slackToken = JSON.parse(slackToken)
              }  
            }
    
            if( slackToken != null ) {
              if(typeof slackToken === 'string'){
                slackToken = JSON.parse(slackToken) 
              }
    
              const { access_token, id} = slackToken
              if( access_token != null && id != null ) {
                store.dispatch(getSlackProfile(access_token, id))
              }
            } 
          } else {
            window.location.href = 'https://patentrack.com'
          }      
        } else {
          window.location.href = 'https://patentrack.com'
        }
      } else {
        window.location.href = 'https://patentrack.com'
      }    
    })()
  } else {
    window.location.href = 'https://patentrack.com'
  } 
} else {
  let token = localStorage.getItem('token')
  if (token === null) {
    token = getCookie('token')
  }
  if (token) {
    const decoded_token = jwt_decode(token)
    let slackToken = null
    const slack_auth_token_info = getCookie('slack_auth_token_info')
    if( slack_auth_token_info != null ) {
      setTokenStorage( 'slack_auth_token_info', slack_auth_token_info)
      store.dispatch(setSlackAuthToken(slack_auth_token_info))
      slackToken = JSON.parse(slack_auth_token_info)      
    } else {
      slackToken = getTokenStorage('slack_auth_token_info')
      if( slackToken != '' && slackToken != null ) {
        slackToken = JSON.parse(slackToken)
      }  
    }

    if( slackToken != null ) {
      if(typeof slackToken === 'string'){
        slackToken = JSON.parse(slackToken) 
      }
      const { access_token, id} = slackToken
      if( access_token != null && id != null ) {
        store.dispatch(getSlackProfile(access_token, id))
      }
    }
    store.dispatch(loginSuccess(decoded_token))
  }
}

export default store
