import React, { useEffect, useRef } from 'react'
import AtButton from './AtButton'
import AttachButton from './AttachButton'
import SendIcon from '@material-ui/icons/Send'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import useStyles from './styles'
const CustomToolbar = ({ quillEditor, quill,  onClick, onUserClick, menuItems, onDocument, onAttachmentFile, onMaintainenceFeeReview, onMaintainenceFeeFile}) => {
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

      <Tooltip title="Send message" arrow classes={classesTooltip}>
        <button className={'ql-saveButton'} onClick={onClick}>
          <SendIcon />   
        </button>
      </Tooltip>      
      <Button className={classes.review} onClick={onMaintainenceFeeReview}>Review Maintainence</Button>
      <Button className={classes.review} onClick={onMaintainenceFeeFile}>Maintainence Fee</Button>
      <Button className={classes.review} onClick={onDocument}>Templates</Button>{/* 
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
