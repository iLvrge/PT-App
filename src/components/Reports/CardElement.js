import React from 'react'
import { Card, CardContent, CardActions, Typography, Button, IconButton }  from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import Chart from './Chart'
import useStyles from './styles'

const CardElement = ({card, id}) => {
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.card} square={true}>
            <CardContent>
                <Tooltip title="Tooltip" placement="right">
                    <IconButton className={classes.onFly}>
                        <ErrorOutlineIcon/> 
                    </IconButton>
                </Tooltip>
                
                <Typography variant="h6" component="div" align="center" className={classes.border}>
                    {card.title}
                </Typography>
                <Chart id={id}/>
            </CardContent>
            <CardActions align="center" style={{justifyContent: 'center'}}>
                <Button size="small">See Example</Button>
            </CardActions>
        </Card>
    )
}


export default CardElement;