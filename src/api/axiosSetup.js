import axios from 'axios'
import { base_api_url, base_new_api_url } from '../config/config'
import getToken from './token' 
import history from '../history'
import {removeTokenStorage, deleteCookie} from '../utils/tokenStorage'
import { refreshMicrosoftToken } from '../components/AuthMicrosoft'
import { problemMessage, problemType, problemFields, problemRequestId, retryAfterSeconds } from './problem'
const api = axios.create({
    baseURL: base_new_api_url,
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Every failure the API returns is an RFC 7807 problem document. It is
        // read once here so no caller has to know the body's shape: the
        // message to show, the stable `type` to branch on, the field errors,
        // and the request id worth quoting in a bug report. problem.js falls
        // back to the older { error: { message } } envelope, so this build
        // works against an API that has not taken the change yet.
        if (error.response) {
            error.problem = {
                type: problemType(error),
                message: problemMessage(error),
                fields: problemFields(error),
                requestId: problemRequestId(error),
                status: error.response.status,
                retryAfter: retryAfterSeconds(error),
            }
        }
        // The refresh call itself goes through this same interceptor. The API
        // answers a missing/invalid/expired token with 401 (never 403), so
        // without this guard a failed refresh re-entered this branch, tried to
        // refresh the refresh, and so on — dozens of /refresh-token calls
        // firing in a tight loop within milliseconds until the rate limiter
        // cut it off. Excluding the refresh request from retry-on-401 breaks
        // the loop; its own failure is handled in the catch block below.
        const isRefreshCall = originalRequest && originalRequest.url === '/refresh-token';

        if (error.response && error.response.status === 401 && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;
            // Was comparing the response *body* — an object — against a
            // string, so it never matched. Compare the message the API sent.
            const errorMessage = error.problem ? error.problem.message : error.response.data;
            if(errorMessage == "Refresh microsoft token") {
                try { 
                    const tokenString = localStorage.getItem('microsoft_auth_token_info');
                    const tokenData = JSON.parse(tokenString);
                    const response = await refreshMicrosoftToken(tokenData.refresh_token); 
                    if (response) { 
                        localStorage.setItem('microsoft_auth_token_info', JSON.stringify(response)); 
                        originalRequest.headers['X-Microsoft-Auth-Token'] = response.access_token 
                        originalRequest.headers['X-microsoft-refresh-token'] = response.refresh_token 
                        axios.defaults.headers.common['X-Microsoft-Auth-Token'] = response.access_token
                        axios.defaults.headers.common['X-microsoft-refresh-token'] = response.refresh_token
                        return api(originalRequest); 
                    }
                } catch (refreshError) {
                    console.log('microsoft CATCH', refreshError)
                    return Promise.reject(refreshError);
                }
            } else { 
                try {
                    const response = await api.get('/refresh-token', {
                        headers: {
                          'x-auth-token': getToken()
                        }
                    });
                    const { accessToken } = response.data;
    
                    document.cookie = `token=${accessToken};domain=.patentrack.com`   
                    localStorage.setItem('token', accessToken)    
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
    
                    return api(originalRequest);
                } catch (refreshError) {
                    console.log('CATCH', refreshError)
                    // No valid session left to recover — the previous 403-only
                    // logout below never fired for this API, which only ever
                    // answers 401 here, so the app was left showing a blank
                    // screen instead of the sign-in page.
                    removeTokenStorage('token')
                    deleteCookie('token')
                    history.push('/auth')
                    window.location = window.location.href
                    return Promise.reject(refreshError);
                }
            }
        } else if (!error.response) {
            // No response at all: a cancellation, a timeout, or the network is
            // down. Tag the error so callers can tell "you are offline" apart
            // from "the server said no" without re-sniffing error strings.
            // Control flow is unchanged: the rejection still propagates as before.
            if (!axios.isCancel(error)) {
                error.isNetworkError = true
                error.isOffline =
                    typeof navigator !== 'undefined' && navigator.onLine === false
            }
            console.log('Request canceled or no response received:', error.message);
            return Promise.reject(error);
        }
        console.log('error.response', error)
        // Handle specific error messages for other status codes
        if (error.response && error.response.status === 403) {
            const errorMessage = error.problem ? error.problem.message : error.response.data;
            if(errorMessage == 'Refresh token failed') {
                removeTokenStorage('token') 
                deleteCookie('token')
                history.push('/auth')
                window.location = window.location.href
            } 
            return Promise.reject(error)
        } 
        return Promise.reject(error);
    }
);

export const createCancelToken = () => {
    return axios.CancelToken.source();
};
  
export default api;