import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useStyles from './styles'
import { fetchCompaniesList, setBreadCrumbs } from '../../../../../actions/patentTrackActions2'
import CompaniesTable from './CompaniesTable'
import { deleteCompany, deleteSameCompany } from '../../../../../actions/patenTrackActions'
import SearchCompanies from './SearchCompanies'
import SplitPaneDrawer from '../../../../SplitPaneDrawer'
import Header from '../../../components/Header'


function Companies() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ open, setOpen ] = useState(true)
  const [ search, setSearch ] = React.useState('')
  const [ companiesSelected, setCompaniesSelected ] = React.useState([])
  const [ childCompaniesSelected, setChildCompaniesSelected ] = React.useState([])
  
  const [ searchSelected, setSearchSelected ] = React.useState([])
  const toggleOpen = useCallback(() => setOpen(open => !open), [])

  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Companies > Names'))
    dispatch(fetchCompaniesList())
  }, [ dispatch ])

  const onDeleteCompanies = useCallback(() => {
    if (companiesSelected.length) {
      dispatch(deleteCompany(companiesSelected.join(',')))
    }
    
    if (childCompaniesSelected.length) {
      dispatch(deleteSameCompany(childCompaniesSelected.join(',')))
    }

    setCompaniesSelected([])
    setChildCompaniesSelected([])
  }, [ dispatch, companiesSelected, childCompaniesSelected ])

  useEffect(() => {
    if (companiesSelected.length || childCompaniesSelected.length) {
      setSearchSelected([])
    }
  }, [ companiesSelected, childCompaniesSelected ])

  useEffect(() => {
    if (searchSelected.length) {
      setCompaniesSelected([])
      setChildCompaniesSelected([])
    }
  }, [ searchSelected ])

  return (
    <SplitPaneDrawer
      open={open}
      setOpen={setOpen}
      drawerChildren={
        <SearchCompanies onClose={toggleOpen} selected={searchSelected} setSelected={setSearchSelected} />
      }
      mainChildren={
        <div className={classes.tableRoot}>
          <Header
            title={'Companies'}
            onDelete={onDeleteCompanies}
            numSelected={companiesSelected.length + childCompaniesSelected.length}
            search={search}
            setSearch={setSearch} />

          <CompaniesTable
            search={search}
            selected={companiesSelected}
            setSelected={setCompaniesSelected}
            childCompaniesSelected={childCompaniesSelected}
            setChildCompaniesSelected={setChildCompaniesSelected}
          />
        </div>
      }
    />
  )
}

export default Companies
