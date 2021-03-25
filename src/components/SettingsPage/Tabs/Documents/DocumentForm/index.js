import React, { Fragment, useCallback } from 'react'
import TextField from '@material-ui/core/TextField'
import { DropzoneArea } from 'material-ui-dropzone'
import useSytles from './styles'

const DocumentForm = ({ edited, onChangeField }) => {
  const classes = useSytles()

  const onChangeFile = useCallback((files) => {
    onChangeField('file')({ target: { value: files.length ? files[0] : null } })
  }, [ onChangeField ])

  return (
    <Fragment>
      <div className={classes.flex1}>
        <TextField
          size={'small'}
          variant="outlined"
          required
          label="Name"
          color={'secondary'}
          value={edited.name || ''}
          onChange={onChangeField('name')} />

        <TextField
          size={'large'}
          variant="outlined"
          color={'secondary'}
          rows={4}
          multiline
          label="Description"
          value={edited.description || ''}
          onChange={onChangeField('description')} />
      </div>
      <DropzoneArea
        classes={{ root: classes.dropzoneArea }}
        showFileNames
        filesLimit={1}
        onChange={onChangeFile}
      />

    </Fragment>
  )
}

export default DocumentForm
