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
    const TOTAL = 200
    const displayNumber = (value) => {
        return `${ props.card.display_value == '%' ? parseFloat(props.card.number).toFixed(1) : numberWithCommas(props.card.number)}${typeof props.card.display_value != 'undefined' ? numberWithCommas(props.card.display_value)  : ''}`
    }
    const total = props.card.total || TOTAL;
    const percent = props.card.number < 0 ? 0 : (parseFloat(props.card.number / total).toFixed(2));

    return (
        <div className={clsx(classes.chartContainer, {[classes.widthResponsive]: props.lineGraph})}>
            <div className={clsx(classes.headingContainer )}>
                <AddToolTip
                    tooltip={props.card.tooltip}
                    placement={'bottom'}
                    grid={props.grid}
                >
                    <span className={classes.btnContainer}>
                        <Button 
                            size="small" 
                            variant="outlined" 
                            className={clsx(classes.actionButton, 'dashboard_buttons')} 
                            onClick={() => props.handleList(props.id, props.card.type)}
                            disabled={
                                (parseInt(props.card?.number) > 0 || (props.card?.list && props.card.list.length > 0)) ? false : true
                            }
                        >
                            { props.card.title }
                        </Button> 
                    </span>  
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
                        percent={percent}
                        arcPadding={0.02}
                        marginInPercent={0.03}
                        className={'gauge'}
                        animate={false} 
                        /* hideText={true} */
                        formatTextValue={displayNumber}
                    />    
            }
        </div>
    )
}

export default Chart;