import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";

import LoadLinkAssets from '../IllustrationCommentContainer/LoadLinkAssets'
import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { numberWithCommas, applicationFormat, capitalize } from "../../../utils/numbers";
import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";
import PatenTrackApi from '../../../api/patenTrack2'
import useStyles from "./styles";

const AllComponentsMenu = ({onClick}) => {
    const classes = useStyles();
    //const dispatch = useDispatch();
    const [selectedComponent, setSelectedComponent] = useState('')
    const [selectedComponentLabel, setSelectedComponentLabel] = useState('Select')
    const [callByAuthLogin, setCallByAuth] = useState(true)     
    const menuComponents = [
        {
            id: 1,
            label: 'Associate to Our Products',
            component: LoadLinkAssets
        },
        {
            id: 2,
            label: 'Associate to Our Technologies',
            component: LoadLinkAssets
        },
        {
            id: 3,
            label: 'Associate to Our Compeitors',
            component: LoadLinkAssets
        },
    ] 

    const [ menus, setMenus] = useState(menuComponents)

    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)
    const google_profile = useSelector(state => state.patenTrack2.google_profile)
    
    useEffect(() =>{
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
           setCallByAuth(false)
           getSheetNames(gToken, gAccount)
        }
    }, [])

    useEffect(() => {
        if(callByAuthLogin === true) {
            if(google_auth_token !== null && google_auth_token != '' && google_profile !== null && google_profile != ''){
                setCallByAuth(false)
                getSheetNames(google_auth_token.access_token, google_profile.email)
            }
        }
    }, [callByAuthLogin, google_auth_token, google_profile])

    const getSheetNames = async(gToken, gAccount) => {
        console.log("Sheetnames", gToken, gAccount)
        if(gToken != '' && gAccount != '') {
            const form = new FormData()
            form.append('access_token', gToken)
            form.append('user_account', gAccount)  
            const { data } = await PatenTrackApi.getSheetDetails(form)
            console.log('data', data)
            if(data !== null && data.length > 0) {
                let items = [...menus]
                if(data.length == 3) {
                    items[0].label = data[0]
                    items[1].label = data[1]
                    items[2].label = data[2]
                }
                setMenus(items)
            }
        } 
    }


    const handleChange = (event) => {
        setSelectedComponent(event.target.value);
        const findIndex = menuComponents.findIndex( item => item.id === event.target.value)

        if(findIndex !== -1) {
            setSelectedComponentLabel(menuComponents[findIndex].label)
            let properties = {}
            if(menuComponents[findIndex].id >= 1 && menuComponents[findIndex].id <= 3 ) {
                properties.type = menuComponents[findIndex].id == 2 ? 'technology' : menuComponents[findIndex].id == 3 ? 'competitors' : 'products'
                if(selectedAssetsPatents.length > 0) {                
                    properties.asset = selectedAssetsPatents[0] == '' ? `US${applicationFormat(selectedAssetsPatents[1])}` : `US${numberWithCommas(selectedAssetsPatents[0])}`
                } else {
                    properties.asset = null
                }            
            }
            onClick([{
                component: menuComponents[findIndex].component,
                ...properties
            }])
        }
    };


    return (
        <div className={classes.menu}>
            <FormControl className={classes.formControl}>
                {/* <InputLabel id="component-menu-select-label">{selectedComponentLabel}</InputLabel> */}
                <Select
                    labelId="component-menu-select-label"
                    id="component-menu-select"
                    IconComponent={KeyboardArrowDownIcon}
                    MenuProps={{
                        PaperProps: {
                            style: {
                              marginTop: 40
                            }
                        }
                    }}
                    value={selectedComponent}
                    onChange={handleChange}
                >
                    {
                        menus.map( (item, index) => (
                            <MenuItem key={index} value={item.id}>{item.label}</MenuItem>
                        ))
                    }                
                </Select>
            </FormControl>
        </div>
    )
}


export default AllComponentsMenu; 