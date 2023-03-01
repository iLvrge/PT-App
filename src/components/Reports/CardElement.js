import React from 'react'
import { Card, CardContent, CardActions }  from '@mui/material'
import Chart from './Chart'
import useStyles from './styles'
import KpiBox from './KpiBox'
import TimelineChart from './TimelineChart'
import clsx from 'clsx'
import FullScreen from '../common/FullScreen'

const CardElement = (props) => {
    const classes = useStyles();

    const menuItems = typeof props.timeline !== 'undefined' ? [
        {
            id: 1,
            label: 'Timeline',
            component: TimelineChart,
            card: props.card,
            id: props.id,
            active: props.active,
            standalone: true,
            handleClick: props.handleClick,
            handleList: props.handleList,
            handleFullScreen: props.handleFullScreen,
            type: props.type,
            grid: props.grid
        }
    ] : [] 
    return (
        <Card variant="outlined" className={clsx(classes.card, {[classes.alignTop]: typeof props.timeline !== 'undefined' && props.timeline === true ? true : false})} square={true}>
            <CardContent>  
                {
                    typeof props.timeline !== 'undefined' && props.timeline === true
                    ?
                        <React.Fragment>
                            {
                                props.card.standalone === true && (
                                    <FullScreen 
                                        componentItems={menuItems} 
                                        showScreen={true} 
                                        setScreen={props.timeline.handleTimelineFullScreen} 
                                        showClose={false}
                                    /> 
                                )
                            }
                            
                            <TimelineChart {...props} />
                        </React.Fragment>
                    :
                        typeof props.kpiEnable !== 'undefined' && props.kpiEnable === true
                        ?
                            <KpiBox {...props}/>
                            :
                                <Chart {...props} />
                }                                 
            </CardContent>  
        </Card>
    )
}


export default CardElement;