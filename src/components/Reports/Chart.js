import React, {useState} from 'react'
import GaugeChart from 'react-gauge-chart'
import useStyles from './styles'
import { IconButton } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
const Chart = (props) => {
    const [arcs, setArcs] = useState([0.5, 0.3, 0.2])
    const classes = useStyles();
    return (
        <React.Fragment>
            <IconButton 
                size="small" 
                onClick={() => props.handleClick(props.id)} 
                className={clsx(classes.exampleButton, props.active === props.id ? classes.active : '')}>
                <AutoAwesomeIcon />
            </IconButton>
            <GaugeChart
                id={`gauge-chart${props.id}`}
                nrOfLevels={420}
                arcsLength={arcs}
                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                percent={0.37}
                arcPadding={0.02}
                marginInPercent={0.03}
                className={'gauge'}
            />       
        </React.Fragment>
    )
}

export default Chart;