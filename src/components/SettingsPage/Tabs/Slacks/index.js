import React, {useMemo, useCallback, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, TextField, FormControl, FormLabel } from "@mui/material"
import useStyles from './styles'
import CompaniesTable from '../Compaines/Names/CompaniesTable'
import Header from '../../components/Header'

import { setBreadCrumbs, fetchCompaniesList } from  '../../../../actions/patentTrackActions2'

import AddPeople from './AddPeople'

const Slacks = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [ open, setOpen ] = useState(true)
  const [ search, setSearch ] = useState('')
  const [ companiesSelected, setCompaniesSelected ] = useState([])
  const [ childCompaniesSelected, setChildCompaniesSelected ] = useState([])
  
  const [ searchSelected, setSearchSelected ] = useState([])
  const toggleOpen = useCallback(() => setOpen(open => !open), [])
  const [ childComponentList, setChildComponentList ] = useState([])
  const companiesList = useSelector(state => state.patenTrack.companiesList)
  /* const [slackTeamID, setSlackTeamID] = useState('') */
  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Slacks'))
    if(companiesList.length === 0) {
      dispatch(fetchCompaniesList())
    }    
  }, [ dispatch ])

  useEffect(() => {
    if(companiesSelected.length === 1) {
      setChildComponentList([{
        component: AddPeople,      
        rows: companiesSelected
      }])
    }
    
  }, [companiesSelected])

  const onDeleteCompanies = () => {

  }
  
  return (
    <Paper className={classes.root} square id={`layout_templates`}>
        {/* <FormControl>
          <FormLabel>Slack TeamID:</FormLabel> 
          <TextField id="slack_team_id" variant="standard" defaultValue={slackTeamID}/>
        </FormControl>
        <FormControl>
          <FormLabel>Add / Remove people of My Company's Workspace:</FormLabel> 
          <TextField id="slack_team_id" variant="standard" defaultValue={slackTeamID}/>
        </FormControl>
        <FormControl>
          <FormLabel>Create a Workspace for Client:</FormLabel> 
          <TextField id="slack_team_id" variant="standard" defaultValue={slackTeamID}/>
        </FormControl>
        <FormControl>
          <FormLabel>Add or Remove people to a client workspace:</FormLabel> 
          <TextField id="slack_team_id" variant="standard" defaultValue={slackTeamID}/>
        </FormControl> */}
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
            showUsers={true}
          />
    </Paper>
  )
}

export default Slacks
