import React from 'react'
import TextField from '@material-ui/core/TextField'

const LawyerForm = ({ edited, onChangeField }) => (
  <TextField
    style={{ width: '100%' }}
    size={'small'}
    variant="outlined"
    required
    label="Law Firm Name"
    color={'secondary'}
    value={edited.name || ''}
    onChange={onChangeField('name')} />
)

export default LawyerForm
