import _last from 'lodash/last'
import Dialog from '@material-ui/core/Dialog'
import FileViewer from 'react-file-viewer'
import React from 'react'
import useStyles from './styles'

const FileViewerDialog = ({ viewerSrc, setViewerSrc }) => {
  const classes = useStyles()
  const onError = (e) => {
    console.log(e, 'error')
    //logger.logError(e, 'error in file-viewer');
  }
  return (
    <Dialog
      classes={{ paper: classes.paper }}
      open={!!viewerSrc}
      
      onClose={() => setViewerSrc('')}>
      {viewerSrc}
      {
        viewerSrc && (
          <FileViewer
            filePath={viewerSrc}
            fileType={_last(viewerSrc.split('.'))}
            onError={onError}
          />
        )
      }
    </Dialog>
  )
}

export default FileViewerDialog
