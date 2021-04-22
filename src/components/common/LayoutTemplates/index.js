import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { Paper } from "@material-ui/core"
import VirtualizedTable from "../VirtualizedTable"

import { 
        setTemplateDocument,
        createDriveTemplateFile,
        setGoogleAuthToken
    } from '../../../actions/patentTrackActions2'

import { getTokenStorage } from '../../../utils/tokenStorage'

import useStyles from "./styles"

const LayoutTemplates = () => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [rowHeight, setRowHeight] = useState(40)
    const [width, setWidth] = useState(800)
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [currentSelection, setCurrentSelection] = useState(null)

    const driveFiles = useSelector(state => state.patenTrack2.template_layout_drive_files)
    const google_profile = useSelector(state => state.patenTrack2.google_profile)

    console.log("driveFiles", driveFiles)

    const COLUMNS = [    
        {
            width: 100,
            minWidth: 100,
            label: 'Template Name',
            dataKey: 'container_name',            
        }
    ]

    const onHandleSelectAll = () => {

    }

    const onHandleClickRow = useCallback((e, item) => {
        // Ask que
        const askQ = window.confirm('Would you like to create a new document based on this template?')

        if( askQ ) {
            /**
           * Check Token
           */
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            let tokenExpired = false
            if(googleToken && googleToken != '' ) {
              const tokenParse = JSON.parse(googleToken)
              const { access_token } = tokenParse
        
              if(access_token) {
                let profileInfo = google_profile
                if(profileInfo == null) {
                  const getGoogleProfile = getTokenStorage('google_profile_info')
                  if( getGoogleProfile != '') {
                    profileInfo = JSON.parse(getGoogleProfile)
                  }
                }
                if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                  /**
                   * Create copy of this file and show in the iframe
                   * Send request to the server to get the new copy of file and open in TV.
                   */
                  console.log("Create new file")       
                  //setCurrentDriveFileItem(item)
                  const formData = new FormData()
                    formData.append('access_token',  tokenParse.access_token )
                    formData.append('refresh_token', tokenParse.refresh_token)
                    formData.append('user_account', profileInfo.email)
                    formData.append('id', item.container_id)
                    dispatch(createDriveTemplateFile(formData))
                } else {
                  tokenExpired = true
                }
              } else {
                tokenExpired = true
              }
            } else {
              tokenExpired = true
            }
  
            if( tokenExpired === true ) {
              alert('Token expired, please login again')
              localStorage.setItem('google_auth_token_info', '')
              dispatch(setGoogleAuthToken(null))
            }
        }
    }, [ dispatch ])

    const onMouseOver = useCallback((e, item, flag) => {
        dispatch(setTemplateDocument(`https://docs.google.com/file/d/${item.container_id}/preview`))
    }, [ dispatch ])

    return (
        <Paper className={classes.root} square id={`layout_templates`}>
            {
                driveFiles != undefined && driveFiles != null && driveFiles.length > 0  && 
                <VirtualizedTable
                    classes={classes}
                    selected={selectItems}
                    rowSelected={selectedRow}
                    selectedIndex={currentSelection}
                    selectedKey={"container_id"}
                    rows={driveFiles}
                    rowHeight={rowHeight}
                    headerHeight={rowHeight}
                    columns={COLUMNS}
                    hover={true}
                    onMouseOver={onMouseOver}
                    onSelect={onHandleClickRow}
                    onSelectAll={onHandleSelectAll}
                    defaultSelectAll={selectedAll}
                    responsive={true}
                    collapsable={false}
                    showIsIndeterminate={false} 
                    totalRows={driveFiles.length}
                    width={width}
                    containerStyle={{
                        width: "100%",
                        maxWidth: "100%",
                    }}
                    style={{
                        width: "100%",
                    }}
                />
            }            
        </Paper>
    )
}

export default LayoutTemplates