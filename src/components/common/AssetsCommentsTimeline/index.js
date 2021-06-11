import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'moment'
import { Paper,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
  Modal,
  Grid,
  Typography
} from '@material-ui/core'
import { 
  Folder as FolderIcon,
  Close as CloseIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
  InsertDriveFile as InsertDriveFileIcon
} from '@material-ui/icons'

import { Droppable } from 'react-drag-and-drop'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import PatenTrackApi from '../../../api/patenTrack2'
import { numberWithCommas, applicationFormat } from "../../../utils/numbers"
import { controlList } from "../../../utils/controlList"
import QuillEditor from '../QuillEditor'
import Googlelogin from '../Googlelogin' 
import useStyles from './styles'
import { FaChevronCircleDown } from 'react-icons/fa'
import {
  getGoogleAuthToken,
  getLayoutTemplatesByID,
  sendMessage,
  getChannelID,
  getSlackMessages, 
  getSlackUsersList,  
  getGoogleProfile,
  setLayoutTemplatesByID,
  setTemplateDocument,
  getChannels,
  getSlackProfile
} from '../../../actions/patentTrackActions2'

import {
  setMaintainenceFeeFrameMode,
  setDriveTemplateFrameMode,
  setDriveTemplateMode,
  setDriveButtonActive
} from '../../../actions/uiActions'


import { setTokenStorage, getTokenStorage, removeTokenStorage } from '../../../utils/tokenStorage'

import { html } from '../../../utils/html_encode_decode'

import { capitalizeEachWord } from '../../../utils/numbers'

const AssetsCommentsTimeline = ({ toggleMinimize, size, setChannel, channel_id, illustrationBar }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const googleLoginRef = useRef(null)
  const inputFile = useRef(null)
  const timelineRef = useRef(null)
  const frameRef = useRef( null )
  const editorContainerRef = useRef(null)
  const [ isLoadingcomments, setIsLoadingcomments ] = useState(false)
  const [ commentsData, setCommentsData ] = useState({messages: [], users: []})
  const [ editData, setEditData ] = useState(null)
  const companyListLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const selectedCommentsEntity = useSelector(state => state.patenTrack2.selectedCommentsEntity)
  const userProfile = useSelector(state => state.patenTrack.profile)
  const driveButtonActive = useSelector(state => state.ui.driveButtonActive)
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  const selectPatents = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.assetTypeAssignments.selected)
  const currentRowSelection = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const slack_messages = useSelector(state => state.patenTrack2.slack_messages)
  const layout_id = useSelector(state => state.patenTrack2.layout_id)
  const google_profile = useSelector(state => state.patenTrack2.google_profile)
  
  const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)
  const slack_auth_token = useSelector(state => state.patenTrack2.slack_auth_token)
  /* const slack_profile_data = useSelector( state => state.patenTrack2.slack_profile_data ) */
  const template_document_url = useSelector(state => state.patenTrack2.template_document_url)
  const [ selectUser, setSelectUser] = useState(null)
  const [ replyId, setReplyId ] = useState(null)
  const [ file, setFile ] = useState(null)
  const [ displayButton, setDisplayButton] = useState( true )
  const [ commentHtml, setCommentHtml ] = useState('')
  
  const [ slackAuthLogin, setSlackAuthLogin ] = useState( true )
  const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
  const [ driveModal, setDriveModal ] = useState(false)
  const [ driveFilesAndFolder, setDriveFilesAndFolder ] = useState( {} )
  const [ selectedDriveFile, setSelectedDriveFile] = useState(null)
  const [ activeBtn, setActiveBtn] = useState({display: false})  
  const type = useMemo(() => selectedCommentsEntity && selectedCommentsEntity.type, [ selectedCommentsEntity ])

  useEffect(() => {
    checkButtons()
  }, [])

  useEffect(() => {
    checkButtons() 
  }, [ google_auth_token, slack_auth_token ])

  useEffect(() => {
    setCommentsData(slack_messages)
    updateHeight(size, timelineRef)
  }, [ slack_messages, size, timelineRef ])

  useEffect(() => {
    if( selectedAssetsPatents.length == 0 ) {
      setCommentsData([])
    }
  }, [ selectedAssetsPatents ])

  useEffect(() => {
    if(slack_auth_token && slack_auth_token != null ) {
      const { access_token } = slack_auth_token;
      if( access_token && access_token != null && (channel_id == '' || channel_id == null) && selectedAssetsPatents.length > 0) {
        dispatch( getChannelID( selectedAssetsPatents[0], selectedAssetsPatents[1] ) )
      }
    }
  }, [ dispatch, slack_auth_token, selectedAssetsPatents ] )

  useEffect(() => {
    updateHeight(size, timelineRef)
  }, [ size, timelineRef, illustrationBar ])

  useEffect(() => {
    if(commentsData.messages != undefined && commentsData.messages.length > 0) {
      setTimeout(() => {
        findElementAddClick()
      }, 2000)
    }
  }, [ commentsData ] )

  const findElementAddClick = () => {
    const elements = document.getElementsByClassName('message_link');
    if(elements.length > 0) {
      for (let i=0; i < elements.length; i++) {
        elements[i].onclick = (event) => {
          openFile(event, elements[i].getAttribute('data-link'))
        }
      }      
    }
  }

  const checkButtons = () => {
    try{
      
      const slackToken = getTokenStorage( 'slack_auth_token_info' ), googleToken = getTokenStorage( 'google_auth_token_info' )
      let slackLoginButton = true, googleLoginButton = true
      if(slackToken && slackToken!= '') {
        let token = JSON.parse(slackToken)
        
        if(typeof token === 'string') {
          token = JSON.parse(token)
          setTokenStorage( 'slack_auth_token_info', token )
        }
        
        if(typeof token === 'object') {
          slackLoginButton =  false           
          const { access_token } = token          
          if(access_token && access_token != '') {
            slackLoginButton =  false 
          }
        }        
      }
      
      if(googleToken && googleToken != '') {
        const tokenParse = JSON.parse( googleToken )
        const { access_token } = tokenParse
        if( access_token ) {
          googleLoginButton =  false 
          dispatch(getGoogleProfile(tokenParse))  
        } 
      }
      setSlackAuthLogin(slackLoginButton)
      setGoogleAuthLogin(googleLoginButton)
    } catch ( err ) {
      console.error( err )
    }
  }

  const updateHeight = ( size, timelineRef ) => {
    if( timelineRef.current != null ) {
      console.log('updateHeight=>height', timelineRef.current.parentNode.clientHeight)
      let calHeight = timelineRef.current.parentNode.clientHeight - 96
      /* if(displayButton === false) {
        calHeight = timelineRef.current.parentNode.clientHeight - 96
      } */
      timelineRef.current.style.height = `${ calHeight }px`
    }    
  }

  const getLayout = useMemo(() => {
    return controlList.filter(item => item.category == selectedCategory)
  }, [selectedCategory, controlList])

  const openGoogleWindow = useCallback(() => {
    if(googleLoginRef.current != null) {
      googleLoginRef.current.querySelector('button').click()
    } 
    setGoogleAuthLogin( true )
    setDisplayButton( true )
  }, [googleLoginRef])
  
  const getDriveDocumentList = (flag) => {
    if( flag === true ) {      
      const googleToken = getTokenStorage( 'google_auth_token_info' )
      if(googleToken && googleToken != '' && googleToken != null ) {

        const { access_token } = JSON.parse(googleToken)

        if(access_token) {
          /**
           * Get Layout templates according to selected category
           */
          
          let profileInfo = google_profile;
          if(profileInfo == null || profileInfo == '' || (profileInfo != null && !profileInfo.hasOwnProperty('email'))) {
            const getGoogleProfile = getTokenStorage('google_profile_info')
            if( getGoogleProfile != '') {
              profileInfo = JSON.parse(getGoogleProfile)
            }
          }
          let  layoutID = layout_id
          if(layoutID == 0 && selectedCategory != '') {
            const item = getLayout
            if(item.length > 0) {
              layoutID = item[0].layout_id
            }
          }
          console.log("openTemplateDriveFiles",profileInfo)
          if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
            //dispatch(setDriveButtonActive( true )) // it will set when user click on drive file link
            dispatch( 
              setDriveTemplateMode(true) 
            )
            dispatch( 
              getLayoutTemplatesByID(layoutID, profileInfo.email) 
            )
          }
        } else {
          //alert("Please first login with google account.")
          if(googleLoginRef.current != null) {
            googleLoginRef.current.querySelector('button').click()
          } 
          setGoogleAuthLogin( true )
          setDisplayButton( true )
        }
      } else {
        //alert("Please first login with google account.")
        if(googleLoginRef.current != null) {
          googleLoginRef.current.querySelector('button').click()
        }
        setGoogleAuthLogin( true )
        setDisplayButton( true )
      }    
    } else {   
      dispatch(setDriveButtonActive( false ))
      dispatch(setDriveTemplateFrameMode( false ))
      dispatch(setDriveTemplateMode(false))
      dispatch(setLayoutTemplatesByID({ list: [], message: '' }))
    }
    
  }


  const handleSubmitComment = useCallback(async () => {
    if(selectedAssetsPatents.length > 0) {
      const formData = new FormData()
      formData.append('text',  html.encode(commentHtml) )
      if(selectedCategory == 'correct_details') {
        formData.append('transaction', selectedAssetsTransactions.length == 1 ? selectedAssetsTransactions[0] : currentRowSelection )
      } else {
        formData.append('asset', selectedAssetsPatents.length == 2 &&  selectedAssetsPatents[0] === '' ? selectedAssetsPatents[1] : selectedAssetsPatents[0])
      }
      formData.append('asset_format', selectedAssetsPatents.length == 2 &&  selectedAssetsPatents[0] === '' ? 'us'+selectedAssetsPatents[1] : 'us'+selectedAssetsPatents[0])
      formData.append('user', selectUser == null ? '' : selectUser)
      formData.append('reply', replyId == null ? '' : replyId)
      formData.append('edit',editData == null ? '' : editData)
      formData.append('file',file == null ? '' : file)
      formData.append('channel_id', channel_id)
      const slackToken = getTokenStorage( 'slack_auth_token_info' )
      if( slackToken  && slackToken != null ) {
        const { access_token } = JSON.parse(slackToken)

        if( access_token != undefined) {
          const { data } = await PatenTrackApi.sendMessage(access_token, formData)

          setCommentHtml('')
  
          if(data != '' && Object.keys(data).length > 0) {
            const { status, channel } = data;
            if(status != '' && status == 'Message sent') {
              setEditData( null )
              if(channel_id != channel) {
                dispatch(setChannel({channel_id}))
                dispatch(getChannels())
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
    }    
  }, [ dispatch, commentHtml, selectedAssetsPatents, getSlackMessages, channel_id, selectUser, replyId, editData, file, selectedAssetsTransactions, currentRowSelection, selectedCategory ])

  const handleCancelComment = useCallback(() => {
    setCommentHtml('')
    setEditData(null)
  }, [])

  const onEdit = useCallback(async (event, comment) => {
    event.preventDefault()
    setEditData( true )
    setReplyId(comment.ts)
    const commentText = comment.text
    setCommentHtml(commentText.replace(/<p><br><\/p>/g, ''))
  }, [])

  const onDelete = useCallback(async (event, comment) => {
    event.preventDefault()
    if(channel_id != '' && channel_id != null ) { 
      const { access_token } = JSON.parse(getTokenStorage( 'slack_auth_token_info' ))
      if(access_token != null && access_token != '' && access_token != undefined) {
        const { status } = await PatenTrackApi.deleteSlackMessage(access_token, channel_id, comment.ts)
        if (status === 200) {
          dispatch( getSlackMessages( channel_id ) )
        }
      }      
    }
  }, [ dispatch, getSlackMessages, channel_id ]) 

  const onUpdateTeamID = async(team) => {
    const form = new FormData()
    form.append('team',  team )
    const { status } = await PatenTrackApi.updateSlackTeam(form)
    if (status === 200) {
      console.log("Team updated")
    }
  }



  const onHandleSlackLogin = (w,h) => {    
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop

    const windowOpen = window.open(`https://slack.com/oauth/v2/authorize?user_scope=${process.env.REACT_APP_SLACK_USER_SCOPE}&client_id=${process.env.REACT_APP_SLACK_CLIENTID}&redirect_uri=${process.env.REACT_APP_SLACK_REDIRECT_URL}`, 'Slack Login', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)

    if(windowOpen != null) {
      checkWindowClosedStatus(windowOpen)
    } 
  }

  const checkWindowClosedStatus = (windowRef) => {
    setTimeout(() => {
      if(windowRef.closed === true) {
        checkButtons()
        checkSlackAuth()
      } else {
        checkWindowClosedStatus(windowRef)
      }
    }, 500)
  }

  const checkSlackAuth = useCallback(() => {
    const slackToken = getTokenStorage( 'slack_auth_token_info' )
		if(slackToken && slackToken!= '') {
      const { access_token, team, id } = JSON.parse( slackToken )
      if( access_token && access_token != null ) {
        /**
         * Set team ID
         */
        onUpdateTeamID(team)
        dispatch(getSlackProfile(access_token, id))

        if( selectedAssetsPatents.length > 0 ) {        
          if( channel_id == '' || channel_id == null ) {
            dispatch( getChannelID( selectedAssetsPatents[0], selectedAssetsPatents[1] ) ) //get channel for selected asset
          } else {
            dispatch( getSlackMessages( channel_id ) ) //getMessages for selected channel
          }  
        }
      }			
		}
  }, [ dispatch, selectedAssetsPatents, channel_id ] )


  const onHandleFileInputChange = useCallback( event => {
    if(event.target.files.length > 0) {
      const file = event.target.files[0]
      const element = document.createElement('div')
      element.setAttribute('class', 'editor-attachment') 
      const editor = editorContainerRef.current.querySelector('.ql-editor')
      const itemElement = document.createElement('div')
      itemElement.setAttribute('class', 'item') 
      if(file.type.indexOf('image') !== -1) {
        itemElement.innerHTML = `<img src="${URL.createObjectURL(file)}" class="attachment_image"/>`
      } else {
        itemElement.innerHTML = `<svg width="24" height="24" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="file" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zm-22.6 22.7c2.1 2.1 3.5 4.6 4.2 7.4H256V32.5c2.8.7 5.3 2.1 7.4 4.2l83.9 83.9zM336 480H48c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16h176v104c0 13.3 10.7 24 24 24h104v304c0 8.8-7.2 16-16 16z" class=""></path></svg> ${file.name}`
      }
      const anchor = document.createElement('a')
      anchor.innerHTML = `<svg aria-hidden="true" width="15" focusable="false" data-prefix="far" data-icon="times-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z" class=""></path></svg>`
      anchor.setAttribute('href','javascript://')
      anchor.setAttribute('class','remove-attachment')
      anchor.onclick = function() {
        editor.parentNode.removeChild(editor.parentNode.querySelector('.editor-attachment'))
      }
      itemElement.insertBefore(anchor, itemElement.firstElementChild)
      element.appendChild(itemElement)
      if(editor.parentNode.querySelector('.editor-attachment') != null) {
        editor.parentNode.removeChild(editor.parentNode.querySelector('.editor-attachment'))
      }      
      editor.parentNode.insertBefore(element, editor.nextSibling)
    }
  }, [ editorContainerRef ])
  
  const onHandleFileExplorer = useCallback(() => {    
    if( inputFile.current != null ) {
      inputFile.current.click()
      inputFile.current.addEventListener('change', onHandleFileInputChange)
    }
  }, [ inputFile ])
  
const onAttachmentOpenedFile = useCallback(() => {    
  if( template_document_url != 'about:blank' && template_document_url != null ) {
    setCommentHtml( previousContent => previousContent + ' ' + template_document_url)
  }
}, [ template_document_url, editorContainerRef ] )

const onHandleDriveExplorer = async( event, fileID = undefined ) => {
  event.preventDefault()  
  const googleToken = getTokenStorage( 'google_auth_token_info' )
  if(googleToken != '' && googleToken != null) {
    const tokenParse = JSON.parse(googleToken)
    const { access_token } = tokenParse

    if( access_token ) {
      /**
       * Send request to server to get drive files and folder
       */
      setDriveModal(true)
      const { data } = await PatenTrackApi.getGoogleTemplates(tokenParse, fileID)
      setDriveFilesAndFolder(data.list)
    }
  } else {
    alert('Token Expired, please first login with google account.')
    checkButtons()
    getDriveDocumentList()
    openGoogleWindow()
  }  
}

const onHandleFile = (event) => {
  event.preventDefault()
  setFile(event.target.value)
}



const handleDriveModalClose = (event) => {
  event.preventDefault()
  setDriveModal(false)
}
  
  const onHandleGoogleSignout = () => {
    removeTokenStorage('google_auth_token_info')
    setGoogleAuthLogin(true)
  }

  const onHandleSlackSignout = () => {
    removeTokenStorage('slack_auth_token_info')
    setSlackAuthLogin(true)
  }

  const handleFocus = useCallback((range, source, editor) => {
    const getSlackUser = getTokenStorage( 'slack_auth_token_info' );
    if(getSlackUser &&  getSlackUser != '') {
      editorContainerRef.current.classList.add('focus')
    }    
  }, [ editorContainerRef ])

  const handleBlur = useCallback((previousRange, source, editor) => {
    editorContainerRef.current.classList.remove('focus');
  }, [ editorContainerRef ])

  const openDriveFolder = (event, itemID, itemName) => {
    event.preventDefault()
    console.log("openDriveFolder", itemID)
    onHandleDriveExplorer(event, itemID)
  }

  const onHandleSelectFile = (event, itemID) => {
    event.preventDefault()
    console.log("onHandleSelectFile", itemID)
    //setSelectedDriveFile(`https://docs.google.com/document/d/${itemID}/edit`)
    setCommentHtml( previousContent => previousContent + `https://docs.google.com/document/d/${itemID}/edit`)
    setDriveModal( false )
  }

  const onDrop = (data, event) => {
    console.log("onDrop", data)
    setCommentHtml( previousContent => previousContent + ` ${data.template_agreement}`)
  }

  const openFile = useCallback((event, file) => {
    event.preventDefault()
    if((typeof file == 'string' && file.indexOf('docs.google.com') !== -1) || (file.hasOwnProperty('external_url') && file.hasOwnProperty('external_type') && file.external_type == 'gdrive') || (file.hasOwnProperty('external_url') && file.external_url.indexOf('docs.google.com') !== -1)) {
      dispatch(
        setDriveTemplateFrameMode(true)
      )
      dispatch(
        setTemplateDocument( typeof file == 'string' ? file : file.external_url)
      )
    } else {
      window.open(file.permalink, '_blank')
    }
  }, [ dispatch ])

  const onSalesAssets = useCallback(async () => {
    if( selectPatents.length == 0) {

    }
  }, [ selectPatents ])

  const renderCommentEditor = useMemo(() => {
    //if (!selectedCommentsEntity) return null
    return (
      <div className={`${classes.commentEditor} editor`} ref={editorContainerRef}> 
        <QuillEditor
          value={commentHtml}
          onChange={setCommentHtml}
          onSubmit={handleSubmitComment}
          onCancel={handleCancelComment}
          openGoogleWindow={openGoogleWindow}
          onDrive={getDriveDocumentList}
          onSalesAssets={onSalesAssets}
          onAttachmentFile={onHandleFileExplorer}
          onAttachmentOpenedFile={onAttachmentOpenedFile}
          onAttachmentDriveFile={onHandleDriveExplorer}
          onSelectUser={setSelectUser}
          onFocus={handleFocus}
          onBlur={handleBlur} 
          driveFile={selectedDriveFile} 
        />
        <input type='file' id='attach_file' ref={inputFile} style={{display: 'none'}} onChange={onHandleFile}/>
      </div> 
    )
  }, [ selectedCommentsEntity, commentHtml, handleSubmitComment, handleCancelComment, classes ])

  const ShowUser = ({users, item}) => {    
    if(users.length === 0) return item.user
    const checkUser = users.findIndex( user => user.id == item.user)
    return (
      <span>
        {
          checkUser !== -1
          ?
            users[checkUser].profile.first_name 
            ? `${users[checkUser].profile.first_name} ${users[checkUser].profile.last_name}`
            : users[checkUser].name
          :
          item.user
        }
        {
          checkUser !== -1 
          ? users[checkUser].profile.title 
            ? 
            ', '+ capitalizeEachWord(users[checkUser].profile.title) 
            : ''
          : ''
        }
        <span className={classes.message_time}>{Moment(new Date(item.ts * 1000)).format('l HH:mm')}</span>
      </span>
    )
  }


  const ShowUserAvtar = ({users, item}) => {
    if(users.length === 0) return <Avatar>{`${item}`}</Avatar>
    const checkUser = users.findIndex( user => user.id === item)
    if(checkUser >= 0) {
      return <Avatar alt={`${users[checkUser].profile.display_name}`} src={users[checkUser].profile.image_48} className={classes.small}/>
    } else {
      return <Avatar>{`${item}`}</Avatar>
    }
  }

  const ShowButtons = ({indexing, item, comment}) => {
    const getSlackUser = getTokenStorage( 'slack_auth_token_info' );
    if(getSlackUser &&  getSlackUser != '') {
      const {id} = JSON.parse(getSlackUser)
      const { subtype } = comment
      if(item === id && (subtype == undefined || (subtype != undefined && subtype != 'group_join'))) {
        return <>
          <Button key={`${indexing}-1`} color="primary" onClick={(event) => { onEdit(event, comment) }} size="small" >
            Edit
          </Button>
          <Button key={`${indexing}-2`} color="primary" onClick={(event) => {onDelete(event, comment)}} size="small">
            Delete
          </Button>
        </>
      } else {
        return null
      }
    } else {
      return null
    }    
  }

  const FileImage = ({file}) => {
    const fileURL = file !== 'string' && file.hasOwnProperty('external_url') ? file.external_url : ''
    let imageURL = ''
    if(fileURL.toString().indexOf('docs.google.com') !== -1 && fileURL.toString().indexOf('document') !== -1){
      imageURL = 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document'
    } else if(file.hasOwnProperty('external_type') && file.hasOwnProperty('thumb_64')){
      imageURL = fileURL.thumb_64
    }
    return(
      <>
      {
        imageURL != '' && (
          <img src={imageURL} />
        )
      }
      </>
    )
  }

  const ShowFiles = ({indexing, files}) => {
    if(!files.hasOwnProperty('files') || files.files.length == 0) return null

    return (
      <>
        {
          files.files.map( (file, index) => (
            <div key={`${indexing}-${index}`}>
              <a onClick={(event) => { openFile(event, file)}} className={classes.fileLink}><FileImage file={file}/>{file.title}</a>
            </div>
          ))
        }
      </>
    )
  }

  const TimelineItem = ({users, comment}) => {
    
    if(comment.hasOwnProperty('subtype')) return null
    let message = comment.text
    if(message.indexOf('docs.google.com') !== -1) {
      const match = message.match(/<([^\s>]+)(\s|>)+/)
      if(match != null) {
        const link = match[1]
        if( typeof comment.files != 'undefined' &&  comment.files.length == 1 ) {
          if(comment.files[0].external_type == 'gdrive' &&  link == comment.files[0].external_url ) {
            message = ''
          }
        } else {
          message += `<div><a href='#' class='message_link' data-link="${link}">${link}</a></div>`
        }
      }
    } 
    return (
      <TimelineEvent
        key={`comment-${comment.ts}`}
        contentStyle={{ background: '#303030' }}
        bubbleStyle={{ 
          background: 'rgb(48 48 48)', 
          border: '2px solid #303030',
          width: '40px', 
          height: '40px', 
        }}
        cardHeaderStyle={{ color: 'white' }}
        title={<ShowUser users={users} item={comment} />}
        icon={<ShowUserAvtar users={users} item={comment.user} />}
        iconStyle={{width: '36px', height: '36px'}}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: message }} />
        <ShowFiles 
          files={comment} 
          indexing={`file-comment-${comment.ts}`} />
        {/* <ShowButtons 
          item={comment.user} 
          comment={comment} 
          indexing={`button-comment-${comment.ts}`} /> */}
      </TimelineEvent>
    )
  }

  const renderCommentsTimeline = useMemo(() => {
    return (
      <div className={classes.commentTimelineSection} ref={timelineRef}>   
        {
          type && isLoadingcomments ? (
            <CircularProgress className={classes.loader} />)
          :
            commentsData.messages != undefined && commentsData.messages.length > 0 ? (
            <Timeline 
              className={classes.timeline} 
              lineColor={'rgb(191 191 191)'}>
              {
                commentsData.messages.map( (comment, index) => (
                  <TimelineItem key={index} users={commentsData.users} comment={comment}/>                  
                ))
              }            
            </Timeline>
            )
            : 
            <div />
        }
      </div>
    )
  }, [ isLoadingcomments, commentsData, type, userProfile, classes, onDelete, onEdit ])

  const FolderList = ({items}) => {
    return items.map( item => {
      if(item.mimeType == 'application/vnd.google-apps.folder'){
        return (
            <div key={item.id} className={classes.item} onClick={(event) => openDriveFolder(event, item.id, item.name)}>
              <Typography variant="body1" component="h2">
                <FolderIcon /><span>{item.name}</span>
              </Typography>
            </div>
        )
      } else {
        return null
      }
    })
  }

  const FilesList = ({items}) => {
    return items.map( item => {
      if(item.mimeType != 'application/vnd.google-apps.folder'){
        return (
          <div key={item.id} className={classes.item} onClick={(event) => onHandleSelectFile(event, item.id)}>
            <Typography variant="body1" component="h2">
              <InsertDriveFileIcon /><span>{item.name}</span>
            </Typography>
          </div>
        )
      } else {
        return null
      }
    })
  }

  const templateBody = useMemo(() => {   
    return (
      <Grid container className={classes.driveModal}>
        {
          driveFilesAndFolder.hasOwnProperty('files') && driveFilesAndFolder.files.length > 0
          ?
          <>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body1" component="h2" className={classes.heading}>
                Folders
              </Typography>
              <Grid item lg={12} md={12} sm={12} xs={12} className={classes.items}>
                <FolderList items={driveFilesAndFolder.files} />
              </Grid>              
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body1" component="h2" className={classes.heading}>
                Files
              </Typography>
              <Grid item lg={12} md={12} sm={12} xs={12} className={classes.items}>
                <FilesList items={driveFilesAndFolder.files} />
              </Grid>
            </Grid>
          </> 
          :
          ''
        } 
      </Grid>
    )    
  }, [ driveFilesAndFolder ])

  if (companyListLoading) return null
  return (
    <Paper className={classes.root} square>
      <div className={classes.content}>
        {
          displayButton === true
          ?
          <div className={classes.button}>
            {
              slackAuthLogin && (<Button 
                onClick={() => {
                  onHandleSlackLogin(900, 830)
                }
                }
              >
                <img 
                  alt='Sign in with Slack' 
                  height='40' 
                  width='172' 
                  src='https://platform.slack-edge.com/img/sign_in_with_slack.png' 
                  srcSet='https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x' />
              </Button>)              
            }

            {
              googleAuthLogin && (
                <span ref={googleLoginRef}>
                  <Googlelogin/>
                </span>)
            }
          </div> 
          :
          ''
        }
        { renderCommentsTimeline }  
        { renderCommentEditor }
      </div>
      <Modal
        open={driveModal}
        onClose={(e) => handleDriveModalClose(e)}
        aria-labelledby="Drive-Files-Modal"
        aria-describedby=""
      >
        {templateBody}
      </Modal>
    </Paper>
  )
}

export default AssetsCommentsTimeline
