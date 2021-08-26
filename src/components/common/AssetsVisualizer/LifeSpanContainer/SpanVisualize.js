import React, { useEffect, useState, useRef } from 'react'
import useStyles from './styles'


import FullScreen from '../../FullScreen'
import { Chart } from "react-google-charts";

const SpanVisualize = ({ chart, chartBar, visualizerBarSize, standalone }) => {
    const containerRef = useRef(null)
    const classes = useStyles() 
    const menuItems = [
        {
            id: 1,
            label: 'Assets Lifespan Data',
            component: SpanVisualize,
            standalone: true,
            chart,
            chartBar, 
            visualizerBarSize
        }
    ]
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
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            gridlines: {
                color: 'transparent',
                count: 0,
            },
            minorGridlines:{
                color:'transparent' 
            },
        },
        vAxis: {
            baselineColor: '#fff',
            format: '0',
            textStyle: {
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            gridlines: {
                color: '#5c5c5c'
            },
            minorGridlines:{
                color:'transparent' 
            },
        },
        annotations: {
            style: 'line',
            stem: {
                color: 'red',
                length: 50
            }
        },
        chartArea: {
            width: '83%',
            height: '92%',
            left:40,
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
            opt.chartArea.height = '92%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '92%'
            } else {
                opt.chartArea.width = '83%'
            }
            setOption(opt)
        } else {
            setHeight('95%')
            const opt = {...option}
            opt.chartArea.height = '91%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '92%'
            } else {
                opt.chartArea.width = '83%'
            }
            setOption(opt)
        }
    }, [chartBar, visualizerBarSize])

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
        <>
            {
                typeof standalone === 'undefined' && (
                    <div className={classes.fullScreenContainer}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } 
            <div className={classes.graphContainer} ref={containerRef}>  
                <DisplayChart />
            </div> 
        </>
    )
}

export default SpanVisualize