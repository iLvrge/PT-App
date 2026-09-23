import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import copy from 'copy-to-clipboard'
import PatenTrackApi from '../../../api/patenTrack2'
import { capitalize, numberWithCommas } from '../../../utils/numbers'
import { getTokenStorage } from '../../../utils/tokenStorage'
import { 
    getGoogleProfile,
} from '../../../actions/patentTrackActions2'

import VirtualizedTable from '../../common/VirtualizedTable'




const CompanySummary = () => {
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
    
    /*
     * Whether this component is still on screen.
     *
     * The summary request takes seconds — eight in one measured load — and this
     * panel lives inside a Suspense boundary in the header, so it is routinely
     * unmounted while that request is still in flight. Writing state afterwards
     * is the "Can't perform a React state update on an unmounted component"
     * warning, and it holds the whole component's closure alive until the
     * request settles.
     */
    const mounted = useRef(true)
    useEffect(() => () => { mounted.current = false }, [])

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
        /* if(document.getElementsByClassName('googleButton').length > 0) {
            document.getElementsByClassName('googleButton')[0].click()
        } */
    }

    const getSummaryData = async(access_token, user_email) => {
        await PatenTrackApi.cancelSummaryRequest()

        let data = null
        try {
            /*
             * Wrapped because the call above cancels whatever was in flight, and
             * a cancelled axios request rejects. That rejection belonged to the
             * earlier invocation, which had nothing to catch it — every token
             * change produced an unhandled rejection alongside the leak.
             */
            ;({ data } = await PatenTrackApi.getCompanySummary( access_token, user_email ))
        } catch (error) {
            // A cancel is this component's own doing and is not worth reporting.
            if (!axios.isCancel(error)) {
                console.warn('company summary unavailable:', error?.message)
            }
            return
        }

        if (!mounted.current) return

        if( data != null ) {
            let {report, reportActive} = data
            let summaryData = [];
            if( Object.keys(report).length > 0 ) {
                Object.keys(report).forEach( key => { 
                    summaryData.push({
                        name: capitalize(key == 'entities' ? '3rd Parties' : key == 'parties' ? 'Parties' : key),
                        number: numberWithCommas(report[key]),
                        iconLink: `${process.env.REACT_APP_BUCKET_PATH}icons/svg/${key == 'entities' ? 'parties' : key}.svg`
                    })
                })    
            }
            if(reportActive != null && Object.keys(reportActive).length > 0 ) {
                Object.keys(reportActive).forEach( key => { 
                    if(key == 'rightsActive') {
                        summaryData.push({
                            name: 'Rights (Active)',
                            number: numberWithCommas(reportActive['rightsActive']),
                            iconLink: `${process.env.REACT_APP_BUCKET_PATH}icons/svg/rights.svg`
                        })
                    } 
                })    
            }
            setCompanyData(summaryData)
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
        <div style={{height: 375, marginLeft: 25}}>
            <VirtualizedTable
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
