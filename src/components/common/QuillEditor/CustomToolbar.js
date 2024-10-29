import React, { useEffect, useRef, useState } from 'react'
import AtButton from './AtButton'
import AttachButton from './AttachButton'
import SendIcon from '@mui/icons-material/Send'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import { IconButton, Tooltip, Typography, Zoom, Button, CircularProgress }  from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons"
import { getTokenStorage } from '../../../utils/tokenStorage'

import useStyles from './styles'
import { warnConsole } from '../../../utils/hashLocation'
const CustomToolbar = ({ quillEditor, quill,  onClick, onUserClick, menuItems, onDocument, onAttachmentOpenedFile, onAttachmentOpenedFileAndEmail, onAttachmentFile, onAttachmentDriveFile, onMaintainenceFeeReview, onMaintainenceFeeFile, onSubmitUSPTO, onCorrectAddress, onChangeAddress, onCorrectName, onChangeName, onSalesAssets, loadingUSPTO, category, driveBtnActive, maintainenceMode, selectedAssets, driveTemplateMode, onShare, addressQueuesDisplay, nameQueuesDisplay, onHandleSubmitAddressUSPTO, onHandleAddressCancel, onHandleSubmitNamesUSPTO, onHandleNamesCancel, onHandleLinkAssetWithSheet, linkAssetsSheetDisplay, linkAssetsSelected  }) => {
  const classes = useStyles()
  const toolBarRef = useRef(null) 

  const useStylesTooltip = makeStyles((theme) => ({
    tooltip: {
      backgroundColor: '#000'
    },
    arrow: {
      color: '#000'
    }  
  }))
 
  const classesTooltip = useStylesTooltip()
  const [ btnActive, setBtnActive] = useState( false )
  
  /* const onHandleFocusListener = () =>{
    console.log("onHandleFocusListener")
  }

  const onHandleBlurListener = () =>{
    console.log("onHandleBlurListener")
  }

  useEffect(() => {
    if( quillEditor.current != null ) {     
      quillEditor.current.editor.container.querySelector('.ql-editor').addEventListener('focus', onHandleFocusListener)
      quillEditor.current.editor.container.querySelector('.ql-editor').addEventListener('blur', onHandleBlurListener)
    }
  }, [ quillEditor ])  */
  
  /* useEffect(() => {
    if (!quill) return
    const toolbar = quill.getModule('toolbar')
    toolbar.addHandler('atButton', AtButton.handler(quill))
    toolbar.addHandler('attachButton', AttachButton.handler(quill))
  }, [ quill ])

  
  useEffect(() => {
    if(toolBarRef.current != null) {
      const bold = toolBarRef.current.querySelector('.ql-bold')
      bold.querySelector('svg').setAttribute('class', 'MuiSvgIcon-root')
      const italic = toolBarRef.current.querySelector('.ql-italic')
      italic.querySelector('svg').setAttribute('class', 'MuiSvgIcon-root')
    }
  }, [ toolBarRef ]) */
 
  const createTemplate = () => {
    if( selectedAssets.length > 0 ) {
      const googleToken = getTokenStorage( 'google_auth_token_info' )
      if(googleToken && googleToken != '') {
        const tokenParse = JSON.parse( googleToken )
        const { access_token } = tokenParse
        if( access_token ) {
          setBtnActive(previousItem => {
            return !previousItem
          })
          onDocument(!btnActive)
        } else {
          onDocument(true)
        }        
      } else {
        onDocument(true)
      }     
    } else {
      alert("Please select an asset from the list first.")
    }    
  }
  
  return (
    <div id='toolbar' ref={toolBarRef}>
      <Tooltip 
        title={
          <Typography color="inherit" variant='body2'>Mention someone</Typography>
        }
        enterDelay={0}
        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
        arrow 
        classes={classesTooltip}>
        <IconButton onClick={onUserClick} className={'ql-atButton'} size="large">
          <AtButton />
        </IconButton>
      </Tooltip> 

      <Tooltip 
        title={
          <Typography color="inherit" variant='body2'>Attach the open document</Typography>
        }
        arrow classes={classesTooltip}
        enterDelay={0}
        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
      >
        <IconButton
          onClick={onAttachmentOpenedFile}
          className={'ql-attachButton'}
          size="large">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="MuiSvgIcon-root"><g><path d="M382,129.7V108h.3a9.631,9.631,0,0,0,9.7-9.9V72.7a9.463,9.463,0,0,0-9.7-9.7H313.5a9.3,9.3,0,0,0-9.5,9.7V98.2c0,5.5,4,9.9,9.5,9.9h.5v21.7a10.074,10.074,0,0,0-2.1,2A50.882,50.882,0,0,0,297,168.1v2.2a9.523,9.523,0,0,0,9.7,9.7H338v39.3a10,10,0,0,0,20,0V180h31.3a9.523,9.523,0,0,0,9.7-9.7v-2.2a50.882,50.882,0,0,0-14.9-36.3A13.86,13.86,0,0,0,382,129.7ZM324,83h48v5H324Zm10,25h28v10.7a45.955,45.955,0,0,0-13.7-1.7h-.5a50.184,50.184,0,0,0-13.8,1.7Zm-16.3,52a32,32,0,0,1,8.2-14.3,30.705,30.705,0,0,1,3.4-2.9c.3-.2.6-.2.8-.5a30.888,30.888,0,0,1,17.8-5.4h.3a30.8,30.8,0,0,1,17.7,5.4l.9.6a29.708,29.708,0,0,1,3.4,2.8,33.076,33.076,0,0,1,8.2,14.2H317.7Z" /><path d="M347,9.4A136.107,136.107,0,0,0,230,75H126.3a9.807,9.807,0,0,0-7.1,2.8L30.1,167a9.865,9.865,0,0,0-3.1,7V452.8C27,480.4,49.8,503,77.4,503H316.7A50.511,50.511,0,0,0,367,452.8V282.9c66-9.6,117.7-66.9,117.7-136C484.7,71,422.9,9.4,347,9.4ZM116,108.8v31.1A23.9,23.9,0,0,1,92.3,164H61.5ZM316.7,483H77.4C60.9,483,47,469.3,47,452.8V184H92.3A43.831,43.831,0,0,0,136,139.9V95h83.8a136.89,136.89,0,0,0,22.5,141H152.2a10,10,0,0,0,0,20H263.3c23.1,18,51.6,28.2,83.6,28.3V452.8C347,469.3,333.2,483,316.7,483ZM347,264.3A117.62,117.62,0,0,1,229.5,146.8C229.5,82,282.2,29.2,347,29.2S464.6,82,464.6,146.8A117.641,117.641,0,0,1,347,264.3Z" /><path d="M111.8 236H82.3a10 10 0 0 0 0 20h29.5a10 10 0 1 0 0-20zM311.8 316H152.3a10 10 0 0 0 0 20H311.8a10 10 0 0 0 0-20zM111.8 316H82.3a10 10 0 0 0 0 20h29.5a10 10 0 1 0 0-20zM311.8 396H152.3a10 10 0 1 0 0 20H311.8a10 10 0 0 0 0-20zM111.8 396H82.3a10 10 0 0 0 0 20h29.5a10 10 0 0 0 0-20z"/></g></svg>
        </IconButton>
      </Tooltip>
      <Tooltip 
        title={
          <Typography color="inherit" variant='body2'>Attach file</Typography>
        }
        enterDelay={0}
        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
        arrow classes={classesTooltip}>
        <IconButton onClick={onAttachmentFile} className={'ql-attachButton'} size="large">
          <AttachButton /> 
        </IconButton>
      </Tooltip>

      <Tooltip 
        title={
          <Typography color="inherit" variant='body2'>Google Drive file</Typography>
        }
        enterDelay={0}
        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
        arrow classes={classesTooltip}>
        <IconButton
          className={'ql-attachButton ql-attachDriveButton'}
          onClick={onAttachmentDriveFile}
          size="large">
          <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google-drive" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-google-drive MuiSvgIcon-root"><path fill="currentColor" d="M339 314.9L175.4 32h161.2l163.6 282.9H339zm-137.5 23.6L120.9 480h310.5L512 338.5H201.5zM154.1 67.4L0 338.5 80.6 480 237 208.8 154.1 67.4z" ></path></svg>
        </IconButton>
      </Tooltip>

      <Tooltip 
        title={
          <Typography color="inherit" variant='body2'>Send message</Typography>
        }
        enterDelay={0}
        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
        arrow classes={classesTooltip}>
        <IconButton className={'ql-saveButton'} onClick={onClick} size="large">
          <SendIcon />   
        </IconButton> 
      </Tooltip>     
      {/* <span className={classes.seperator}></span>     
      <Tooltip 
        title={
          <Typography color="inherit" variant='body2'>Attach the open document and send email</Typography>
        }
        enterDelay={0}
        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
        arrow classes={classesTooltip}>
        <IconButton onClick={onAttachmentOpenedFileAndEmail} className={'ql-sendattachButton'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="MuiSvgIcon-root"><path d="M11 20H2.5A2.503 2.503 0 0 1 0 17.5v-13C0 3.122 1.122 2 2.5 2h19C22.878 2 24 3.122 24 4.5V18c0 .275-.225.5-.5.5s-.5-.225-.5-.5V4.5c0-.827-.673-1.5-1.5-1.5h-19C1.673 3 1 3.673 1 4.5v13c0 .827.673 1.5 1.5 1.5H11a.5.5 0 0 1 0 1z"/><path d="M12 14.03c-1.014 0-1.962-.425-2.67-1.194L3.122 6.048a.5.5 0 0 1 .739-.675l6.207 6.787c1.03 1.12 2.834 1.121 3.866-.001l6.195-6.777a.5.5 0 0 1 .739.675l-6.196 6.778c-.71.77-1.658 1.195-2.672 1.195z"/><path d="M3.492 17.215a.5.5 0 01-.337-.87l5.458-4.982a.499.499 0 11.675.738L3.83 17.084a.506.506 0 01-.338.131zM19.168 16a.495.495 0 01-.337-.131l-4.127-3.771a.5.5 0 11.675-.738l4.127 3.77a.5.5 0 01-.338.87z"/><path d="M20.542 22h-7.147A2.398 2.398 0 0 1 11 19.605v-.211a2.399 2.399 0 0 1 2.395-2.396h7.147A1.46 1.46 0 0 1 22 18.456c0 .887-.654 1.542-1.458 1.542H15a.5.5 0 0 1 0-1h5.542A.46.46 0 0 0 21 18.54c0-.336-.206-.542-.458-.542h-7.147c-.769 0-1.395.626-1.395 1.396v.211c0 .769.625 1.395 1.395 1.395h7.147A2.463 2.463 0 0 0 23 18.542C23 17.104 21.896 16 20.542 16H15c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h5.542A3.462 3.462 0 0 1 24 18.458C24 20.449 22.449 22 20.542 22z"/></svg>
        </IconButton>
      </Tooltip>

      <Tooltip 
        title={
          <Typography color="inherit" variant='body2'>{'Share Selected Assets'}</Typography>
        }    
        enterDelay={0}
        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
        classes={classesTooltip}>
        <IconButton className={`ql-share`} onClick={onShare} >
          <FontAwesomeIcon
            icon={faShareAlt}
          />
        </IconButton>
      </Tooltip>   
      <span className={classes.seperator}></span>  

      <div className={classes.secondaryGroup}>
      {loadingUSPTO && <CircularProgress size={24} className={classes.buttonProgress} />}
      {
        linkAssetsSheetDisplay === true && linkAssetsSelected.length > 0  
        ?
        <Button className={classes.review} onClick={onHandleLinkAssetWithSheet}>Process Selections</Button>  
        :
        ''
      }
      {
        category == 'pay_maintainence_fee'
        ?
          maintainenceMode === false
          ? 
            <>
              <Button className={classes.review} onClick={onMaintainenceFeeReview}>Process Selections</Button>
            </>
          :
            <>
              <Button className={classes.review} onClick={onMaintainenceFeeFile}>Pay Maintenance Fees</Button>
              <Button className={classes.review} onClick={onMaintainenceFeeReview}>Cancel</Button>
            </>
        :
        category == 'restore_ownership' || category == 'correct_details'
        ?
          <>
            <Button className={`${classes.review} ${driveTemplateMode === true ? classes.active : ''}`} onClick={createTemplate}>{driveTemplateMode === true ? 'Close ' : 'Create a '}Document</Button>
            <Button className={classes.review} onClick={onSubmitUSPTO} disabled={loadingUSPTO}>Submit to USPTO</Button>
          </>
        :
        category == 'correct_address' 
        ?
          addressQueuesDisplay === true
          ?
          <>
            <Button className={classes.review} onClick={onHandleSubmitAddressUSPTO}>Submit to USPTO</Button>
            <Button className={classes.review} onClick={onHandleAddressCancel}>Cancel</Button>
          </>
          :
          <>
            <Button className={classes.review} onClick={onCorrectAddress}>Correct Addresses</Button>
            <Button className={classes.review} onClick={onChangeAddress}>Change Addresses</Button>
          </>
        :
        category == 'correct_names' 
        ?
          <>
            <Button className={classes.review} onClick={onHandleSubmitNamesUSPTO}>Submit to USPTO</Button>
            <Button className={classes.review} onClick={onChangeName}>Change Name</Button>
          </>
        :
        category == 'sell_payments' 
        ?
          <Button className={classes.review} onClick={onSalesAssets}>Select Assets and Click Here</Button>
        :
        <Button className={`${classes.review} ${driveTemplateMode === true ? classes.active : ''}`} onClick={createTemplate}>{driveTemplateMode === true ? 'Close ' : 'Create a '}Document</Button>
      }      
      </div> */}
               
    </div>
  );
}

CustomToolbar.modules = {
  keyboard: {
    bindings: {
      shift_enter: {
        key: 13,
        shiftKey: true,
        handler: (range, ctx) => {
          console.log(range, ctx); // if you want to see the output of the binding
          this.editor.insertText(range.index, "\n");
        }
      },
      enter: {
        key: 13,
        handler: () => {
          const elementContainer = document.querySelector('.editorFullScreen') !== null ? document.querySelector('.editorFullScreen') : document.querySelector('.editor')
          elementContainer.querySelector('#toolbar').querySelector('.ql-saveButton').click()
        }
      }
    }
  },
  toolbar: { 
    container: '#toolbar',
    handlers: {   // Will be replaced in CustomToolbar
      atButton: () => {},
      attachButton: () => {},
    },
  },
  clipboard: {
    matchVisual: false,
  },
}

CustomToolbar.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color', 'slackusermention', 'span' ,'patentracklinebreak', 'microsoftat'
]

export default CustomToolbar
