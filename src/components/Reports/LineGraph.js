import { data } from 'autoprefixer';
import React, {useState, useRef, useEffect} from 'react'
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
            width: '95%',
            height: '50%',
            left: 30,
            top: 20,
        },
        tooltip: { textStyle: { fontName: 'Roboto', fontSize: 12 } },
        colors: ['#1565c0'],
        hAxis: {
            baselineColor: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider,
            format: '0',
            textStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 10,
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 10,
                fontFamily: 'Roboto'
            },
            gridlines: {
                color: 'transparent',
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
                fontSize: 10,
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 10,
                fontFamily: 'Roboto'
            },
            gridlines: {
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
                    width='100%'
                    height={height}
                    chartType="SteppedAreaChart"
                    loader={<div>Loading...</div>}
                    data={props.data}
                    options={option}
                    /* chartEvents={[
                        {
                            eventName: "ready",
                            callback: ({ chartWrapper, google }) => {
                                const chart = chartWrapper.getChart();
                                const container = chart.container
                                const observer = new MutationObserver(function () {
                                    Array.prototype.forEach.call(container.getElementsByTagName('path'), function(path) {
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
                    ]} */ 
                />
                <svg style={{width:0,height:0,position:'absolute'}} aria-hidden="true" focusable="false">
                    <linearGradient id={gradientID} x1="0%" y1="0%" x2="0%" y2="100%" >
                        <stop offset="0%" stopColor="#0355e9" />
                        <stop offset="50%" stopColor="#1D2025" />
                        <stop offset="100%" stopColor="#1D2025" />
                    </linearGradient>
                </svg>  
            </React.Fragment>
        )
    }


    return (
        <div className={classes.graphContainer} ref={containerRef} style={{height: '90%'}}>  
            <DisplayChart />
        </div> 
    )
}


export default LineGraph;