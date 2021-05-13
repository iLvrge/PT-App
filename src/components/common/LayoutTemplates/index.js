import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux"
import moment from 'moment'
import { Paper } from "@material-ui/core"
import VirtualizedTable from "../VirtualizedTable"

import { 
        setTemplateDocument,
        createDriveTemplateFile,
        setDriveTemplateFile,
        setGoogleAuthToken,
        setSlackAuthToken,
        setChannelID,
        getSlackMessages
    } from '../../../actions/patentTrackActions2'

import {
  setDriveTemplateFrameMode,
  setDriveTemplateMode
} from '../../../actions/uiActions'

import { getTokenStorage } from '../../../utils/tokenStorage'

import PatenTrackApi from '../../../api/patenTrack2'

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
    const channel_id = useSelector( state => state.patenTrack2.channel_id )  
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

    const COLUMNS = [    
      {
        minWidth: 100,
        label: 'Document Templates',
        dataKey: 'container_name',            
      }
    ]

    const onHandleSelectAll = () => {

    }

    const sendMessageViaSlack = useCallback(async(data) => {
      const formData = new FormData()
      formData.append('text',  `https://docs.google.com/document/d/${data.id}/edit` )
      formData.append('asset', selectedAssetsPatents.length == 2 &&  selectedAssetsPatents[0] === '' ? selectedAssetsPatents[1] : selectedAssetsPatents[0])
      formData.append('asset_format', selectedAssetsPatents.length == 2 &&  selectedAssetsPatents[0] === '' ? 'us'+selectedAssetsPatents[1] : 'us'+selectedAssetsPatents[0])
      formData.append('user', '')
      formData.append('reply', '')
      formData.append('edit', '')
      formData.append('file', '')
      formData.append('channel_id', channel_id)
      const slackToken = getTokenStorage( 'slack_auth_token_info' )	
      if( slackToken  && slackToken != null ) {
        const { access_token } = JSON.parse(slackToken)

        if( access_token != undefined) {
          const { data } = await PatenTrackApi.sendMessage(access_token, formData)

          if(data != '' && Object.keys(data).length > 0) {
            const { status, channel } = data;
            if(status != '' && status == 'Message sent') {
              if(channel_id != channel) {
                dispatch(setChannelID({channel_id}))
              }
              dispatch( getSlackMessages( data.channel ) ) 
            }
          }
        } else {
          alert("Please login first with your Slack Account")
        }
      } else {
        alert("Please login first with your Slack Account")
      }
    }, [dispatch, selectedAssetsPatents, channel_id ])

    const onHandleDoubleClick = useCallback(async(e, item) => {
        console.log('onHandleDoubleClick')
        // Ask que
        const askQ = window.confirm('Would you like to create a new document based on this template?')

        if( askQ ) {
          /**
           * Check Token 
          */
          const googleToken = getTokenStorage( 'google_auth_token_info' )
          const slackToken = getTokenStorage( 'slack_auth_token_info' )
          let tokenExpired = false, slackTokenExpired = false
          if(googleToken && googleToken != '' ) {
            const tokenParse = JSON.parse(googleToken), slackTokenParse = JSON.parse(slackToken)

            //const { access_token } = tokenParse
      
            if(tokenParse && tokenParse.access_token) {
              if(slackTokenParse && slackTokenParse.access_token) {
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
                  console.log("Create new drive file")       
                  //setCurrentDriveFileItem(item)
                  const formData = new FormData()
                    formData.append('access_token',  tokenParse.access_token )
                    formData.append('refresh_token', tokenParse.refresh_token)
                    formData.append('user_account', profileInfo.email)
                    formData.append('id', item.container_id)
                    formData.append('name', `US${selectedAssetsPatents.length == 2 &&  selectedAssetsPatents[0] === '' ? selectedAssetsPatents[1] : selectedAssetsPatents[0]} ${moment(new Date()).format('MM DD, YYYY')} ${item.container_name}`)
                    //dispatch(createDriveTemplateFile(formData))
                    const { data } = await PatenTrackApi.createDriveTemplateFile( formData ) // send request for new document
                    if( data != null && typeof data == 'object') {
                      dispatch(setTemplateDocument('')) // close preview file frame mode
                      dispatch(setDriveTemplateFrameMode(true)) // open drive frame
                      dispatch(setDriveTemplateFile(data)) // open file in TV
                      dispatch(setDriveTemplateMode(false)) // close document template
                      sendMessageViaSlack(data) // send message via slack channel
                      alert('A new document was added to the Documents list of this patent.')
                    }
                } else {
                  tokenExpired = true
                }
              } else {
                slackTokenExpired = true
              }              
            } else {
              tokenExpired = true
            }
          } else {
            tokenExpired = true
          }  
          if( tokenExpired === true ) {
            alert('Token expired, please login with google account')
            localStorage.setItem('google_auth_token_info', '')
            dispatch(setGoogleAuthToken(null))
          } else if( slackTokenExpired === true ) {
            alert('Token expired, please login with slack account')
            localStorage.setItem('slack_auth_token_info', '')
            dispatch(setSlackAuthToken(null))
          }
        }
    }, [ dispatch ])

    /* const onMouseOver = useCallback((e, item, flag) => {
        setCurrentSelection(item.container_id)
        dispatch(setDriveTemplateFrameMode(true))
        dispatch(setTemplateDocument(`https://docs.google.com/file/d/${item.container_id}/preview`))
    }, [ dispatch ]) */

    const onHandleClickRow = useCallback((e, item, flag) => {
      setCurrentSelection(item.container_id)
      setSelectedRow([item.container_id])
      dispatch(setDriveTemplateFrameMode(true))
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
                  /* hover={true}
                  onMouseOver={onMouseOver} */
                  onSelect={onHandleClickRow}
                  onDoubleClick={onHandleDoubleClick}
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