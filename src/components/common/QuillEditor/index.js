import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactQuill from 'react-quill'
import {
  Menu,
  MenuItem,
  Modal,
  Backdrop,
  DialogContent
} from '@material-ui/core'

import useStyles from './styles'
import CustomToolbar from './CustomToolbar'
import UserInputForm from './UserInputForm'
import PatenTrackApi from '../../../api/patenTrack2'
import { setMaintainenceFeeFrameMode } from '../../../actions/uiActions'
import { getSlackUsersList, setMoveAssets, getMaintainenceAssetsList } from '../../../actions/patentTrackActions2'
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
  /* onAttachmentOpenedFile = () => {}, */
  onAttachmentDriveFile = () => {},
  onAttachmentFile = () => {},
  onFocus = () => {},
  onBlur = () => {},
  driveFile = ''
}) => {

  const classes = useStyles()
  const quillRef = useRef(null)
  const dispatch = useDispatch()
  const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
  const maintainence_fee_file_name = useSelector(state => state.patenTrack2.maintainence_fee_file_name)
  const assetTypeAssignmentAssetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  const google_profile = useSelector(state => state.patenTrack2.google_profile)
  const category = useSelector(state => state.patenTrack2.selectedCategory)
  const slack_users = useSelector(state => state.patenTrack2.slack_users)
  const driveButtonActive = useSelector(state => state.ui.driveButtonActive)
  const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
  const move_assets = useSelector(state => state.patenTrack2.move_assets)
  const selectedMainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
  const driveTemplateMode = useSelector(state => state.ui.driveTemplateMode)
  const template_document_url = useSelector(state => state.patenTrack2.template_document_url)
  const [ userListMenu, setUserListMenu ] = useState( null )
  const [ loadingUSPTO, setLoadingUSPTO ] = useState(false)
  const [ modalOpen, setModalOpen] = useState(false)
  const [ redo, setRedo ] = useState([])

  const quill = useMemo(() => {
    if (!quillRef.current) return null
       
    return quillRef.current.getEditor()
  }, [ quillRef.current ]) 

  useEffect(() => {
    if (!quillRef.current) return null
    
    if( driveFile != null ) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex , driveFile)
      editorRef.getEditor().setSelection(selectionIndex +  driveFile.length)
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


  const onHandleReviewMaintainenceFee = useCallback(async () => { 
    if( maintainenceFrameMode === false) {
      const action = ( selectedMaintainencePatents.length > 0 &&  move_assets.length > 0 ) ? true : move_assets.length > 0 ? true : selectedMaintainencePatents.length > 0 ? true : false
      
      if(action === true) {
        if( move_assets.length > 0 ) {
          //move assets to other layout
          const form = new FormData()
          form.append('moved_assets', JSON.stringify(move_assets))
          const { data } = await PatenTrackApi.moveAssetToLayout(form)
          if( data != null && data.length > 0 ) {
            setRedo(data)
            dispatch(setMoveAssets([]))
            if(selectedMaintainencePatents.length == 0) {
              dispatch( getMaintainenceAssetsList( selectedMainCompanies ))
            }
          }
        }
        if(selectedMaintainencePatents.length > 0) {
          dispatch(setMaintainenceFeeFrameMode( true ))
        }
      } else {
        alert("Please select assets from the maintainence list")
      }
    } else {
      //cancel
      dispatch(setMaintainenceFeeFrameMode( false )) 
      if( redo.length > 0 ) {
        //redo all activities
        const assetIDs = []
        redo.map( row => {
          assetIDs.push(row.asset_id)
        })
        const { data } = await PatenTrackApi.moveAssetRollback(JSON.stringify(assetIDs))
        if( data ) {
          // refresh patent list
          setRedo([])
          dispatch( getMaintainenceAssetsList( selectedMainCompanies ))
        }
      }
    }    
  }, [ dispatch, selectedMaintainencePatents, maintainenceFrameMode, move_assets, redo, selectedMainCompanies ])  

  const onHandleSubmitToUSPTO =  useCallback( async () => {      
    if(selectedAssetsPatents.length == 0) {
      alert('Please select a asset') 
    } else {
      /**
       * Open model
       * where user can add assignee, assignor and correspondence
       * add Autocomplete component
       */
      setModalOpen(true)
    }
  }, [ selectedAssetsPatents ])

  const onHandleModalClose = () => {
    setModalOpen(false)
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
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex, name) 
      editorRef.getEditor().setSelection(selectionIndex +  name.length)
    }
    onSelectUser(user.id) 
    setUserListMenu(null);
  },[ quillRef ])

  const onUsersList = useCallback(( event ) => {
    if(quillRef.current  != null) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex, '@') 
      editorRef.getEditor().setSelection(selectionIndex +  1)
    }
    
    dispatch(getSlackUsersList())
    setUserListMenu( event.currentTarget )
  }, [ dispatch, getSlackUsersList, quillRef ])

  const onAttachmentOpenedFile = useCallback(() => {    
    if( template_document_url != '') {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex , template_document_url)
      editorRef.getEditor().setSelection(selectionIndex +  template_document_url.length)
    }
  }, [ template_document_url, quillRef ] )


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
          onAttachmentOpenedFile={onAttachmentOpenedFile}
          onAttachmentFile={onAttachmentFile} 
          onAttachmentDriveFile={onAttachmentDriveFile}
          onMaintainenceFeeReview={onHandleReviewMaintainenceFee} 
          onMaintainenceFeeFile={onMaintainenceFeeFile}
          onSubmitUSPTO={onHandleSubmitToUSPTO}
          loadingUSPTO={loadingUSPTO}
          category={category}
          driveBtnActive={driveButtonActive}
          maintainenceMode={maintainenceFrameMode}
          selectedAssets={selectedAssetsPatents}
          driveTemplateMode={driveTemplateMode}
        /> 
        {GetMenuComponent}
      </div>
      <Modal
        disableBackdropClick={false}
        open={modalOpen}
        onClose={onHandleModalClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        aria-labelledby="assignor-assignee"
        aria-describedby=""
      >
        <>
          <UserInputForm />
        </>
      </Modal> 
    </div>
  )
}

export default QuillEditor