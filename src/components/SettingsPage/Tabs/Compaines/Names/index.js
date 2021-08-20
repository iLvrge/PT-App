import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useStyles from './styles'
import { fetchCompaniesList, setBreadCrumbs } from '../../../../../actions/patentTrackActions2'
import CompaniesTable from './CompaniesTable'
import { deleteCompany, deleteSameCompany } from '../../../../../actions/patenTrackActions'
import SearchCompanies from './SearchCompanies'
import SplitPaneDrawer from '../../../../SplitPaneDrawer'
import Header from '../../../components/Header'
import Group from './Group'



function Companies() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ open, setOpen ] = useState(true)
  const [ search, setSearch ] = useState('')
  const [ companiesSelected, setCompaniesSelected ] = useState([])
  const [ childCompaniesSelected, setChildCompaniesSelected ] = useState([])
  
  const [ searchSelected, setSearchSelected ] = useState([])
  const toggleOpen = useCallback(() => setOpen(open => !open), [])
  const [ childComponentList, setChildComponentList ] = useState([])



  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Companies'))  
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

  useEffect(() => {
    setChildComponentList([{
      component: Group,      
    }])
  }, [])

  

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
            setSearch={setSearch} 
            childComponent={childComponentList}
          />

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
