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
import { 
    getSlackUsersList, 
    setMoveAssets, 
    getMaintainenceAssetsList,
    setAddressQueueDisplay,
    setAddressQueueData,
    setAddressQueueLoading,
    setNameQueueDisplay,
    setNameQueueData,
    setNameQueueLoading 
  } from '../../../actions/patentTrackActions2'
import { setTokenStorage, getTokenStorage } from '../../../utils/tokenStorage'
import {downloadFile} from '../../../utils/html_encode_decode'
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
  onSalesAssets = () => {}, 
  onCorrectAddress = () => {},
  onChangeAddress = () => {},
  onCorrectName = () => {},
  onChangeName = () => {},
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
  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.assetTypeAssignments.selected)
  const maintainence_fee_file_name = useSelector(state => state.patenTrack2.maintainence_fee_file_name)
  const assetTypeAddressSelected = useSelector(state => state.patenTrack2.assetTypeAddress.selected)
  const assetTypeNamesSelected = useSelector(state => state.patenTrack2.assetTypeNames.selected)
  const assetTypeAssignmentAssetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  const google_profile = useSelector(state => state.patenTrack2.google_profile)
  const category = useSelector(state => state.patenTrack2.selectedCategory)
  const slack_users = useSelector(state => state.patenTrack2.slack_users)
  const driveButtonActive = useSelector(state => state.ui.driveButtonActive)
  const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
  const addressQueuesDisplay = useSelector(state => state.patenTrack2.addressQueuesDisplay)
  const nameQueuesDisplay = useSelector(state => state.patenTrack2.nameQueuesDisplay)
  const fixedTransactionAddress = useSelector(state => state.patenTrack2.fixedTransactionAddress)
  const fixedTransactionName = useSelector(state => state.patenTrack2.fixedTransactionName)
  const move_assets = useSelector(state => state.patenTrack2.move_assets)
  const selectedMainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
  const driveTemplateMode = useSelector(state => state.ui.driveTemplateMode)
  const template_document_url = useSelector(state => state.patenTrack2.template_document_url)
  const assetTypeNamesGroups = useSelector(state => state.patenTrack2.assetTypeNames.all_groups)
  const mainCompaniesSelected = useSelector(state => state.patenTrack2.mainCompaniesList.selected)
  const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)
  const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
  const link_assets_sheet_display = useSelector(state => state.patenTrack2.link_assets_sheet_display)
  const link_assets_sheet_type = useSelector(state => state.patenTrack2.link_assets_sheet_type)
  const link_assets_selected = useSelector(state => state.patenTrack2.link_assets_selected)

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
    if( (category == 'correct_details' && selectedAssetsTransactions.length == 0) || (category != 'correct_details' && selectedAssetsPatents.length == 0)) {
      alert(category == 'correct_details' ? 'Please select a transaction' : 'Please select a asset') 
    } else {
      /**
       * Open model
       * where user can add assignee, assignor and correspondence
       * add Autocomplete component
       */
      setModalOpen(true)
    }
  }, [ selectedAssetsPatents, selectedAssetsTransactions, category ])

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
      editorRef.getEditor().setSelection(selectionIndex +  2)
    }
    
    dispatch(getSlackUsersList())
    setUserListMenu( event.currentTarget )
  }, [ dispatch, getSlackUsersList, quillRef ])

  const onAttachmentOpenedFile = useCallback(() => {    
    if( template_document_url != '') {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex , template_document_url)
      editorRef.getEditor().setSelection(selectionIndex +  template_document_url.length + 1)
    }
  }, [ template_document_url, quillRef ] )

  const copyToClipboard = (data) => {
    var textField = document.createElement('textarea')
    textField.innerText = data
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  const onAttachmentOpenedFileAndEmail = useCallback(() => {    
    let url = `https://mail.google.com/mail/u/0/?fs=1&tf=cm${template_document_url != '' ? '&body='+template_document_url : ''}`
    /* if( template_document_url != '') {
      copyToClipboard(template_document_url)

    } */
    window.open(url,'GMAIL')
  }, [ template_document_url, quillRef ] )  

  const onShare = useCallback(async () => {
    let selectAssetsList = [], selectedTransactions = []
    
    if(display_clipboard === true) {
      selectAssetsList =  selectedMaintainencePatents.length > 0 ? [...selectedMaintainencePatents] : [...assetTypeAssignmentAssetsSelected]
    } else {
      if(category == "pay_maintainence_fee") {
        selectAssetsList = [...selectedMaintainencePatents]
      } else if (category == 'correct_details') {
        selectedTransactions = [...selectedAssetsTransactions]
      } else {
        selectAssetsList = [...assetTypeAssignmentAssetsSelected]
      }
    } 

    if(selectAssetsList.length == 0) {
      if(selectedAssetsPatents.length  == 2) {
        selectAssetsList.push(selectedAssetsPatents[0] != "" ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString())
      }
    }

    if( (category == 'correct_details' && selectedTransactions.length == 0) || (category != 'correct_details' && selectAssetsList.length == 0)) {
      alert(category == 'correct_details' ? 'Please select a transaction' : 'Please select a asset')
    } else {
      // Share list of assets and create share link 
      let form = new FormData()
      form.append('assets', JSON.stringify(selectAssetsList))
      form.append('transactions', JSON.stringify(selectedTransactions))
      form.append('type', 2)      
      const {data} = await PatenTrackApi.shareIllustration(form)
      if (data.indexOf('pitch') >= 0) {
        /**
         * just for temporary replacing
         * open share url new tab
         */
        //const shareURL = data.replace('https://share.patentrack.com','http://167.172.195.92:3000')
        window.open(data,'_BLANK')
      } 
    }
  }, [ dispatch, category, selectedAssetsPatents, selectedMaintainencePatents, assetTypeAssignmentAssetsSelected, selectedAssetsTransactions ])

  const onHandleCorrectAddress = useCallback(() => {
    if(assetTypeAddressSelected.length > 0) {
      onCorrectAddress()
    } else {
      alert('Please select address first.')
    }
  }, [ assetTypeAddressSelected ])

  const onHandleChangeAddress = useCallback(() => {
    if(assetTypeAddressSelected.length > 0) {
      onChangeAddress()
    } else {
      alert('Please select address first.')
    }
  }, [ assetTypeAddressSelected ])

  const onHandleChangeName = useCallback(() => {
    if(assetTypeNamesSelected.length > 0) {
      onChangeName()
    } else {
      alert('Please select name first.')
    }
  }, [ assetTypeNamesSelected ])

  const onHandleCorrectName = useCallback(() => {
    if(assetTypeNamesSelected.length > 0) {
      onCorrectName(undefined, assetTypeNamesGroups, mainCompaniesSelected)
      console.log("onHandleCorrectName", assetTypeNamesSelected, assetTypeNamesGroups, mainCompaniesSelected)
    } else {
      alert('Please select name first.')
    }
  }, [ assetTypeNamesSelected, assetTypeNamesGroups, mainCompaniesSelected ])

  const onHandleNamesCancel = useCallback(() => {
    dispatch(setNameQueueDisplay(false))
    dispatch(setNameQueueData([]))
    dispatch(setNameQueueLoading(false))    
  }, [dispatch])

  const onHandleSubmitNamesUSPTO = useCallback(async() => {
    if( fixedTransactionName.length > 0 ) {
      const form = new FormData()
      form.append('id', fixedTransactionName[0][0])
      form.append('new_name', fixedTransactionName[0][1])
      form.append('company_ids', JSON.stringify(selectedMainCompanies))
      const { data } = await PatenTrackApi.fixedTransactionNameXML(form)
 
      if( data != null && data != '') {
        downloadFile(data)
      }
    }
  }, [ dispatch, fixedTransactionName ])

  const onHandleAddressCancel = useCallback(() => {
    dispatch(setAddressQueueDisplay(false))
    dispatch(setAddressQueueData([]))
    dispatch(setAddressQueueLoading(false))    
  }, [dispatch])

  const onHandleSubmitAddressUSPTO = useCallback(async() => {
    if( fixedTransactionAddress.length > 0 ) {
      const form = new FormData()
      form.append('id', fixedTransactionAddress[0][0])
      form.append('update_address', fixedTransactionAddress[0][1])
      form.append('company_ids', JSON.stringify(selectedMainCompanies))
      const { data } = await PatenTrackApi.fixedTransactionAddressXML(form)

      if( data != null && data != '') {
        downloadFile(data)
      }
    }
  }, [ dispatch, fixedTransactionAddress ])

  const onHandleLinkAssetWithSheet = useCallback(async() => {
    if(link_assets_selected.length > 0 && link_assets_sheet_type.type !== null && link_assets_sheet_type.asset !== null && link_assets_sheet_display === true) {
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
        form.append('asset', decodeURIComponent(link_assets_sheet_type.asset))
        form.append('values', JSON.stringify(link_assets_selected))
        const { data } = await PatenTrackApi.linkSheetUpdateData(form, link_assets_sheet_type.type)
        console.log('updateSHeet', data)
      }      
    }
  }, [link_assets_selected, link_assets_sheet_type])

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
          onAttachmentOpenedFileAndEmail={onAttachmentOpenedFileAndEmail}
          onAttachmentFile={onAttachmentFile} 
          onAttachmentDriveFile={onAttachmentDriveFile}
          onMaintainenceFeeReview={onHandleReviewMaintainenceFee} 
          onMaintainenceFeeFile={onMaintainenceFeeFile}
          onSubmitUSPTO={onHandleSubmitToUSPTO}
          onSalesAssets={onSalesAssets}
          onCorrectAddress={onHandleCorrectAddress}
          onChangeAddress={onHandleChangeAddress}
          onCorrectName={onHandleCorrectName}
          onChangeName={onHandleChangeName}
          onShare={onShare} 
          loadingUSPTO={loadingUSPTO}
          category={category}
          driveBtnActive={driveButtonActive}
          maintainenceMode={maintainenceFrameMode}
          selectedAssets={selectedAssetsPatents}
          driveTemplateMode={driveTemplateMode}
          addressQueuesDisplay={addressQueuesDisplay} 
          nameQueuesDisplay={nameQueuesDisplay} 
          onHandleAddressCancel={onHandleAddressCancel}        
          onHandleSubmitAddressUSPTO={onHandleSubmitAddressUSPTO}
          onHandleSubmitNamesUSPTO={onHandleSubmitNamesUSPTO}
          onHandleNamesCancel={onHandleNamesCancel}
          onHandleLinkAssetWithSheet={onHandleLinkAssetWithSheet}
          linkAssetsSheetDisplay={link_assets_sheet_display}
          linkAssetsSelected={link_assets_selected}
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