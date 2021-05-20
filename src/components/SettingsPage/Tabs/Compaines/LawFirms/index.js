import React, { useMemo, useEffect, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import SplitPane from 'react-split-pane'
import { fetchCompanyLawyers, fetchLawFirms, addCompanyLawfirm, setCompaniesToAddLawfirms } from '../../../../../actions/settingsActions'
import { fetchCompaniesList, setBreadCrumbs } from '../../../../../actions/patentTrackActions2'
import _keyBy from 'lodash/keyBy'
import _get from 'lodash/get'
import LawyerChild from './LawyerChild'
import LawyerForm from './LawyerChild/LawyerForm'
import Page from '../../../components/Page'
import Lawfirms from '../../LawFirms'
import useStyles from './styles'

const COLUMNS = [
  { id: 'companyName', label: 'Company Name' },
  { id: 'lawyersCount', label: 'Lawyers', numeric: true, alignCenter: true, width: 130 },
]

const ID_KEY = 'representative_id' 
const TITLE = 'Law Firms'
const NAME = 'law firm'




const ACTIONS = {
  fetchItems: [ fetchCompanyLawyers, fetchCompaniesList ],
  addItem: addCompanyLawfirm,
}

const CompanyLawFirms = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const companiesList = useSelector(state => state.patenTrack2.companiesList)
  const { list, loading } = useSelector(state => state.settings.companyLawyers)
  const lawFirmsList  = useSelector(state => state.settings.lawFirms)


  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Companies > LawFirms'))
    dispatch(fetchLawFirms()) 
  }, [ dispatch ])

  const data = useMemo(() => {
    const flattenCompanies = companiesList.reduce((prev, item) => [ ...prev, item, ...(item.children || []) ], [])
    const companiesById = _keyBy(flattenCompanies, 'id')

    return list.map(({ representative_id, mapping_company_law_firms }) => ({
      representative_id,
      companyName: _get(companiesById, `[${representative_id}].original_name`, ''),
      lawyersCount: _get(mapping_company_law_firms, 'length', 0),
      expandable: true,
      mapping_company_law_firms,
    }))
  }, [ companiesList, list ])

  const onChecked = useCallback((id) => {
    dispatch(setCompaniesToAddLawfirms(id))
  }, [dispatch])

  const fieldsComponent = useMemo(() => ({ edited, onChangeField }) => (
    <LawyerForm edited={edited} onChangeField={onChangeField}  companiesList={companiesList} list={lawFirmsList.list} />
  ), [lawFirmsList, companiesList])

  return (
    <SplitPane
        className={classes.splitPane}
        split="vertical"
        size={500}
    >
      <Page
        loading={loading}
        actions={ACTIONS}
        name={NAME}
        idKey={ID_KEY}
        title={TITLE}
        columns={COLUMNS}
        childComponent={LawyerChild}
        fieldsComponent={fieldsComponent}
        checkbox={onChecked} 
        data={data}
      />
      <Lawfirms />
    </SplitPane>
    
  )
}

export default CompanyLawFirms
