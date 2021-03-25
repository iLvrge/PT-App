import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import StyledMaterialTable from '../../../../components/StyledMaterialTable'
import { addCompanyAddress, deleteCompanyAddress, updateCompanyAddress } from '../../../../../../actions/settingsActions'
import { useSnackbar } from 'notistack'

const COLUMNS = [
  { field: 'street_address', title: 'Street Address' },
  { field: 'suite', title: 'Internal' },
  { field: 'city', title: 'City' },
  { field: 'state', title: 'State' },
  { field: 'country', title: 'Country' },
  { field: 'zip_code', title: 'Zip Code' },
  { field: 'telephone', title: 'Telephone' },
  { field: 'telephone_2', title: 'Telephone 2' },
  { field: 'telephone_3', title: 'Telephone 3' },
  { field: 'updated_at', title: 'Updated At', editable: 'never' },
]

const AddressesTable = ({ row }) => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const onRowAdd = useCallback(async (newData) => {
    try {
      await dispatch(addCompanyAddress({ ...newData, representative_id: row.representative_id }))
      enqueueSnackbar('Address added successfully ', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('Failed to add address', { variant: 'error' })
    }
  }, [ dispatch, enqueueSnackbar, row.representative_id ])

  const onRowUpdate = useCallback(async ({ updated_at, created_at, ...newData }) => {
    try {
      await dispatch(updateCompanyAddress(newData))
      enqueueSnackbar('Address updated successfully ', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('failed to update address', { variant: 'error' })
    }
  }, [ dispatch, enqueueSnackbar ])

  const onRowDelete = useCallback(async (oldData) => {
    try {
      await dispatch(deleteCompanyAddress({  ...oldData, representative_id: row.representative_id }))
      enqueueSnackbar('Address deleted successfully ', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('failed to delete address', { variant: 'error' })
    }
  }, [ dispatch, enqueueSnackbar, row.representative_id ])

  const editable = useMemo(() => ({
    onRowAdd,
    onRowUpdate,
    onRowDelete
  }), [ onRowAdd, onRowUpdate, onRowDelete ])

  return (
    <StyledMaterialTable
      columns={COLUMNS}
      data={row.address}
      editable={editable}
      help={true}
    />
  )
}

export default AddressesTable
