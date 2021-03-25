import { applyMiddleware, createStore } from 'redux'
import logger from "redux-logger";
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

import jwt_decode from 'jwt-decode'
import { loginSuccess, getCookie } from '../actions/authActions'
import { setSlackAuthToken } from '../../actions/patentTrackActions2'
import { setTokenStorage } from '../utils/tokenStorage'

const store = createStore(rootReducer, applyMiddleware(thunk, logger))

let token = localStorage.getItem('token')
console.log("configureStore1", token)
if (token === null) {
  token = getCookie('token')
  console.log("getCookie1", token)
}
 
if (token) {
  const decoded_token = jwt_decode(token)

  const slack_auth_token_info = getCookie('slack_auth_token_info')
  if( slack_auth_token_info != null ) {
    setTokenStorage( 'slack_auth_token_info', slack_auth_token_info)
    store.dispatch(setSlackAuthToken(slack_auth_token_info))
  }

  store.dispatch(loginSuccess(decoded_token))
}
export default store
