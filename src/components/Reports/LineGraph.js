import React, {useState, useRef} from 'react'
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux'
import themeMode from '../../themes/themeMode';
import useStyles from './styles'

const LineGraph = (props) => {
    const containerRef = useRef(null)
    const gradientID = `gradient-expense-${props.lineID}`
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const classes = useStyles()
    const [height, setHeight] = useState('100%');
    const [option, setOption] = useState({
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        chartArea: {
            width: '90%',
            height: '81%',
            left: 40,
            top: 15,
        },
        vAxis: {minValue: 0},
        colors: ['#1565c0'],
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
                color: 'transparent',   
            },
            minorGridlines:{
                color:'transparent' 
            },
        },
    });

    const DisplayChart = () => {
        if(typeof props.data == 'undefined' || props.data.length === 0) return null
        return (
            <React.Fragment>
                <Chart
                    width={'100%'}
                    height={height}
                    chartType="AreaChart"
                    loader={<div>Loading...</div>}
                    data={props.data}
                    options={option}
                    chartEvents={[
                        {
                            eventName: "ready",
                            callback: ({ chartWrapper, google }) => {
                                const chart = chartWrapper.getChart();
                                const container = chart.container
                                const observer = new MutationObserver(function () {
                                    Array.prototype.forEach.call(container.getElementsByTagName('path'), function(path) {
                                        console.log("path.getAttribute('fill')", path.getAttribute('fill'))
                                        if (path.getAttribute('fill') === '#1565c0') {
                                            path.setAttribute('fill', `url(#${gradientID}) #1565c0`);
                                        }
                                    });
                                });
                                observer.observe(container, {
                                    childList: true,
                                    subtree: true
                                }); 
                            }
                        }
                    ]} 
                />
                <svg style={{width:0,height:0,position:'absolute'}} aria-hidden="true" focusable="false">
                    <linearGradient id={gradientID} x1="0%" y1="0%" x2="0%" y2="100%" >
                    <stop offset="0%" stop-color="#0355e9" />
                    <stop offset="50%" stop-color="#1D2025" />
                    <stop offset="100%" stop-color="#1D2025" />
                    </linearGradient>
                </svg>  
            </React.Fragment>
        )
    }


    return (
        <div className={classes.graphContainer} ref={containerRef}>  
            <DisplayChart />
        </div> 
    )
}


export default LineGraph;