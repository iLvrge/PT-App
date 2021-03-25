import React, { useMemo, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import useStyles from './styles'
import { addCompanyLawyer, addCompanyLawfirm, deleteCompanyLawyer } from '../../../../../../actions/settingsActions'
import { fetchLawFirms } from '../../../../../../actions/settingsActions'

import Page from '../../../../components/Page'

const NAME = 'law firm'

const COLUMNS = [
  { id: 'name', label: 'Name' },
]

const ID_KEY = 'lawyer_id'

const LawyerChild = ({ row }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { representative_id, mapping_company_law_firms, companyName } = row
  const data = useMemo(() => mapping_company_law_firms.map(item => ({ ...item.lawfirm, companyName })), [ mapping_company_law_firms, companyName ])

  

  useEffect(() => {
    dispatch(fetchLawFirms()) 
  }, [ dispatch ])

  const ACTIONS = useMemo(() => ({
    /* addItem: (lawyer) => addCompanyLawfirm({ representative_id }), */
    deleteItem: deleteCompanyLawyer,
  }), [ representative_id ])



  return (
    <Page
      className={classes.childrenTable}
      actions={ACTIONS}
      name={NAME}
      columns={COLUMNS}
      idKey={ID_KEY}
      title={`${companyName}'s Law Firms`}
      data={data}
    />
  )
}

export default LawyerChild