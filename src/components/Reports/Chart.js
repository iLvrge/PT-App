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
import { numberWithCommas } from '../../utils/numbers';
const Chart = (props) => {
    const [arcs, setArcs] = useState([0.5, 0.3, 0.2])
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))
    
    const displayNumber = (value) => {
        return `${ props.card.display_value == '%' ? parseFloat(props.card.number).toFixed(1) : numberWithCommas(props.card.number)}${typeof props.card.display_value != 'undefined' ? numberWithCommas(props.card.display_value)  : ''}`
    }
    console.log('sdsdsd')
    return (
        <div className={clsx(classes.chartContainer, {[classes.widthResponsive]: props.lineGraph})}>
            <div className={clsx(classes.headingContainer, classes.headerContainerPosition)}>
                <AddToolTip
                    tooltip={props.card.tooltip}
                    placement={'bottom'}
                    grid={props.grid}
                >
                    <Typography variant="h6" component="div" align="center" className={classes.title}>
                        {props.card.title}
                    </Typography>
                </AddToolTip>  
            </div>
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
            <Button 
                size="small" 
                variant="outlined" 
                className={clsx(classes.actionButton)} 
                onClick={() => props.handleList(props.id, props.card.type)}
            >
                {   parseInt(profile?.user?.organisation?.subscribtion) > 2 ? 
                        'View List' 
                        : 
                        parseInt(profile?.user?.organisation?.subscribtion) === 2 && (props.type < 3 ) ?
                            'View List'
                        :
                            'Upgrade and Fix it!' 
                }
            </Button>    
            {
                props.card?.number != '0'
                ?
                    <AddToolTip
                        tooltip='See Example'
                        placement='bottom'
                    >
                        <IconButton 
                            size="small" 
                            onClick={() => props.handleClick(props.id)} 
                            className={clsx(classes.exampleButton, props.active === props.id ? classes.active : '')}
                        >
                            <AutoAwesomeIcon />
                        </IconButton>  
                    </AddToolTip>  
                :
                    <IconButton 
                        size="small" 
                        className={clsx(classes.exampleButton)}
                        disabled={true}
                    >
                        <AutoAwesomeIcon />
                    </IconButton>     
            } 
        </div>
    )
}

export default Chart;