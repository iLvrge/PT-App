import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Select, { components } from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLawFirms } from '../../../../../actions/settingsActions'
import MenuItem from '@material-ui/core/MenuItem'
import _find from 'lodash/find'

const SelectFirm = ({ edited, onChangeField }) => {
  const list = useSelector(state => state.settings.lawFirms.list)

  const options = useMemo(() => list.map((lawfirm) => ({
    label: lawfirm.name,
    value: lawfirm.lawfirm_id,
  })), [ list ])

  const styles = useMemo(() => ({
    container: (provided) => ({
      ...provided,
      outline: 'none',
      height: 37.63
    }),
    menu: (provided, state) => ({
      ...provided,
      background: '#424242',
      zIndex: 100000,
    }),
    input: (provided) => ({
      color: 'white',
      fontSize: 11.2,
    }),
    valueContainer: (provided) => ({
      padding: '10px 14px',
    }),
    option: () => ({}),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: 11.2,
    }),
    control: (provided) => ({
      ...provided,
      background: 'transparent',
      borderColor: '#6e6e6e',
      '&:hover': {
        borderColor: 'white',
      },
    }),
  }), [])

  const selectComponents = useMemo(() => ({
    Option: (props) => (
      <components.Option {...props}>
        <MenuItem>{props.data.label}</MenuItem>
      </components.Option>
    ),
  }), [])

  const onChange = useCallback((e) => {
    onChangeField('firm_id')({ target: e })
  }, [ onChangeField ])

  const value = useMemo(() => _find(options, { value: edited.firm_id }), [ options, edited.firm_id ])
  const menuPortalTarget = document.querySelector('[role="presentation"]')

  return (
    <Select
      styles={styles}
      placeholder={'Firm'}
      maxMenuHeight={150}
      menuPortalTarget={menuPortalTarget}
      components={selectComponents}
      value={value}
      onChange={onChange}
      options={options} />
  )
}

const ProfessionalForm = ({ onChangeField, edited }) => {
  const dispatch = useDispatch()
  const initialized = useSelector(state => state.settings.lawFirms.initialized)

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchLawFirms())
    }
  }, [ dispatch, initialized ])

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

      <FormControl required variant={'outlined'} color={'secondary'} size={'small'}>
        <SelectFirm edited={edited} onChangeField={onChangeField} />
      </FormControl>

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
    </Fragment>
  )
}

export default ProfessionalForm