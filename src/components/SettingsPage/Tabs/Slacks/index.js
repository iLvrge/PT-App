import React, {useMemo, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, TextField, FormControl, FormLabel } from "@material-ui/core"
import useStyles from "./styles"

import { setBreadCrumbs } from  '../../../../actions/patentTrackActions2'

const Slacks = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [slackTeamID, setSlackTeamID] = useState('')
  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Slacks'))
  }, [ dispatch ])

  
  return (
    <Paper className={classes.root} square id={`layout_templates`}>
        <FormControl>
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
        </FormControl>
    </Paper>
  )
}

export default Slacks
