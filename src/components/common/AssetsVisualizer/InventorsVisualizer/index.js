import { Paper } from '@mui/material';
import React from 'react'

import Loader from "../../Loader";
import useStyles from "./styles";

const InventorsVisualizer = (props) => {


    const classes = useStyles()
    return (
        <Paper className={classes.root} square> 
            Inventors Visualizer 
        </Paper>
    )

}



export default InventorsVisualizer;