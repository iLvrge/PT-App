import React from 'react'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const AtButton = () => (
  <AlternateEmailIcon />
)

AtButton.handler = (quill) => () => {
  if (!quill) return
  // const range = quill.getSelection()
  // const cursorPosition = range.index
  // quill.insertText(cursorPosition, '★')
  // quill.setSelection(cursorPosition + 1)
}

export default AtButton
