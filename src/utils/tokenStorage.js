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

export const getTokenStorage = ( param ) => {
    return localStorage.getItem( param  )
}

export const removeTokenStorage = ( param ) => {
    return localStorage.removeItem( param  )
}

export const loginRedirect = (authenticated) => {
    if (!authenticated) {
        localStorage.removeItem('google_auth_token_info')
        localStorage.removeItem('slack_auth_token_info')
        window.location.href = 'https://patentrack.com'
    }
}