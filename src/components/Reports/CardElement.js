import React from 'react'
import { Card, CardContent, CardActions }  from '@mui/material'
import Chart from './Chart'
import useStyles from './styles'
import KpiBox from './KpiBox'
import TimelineChart from './TimelineChart'

const CardElement = (props) => {
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.card} square={true}>
            <CardContent>  
                {
                    typeof props.timeline !== 'undefined' && props.timeline === true
                    ?
                        <TimelineChart {...props}/>
                    :
                        typeof props.kpiEnable !== 'undefined' && props.kpiEnable === true
                        ?
                            <KpiBox {...props}/>
                            :
                                <Chart 
                                    id={props.id}
                                    handleClick={props.handleClick}
                                    handleList={props.handleList} 
                                    active={props.active}
                                    type={props.type}
                                    card={props.card}   
                                    lineGraph={props.lineGraph} 
                                />
                }                                 
            </CardContent>  
        </Card>
    )
}


export default CardElement;