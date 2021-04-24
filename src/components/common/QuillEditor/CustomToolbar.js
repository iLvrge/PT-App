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
const CustomToolbar = ({ quillEditor, quill,  onClick, onUserClick, menuItems, onDocument, onAttachmentFile, onAttachmentDriveFile, onMaintainenceFeeReview, onMaintainenceFeeFile, onSubmitUSPTO, loadingUSPTO, category, driveBtnActive, maintainenceMode }) => {
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
    setBtnActive(previousItem => {
      console.log('createTemplate', previousItem, !previousItem)
      return !previousItem
    })
    onDocument(!btnActive)
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

      <Tooltip title="Attach file" arrow classes={classesTooltip}>
        <button className={'ql-attachButton'} onClick={onAttachmentFile}>
          <AttachButton /> 
        </button>
      </Tooltip>

      <Tooltip title="Google Drive file" arrow classes={classesTooltip}>
        <button className={'ql-attachButton'} onClick={onAttachmentDriveFile}>
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
        <>
          <Button className={classes.review} onClick={onMaintainenceFeeFile}>Pay Maint. Fees</Button>
          <Button className={`${classes.review} ${maintainenceMode === true ? classes.active : ''}`} onClick={onMaintainenceFeeReview}>Review Preliminary List</Button>          
        </>
        :
        <>
          <Button className={classes.review} onClick={onSubmitUSPTO} disabled={loadingUSPTO}>Submit to USPTO</Button>
          <Button className={`${classes.review} ${btnActive === true ? classes.active : ''}`} onClick={createTemplate}>Create a Document</Button>
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
