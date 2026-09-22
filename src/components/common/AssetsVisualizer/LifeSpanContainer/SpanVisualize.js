import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import './styles.css'
import { pink } from '@mui/material/colors'

import FullScreen from '../../FullScreen'
import { Chart } from "react-google-charts";
import themeMode from '../../../../themes/themeMode';
import TitleBar from '../../TitleBar'

const SpanVisualize = ({ chart, chartBar, visualizerBarSize, standalone }) => {
    const containerRef = useRef(null)
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
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
                color: isDarkTheme ? themeMode.dark.palette.secondary.main : themeMode.light.palette.secondary.main,
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
        /* console.log('opt', opt) */
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


    /*
     * A table is a header row plus at least one data row. Anything less used
     * to be handed to Google Charts, which answers with its own red
     * "Cannot draw chart: no data specified" box - one per render, so the
     * panel filled with them. Both that case and a chart-side error now
     * show the panel's own message in the app's colours.
     */
    const [chartError, setChartError] = useState(null)
    useEffect(() => { setChartError(null) }, [chart]) // a new table gets a fresh try
    const hasRows = Array.isArray(chart) && chart.length > 1

    const DisplayChart = () => {
        if (!hasRows || chartError) {
            return (
                <div className={'pt-lifespan-empty'} role="status">
                    <span className={'pt-lifespan-empty-title'}>
                        {chartError ? 'The lifespan chart could not be drawn.' : 'No lifespan data for this selection.'}
                    </span>
                    <span className={'pt-lifespan-empty-hint'}>
                        {chartError
                            ? 'Try selecting the assets again. If it keeps happening, let us know.'
                            : 'Assets need a filing or grant date to appear here.'}
                    </span>
                </div>
            )
        }
        return (
            <div style={{marginTop: 15, display: 'flex', height: '93%', width: '100%'}}>
                <Chart
                    width={'100%'}
                    height={height}
                    chartType="ColumnChart"
                    loader={<div>Loading...</div>}
                    data={chart}
                    options={option}
                    chartEvents={[{ eventName: 'error', callback: ({ chartWrapper }) => setChartError(chartWrapper) }]}
                />
            </div>
        )
    }

    return (
        <>
            {/* {
                typeof standalone === 'undefined' && (
                    <div className={'pt-lifespan-full-screen-container'}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } */} 
            <div className={'pt-lifespan-graph-container'} ref={containerRef}>  
                <TitleBar 
                    title={`Hover over the bars to see how many patents will remain active if maintained.`} 
                    enablePadding={false}  
                    underline={false} 
                    typography={true}
                />
                {/*
                  * Called, not rendered as <DisplayChart />. It is declared
                  * inside this render, so used as a component it is a *new
                  * type* on every render: React unmounts the old subtree and
                  * mounts a fresh one each time. react-google-charts loads the
                  * chart asynchronously, so a load already in flight came back
                  * to an unmounted instance - "Can't perform a React state
                  * update on an unmounted component ... at DisplayChart".
                  * Calling it yields the same elements while letting React
                  * reconcile Chart by its own stable type, so the instance
                  * survives the re-render and the async load lands on it.
                  */}
                {DisplayChart()}
            </div>
        </>
    )
}

export default SpanVisualize