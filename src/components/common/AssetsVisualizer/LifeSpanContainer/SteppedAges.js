import React, { useState } from 'react' 
import { Chart } from "react-google-charts"; 
import Loader from '../../Loader';
import useStyles from './styles' 


const SteppedAges = () => {
    const classes = useStyles() 
    const [loading, setLoading] = useState(false)
    const [option, setOption] = useState({
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        chartArea: {
            width: '83%',
            height: '92%',
            left:40,
            top:15,
        },
        isStacked: true,
        colorAxis: {colors: ['#FFAA00', '#70A800', '#1565C0']}
    });

    const [height, setHeight] = useState('100%');

    const [data, setData] = useState([
        ['Director (Year)',  'Rotten Tomatoes', 'IMDB'],
        ['Alfred Hitchcock (1935)', 8.4,         7.9],
        ['Ralph Thomas (1959)',     6.9,         6.5],
        ['Don Sharp (1978)',        6.5,         6.4],
        ['James Hawes (2008)',      4.4,         6.2]
      ])

    const DisplayChart = () => {
        if(loading) return <Loader/>
        if(data.length < 2) return null
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType="Histogram"
                loader={<div>Loading...</div>}
                data={data}
                options={option}
            />
        )
    }
    return (
        <DisplayChart/>
    )
}



export default SteppedAges;