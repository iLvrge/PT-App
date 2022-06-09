import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import GaugeChart from 'react-gauge-chart'
import useStyles from './styles'
import { IconButton, Button, Typography, Tooltip, Zoom } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
import LineGraph from './LineGraph';
import AddToolTip from './AddToolTip';
const Chart = (props) => {
    const [arcs, setArcs] = useState([0.5, 0.3, 0.2])
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))
    
    const displayNumber = (value) => {
        return `${ props.card.display_value == '%' ? parseFloat(props.card.number).toFixed(1) : props.card.number}${typeof props.card.display_value != 'undefined' ? props.card.display_value  : ''}`
    }
    
    return (
        <div className={clsx(classes.chartContainer, {[classes.widthResponsive]: props.lineGraph})}>
            <Button 
                size="small" 
                variant="outlined" 
                className={clsx(classes.actionButton)} 
                onClick={() => props.handleList(props.id, props.card.type)}
            >
                {   parseInt(profile?.user?.organisation?.subscribtion) > 2 ? 
                        'See List' 
                        : 
                        parseInt(profile?.user?.organisation?.subscribtion) === 2 && (props.type < 3 ) ?
                            'See List'
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
            {
                props.lineGraph === true
                ?
                    <LineGraph
                        id={`line-chart${props.id}`}
                        data={props.card.list}
                        lineID={props.id}
                    />
                :
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
            }
            <AddToolTip
                tooltip={props.card.tooltip}
                placement={'bottom'}
            >
                <div>
                    <Typography variant="h6" component="div" align="center" className={classes.border}>
                        {props.card.title}
                    </Typography>
                </div>
            </AddToolTip>            
        </div>
    )
}

export default Chart;