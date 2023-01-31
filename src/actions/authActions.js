import * as types from './actionTypes'
import AuthApi from '../api/authApi'
import jwt_decode from 'jwt-decode'

import { initEnvironment } from './patenTrackActions'

const setToken = async token => {
  document.cookie = `token=${token};domain=.patentrack.com`
  return await localStorage.setItem('token', token)
}

export const deleteCookie = name => {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.patentrack.com;';
}

export const getCookie = name => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const loginSuccess = user => {
  return {
    type: types.LOGIN_SUCCESS,
    user,
  }
}

export const authEmailSuccess = sent => {
  return {
    type: types.AUTH_EMAIL_SUCCESS,
    sent: sent,
  }
}

export const codeAuthenticatSuccess = code => {
  return {
    type: types.AUTH_CODE_SUCCESS,
    isLoadingReset: false,
    code,
  }
}

export const passwordResetSuccess = code => {
  return {
    type: types.PASSWORD_RESET_SUCCESS,
    isLoadingReset: true,
    code: '',
    password_reset: true,
  }
}

export const signOutSuccess = () => {
  return {
    type: types.SIGN_OUT_SUCCESS,
  }
}

export const login = user => {
  return dispatch => {
    return AuthApi.signIn(user)
      .then(res => {
        setToken(res.data.accessToken)        
        const decoded_token = jwt_decode(res.data.accessToken)
        
        dispatch(initEnvironment())
        dispatch(loginSuccess(decoded_token))
      })
      .catch(err => {
        throw err
      })
  }
}

export const forget = user => {
  return dispatch => {
    return AuthApi.forget(user)
      .then(res => {
        dispatch(authEmailSuccess(true))
      })
      .catch(err => {
        throw err
      })
  }
}

export const checkCode = code => {
  return dispatch => {
    return AuthApi.checkCode(code)
      .then(res => {
        dispatch(codeAuthenticatSuccess(res.data.token))
      })
      .catch(err => {
        throw err
      })
  }
}

export const passwordReset = user => {
  return dispatch => {
    return AuthApi.password_reset(user)
      .then(res => {
        dispatch(passwordResetSuccess(res.data))
      })
      .catch(err => {
        throw err
      })
  }
}

export const signOut = () => {
  deleteCookie('token')
  localStorage.removeItem('token')
  console.log("------signOut------------------")
  return dispatch => {    
    return dispatch(signOutSuccess())
  }
}
