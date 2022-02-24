import React from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';

const AttachButton = () => (
  <AttachFileIcon />
)

AttachButton.handler = (quill) => () => {
  if (!quill) return
  // const range = quill.getSelection()
  // const cursorPosition = range.index
  // quill.insertText(cursorPosition, 'attach')
  // quill.setSelection(cursorPosition + 1)
}

export default AttachButton
