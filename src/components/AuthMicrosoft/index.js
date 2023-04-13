import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import queryString from 'query-string'

import { setTokenStorage } from '../../utils/tokenStorage'

import { 
    setSlackAuthToken
  } from '../../actions/patentTrackActions2'

import PatenTrackApi from '../../api/patenTrack2'

const AuthMicrosoft = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const MICROSOFT_SCOPES = 'https%3A%2F%2Fgraph.microsoft.com%2F.default%20offline_access'
    useEffect(() => {        
        const getAuthToken = async() => {
            const { hash } = location
            console.log(location) 
            if( hash != undefined && hash != '') {
                const querystring = queryString.parse( hash ) 
                if( Object.keys(querystring).length > 0 && querystring.code != ''){  
                    console.log('querystring', querystring)
                    fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/token?client_id=${process.env.REACT_APP_MICROSOFT_CLIENTID}&scope=${MICROSOFT_SCOPES}&code=${querystring.code}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fmicrosoft&client-request-id=c8dddcc9-1925-49ed-8678-444998d243ee&grant_type=authorization_code&x-client-SKU=msal.js.browser&x-client-VER=2.34.0&client_info=1&code_challenge=MhiCfYJ_NJ9odwPB99U5Q58Cczv4-jmNYG6XwMJsSD8&code_challenge_method=S256&nonce=5e7f20b1-394b-4aa4-980e-bf651f688e72&state=eyJpZCI6IjU3ZDhjY2M3LTdjMzgtNGRkYS1iMWMzLWE1MDUzMTJkOWU5NyIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicG9wdXAifX0%3D`,{mode: 'no-cors'}).then((res) => {
                        console.log('res', res)
                        return res.json()
                    })
                    .then((json) => {
                        console.log('json', json)
                    })
                }
            } 
        }

        getAuthToken()         // authenticate code to get token and teamID

    }, [ location, dispatch ])


    return null
}



export default AuthMicrosoft;