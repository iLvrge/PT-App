import React, { useEffect, useRef, useState } from 'react'
import AtButton from './AtButton'
import AttachButton from './AttachButton'
import SendIcon from '@material-ui/icons/Send'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import useStyles from './styles'
const CustomToolbar = ({ quillEditor, quill,  onClick, onUserClick, menuItems, onDocument, onAttachmentOpenedFile, onAttachmentFile, onAttachmentDriveFile, onMaintainenceFeeReview, onMaintainenceFeeFile, onSubmitUSPTO, loadingUSPTO, category, driveBtnActive, maintainenceMode, selectedAssets, driveTemplateMode }) => {
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
  
  useEffect(() => {
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
  }, [ toolBarRef ])

  const createTemplate = () => {
    if( selectedAssets.length > 0 ) {
      setBtnActive(previousItem => {
        return !previousItem
      })
      onDocument(!btnActive)
    } else {
      alert("Please select asset from list first.")
    }    
  }
  
  return (
    <div id='toolbar' ref={toolBarRef}>
      {/* <select className='ql-header' defaultValue={''} onChange={e => e.persist()}>
        <option value='1' />
        <option value='2' />
        <option selected />
      </select> */}
      <Tooltip title="Bold" arrow classes={classesTooltip}>
        <button className='ql-bold'>
          <FormatBoldIcon />
        </button>
      </Tooltip>
      <Tooltip title="Italic" arrow classes={classesTooltip}>
        <button className='ql-italic'>
          <FormatItalicIcon />
        </button> 
      </Tooltip>       
      {/* <select className='ql-color'>
        <option value='red' />
        <option value='green' />
        <option value='blue' />
        <option value='orange' />
        <option value='violet' />
        <option value='#d0d1d2' /> 
        <option selected />
      </select> */}
      <Tooltip title="Mention someone" arrow classes={classesTooltip}>
        <button className={'ql-atButton'} onClick={onUserClick}>
          <AtButton />
        </button>
      </Tooltip> 

      <Tooltip title="Attach the open document" arrow classes={classesTooltip}>
        <button className={'ql-attachButton'} onClick={onAttachmentOpenedFile}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="MuiSvgIcon-root"><g><path d="M382,129.7V108h.3a9.631,9.631,0,0,0,9.7-9.9V72.7a9.463,9.463,0,0,0-9.7-9.7H313.5a9.3,9.3,0,0,0-9.5,9.7V98.2c0,5.5,4,9.9,9.5,9.9h.5v21.7a10.074,10.074,0,0,0-2.1,2A50.882,50.882,0,0,0,297,168.1v2.2a9.523,9.523,0,0,0,9.7,9.7H338v39.3a10,10,0,0,0,20,0V180h31.3a9.523,9.523,0,0,0,9.7-9.7v-2.2a50.882,50.882,0,0,0-14.9-36.3A13.86,13.86,0,0,0,382,129.7ZM324,83h48v5H324Zm10,25h28v10.7a45.955,45.955,0,0,0-13.7-1.7h-.5a50.184,50.184,0,0,0-13.8,1.7Zm-16.3,52a32,32,0,0,1,8.2-14.3,30.705,30.705,0,0,1,3.4-2.9c.3-.2.6-.2.8-.5a30.888,30.888,0,0,1,17.8-5.4h.3a30.8,30.8,0,0,1,17.7,5.4l.9.6a29.708,29.708,0,0,1,3.4,2.8,33.076,33.076,0,0,1,8.2,14.2H317.7Z" /><path d="M347,9.4A136.107,136.107,0,0,0,230,75H126.3a9.807,9.807,0,0,0-7.1,2.8L30.1,167a9.865,9.865,0,0,0-3.1,7V452.8C27,480.4,49.8,503,77.4,503H316.7A50.511,50.511,0,0,0,367,452.8V282.9c66-9.6,117.7-66.9,117.7-136C484.7,71,422.9,9.4,347,9.4ZM116,108.8v31.1A23.9,23.9,0,0,1,92.3,164H61.5ZM316.7,483H77.4C60.9,483,47,469.3,47,452.8V184H92.3A43.831,43.831,0,0,0,136,139.9V95h83.8a136.89,136.89,0,0,0,22.5,141H152.2a10,10,0,0,0,0,20H263.3c23.1,18,51.6,28.2,83.6,28.3V452.8C347,469.3,333.2,483,316.7,483ZM347,264.3A117.62,117.62,0,0,1,229.5,146.8C229.5,82,282.2,29.2,347,29.2S464.6,82,464.6,146.8A117.641,117.641,0,0,1,347,264.3Z" /><path d="M111.8 236H82.3a10 10 0 0 0 0 20h29.5a10 10 0 1 0 0-20zM311.8 316H152.3a10 10 0 0 0 0 20H311.8a10 10 0 0 0 0-20zM111.8 316H82.3a10 10 0 0 0 0 20h29.5a10 10 0 1 0 0-20zM311.8 396H152.3a10 10 0 1 0 0 20H311.8a10 10 0 0 0 0-20zM111.8 396H82.3a10 10 0 0 0 0 20h29.5a10 10 0 0 0 0-20z"/></g></svg>
        </button>
      </Tooltip>

      <Tooltip title="Attach file" arrow classes={classesTooltip}>
        <button className={'ql-attachButton'} onClick={onAttachmentFile}>
          <AttachButton /> 
        </button>
      </Tooltip>

      <Tooltip title="Google Drive file" arrow classes={classesTooltip}>
        <button className={'ql-attachButton ql-attachDriveButton'} onClick={onAttachmentDriveFile}>
          <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google-drive" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-google-drive fa-w-16 fa-2x"><path fill="currentColor" d="M339 314.9L175.4 32h161.2l163.6 282.9H339zm-137.5 23.6L120.9 480h310.5L512 338.5H201.5zM154.1 67.4L0 338.5 80.6 480 237 208.8 154.1 67.4z" ></path></svg>
        </button>
      </Tooltip>

      <Tooltip title="Send message" arrow classes={classesTooltip}>
        <button className={'ql-saveButton'} onClick={onClick}>
          <SendIcon />   
        </button> 
      </Tooltip>      
      
      {loadingUSPTO && <CircularProgress size={24} className={classes.buttonProgress} />}
      {
        category == 'pay_maintainence_fee'
        ?
          maintainenceMode === false
          ? 
            <Button className={classes.review} onClick={onMaintainenceFeeReview}>Process Selections</Button>
          :
          <>
            <Button className={classes.review} onClick={onMaintainenceFeeFile}>Pay Maintenance Fees</Button>
            <Button className={classes.review} onClick={onMaintainenceFeeReview}>Cancel</Button>
          </>
        :
        <>
          <Button className={classes.review} onClick={onSubmitUSPTO} disabled={loadingUSPTO}>Submit to USPTO</Button>
          <Button className={`${classes.review} ${driveTemplateMode === true ? classes.active : ''}`} onClick={createTemplate}>{driveTemplateMode === true ? 'Close ' : 'Select a '}Document Templates</Button>
        </>
      }      
      {/* 
      <button className={classes.review} onClick={onMaintainenceFeeReview}><Typography variant='body2'>Review Maintainence</Typography></button>
      <button className={classes.review} onClick={onMaintainenceFeeFile}><Typography variant='body2'>Maintainence Fee</Typography></button>
      <button className={classes.review} onClick={onDocument}><Typography variant='body2'>Templates</Typography></button> */}
    </div> 
  )
}

CustomToolbar.modules = {
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
  'link', 'image', 'color',
]

export default CustomToolbar
