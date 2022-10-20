import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Paper, TextField, InputLabel, Fab, Button } from "@mui/material";
import Loader from "../Loader";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import { numberWithCommas, applicationFormat } from "../../../utils/numbers";
import { MonetizationOn } from '@mui/icons-material';
import { getTokenStorage } from '../../../utils/tokenStorage';
import PatenTrackApi from '../../../api/patenTrack2';

const LoadMaintainenceAssets = ({rows, onChangeFileName}) => {
    const classes = useStyles();
    const [rowHeight, setRowHeight] = useState(40)
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
    const [width, setWidth] = useState(800);
    const [currentSelection, setCurrentSelection] = useState(null)
    const [assets, setAssets] = useState([])
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [ name, setName ] = useState(`${moment(new Date()).format('MM-DD-YYYY')}_Patent_Maintenance_Fee_Bulk_File`)
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
    const google_profile = useSelector( state => state.patenTrack2.google_profile )

    const COLUMNS = [
        {
            width: 110,
            minWidth: 110,   
            label: "Patent #",
            dataKey: "patent",
            staticIcon: "US",
            format: numberWithCommas,
            align: "left",
            paddingLeft: 20
        },
        {
            width: 110,
            minWidth: 110,   
            label: "Application #",
            dataKey: "application",
            staticIcon: "US",
            format: applicationFormat,
            align: "left",
        },
        {
            width: 135,  
            minWidth: 135,      
            label: "Attorney Docket #",
            dataKey: "attorney",
            align: "left",
        },
        {
            width: 80,  
            minWidth: 80,          
            label: "Fee Code",
            dataKey: "fee_code",
            align: "left",		
            styleCss: true,
            justifyContent: 'flex-end',
        },
        {
            width: 70,      
            minWidth: 70,   
            label: "Fee Amount",
            dataKey: "fee_amount",
            staticIcon: "$",
            format: numberWithCommas,
            align: "left",		
            styleCss: true,
            justifyContent: 'flex-end',
        },
    ]

    useEffect(() => {
        const maintainenceAssets = []
        if( rows.length > 0 ) {
            let total = 0
            rows.map( row => {
                maintainenceAssets.push({
                    id: ' ',
                    patent: row[0],
                    application: row[1],
                    attorney: row[2]+' ',
                    fee_code: row[3],
                    fee_amount: row[4],
                })
                total += parseInt(row[4]) > 0 ? parseInt(row[4]) : 0
            })

            maintainenceAssets.push({
                id: ' ',
                patent: '',
                application: '',
                attorney: '',
                fee_code: 'Total:',
                fee_amount: total,
                underline: true   
            })

        }
        setAssets(maintainenceAssets)
    }, [ rows ])

    const handleClickSelectCheckbox = () => {

    }

    const onHandleSelectAll = () => {
        
    }

    /**
     * Open google auth login window
     */
     const openGoogleWindow = () => {
        alert("Token Expired, please first login with google account.")
        const googleButton = document.querySelector('.googleButton')
        if(googleButton != null) {
            googleButton.click()           
        }
    }

     /**
     * Open uspto window 
     * @param {*} w 
     * @param {*} h 
     */

      const openUSPTOWindow = (w, h) => {
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY
    
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height
    
        const systemZoom = width / window.screen.availWidth
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
    
        window.open('https://fees.uspto.gov/MaintenanceFees/', 'Maintainence Fee', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)
    }

    /**
     * Create Maintainance CSV file and open USPTO window to upload file
     */

    const onMaintainenceFeeFile = useCallback(async () => {  
        console.log('Maintainence Fee File')
        if(selectedMaintainencePatents.length > 0) {
            const getGoogleToken = getTokenStorage('google_auth_token_info')
            if(getGoogleToken && getGoogleToken != '') {
                const tokenJSON = JSON.parse( getGoogleToken )
                if( tokenJSON && tokenJSON.access_token != '' && tokenJSON.access_token != undefined) {
                    let profileInfo = google_profile;
                    if(profileInfo == null) {
                        const getGoogleProfile = getTokenStorage('google_profile_info')
                        if( getGoogleProfile != '') {
                            profileInfo = JSON.parse(getGoogleProfile)
                        }
                    }
                    if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                        const promptBox = window.confirm('Create a csv payment file to be loaded to USPTO.')
                        /**
                         * True
                         */
                        if( promptBox ) {
                            const formData = new FormData()
                            formData.append('file_name',  name )
                            formData.append('file_data',  JSON.stringify(selectedMaintainencePatents))
                            formData.append('access_token',  tokenJSON.access_token)
                            formData.append('user_account',  profileInfo.email)
                        
                            const { data } = await PatenTrackApi.createMaintainenceFeeFile( formData )
                            console.log("data", data)
                            if( data != null && data != undefined && data.webViewLink != '') {
                                /**
                                 * Open USPTO Maintainence Fee window
                                 */
                                openUSPTOWindow(1200, 700)
                            }
                        }            
                    } else {
                        alert("Please first login with google account")
                    }          
                } else {
                    alert("Please first login with google account")
                }
            } else {
                alert("Please first login with google account")
                console.log("Google login popup")
                openGoogleWindow()
            }
        } else {
          alert("Please first select the assets")
        }
    }, [ selectedMaintainencePatents, name, google_profile  ])
    
    return (
        <Paper
            className={classes.root}
            square
            id={`pay_maintainence_assets_to_uspto`}
            >
            {/* <InputLabel shrink>File Name</InputLabel>   
            <TextField 
                id='file_name' 
                label={false}
                placeholder='File Name' 
                defaultValue={name} 
                onChange={onChangeFileName}
            /> */}
            {/* <Fab size="small" aria-label='Pay Maintainence Due' color='primary' onClick={onHandleMaintainence} className={classes.floatIcon}>
                <MonetizationOn/>
            </Fab> */}
            <Button 
                className={classes.floatIcon}
                onClick={onMaintainenceFeeFile}
            >
                Pay USPTO
            </Button>
            <div className={classes.container}>
                <VirtualizedTable
                    classes={classes}
                    selected={selectItems}
                    rowSelected={selectedRow}
                    selectedIndex={currentSelection}
                    selectedKey={"asset"}
                    rows={assets}
                    rowHeight={rowHeight}
                    headerHeight={headerRowHeight}
                    columns={COLUMNS}
                    onSelect={handleClickSelectCheckbox}
                    onSelectAll={onHandleSelectAll}
                    defaultSelectAll={selectedAll}
                    collapsable={false}
                    showIsIndeterminate={false}
                    totalRows={assets.length}
                    defaultSortField={`asset`}
                    defaultSortDirection={`desc`}
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
        </Paper>
    ) 
}



export default LoadMaintainenceAssets;