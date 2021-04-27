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
  openGoogleWindow = () => {},
  onAttachmentDriveFile = () => {},
  onAttachmentFile = () => {},
  onFocus = () => {},
  onBlur = () => {},
  driveFile = '',
  category = ''
}) => {

  const classes = useStyles()
  const quillRef = useRef(null)
  const dispatch = useDispatch()
  const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
  const maintainence_fee_file_name = useSelector(state => state.patenTrack2.maintainence_fee_file_name)
  const assetTypeAssignmentAssetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
  const google_profile = useSelector(state => state.patenTrack2.google_profile)
  const slack_users = useSelector(state => state.patenTrack2.slack_users)
  const driveButtonActive = useSelector(state => state.ui.driveButtonActive)
  const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
  const [ userListMenu, setUserListMenu ] = useState( null )
  const [ loadingUSPTO, setLoadingUSPTO ] = useState(false)
  

  const quill = useMemo(() => {
    if (!quillRef.current) return null
       
    return quillRef.current.getEditor()
  }, [ quillRef.current ]) 

  useEffect(() => {
    if (!quillRef.current) return null
    
    if( driveFile != null ) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditorSelection().index
      editorRef.getEditor().insertText(selectionIndex, driveFile) 
    }
  }, [ driveFile, quillRef ])
  
  
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
          let profileInfo = google_profile;
          if(profileInfo == null) {
            const getGoogleProfile = getTokenStorage('google_profile_info')
            if( getGoogleProfile != '') {
              profileInfo = JSON.parse(getGoogleProfile)
            }
          }
          if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
            const promptBox = window.confirm('Create a csv payment file to be loaded to USPTO.')
            if( promptBox ) {
              const formData = new FormData()
              formData.append('file_name',  maintainence_fee_file_name )
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
  }, [ selectedMaintainencePatents, maintainence_fee_file_name, google_profile  ])


  const onHandleReviewMaintainenceFee = useCallback(() => { 
    if( maintainenceFrameMode === false) {
      if(selectedMaintainencePatents.length > 0) {
        dispatch(setMaintainenceFeeFrameMode( true ))
      } else {
        alert("Please select assets from the maintainence list")
      }
    } else {
      dispatch(setMaintainenceFeeFrameMode( false ))
    }    
  }, [ dispatch, selectedMaintainencePatents, maintainenceFrameMode ])  

  const onHandleSubmitToUSPTO =  useCallback( async () => {      
    if(assetTypeAssignmentAssetsSelected.length == 0) {
      alert('Please first select assets from list') 
    } else {
      /**
       * Send request to server to create XML file 
      */
      setLoadingUSPTO( true )
      const form = new FormData()
      form.append('assets', JSON.stringify(assetTypeAssignmentAssetsSelected))

      const {data} = await PatenTrackApi.downloadXMLFromServer(form)

      if( data && data != null && data.indexOf('xml') !== -1) {
        //downloadfile
        downloadFile(data)
        setLoadingUSPTO( false )
      } else {
        alert(data)
        setLoadingUSPTO( false )
      }
      
    }
  }, [assetTypeAssignmentAssetsSelected])

  const downloadFile = (data) => {
    const blob = new Blob([data], {type: 'text/plain'})
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = 'uspto.xml'
    link.href = url
    link.click()
    window.URL.revokeObjectURL(url)
  }

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
          onAttachmentDriveFile={onAttachmentDriveFile}
          onMaintainenceFeeReview={onHandleReviewMaintainenceFee} 
          onMaintainenceFeeFile={onMaintainenceFeeFile}
          onSubmitUSPTO={onHandleSubmitToUSPTO}
          loadingUSPTO={loadingUSPTO}
          category={category}
          driveBtnActive={driveButtonActive}
          maintainenceMode={maintainenceFrameMode}
        />
        {GetMenuComponent}
      </div>
    </div>
  )
}

export default QuillEditor
