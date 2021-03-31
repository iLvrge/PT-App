import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import queryString from 'query-string'

import { setTokenStorage } from '../../utils/tokenStorage'

import { 
    setSlackAuthToken
  } from '../../actions/patentTrackActions2'

import PatenTrackApi from '../../api/patenTrack2'

const AuthSlack = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {        
        const getAuthToken = async() => {
            const { search } = location
            if( search != undefined && search != '') {
                const querystring = queryString.parse( search )
                if( Object.keys(querystring).length > 0 && querystring.code != '' ){                    
                    const { data } = await PatenTrackApi.getSlackAuthToken( querystring.code, process.env.REACT_APP_SLACK_REDIRECT_URL )
                    if( data != null ) {
                        setTokenStorage( 'slack_auth_token_info' , JSON.stringify(data) )                        
                        dispatch(setSlackAuthToken( data ))
                    }
                    window.close()
                }
            } 
        }

        getAuthToken()         // authenticate code to get token and teamID

    }, [ location, dispatch ])


    return null
}



export default AuthSlack;