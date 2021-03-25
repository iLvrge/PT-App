import React, { Fragment, useState, useCallback } from 'react'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import { DropzoneArea } from 'material-ui-dropzone'
import { ROLES } from '../contants'
import InputLabel from '@material-ui/core/InputLabel'

import useSytles from './styles'


const UserForm = ({ onChangeField, edited }) => {
  const classes = useSytles()
  /* const [profilePicture, setProfilePicture] = useState(null)

  const handleCapture = ({ target }) => {
    const fileReader = new FileReader();
    if(target.files.length > 0) {
      fileReader.readAsDataURL(target.files[0]);
      fileReader.onload = (e) => {
        setProfilePicture(e.target.result)
      };
    }
    
  }; */
  const onChangeFile = useCallback((files) => {
    onChangeField('file')({ target: { value: files.length ? files[0] : null } })
  }, [ onChangeField ])
  return (
  <Fragment>
    <TextField
      size={'small'}
      variant="outlined"
      required
      label="First Name"
      color={'secondary'}
      value={edited.first_name || ''}
      onChange={onChangeField('first_name')} />

    <TextField
      size={'small'}
      variant="outlined"
      color={'secondary'}
      required
      label="Last Name"
      value={edited.last_name || ''}
      onChange={onChangeField('last_name')} />

    <TextField
      size={'small'}
      variant="outlined"
      color={'secondary'}
      required
      label="Title"
      value={edited.job_title || ''}
      onChange={onChangeField('job_title')} />

    <TextField
      size={'small'}
      variant="outlined"
      color={'secondary'}
      required
      label="Email"
      value={edited.email_address || ''}
      onChange={onChangeField('email_address')} />

    <TextField
      size={'small'}
      variant="outlined"
      color={'secondary'}
      required
      label="Telephone"
      value={edited.telephone || ''}
      onChange={onChangeField('telephone')} />

    <TextField
      size={'small'}
      variant="outlined"
      color={'secondary'}
      required
      label="Telephone2"
      value={edited.telephone1 || ''}
      onChange={onChangeField('telephone1')} />

    <FormControl required variant={'outlined'} color={'secondary'} size={'small'}>
      <InputLabel id="select-role">Role</InputLabel>

      <Select
        label={'Role'}
        labelId={'select-role'}
        value={edited.role || ''}
        onChange={onChangeField('role')}>

        <MenuItem value={ROLES['1']}>{ROLES['1']}</MenuItem>
        <MenuItem value={ROLES['2']}>{ROLES['2']}</MenuItem>
      </Select>
    </FormControl>
    <FormControl required variant={'outlined'} color={'secondary'} size={'small'}>
      {/* <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        onChange={handleCapture}
        type="file"
        name="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="raised" component="span">
          Profile Picture
        </Button>
      </label> 
      {
        profilePicture != null && <img src={profilePicture} width={40}/>
      } */}
      <DropzoneArea
        classes={{ root: classes.dropzoneArea }}
        showFileNames
        filesLimit={1}
        onChange={onChangeFile}
      />
    </FormControl>
  </Fragment>
  )
}

export default UserForm