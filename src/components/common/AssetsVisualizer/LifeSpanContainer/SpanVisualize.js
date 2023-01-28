import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import useStyles from './styles'
import { pink } from '@mui/material/colors'

import FullScreen from '../../FullScreen'
import { Chart } from "react-google-charts";
import themeMode from '../../../../themes/themeMode';
import TitleBar from '../../TitleBar'

const SpanVisualize = ({ chart, chartBar, visualizerBarSize, standalone }) => {
    const containerRef = useRef(null)
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
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
        isStacked: false,
        backgroundColor: 'transparent',
        hAxis: {
            baselineColor: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider,
            format: '0',
            textStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
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
            baselineColor: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider,
            format: '0',
            textStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            gridlines: {
                /* color: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider, */
                color: '#292a2b',
            },
            minorGridlines:{
                color:'transparent' 
            },
        },
        annotations: {
            style: 'line',
            stem: {
                color: pink[500],
                length: 50
            }
        },
        chartArea: {
            width: '83%',
            height: '90%',
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
        const opt = {...option}
        opt.hAxis.baselineColor = isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider
        opt.hAxis.textStyle.color = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary
        opt.hAxis.titleTextStyle.color = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary
        opt.vAxis.baselineColor = isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider
        opt.vAxis.textStyle.color = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary
        opt.vAxis.titleTextStyle.color = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary
        if(chart.length > 1) { 
            opt.vAxis = {
                ...opt.vAxis,
                viewWindowMode: 'explicit',
                viewWindow: {
                    max: chart[1][1],
                    min: chart[chart.length - 1][1]
                }
            } 
            opt.axes = {
                y: {
                    all: {
                        range: {
                            max: chart[1][1],
                            min: chart[chart.length - 1][1]
                        }
                    }
                }
            }
        }
        console.log('opt', opt)
        /* opt.vAxis.gridlines.color = isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider */
        setOption(opt)
    }, [isDarkTheme])

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
            setHeight('98%')
            const opt = {...option}
            opt.chartArea.height = '85%'
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
        if(chart.length === 0) return null
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
            {/* {
                typeof standalone === 'undefined' && (
                    <div className={classes.fullScreenContainer}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } */} 
            <div className={classes.graphContainer} ref={containerRef}>  
                <TitleBar 
                    title={`Hover over the bars to see how many patents will remain active if maintained.`} 
                    enablePadding={false}  
                    underline={false} 
                    typography={true}
                />
                <DisplayChart />
            </div> 
        </>  
    )
}

export default SpanVisualize