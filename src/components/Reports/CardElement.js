import React from 'react'
import { Card, CardContent, CardActions, Typography, Button, IconButton }  from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import Chart from './Chart'
import useStyles from './styles'

const CardElement = ({card, id, active, type, handleList, handleClick}) => {
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.card} square={true}>
            <CardContent>           
                <Tooltip title="Tooltip" placement="right">
                    <Typography variant="h6" component="div" align="center" className={classes.border}>
                        {card.title}
                    </Typography>
                </Tooltip>
                <Chart 
                    id={id}
                    handleClick={handleClick}
                    handleList={handleList} 
                    active={active}
                    type={type}
                />  
            </CardContent>  
        </Card>
    )
}


export default CardElement;