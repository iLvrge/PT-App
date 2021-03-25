import axios from 'axios'
import { base_api_url, base_new_api_url } from '../config/config'

class AuthApi {

  static signIn(user) {
    return axios.post(`${base_new_api_url}/signin`, user)
  }

  static forget(user) {
    return axios.post(`${base_api_url}/forgot_password`, user)
  }

  static password_reset(user) {
    return axios.post(`${base_api_url}/update_password_via_email`, user)
  }

  static checkCode(code) {
    return axios.get(`${base_api_url}/reset/${code}`)
  }
  
}

export default AuthApi