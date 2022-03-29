import React from 'react'
import { Card, CardContent, CardActions, Typography, Button, IconButton, Tooltip }  from '@mui/material'
import Chart from './Chart'
import useStyles from './styles'

const CardElement = ({card, id, active, type, handleList, handleClick}) => {
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
                />  
                <Tooltip title="Tooltip" placement="right">
                    <div>
                        <Typography variant="h6" component="div" align="center" className={classes.border}>
                            {card.title}
                        </Typography>
                    </div>
                </Tooltip>
            </CardContent>  
        </Card>
    )
}


export default CardElement;