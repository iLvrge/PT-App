import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAddresses } from '../../../../../actions/settingsActions'
import { fetchCompaniesList, setBreadCrumbs } from '../../../../../actions/patentTrackActions2'
import _keyBy from 'lodash/keyBy'
import _get from 'lodash/get'
import Page from '../../../components/Page'
import AddressesTable from './AddressesTable'

const COLUMNS = [
  { id: 'companyName', label: 'Company Name' },
  { id: 'addressesCount', label: 'Number of Addresses', numeric: true, alignCenter: true, width: 185 },
]

const ID_KEY = 'representative_id'
const TITLE = 'Addresses'
const NAME = 'Address'

const ACTIONS = {
  fetchItems: [ fetchAddresses, fetchCompaniesList ],
}

const Addresses = () => {
  const dispatch = useDispatch()
  const companiesList = useSelector(state => state.patenTrack2.companiesList)
  const { list, loading } = useSelector(state => state.settings.companyAddresses)

  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Companies > Address'))
  }, [ dispatch ])

  const data = useMemo(() => {
    const flattenCompanies = companiesList.reduce((prev, item) => [ ...prev, item, ...(item.children || []) ], [])
    const companiesById = _keyBy(flattenCompanies, 'id')

    return list.map(({ representative_id, address }) => ({
      representative_id,
      companyName: _get(companiesById, `[${representative_id}].original_name`, ''),
      addressesCount: _get(address, 'length', 0),
      expandable: true,
      address,
    }))
  }, [ companiesList, list ])

  return (
    <Page
      loading={loading}
      actions={ACTIONS}
      name={NAME}
      idKey={ID_KEY}
      title={TITLE}
      columns={COLUMNS}
      childComponent={AddressesTable}
      data={data}
    />
  )
}

export default Addresses
