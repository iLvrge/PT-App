import PatenTrackApi from "../api/patenTrack2"

export const setSlackAuthCode = (code) => {
    localStorage.setItem('slack_auth_token_info', code)
}

export const getSlackAuthCode = () => {
    return localStorage.getItem('slack_auth_token_info')
}

export const removeSlackAuthCode = () => {
    return localStorage.removeItem('slack_auth_token_info')
}

export const setGoogleAuthCode = (code) => {
    localStorage.setItem('google_auth_token_info', code)
}

export const getGoogleAuthCode = () => {
    return localStorage.getItem('google_auth_token_info')
}

export const removeGoogleAuthCode = () => {
    return localStorage.removeItem('google_auth_token_info')
}

export const setTokenStorage = ( param, code ) => {
    localStorage.setItem( param , code)
} 

export const getTokenStorage = (param) => {
    return localStorage.getItem(param);
};

export const removeTokenStorage = ( param ) => {
    return localStorage.removeItem( param  )
}

export const loginRedirect = (authenticated) => {
    if (!authenticated) {
        localStorage.removeItem('google_auth_token_info')
        localStorage.removeItem('slack_auth_token_info')
        localStorage.removeItem('microsoft_auth_token_info')
        localStorage.removeItem('microsoft_auth_team')
        window.location.href = 'https://patentrack.com'
    }
}

export const getAuthConnectToken = () => {
    let tokenType = 0
    try {
        const getSlackToken = localStorage.getItem('slack_auth_token_info')
        const tokenJSON = JSON.parse( getSlackToken )

        if( tokenJSON != null ) {
            tokenType = 1
        } else {
            const getMicrosoftToken = localStorage.getItem('microsoft_auth_token_info')
            const teamTokenJSON = JSON.parse( getMicrosoftToken )
            if( teamTokenJSON != null ) {
                tokenType = 2
            }
        }
    } catch (err) {
        console.warn(`Issue which retreiving token: ${err}`)
    }
    return tokenType
}

export const getMicrosoftTokenWithTeamId = () => {
    const getMicrosoftToken = getTokenStorage('microsoft_auth_token_info');
    const getTeamData = getTokenStorage('microsoft_auth_team')
    const {access_token, refresh_token} = JSON.parse( getMicrosoftToken )
    const {teamId} = JSON.parse(getTeamData)

    return {
        access_token,
        refresh_token,
        teamId
    }
}

export const getSlackToken = () => {
    let token =  '';
    const slackToken = getTokenStorage( 'slack_auth_token_info' )
    if(slackToken && slackToken!= '' && slackToken!= null && slackToken!= 'null' ) {
      token = JSON.parse(slackToken)
        
      if(typeof token === 'string') {
        token = JSON.parse(token)
      }
    }
    return token
}

export const deleteCookie = name => {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.patentrack.com;';
}