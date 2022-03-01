import React from 'react'
import { Card, CardContent, CardActions, Typography, Button }  from '@mui/material'
import Chart from './Chart'

const CardElement = ({card}) => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" component="div" align="center">
                    {card.title}
                </Typography>
                <Typography variant="body2">
                    {card.sub_heading}
                </Typography>
                <Chart id={card.id}/>
            </CardContent>
            <CardActions align="center" style={{justifyContent: 'center'}}>
                <Button size="small">See Example</Button>
            </CardActions>
        </Card>
    )
}


export default CardElement;