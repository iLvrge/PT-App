import React, { Fragment } from 'react'
import TextField from '@mui/material/TextField'

const AddressesForm = ({ edited, onChangeField, companyName }) => (
  <Fragment>
    <TextField
      style={{ width: '100%' }}
      size={'small'}
      variant="outlined"
      required
      disabled
      label="Company"
      color={'secondary'}
      value={companyName || ''} />

    <TextField
      style={{ width: '100%' }}
      size={'small'}
      variant="outlined"
      required
      label="Address"
      color={'secondary'}
      value={edited.address || ''}
      onChange={onChangeField('address')} />
  </Fragment>
)

export default AddressesForm
