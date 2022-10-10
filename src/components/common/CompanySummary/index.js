import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import copy from 'copy-to-clipboard'
import PatenTrackApi from '../../../api/patenTrack2'
import { capitalize, numberWithCommas } from '../../../utils/numbers'
import { getTokenStorage } from '../../../utils/tokenStorage'
import { 
    getGoogleProfile,
} from '../../../actions/patentTrackActions2'

import VirtualizedTable from '../../common/VirtualizedTable'



import useStyles from './styles'

const CompanySummary = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)
    const COLUMNS = [        
        {
            width: 130,  
            minWidth: 130,
            label: '',
            dataKey: 'name',
            imageURL: 'iconLink',
            role: 'image'
        },
		{  
            width: 60,  
            minWidth: 60,
            label: '',
            dataKey: 'number', 
            styleCss: true,
            justifyContent: 'flex-end' 
        }
    ]
    const [companyData, setCompanyData] = useState([])
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [ width, setWidth ] = useState( 200 )
    const [ rowHeight, setRowHeight ] = useState(40)
    const [selectedRow, setSelectedRow] = useState([])
    const [selectItems, setSelecteItems] = useState([])
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
                getSummaryData('', '')
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
        await PatenTrackApi.cancelSummaryRequest()
        const { data } = await PatenTrackApi.getCompanySummary( access_token, user_email )
        if( data != null ) {
           
            if( Object.keys(data).length > 0 ) {
                let summaryData = [];
                Object.keys(data).forEach( key => {
                    summaryData.push({
                        name: capitalize(key),
                        number: numberWithCommas(data[key]),
                        iconLink: `https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/${key}.svg`
                    })
                })                
                setCompanyData(summaryData)
            }
        }  
    }

    const handleClickRow = async(event, row) => {
        if(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && row.name == "Employees") {
            if(clipboard_assets.length > 0) {
                const list = []
                clipboard_assets.forEach( item => {
                    list.push({
                        asset: item.asset,
                        flag: item.asset_type === 0 ? 4 : 5
                    })
                })
                let form = new FormData()
                form.append('assets', JSON.stringify(list))
                form.append('transactions', JSON.stringify([]))
                form.append('type', 0)      
                const {data} = await PatenTrackApi.shareIllustration(form)
                if (data.indexOf('standard') >= 0) {
                    if(window.confirm("Copy a sharing link to your clipboard.")){
                        copy(data)
                    }
                }
            }
        }
    }

    const handleSelectAll = () => {        
    }

    return(
        <div style={{height: '50vh', marginLeft: 25}}>
            <VirtualizedTable
                classes={classes}
                rows={companyData}
                rowHeight={rowHeight}
                headerHeight={rowHeight}
                columns={headerColumns}
                selected={selectItems}
                selectedKey={'name'}
                rowSelected={selectedRow}
                onSelect={handleClickRow}
                onSelectAll={handleSelectAll}
                defaultSelectAll={false}     
                responsive={true}
                width={width} 
                disableHeader={true}
                containerStyle={{ 
                    width: '100%',
                    maxWidth: '100%'
                }}
                style={{
                    width: '100%'
                }}
            />
        </div>
    )
}



export default CompanySummary
