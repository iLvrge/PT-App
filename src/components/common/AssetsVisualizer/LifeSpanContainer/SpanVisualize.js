import React, { useEffect, useState, useRef } from 'react'
import useStyles from './styles'



import { Chart } from "react-google-charts";

const SpanVisualize = ({ chart, chartBar }) => {
    const containerRef = useRef(null)
    const classes = useStyles() 
    const [height, setHeight] = useState('100%');
    const [minMax, setMinMax] = useState([0,0])
    const [option, setOption] = useState({
        legend: { position: 'none' },
        bar: { groupWidth: '98%' },
        isStacked: true,
        colors: ['#395270'],
        backgroundColor: '#222222',
        hAxis: {
            baselineColor: '#fff',
            format: '0',
            textStyle: {
                color: '#fff'
            },
            titleTextStyle: {
                color: '#fff'
            },
            gridlines: {
                color: 'transparent'
            }
        },
        vAxis: {
            baselineColor: '#fff',
            format: '0',
            textStyle: {
                color: '#fff'
            },
            titleTextStyle: {
                color: '#fff'
            },
            gridlines: {
                color: '#5c5c5c', 
            }
        },
        annotations: {
            style: 'line',
            stem: {
                color: 'red',
                length: 50
            }
        },
        chartArea: {
            width: '96%',
            height: '95%',
            left:50,
            top:15,
        }
    });
    
    useEffect(() => {
        if( chart.length > 1 ) {
            setMinMax([chart[1][0], chart[chart.length - 1][0]])
        }
    }, [ chart ])

    useEffect(() => {        
        if(chartBar === false) {
            setHeight('100%')
            const opt = {...option}
            opt.chartArea.height = '95%'
            setOption(opt)
        } else {
            setHeight('90%')
            const opt = {...option}
            opt.chartArea.height = '90%'
            setOption(opt)
        }
    }, [chartBar])

    useEffect(() => {
        if(containerRef.current != null) {            
            DisplayChart()
        }
    }, [height, containerRef])


    const DisplayChart = () => {
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType="ColumnChart"
                loader={<div>Loading...</div>}
                data={chart}
                options={option}
            />
        )
    }

    return (
        <div className={classes.graphContainer} ref={containerRef}>              
            <DisplayChart />
        </div> 
    )
}

export default SpanVisualize