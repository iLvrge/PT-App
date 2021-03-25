import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addProfessional, deleteProfessional, fetchLawFirms, fetchProfessionals, updateProfessional } from '../../../../actions/settingsActions'
import ProfessionalForm from './ProfessionalForm'
import _get from 'lodash/get'
import _find from 'lodash/find'
import Page from '../../components/Page'
import { setBreadCrumbs } from  '../../../../actions/patentTrackActions2'

const COLUMNS = [
  { id: 'first_name', label: 'First Name' },
  { id: 'last_name', label: 'Last Name' },
  { id: 'firm_name', label: 'Firm Name' },
  { id: 'email_address', label: 'Email' },
  { id: 'telephone', label: 'Telephone' },
  { id: 'telephone1', label: 'Telephone2' },
]

const ID_KEY = 'professional_id'
const TITLE = 'Professionals'
const NAME = 'professional'

const ACTIONS = {
  fetchItems: [ fetchProfessionals, fetchLawFirms ],
  deleteItem: deleteProfessional,
  addItem: addProfessional,
  updateItem: updateProfessional,
}

const Professionals = () => {
  const { list, loading } = useSelector(state => state.settings.professionals)
  const lawFirms = useSelector(state => state.settings.lawFirms.list)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Professionals'))
  }, [ dispatch ])

  const data = useMemo(() => {
    return list.map((professional) => ({
      ...professional,
      firm_name: _get(_find(lawFirms, { lawfirm_id: professional.firm_id }), 'name', ''),
    }))
  }, [ lawFirms, list ])

  return (
    <Page
      loading={loading}
      actions={ACTIONS}
      name={NAME}
      fieldsComponent={ProfessionalForm}
      idKey={ID_KEY}
      title={TITLE}
      columns={COLUMNS}
      data={data}
    />
  )
}

export default Professionals
