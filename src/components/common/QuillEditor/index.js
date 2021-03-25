import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactQuill from 'react-quill'
import {
  Menu,
  MenuItem,
} from '@material-ui/core'
import useStyles from './styles'
import CustomToolbar from './CustomToolbar'
import PatenTrackApi from '../../../api/patenTrack2'
import { setMaintainenceFeeFrameMode } from '../../../actions/uiActions'
import { getSlackUsersList } from '../../../actions/patentTrackActions2'
import { setTokenStorage, getTokenStorage } from '../../../utils/tokenStorage'
import 'react-quill/dist/quill.snow.css'
import './styles.css'

const QuillEditor = ({
  placeholder = 'Message #',
  value = '',
  onSelectUser = (value) => {},
  onChange = (value) => {},
  onSubmit = (value) => {},
  onCancel = () => {},
  onDrive = () => {},
  onAttachmentFile = () => {},
  onFocus = () => {},
  onBlur = () => {}
}) => {

  const classes = useStyles()
  const quillRef = useRef(null)
  const dispatch = useDispatch()
  const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
  const maintainence_fee_file_name = useSelector(state => state.patenTrack2.maintainence_fee_file_name)
  const slack_users = useSelector(state => state.patenTrack2.slack_users)
  const [ userListMenu, setUserListMenu ] = useState( null )

  const quill = useMemo(() => {
    if (!quillRef.current) return null
       
    return quillRef.current.getEditor()
    /* eslint-disable-next-line */
  }, [ quillRef.current ]) 
 

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
  
  const onMaintainenceFeeFile = useCallback(async () => {  
    if(selectedMaintainencePatents.length > 0) {
      const getGoogleToken = getTokenStorage('google_auth_token_info')
      if(getGoogleToken && getGoogleToken != '') {
        const tokenJSON = JSON.parse( getGoogleToken )
        if( tokenJSON && tokenJSON.access_token != '' && tokenJSON.access_token != undefined) {
          const formData = new FormData()
          formData.append('file_name',  maintainence_fee_file_name )
          formData.append('file_data',  JSON.stringify(selectedMaintainencePatents))
          formData.append('access_token',  tokenJSON.access_token)
    
          const { data } = await PatenTrackApi.createMaintainenceFeeFile( formData )
          console.log("data", data)
          if( data != null && data != undefined && data.webViewLink != '') {
            /**
             * Open USPTO Maintainence Fee window
             */
            openUSPTOWindow(1200, 700)
          }
        } else {
          alert("Please first login with google account")
        }
      } else {
        alert("Please first login with google account")
      }
    } else {
      alert("Please first select the assets")
    }
  }, [ selectedMaintainencePatents, maintainence_fee_file_name  ])


  const onHandleReviewMaintainenceFee = useCallback(() => { 
    console.log("selectedMaintainencePatents", selectedMaintainencePatents)     
    if(selectedMaintainencePatents.length > 0) {
      dispatch(setMaintainenceFeeFrameMode( true ))
    } else {
      alert("Please select assets from the maintainence list")
    }
  }, [ dispatch, selectedMaintainencePatents ])  

  const onCloseUserMenu = () => {
    setUserListMenu(null);
  }

  const GetMenuComponent = useMemo(() => {
    return (
      <Menu
        id="users_list"
        anchorEl={userListMenu}
        keepMounted
        open={Boolean(userListMenu)}
        onClose={onCloseUserMenu}
      >
        {
          slack_users.length > 0 && slack_users.map( user => {
            return user.id != 'USLACKBOT' && user.deleted === false  ? <MenuItem key={user.id} onClick={(event) => {onUserClick(event, user)}}>{ user.real_name == undefined || user.real_name == null ? user.profile.real_name : user.real_name }</MenuItem> : ''}
          )
        }
      </Menu>
    )
  }, [ slack_users, userListMenu ])

  const onUserClick = useCallback((event, user) => {   
    const name = user.real_name == undefined || user.real_name == null ? user.profile.real_name : user.real_name
    if(quillRef.current  != null) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditorSelection().index
      editorRef.getEditor().insertText(selectionIndex, name+' ') 
    }
    onSelectUser(user.id) 
    setUserListMenu(null);
  },[ quillRef ])

  const onUsersList = useCallback(( event ) => {
    if(quillRef.current  != null) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditorSelection().index
      editorRef.getEditor().insertText(selectionIndex, '@') 
    }
    
    dispatch(getSlackUsersList())
    setUserListMenu( event.currentTarget )
  }, [ dispatch, getSlackUsersList, quillRef ])

  return (
    <div className={classes.root}>
      <div className={classes.textEditor}>
        <ReactQuill
          ref={quillRef}
          theme='snow'
          modules={CustomToolbar.modules}
          formats={CustomToolbar.formats}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <CustomToolbar 
        quillEditor={quillRef}
        quill={quill} 
        onClick={onSubmit} 
        onUserClick={onUsersList} 
        onDocument={onDrive} 
        onAttachmentFile={onAttachmentFile} 
        onMaintainenceFeeReview={onHandleReviewMaintainenceFee} 
        onMaintainenceFeeFile={onMaintainenceFeeFile}/>
        {GetMenuComponent}
      </div>
    </div>
  )
}

export default QuillEditor
