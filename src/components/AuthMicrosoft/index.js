import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom' 

import { setTokenStorage } from '../../utils/tokenStorage'

import { 
    setMicirosoftAuthToken
  } from '../../actions/patentTrackActions2'
import axios from 'axios'
 


async function exchangeCodeForToken(authCode) {
    const CLIENT_ID = `${process.env.REACT_APP_MICROSOFT_CLIENTID}`;
    const TENANT_ID = `${process.env.REACT_APP_MICROSOFT_TENANTID}`;
    const REDIRECT_URI = `${process.env.REACT_APP_MICROSOFT_REDIRECT_URL}`;  
    const codeVerifier = localStorage.getItem('code_verifier');
    const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

    const data = {
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
    };

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    });

    const tokenData = await response.json();
    return tokenData;
}

const AuthMicrosoft = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    useEffect(() => {        
        const getAuthToken = async() => {
            const { search } = location
            if( search != undefined && search != '') {
                const urlParams = new URLSearchParams(window.location.search);
                const authCode = urlParams.get('code');
                if( authCode && authCode != ''){  
                    exchangeCodeForToken(authCode).then((tokenData) => { 
                        localStorage.setItem('microsoft_auth_token_info', JSON.stringify(tokenData))
                        setTokenStorage( 'microsoft_auth_token_info' , JSON.stringify(tokenData) ) 
                        dispatch(setMicirosoftAuthToken( tokenData ))   
                        window.close() 
                    }).catch(() => {
                        window.close()
                    }); 
                }
            } 
        }
        getAuthToken()
    }, [ location, dispatch ]) 

    return null
}

export async function refreshMicrosoftToken(refreshToken) {
    try {
        const CLIENT_ID = `${process.env.REACT_APP_MICROSOFT_CLIENTID}`;
        const TENANT_ID = `${process.env.REACT_APP_MICROSOFT_TENANTID}`;
        const REDIRECT_URI = `${process.env.REACT_APP_MICROSOFT_REDIRECT_URL}`;   
        const response = await axios.post(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, new URLSearchParams({
            client_id: CLIENT_ID,
            scope: 'https://graph.microsoft.com/.default',
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
}

export default AuthMicrosoft;