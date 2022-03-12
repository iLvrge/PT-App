import React from 'react'
import { Card, CardContent, CardActions, Typography, Button, IconButton }  from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import Chart from './Chart'
import useStyles from './styles'

const CardElement = ({card, id, active, handleClick}) => {
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.card} square={true}>
            <CardContent>
                <IconButton className={'tooltip'}>
                    <Tooltip title="Tooltip" placement="right">
                        <ErrorOutlineIcon/> 
                    </Tooltip>
                </IconButton>                
                <Typography variant="h6" component="div" align="center" className={classes.border}>
                    {card.title}
                </Typography>
                <Chart 
                    id={id}
                    handleClick={handleClick}
                    active={active}
                />
            </CardContent>  
            <CardActions align="center" style={{justifyContent: 'center'}}>
                <Button size="small" variant="outlined">Lets Fix it</Button>
            </CardActions>  
        </Card>
    )
}


export default CardElement;