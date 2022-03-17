import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import GaugeChart from 'react-gauge-chart'
import useStyles from './styles'
import { IconButton, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
const Chart = (props) => {
    const [arcs, setArcs] = useState([0.5, 0.3, 0.2])
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))

    const displayNumber = (value) => {
        console.log("value", value, parseFloat(parseFloat(props.card.number / 100).toFixed(2)))
        return props.card.number
    }
    
    return (
        <div className={classes.chartContainer}>
            <IconButton 
                size="small" 
                onClick={() => props.handleClick(props.id)} 
                className={clsx(classes.exampleButton, props.active === props.id ? classes.active : '')}
                disabled={parseInt(props.card?.number) == 0 ? true : false}
            >
                <AutoAwesomeIcon />
            </IconButton>
            <GaugeChart
                id={`gauge-chart${props.id}`}
                nrOfLevels={420}
                arcsLength={arcs}
                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                percent={parseFloat(parseFloat(props.card.number / 100).toFixed(2))}
                arcPadding={0.02}
                marginInPercent={0.03}
                className={'gauge'}
                /* hideText={true} */
                formatTextValue={displayNumber}
            />    
            <Button 
                size="small" 
                variant="outlined" 
                className={clsx(classes.actionButton)} 
                onClick={() => props.handleList(props.id)}
                disabled={
                    parseInt(profile?.user?.organisation?.subscribtion) === 1 ? 
                        true 
                    :
                        parseInt(profile?.user?.organisation?.subscribtion) === 2 ? 
                            (props.type < 3 ) ?
                                false
                            :
                                true
                        :
                            parseInt(profile?.user?.organisation?.subscribtion) === 3 ? 
                                false
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
        </div>
    )
}

export default Chart;