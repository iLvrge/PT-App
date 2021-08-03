import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Button } from "@material-ui/core";
import Loader from "../Loader";
import Googlelogin from '../Googlelogin' 
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";
import { numberWithCommas, applicationFormat, capitalize } from "../../../utils/numbers";
import PatenTrackApi from '../../../api/patenTrack2'
import {
    setLinkAssetListSelected
  } from '../../../actions/patentTrackActions2'

const LoadLinkAssets = ({type, asset}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const googleLoginRef = useRef(null)
    const viewerRef = useRef(null)
    const [rowHeight, setRowHeight] = useState(40)
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
    const [width, setWidth] = useState(1200)
    const [currentSelection, setCurrentSelection] = useState(null)    
    const [sheetUrl, setSheetUrl] = useState(null)    
    const [editSheet, setEditSheet] = useState(false)
    const [callByAuthLogin, setCallByAuth] = useState(false)
    const [googleAuthLogin, setGoogleAuthLogin ] = useState( true )
    const [loadingData, setLoadingData] = useState( false )
    const [selectedAsset, setSelectedAsset] = useState('')
    const [rows, setRows] = useState([])
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)
    const google_profile = useSelector(state => state.patenTrack2.google_profile)
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
    const COLUMNS = [
        { 
            width: 29, 
            minWidth: 29,   
            label: '',
            dataKey: 'name',
            role: 'checkbox',
            disableSort: true,
            show: false
        },
        {
            width: 300,
            minWidth: 300,   
            label: "Name",
            dataKey: "name",
            align: "left",
        },        
    ]

    useEffect(() => {        
        const getGoogleToken = getTokenStorage("google_auth_token_info"), getGoogleProfile = getTokenStorage('google_profile_info')

        let gToken = '', gAccount = ''
        if (getGoogleToken && getGoogleToken != "") {
            const tokenJSON = JSON.parse( getGoogleToken )
            if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
              gToken = tokenJSON.access_token
            }
        }

        if( getGoogleProfile != '') {
            const profileInfo = JSON.parse(getGoogleProfile)
            if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
              gAccount =  profileInfo.email
            }
        }
        if(gToken != '' && gAccount != '') {
          callSheetData(gToken, gAccount)      
          getSelectedLinkAssets()      
        } else {
            setTimeout(openGoogleWindow, 1000)
        }
    }, [type])

    useEffect(() => {
        if(callByAuthLogin === true) {
            if(google_auth_token !== null && google_auth_token != '' && google_profile !== null && google_profile != '' && type !== null && asset !== null){
                setCallByAuth(false)
                setSelectedAsset(asset)
                callSheetData(google_auth_token.access_token, google_profile.email)
            }
        }
    }, [callByAuthLogin, google_auth_token, google_profile])

    useEffect(() => {
        if(selectedAssetsPatents.length > 0 ) {
            let formatAsset  = selectedAssetsPatents[0] == '' ? `US${applicationFormat(selectedAssetsPatents[1])}` : `US${numberWithCommas(selectedAssetsPatents[0])}`
            setSelectedAsset(formatAsset)
        }
    }, [selectedAssetsPatents])

    useEffect(() => {
        if(selectedAsset !== null && selectedAsset != '') {
            getSelectedLinkAssets()
        }
    }, [selectedAsset])

    const callSheetData = async(gToken, gAccount) => {
        const form = new FormData()
        form.append('access_token', gToken)
        form.append('user_account', gAccount)
        setLoadingData(true)
        const { data } = await PatenTrackApi.linkWithSheet(type, form)
        setLoadingData(false)        
        if(data.length > 0) {
            let list = [];  
            const promiseList = data.map(item => {
                list.push({
                    name: item
                })
            })
            await Promise.all(promiseList)
            setRows(list)
        } else {
            setRows([])
            setSelectItems([])
        }
    }

    const getSelectedLinkAssets = async() => {
        if(type !== null && type !== '' && selectedAsset !== null && selectedAsset != '') {
            const getGoogleToken = getTokenStorage("google_auth_token_info"), getGoogleProfile = getTokenStorage('google_profile_info')

            let gToken = '', gAccount = ''
            if (getGoogleToken && getGoogleToken != "") {
                const tokenJSON = JSON.parse( getGoogleToken )
                if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
                gToken = tokenJSON.access_token
                }
            }

            if( getGoogleProfile != '') {
                const profileInfo = JSON.parse(getGoogleProfile)
                if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                gAccount =  profileInfo.email
                }
            }
            if(gToken != '' && gAccount != '') {
                const form = new FormData()
                form.append('access_token', gToken)
                form.append('user_account', gAccount)
                const { data } = await PatenTrackApi.linkSheetSelectedData(type, encodeURIComponent(selectedAsset), form)
                if(data !== null && data.length > 0) {
                    setSelectItems(data)
                }
            }
        }
    }

    const openGoogleWindow = () => {
        if(googleLoginRef.current != null) {
            if(googleLoginRef.current.querySelector('button') !== null) {
                setCallByAuth(true)
                googleLoginRef.current.querySelector('button').click()
            } else {
                setTimeout(openGoogleWindow, 1000)
            }          
        } else {
            setTimeout(openGoogleWindow, 1000)
        }
    }

    const handleClickSelectCheckbox = useCallback((event, row) => {
        event.preventDefault()
        let items = [...selectItems], list = [...rows]
        if(!items.includes(row.name)) {
            items.push(row.name)            
        } else {
            items = items.filter( item => item != row.name)
        } 
        setSelectAll(items.length == list.length ? true : false);
        setSelectItems(items)
        onHandleLinkAssetWithSheet(items)
    }, [selectItems])

    const onHandleSelectAll = async(event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        let items = []
        if (checked !== false) {
            let items = [], list = [...rows]
            const promise = list.map(item =>
                items.push(item.name),
            ); 
            await Promise.all(promise);
        }
        setSelectItems(items)
        setSelectAll(checked);
        onHandleLinkAssetWithSheet(selectItems)
    }

    const onHandleLinkAssetWithSheet = async(selectItems) => {
        if(type !== null && selectedAsset !== null) {
            const getGoogleToken = getTokenStorage("google_auth_token_info"), getGoogleProfile = getTokenStorage('google_profile_info')
            let gToken = '', gAccount = ''
            if (getGoogleToken && getGoogleToken != "") {
                const tokenJSON = JSON.parse( getGoogleToken )
                if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
                    gToken = tokenJSON.access_token
                }
            }

            if( getGoogleProfile != '') {
                const profileInfo = JSON.parse(getGoogleProfile)
                if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                    gAccount =  profileInfo.email
                }
            }
            if(gToken != '' && gAccount != '') {
                const form = new FormData()
                form.append('access_token', gToken)
                form.append('user_account', gAccount)  
                form.append('asset', decodeURIComponent(selectedAsset))
                form.append('values', JSON.stringify(selectItems))
                const { data } = await PatenTrackApi.linkSheetUpdateData(form, type)
                console.log('updateSheet', data)
            }      
        }
    }

    const openCloseFile = async() => {
        if( !editSheet === true) {
            let gAccount = ''
            const getGoogleProfile = getTokenStorage('google_profile_info')
            if( getGoogleProfile != '') {
                const profileInfo = JSON.parse(getGoogleProfile)
                if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                    gAccount =  profileInfo.email
                }
            }
            if(gAccount != '') {
                const form = new FormData()
                form.append('user_account', gAccount)
                const { data } = await PatenTrackApi.getSheet(type, form)

                if(data !== null && data !== '') {
                    setSheetUrl(data)
                }
            }
        }
        setEditSheet(!editSheet)
    }

    const findHeightContainer = () => {
        const parentElement = viewerRef.current
        const iframeElement = parentElement.querySelector(`iframe`)
        if(iframeElement != null) {
           iframeElement.style =  `height: ${parentElement.clientHeight}px;` 
        }
    }
    
    return ( 
        <Paper
            ref={viewerRef}
            className={classes.root}
            square
            id={`link_assets_to_product_technology_competition`}
        >       
            <div className={classes.headerContainer}>
                <Button variant="text" onClick={openCloseFile}>{editSheet === true ? 'Close File' : 'Edit File'}</Button>
            </div>
            {
                editSheet === true && sheetUrl !== null
                ?
                    <iframe className={classes.iframe} src={sheetUrl} onLoad={findHeightContainer}></iframe>
                :
                    loadingData === true
                    ?
                        <Loader/>  
                    :
                        <div className={classes.container}>
                            <VirtualizedTable
                                classes={classes}
                                selected={selectItems}
                                rowSelected={selectedRow}
                                selectedIndex={currentSelection}
                                selectedKey={"name"}
                                rows={rows}
                                rowHeight={rowHeight}
                                headerHeight={headerRowHeight}  
                                columns={COLUMNS}
                                onSelect={handleClickSelectCheckbox}
                                onSelectAll={onHandleSelectAll}
                                defaultSelectAll={selectedAll}
                                collapsable={false}
                                showIsIndeterminate={false}
                                totalRows={rows.length}
                                /* defaultSortField={`exec_dt`}
                                defaultSortDirection={`desc`} */
                                responsive={true}
                                width={width}
                                containerStyle={{
                                    width: "100%",
                                    maxWidth: "100%",
                                }}
                                style={{
                                    width: "100%",
                                }}
                            />
                        </div>
            }
            {
                googleAuthLogin && (
                <span ref={googleLoginRef}>
                    <Googlelogin/>
                </span>)
            }
        </Paper> 
    ) 
}


export default LoadLinkAssets;