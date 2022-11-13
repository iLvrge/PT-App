import { Paper } from '@mui/material';
import React from 'react'

import Loader from "../../Loader";
import useStyles from "./styles";

const AgentsVisualizer = (props) => {


    const classes = useStyles()
    return (
        <Paper className={classes.root} square> 
            Agent Visualizer {props.type}
        </Paper>
    )

}



export default AgentsVisualizer;