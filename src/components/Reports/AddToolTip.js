import React from 'react'
import { Tooltip, Typography, Zoom } from '@mui/material';


import useStyles from './styles'
import clsx from 'clsx';


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
            enterDelay={500}
            TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
            classes={{ 
                tooltip: clsx(classes.tooltip, typeof props.grid !== 'undefined' ?  `tooltip${props.grid.lg}` : '')
            }}
        >
            {props.children}
        </Tooltip>
    )

}



export default AddToolTip;