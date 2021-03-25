import React, { useRef } from 'react'
import StyledMaterialTable from '../../../components/StyledMaterialTable'
import { useDispatch } from 'react-redux'
import { addLawFirmAddress, deleteLawFirmAddress, updateLawFirmAddress } from '../../../../../actions/settingsActions'
import { MTableAction } from 'material-table'

const COLUMNS = [
  { field: 'street_address', title: 'Street Address' },
  { field: 'suite', title: 'Suite' },
  { field: 'city', title: 'City' },
  { field: 'state', title: 'State' },
  { field: 'zip_code', title: 'Zip Code' },
  { field: 'telephone', title: 'Telephone' },
  { field: 'telephone_2', title: 'Telephone 2' },
  { field: 'telephone_3', title: 'Telephone 3' },
  { field: 'updated_at', title: 'Updated At', editable: false },
]

const AddressesTable = ({ row }) => {
  const dispatch = useDispatch()

  return (
    <StyledMaterialTable
      columns={COLUMNS}
      data={row.lawfirm_address}
      editable={{
        onRowAdd: newData => dispatch(addLawFirmAddress({ ...newData, lawfirm_id: row.lawfirm_id })),
        onRowUpdate: (newData, oldData) => dispatch(updateLawFirmAddress(newData)),
        onRowDelete: oldData => dispatch(deleteLawFirmAddress(oldData)),
      }}
    />
  )
}

export default AddressesTable
