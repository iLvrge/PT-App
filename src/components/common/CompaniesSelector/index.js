import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'
import ListItem from '@material-ui/core/ListItem'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubheader from '@material-ui/core/ListSubheader'
import SelectAllIcon from '@material-ui/icons/SelectAll'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'
import Typography from '@material-ui/core/Typography'


import { 
  fetchCompaniesList, 
  setSelectedCompaniesList,
  setSelectedAssetsCustomers,
  setSelectedAssetsTransactions,
  setSelectedAssetsPatents,
} from '../../../actions/patentTrackActions2'

import useStyles from './styles'

import Loader from '../Loader'


const CompaniesSelector = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const companies = useSelector(state => state.patenTrack2.companiesList)
  const isLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

  useEffect(() => {
    const initCompaniesData = async () => dispatch(fetchCompaniesList())
    initCompaniesData()
  }, [ dispatch ])

  const handlenChangeSelectedCompanies = useCallback((updatedSelectedCompaniesList) => {
    dispatch(setSelectedAssetsCustomers([]))
    dispatch(setSelectedAssetsTransactions([]))
    dispatch(setSelectedAssetsPatents([]))
    dispatch(setSelectedCompaniesList(updatedSelectedCompaniesList))
  }, [ dispatch ])

  const handleToggleCompanyCheckbox = useCallback((company) => () => {
    let updatedSelectedCompaniesList = [ ]
    if (selectedCompaniesList.map(selectedCompany => selectedCompany.id).includes(company.id)) {
      updatedSelectedCompaniesList = selectedCompaniesList.filter((selectedCompany) => selectedCompany.id !== company.id)
    } else {
      updatedSelectedCompaniesList = [ ...selectedCompaniesList, company ]
    }

    handlenChangeSelectedCompanies(updatedSelectedCompaniesList)
  }, [ handlenChangeSelectedCompanies, selectedCompaniesList ])

  const handleToggleCompanyListItem = useCallback((company) => () => {
    handlenChangeSelectedCompanies([ company ])
  }, [ handlenChangeSelectedCompanies ])

  const handleClickSelectCheckbox = useCallback(() => {
    const updatedSelectedCompaniesList = selectedCompaniesList.length === companies.length ? [] : [ ...companies ]
    handlenChangeSelectedCompanies(updatedSelectedCompaniesList)
  }, [ companies, handlenChangeSelectedCompanies, selectedCompaniesList.length ])

  const MultiSelectCheckboxIcon = () => {
    if (selectedCompaniesList.length === companies.length) return <CheckBoxIcon />
    if (selectedCompaniesList.length > 0 && selectedCompaniesList.length < companies.length) return <IndeterminateCheckBoxIcon />
    return  <CheckBoxOutlineBlankIcon />
  }

  if (isLoading) return <Loader />

  return (
    <Paper className={classes.root} square>
       {/* <div className={classes.controllersContainer}>
          <div className={classes.controllers}>
            <Tooltip title={`${selectedCompaniesList.length === companies.length ? 'unselect' : 'select'} all`} placement='top'>
              <div>
              {
                <IconButton 
                  variant='outlined' 
                  onClick={handleClickSelectCheckbox} 
                  className={classes.selectAllBtn}
                >
                    <MultiSelectCheckboxIcon />
                </IconButton>
              }
              </div>
            </Tooltip>
            <Typography className={classes.headingText}>Companies</Typography>
            <div className={classes.totalSelected}>{selectedCompaniesList.length} / {companies.length}</div> 
          </div>
        </div> */} 
      <List 
        dense 
        disablePadding 
        className={classes.list}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {
                <IconButton 
                  variant='outlined' 
                  onClick={handleClickSelectCheckbox} 
                  className={classes.selectAllBtn}
                >
                    <MultiSelectCheckboxIcon />
                </IconButton>
            } Companies <span className={classes.totalSelected}>{selectedCompaniesList.length}/{companies.length}</span>
          </ListSubheader>
        }
      >
        {
            companies.map(company => {
                const companyName = company.representative_name || company.original_name
                return (
                <ListItem key={`company-${company.id}`} button onClick={handleToggleCompanyListItem(company)}>
                    <ListItemIcon>
                        <Checkbox
                          className={classes.checkbox}
                          edge="start"
                          onChange={handleToggleCompanyCheckbox(company)}
                          checked={selectedCompaniesList.map(selectedCompany => selectedCompany.id).includes(company.id)}
                          inputProps={{ 'aria-labelledby': companyName }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={companyName}
                    />
                </ListItem>
                )
            })
        }
      </List>
    </Paper>
  )
}

export default CompaniesSelector
