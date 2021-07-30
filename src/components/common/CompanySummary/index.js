import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PatenTrackApi from '../../../api/patenTrack2'
import { capitalize, numberWithCommas } from '../../../utils/numbers'
import { getTokenStorage } from '../../../utils/tokenStorage'

import { 
    getGoogleProfile,
} from '../../../actions/patentTrackActions2'

import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import useStyles from './styles'
import Typography from '@material-ui/core/Typography'


const ShowData = ({ data, number, c }) => {  
    return (
      <Typography variant="body1">
        <span className={c.relativeIcon}>
        {
            data == 'companies'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M46.4 7.8L34.9 6.1V1c0-.6-.4-1-1-1H1.8c-.6 0-1 .4-1 1v46c0 .6.4 1 1 1h44.5c.6 0 1-.4 1-1V8.8c-.1-.5-.4-.9-.9-1zM19.9 46h-4.1v-6h4.1v6zm13 0h-11v-7c0-.6-.4-1-1-1h-6.1c-.6 0-1 .4-1 1v7h-11V2h30.1v44zm2 0V8.1l10.4 1.6v4.9h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7v6.2h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7V31h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7v6.2h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7V46H34.9z"></path><path d="M21.5 9h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 16.8h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 24.6h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 32.4h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM25.2 41.9c0 .6.4 1 1 1h2.7c.6 0 1-.4 1-1s-.4-1-1-1h-2.7c-.6 0-1 .5-1 1zM6.8 42.9h2.7c.6 0 1-.4 1-1s-.4-1-1-1H6.8c-.6 0-1 .4-1 1s.5 1 1 1zM8.2 9h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 16.8h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 24.6h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 32.4h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1z"></path></svg>
            :
            data == 'activites'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="noStroke"><path d="M0 0h24v24H0z" fill="none"></path><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"></path></svg>
            :
            data == 'parties'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="noStroke"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"></path></svg>
            :
            data == 'employees'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" class="noStroke"><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M13,8.57c-0.79,0-1.43,0.64-1.43,1.43s0.64,1.43,1.43,1.43s1.43-0.64,1.43-1.43S13.79,8.57,13,8.57z"></path><path d="M13,3C9.25,3,6.2,5.94,6.02,9.64L4.1,12.2C3.85,12.53,4.09,13,4.5,13H6v3c0,1.1,0.9,2,2,2h1v3h7v-4.68 c2.36-1.12,4-3.53,4-6.32C20,6.13,16.87,3,13,3z M16,10c0,0.13-0.01,0.26-0.02,0.39l0.83,0.66c0.08,0.06,0.1,0.16,0.05,0.25 l-0.8,1.39c-0.05,0.09-0.16,0.12-0.24,0.09l-0.99-0.4c-0.21,0.16-0.43,0.29-0.67,0.39L14,13.83c-0.01,0.1-0.1,0.17-0.2,0.17h-1.6 c-0.1,0-0.18-0.07-0.2-0.17l-0.15-1.06c-0.25-0.1-0.47-0.23-0.68-0.39l-0.99,0.4c-0.09,0.03-0.2,0-0.25-0.09l-0.8-1.39 c-0.05-0.08-0.03-0.19,0.05-0.25l0.84-0.66C10.01,10.26,10,10.13,10,10c0-0.13,0.02-0.27,0.04-0.39L9.19,8.95 c-0.08-0.06-0.1-0.16-0.05-0.26l0.8-1.38c0.05-0.09,0.15-0.12,0.24-0.09l1,0.4c0.2-0.15,0.43-0.29,0.67-0.39l0.15-1.06 C12.02,6.07,12.1,6,12.2,6h1.6c0.1,0,0.18,0.07,0.2,0.17l0.15,1.06c0.24,0.1,0.46,0.23,0.67,0.39l1-0.4c0.09-0.03,0.2,0,0.24,0.09 l0.8,1.38c0.05,0.09,0.03,0.2-0.05,0.26l-0.85,0.66C15.99,9.73,16,9.86,16,10z"></path></g></g></svg>
            :
            data == 'transactions'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" class="noStroke"><g><rect fill="none" height="24" width="24" x="0" y="0"></rect></g><g><g><path d="M9,21h9c0.83,0,1.54-0.5,1.84-1.22l3.02-7.05C22.95,12.5,23,12.26,23,12v-2c0-1.1-0.9-2-2-2h-6.31l0.95-4.57l0.03-0.32 c0-0.41-0.17-0.79-0.44-1.06L14.17,1L7.58,7.59C7.22,7.95,7,8.45,7,9v10C7,20.1,7.9,21,9,21z M9,9l4.34-4.34L12,10h9v2l-3,7H9V9z M1,9h4v12H1V9z"></path></g></g></svg>
            :
            data == 'assets'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="noStroke"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"></path></svg>
            :
            data == 'rights'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M51.258 62.386a.996.996 0 0 1-.707-.293l-8.279-8.28 1.414-1.414 7.572 7.573 7.568-7.573 1.414 1.414-8.275 8.28a1.003 1.003 0 0 1-.707.293z"/><path d="M52.254 60.271h-2V40.313c0-4.698-3.822-8.521-8.52-8.521h-10.67v-2h10.67c5.801 0 10.52 4.72 10.52 10.521v19.958z"/><path d="M32.9 31.792H22.261c-5.801 0-10.52-4.719-10.52-10.519V2.614h2v18.659c0 4.697 3.822 8.519 8.52 8.519H32.9v2zM12.741 62.386c-.265 0-.52-.105-.708-.293l-8.275-8.28 1.415-1.414 7.568 7.573 7.571-7.573 1.414 1.414-8.278 8.28a1.002 1.002 0 01-.707.293z"/><path d="M11.744 34.009h2v26.265h-2z"/></svg>
            :
            data == 'documents'
            ?
                <svg xmlns="http://www.w3.org/2000/svg" className='addStroke' enable-background="new 0 0 30 30" version="1.1" viewBox="0 0 30 30"><g><path d="M28.595,7.562l-5.438-6.309l-1.078-1.25H9.228c-1.727,0-3.124,1.397-3.124,3.124v3.971H8.04l-0.001-3.21   c0.004-0.971,0.784-1.756,1.752-1.756l10.994-0.01v5.208c0.001,1.939,1.567,3.51,3.507,3.51h3.807L27.91,25.86   c-0.004,0.967-0.784,1.747-1.752,1.754L9.652,27.606c-0.883,0-1.594-0.866-1.6-1.935V24.4H6.114v1.896   c0,1.907,1.277,3.455,2.845,3.455l17.763-0.005c1.726,0,3.124-1.404,3.124-3.126V9.016L28.595,7.562" fill="#292929"></path><path d="M20.145,25.368H0V6.129h20.145V25.368 M1.934,23.432h16.274V8.065H1.934"></path><path d="M10.314,9.069   c0.305,0.141,0.242,0.328,0.148,1.201c-0.097,0.905-0.414,2.554-1.032,4.173c-0.616,1.622-1.529,3.21-2.325,4.39   c-0.797,1.178-1.478,1.943-1.998,2.386c-0.519,0.441-0.882,0.559-1.115,0.599c-0.233,0.04-0.339,0-0.405-0.117   c-0.063-0.118-0.084-0.315-0.031-0.551c0.053-0.234,0.181-0.51,0.542-0.863c0.36-0.354,0.956-0.785,1.785-1.188   c0.829-0.402,1.891-0.775,2.762-1.031s1.551-0.393,2.146-0.5c0.595-0.108,1.104-0.187,1.604-0.226c0.5-0.04,0.988-0.04,1.467,0   c0.478,0.039,0.945,0.117,1.348,0.216c0.406,0.097,0.745,0.217,1.042,0.402c0.299,0.187,0.552,0.441,0.681,0.726   c0.127,0.286,0.127,0.6,0.021,0.825c-0.105,0.227-0.318,0.364-0.563,0.441c-0.246,0.08-0.522,0.099-0.851,0   c-0.33-0.098-0.712-0.314-1.115-0.599c-0.404-0.284-0.829-0.638-1.381-1.187c-0.553-0.551-1.232-1.298-1.807-2.023   c-0.573-0.727-1.041-1.434-1.358-2.033c-0.319-0.599-0.489-1.09-0.627-1.582c-0.138-0.491-0.244-0.98-0.287-1.422   c-0.043-0.443-0.021-0.837,0.021-1.149c0.042-0.315,0.106-0.55,0.213-0.708c0.106-0.157,0.256-0.235,0.362-0.275   s0.169-0.04,0.234-0.049c0.063-0.009,0.126-0.029,0.222,0c0.094,0.03,0.216,0.104,0.34,0.18" fill="none" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.75"></path></g></svg>
            :
            ''
        }  
        </span>
        {number === true ? numberWithCommas(data) : capitalize(data.split('_').join(' ').trim())}
      </Typography>
    )
} 

const CompanySummary = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [companyData, setCompanyData] = useState({companies: 0, activites: 0, parties: 0, employees: 0, transactions: 0, assets: 0, rights: 0, documents: 0})
    const google_profile = useSelector(state => state.patenTrack2.google_profile)
    const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)


    useEffect(() => {
        const findSummary = async() => {
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            let access_token = '', user_email = ''
            if( googleToken && googleToken != '' && googleToken != null ) {
                const tokenParse = JSON.parse( googleToken )
                if( tokenParse && Object.keys(tokenParse).length > 0 ) {
                    access_token = tokenParse.access_token
                } 
                
                let profileInfo = google_profile
                if(profileInfo == null) {
                  const getGoogleProfile = getTokenStorage('google_profile_info')
                  if( getGoogleProfile != '') {
                    profileInfo = JSON.parse(getGoogleProfile)
                  }
                }
                if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                    user_email = profileInfo.email
                }
                getSummaryData(access_token, user_email)
            } else {
                openGoogleWindow()
            }            
        }
        findSummary()
    }, [])

    useEffect(() => {
        if(google_profile != null && google_profile.hasOwnProperty('email') && google_auth_token != null ) {
            getSummaryData(google_auth_token.access_token, google_profile.email)
        }  else if( google_profile == null && google_auth_token != null ) {
            dispatch(getGoogleProfile(google_auth_token.access_token))  
        }
    }, [google_profile, google_auth_token])

    const openGoogleWindow = () => {
        if(document.getElementsByClassName('googleButton').length > 0) {
            document.getElementsByClassName('googleButton')[0].click()
        }
    }

    const getSummaryData = async(access_token, user_email) => {
        const { data } = await PatenTrackApi.getCompanySummary( access_token, user_email )
        if( data != null ) {
            setCompanyData( data )
        }
    }

    return(
        <TableContainer
            component='div'
            className={classes.root}
        >
            <Table>
                <TableBody>
                    {
                        Object.keys(companyData).map( key => (
                            <TableRow>
                                <TableCell>
                                    <ShowData data={key} c={classes}/>
                                </TableCell>
                                <TableCell>
                                    <ShowData data={companyData[key]} number={true} c={classes}/>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}



export default CompanySummary
