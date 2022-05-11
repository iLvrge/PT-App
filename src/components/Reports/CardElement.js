import React from 'react'
import { Card, CardContent, CardActions }  from '@mui/material'
import Chart from './Chart'
import useStyles from './styles'

const CardElement = ({card, id, active, type, lineGraph, handleList, handleClick}) => {
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.card} square={true}>
            <CardContent>  
                <Chart 
                    id={id}
                    handleClick={handleClick}
                    handleList={handleList} 
                    active={active}
                    type={type}
                    card={card}   
                    lineGraph={lineGraph} 
                />                 
            </CardContent>  
        </Card>
    )
}


export default CardElement;