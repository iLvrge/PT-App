import React, {useState} from 'react'
import GaugeChart from 'react-gauge-chart'


const Chart = (props) => {
    const [arcs, setArcs] = useState([0.5, 0.3, 0.2])
    return (
        <GaugeChart
            id={`gauge-chart${props.id}`}
            nrOfLevels={420}
            arcsLength={arcs}
            colors={['#5BE12C', '#F5CD19', '#EA4228']}
            percent={0.37}
            arcPadding={0.02}
            className={'gauge'}
        />
    )

}

export default Chart;