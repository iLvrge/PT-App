import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import GaugeChart from 'react-gauge-chart'
import useStyles from './styles'
import { IconButton, Button, Typography, Tooltip, Zoom } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
const Chart = (props) => {
    const [arcs, setArcs] = useState([0.5, 0.3, 0.2])
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))
    
    const displayNumber = (value) => {
        return `${ props.card.display_value == '%' ? parseFloat(props.card.number).toFixed(1) : props.card.number}${typeof props.card.display_value != 'undefined' ? props.card.display_value  : ''}`
    }
    
    return (
        <div className={classes.chartContainer}>
            <Button 
                size="small" 
                variant="outlined" 
                className={clsx(classes.actionButton)} 
                onClick={() => props.handleList(props.id, props.card.type)}
                disabled={
                    parseInt(profile?.user?.organisation?.subscribtion) === 1 ? 
                        true  
                    :
                        parseInt(profile?.user?.organisation?.subscribtion) === 2 ? 
                            (props.type < 3 ) ?
                                parseInt(props.card?.number) == 0 ? true : false
                            :
                                true
                        :
                            parseInt(profile?.user?.organisation?.subscribtion) === 3 ? 
                                parseInt(props.card?.number) == 0 ? true : false                                
                            :
                                true
                }
            >
                {   parseInt(profile?.user?.organisation?.subscribtion) > 2 ? 
                        'Let\'s Fix it!' 
                        : 
                        parseInt(profile?.user?.organisation?.subscribtion) === 2 && (props.type < 3 ) ?
                            'Let\'s Fix it!'
                        :
                            'Upgrade and Fix it!' 
                }
            </Button> 
            <IconButton 
                size="small" 
                onClick={() => props.handleClick(props.id)} 
                className={clsx(classes.exampleButton, props.active === props.id ? classes.active : '')}
                disabled={props.card?.number != '0' ? false : true}
            >
                <AutoAwesomeIcon />
            </IconButton>
            <GaugeChart
                id={`gauge-chart${props.id}`}
                nrOfLevels={420}
                arcsLength={arcs}
                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                percent={ props.card.total > 0 ? parseFloat(props.card.number / props.card.total).toFixed(2) : 0 }
                arcPadding={0.02}
                marginInPercent={0.03}
                className={'gauge'}
                animate={false} 
                /* hideText={true} */
                formatTextValue={displayNumber}
            />    
            
            <Tooltip 
                title="Tooltip" 
                placement="right"
                enterDelay={0}
                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                className={clsx(classes.tooltip/* , {[classes.mobileTooltip]: typeof isMobile !== 'undefined' && isMobile === true} */)}  
            >
                <div>
                    <Typography variant="h6" component="div" align="center" className={classes.border}>
                        {props.card.title}
                    </Typography>
                </div>
            </Tooltip>              
        </div>
    )
}

export default Chart;