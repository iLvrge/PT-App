import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from './styles'
import { fetchCompaniesList, setBreadCrumbs } from '../../../../../actions/patentTrackActions2'
import CompaniesTable from './CompaniesTable'
import { deleteCompany, deleteSameCompany } from '../../../../../actions/patenTrackActions'
import SearchCompanies from './SearchCompanies'
import SplitPaneDrawer from '../../../../SplitPaneDrawer'
import Header from '../../../components/Header'
import Group from './Group'
import { Paper } from '@mui/material'



function Companies() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ open, setOpen ] = useState(true)
  const [ search, setSearch ] = useState('')
  const [ selectedType, setSelectedType] = useState('companies')
  const [ companiesSelected, setCompaniesSelected ] = useState([])
  const [ childCompaniesSelected, setChildCompaniesSelected ] = useState([])
  
  const [ searchSelected, setSearchSelected ] = useState([])
  const toggleOpen = useCallback(() => setOpen(open => !open), [])
  const [ childComponentList, setChildComponentList ] = useState([])
  const companiesList = useSelector(state => state.patenTrack.companiesList)


  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Companies'))  
    dispatch(fetchCompaniesList())
  }, [ dispatch ])

  const onDeleteCompanies = useCallback((event) => {
    if (companiesSelected.length) { 
      let removeEntites = event.target.innerText == 'REMOVE THE GROUP BUT KEEP ITS ENTITIES' ? 1 : 0
      dispatch(deleteCompany(companiesSelected.join(','), removeEntites))
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

  useEffect(() => {
    if(companiesSelected.length > 0) {
      let type = ''
      const promises = companiesSelected.map( row => {
        companiesList.forEach(company => {
          if(company.id === row && company.type == 1) {
            type = type === 'companies' ?  'companies and groups' : 'groups'
            return 
          } else if(company.id === row && company.type == 0 ) {
            type = type === 'groups' ? 'groups and companies' : 'companies'
            return
          } 
        });
      })
      Promise.all(promises)
      setSelectedType(type === '' ? 'companies' : type)
    }
  }, [companiesSelected])

  return (
    <SplitPaneDrawer
      open={open}
      setOpen={setOpen}
      drawerChildren={
        <SearchCompanies onClose={toggleOpen} selected={searchSelected} setSelected={setSearchSelected} />
      }
      mainChildren={
        <Paper className={classes.tableRoot}>
          <Header
            title={'Companies'}
            onDelete={onDeleteCompanies}
            numSelected={companiesSelected.length + childCompaniesSelected.length}
            search={search}
            setSearch={setSearch} 
            selectedType={selectedType}
            childComponent={childComponentList}
          />

          <CompaniesTable
            search={search}
            selected={companiesSelected}
            setSelected={setCompaniesSelected}
            childCompaniesSelected={childCompaniesSelected}
            setChildCompaniesSelected={setChildCompaniesSelected}
          />
        </Paper>
      }
    />
  )
}

export default Companies
