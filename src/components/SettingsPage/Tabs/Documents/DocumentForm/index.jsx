import React, { Fragment, useCallback } from 'react'
import TextField from '@mui/material/TextField'
import { DropzoneArea } from 'react-mui-dropzone'

/**
 * The full-width rule previously reached the fields through
 * `.MuiTextField-root`; it now sits on the fields themselves.
 */
const DocumentForm = ({ edited, onChangeField }) => {
  const onChangeFile = useCallback(
    (files) => onChangeField('file')({ target: { value: files.length ? files[0] : null } }),
    [ onChangeField ]
  )

  return (
    <Fragment>
      <div className="mr-5 flex-1">
        <TextField
          className="w-full"
          size="small"
          variant="outlined"
          required
          label="Name"
          color="secondary"
          value={edited.name || ''}
          onChange={onChangeField('name')}
        />
        <TextField
          className="w-full"
          variant="outlined"
          color="secondary"
          rows={4}
          multiline
          label="Description"
          value={edited.description || ''}
          onChange={onChangeField('description')}
        />
      </div>
      <DropzoneArea
        classes={{ root: 'min-h-[170px] flex-1' }}
        showFileNames
        filesLimit={1}
        onChange={onChangeFile}
      />
    </Fragment>
  )
}

export default DocumentForm
