import React, { useMemo } from 'react'
import AddressesForm from './AdressForm'
import useStyles from './styles'
import { addCompanyAddress, deleteCompanyAddress } from '../../../../../../actions/settingsActions'
import Page from '../../../../components/Page'

const NAME = 'address'

const COLUMNS = [
  { id: 'address', label: 'Address' },
]

const ID_KEY = 'address_id'

const AddressesChild = ({ row }) => {
  const classes = useStyles()
  const { representative_id, address, companyName } = row
  const data = useMemo(() => address.map(item => ({ ...item, companyName })), [ address, companyName ])

  const ACTIONS = useMemo(() => ({
    addItem: (address) => addCompanyAddress({ ...address, representative_id }),
    deleteItem: deleteCompanyAddress,
  }), [ representative_id ])

  const fieldsComponent = useMemo(() => ({ edited, onChangeField }) => (
    <AddressesForm edited={edited} onChangeField={onChangeField} companyName={companyName} />
  ), [ companyName ])

  return (
    <Page
      className={classes.childrenTable}
      actions={ACTIONS}
      name={NAME}
      columns={COLUMNS}
      idKey={ID_KEY}
      title={`${companyName}'s Addresses`}
      fieldsComponent={fieldsComponent}
      data={data}
    />
  )
}

export default AddressesChild