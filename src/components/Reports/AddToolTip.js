import React from 'react'
import { Tooltip, Typography, Zoom } from '@mui/material';


import useStyles from './styles'


const AddToolTip = (props) => {
    const classes = useStyles();
    return (
        <Tooltip 
            title={
                <Typography 
                    color="inherit" 
                    variant='body2'
                >
                    {props.tooltip}
                </Typography>
            } 
            placement={props.placement}
            enterDelay={0}
            TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
            className={classes.tooltip}  
        >
            {props.children}
        </Tooltip>
    )

}



export default AddToolTip;