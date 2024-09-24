import axios from 'axios'
import { base_api_url, base_new_api_url } from '../config/config'
import getToken from './token' 
import history from '../history'
import {removeTokenStorage, deleteCookie} from '../utils/tokenStorage'
const api = axios.create({
    baseURL: base_new_api_url,
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
  
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
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
                return Promise.reject(refreshError);
            }
        } else if (!error.response) {
            // Handle cases where error.response is undefined (e.g., request cancellations)
            console.log('Request canceled or no response received:', error.message);
            return Promise.reject(error);
        }
        console.log('error.response', error)
        // Handle specific error messages for other status codes
        if (error.response && error.response.status === 403) {
            const errorMessage = error.response.data  ;
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