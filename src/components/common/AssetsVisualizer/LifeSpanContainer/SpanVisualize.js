import React, { useEffect, useState, useRef } from 'react'
/* import Moment from 'moment'
import { DataSet } from 'vis-data/esnext'
import { Graph2d } from 'vis-timeline/esnext' */

import useStyles from './styles'

//import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

/* 
const SpanVisualize = ({ chart }) => {

    const graphRef = useRef()
    const graphContainerRef = useRef()  
    const [ isLoadingCharts, setIsLoadingCharts ] = useState(false)
    const classes = useStyles()

    const options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        style: 'bar',
        drawPoints: false,
        stack: true,
        dataAxis: {
            left: {
                format: function(value){
                    // don't show non-integer values on data axis
                    return Math.round(value) === value ? value : ''
                }
            }
        },
        orientation: 'bottom',
        start: Moment()
          .subtract(25, 'years')
          .format(),
        end: new Date(),
    }

    useEffect(() => {
        graphRef.current = new Graph2d(graphContainerRef.current, [], options)
        return () => {
            graphRef.current.destroy()
        }
    }, [ options ])

    useEffect(() => {
        const getChartData = async () => {
          setIsLoadingCharts(true)        
          const convertedData = chart.map(datum => ({
              x: Moment(datum.year + '-01-01').format(),
              y: datum.count,
          }))
          const items = new DataSet(convertedData)
          graphRef.current.setItems(items)
          graphRef.current.setOptions({ ...options, start: Moment(new Date(chart[0].year+ '-01-01')).format(), end: Moment(new Date(chart[chart.length -1].year+ '-01-01')).add(3, 'year').format() })
          setIsLoadingCharts(false)
        }
        getChartData()
    }, [ chart, options ])

    return (
        <div className={classes.graphContainer}>
            <div
                style={{
                height: '100%',
                width: '100%',
                display: chart ? 'block' : 'hidden',
                filter: `blur(${isLoadingCharts ? '4px' : 0})`,
                }}
                ref={graphContainerRef}
                className={classes.timeline}
            />  
        </div>
    )
}

export default SpanVisualize */



import { Chart } from "react-google-charts";

const SpanVisualize = ({ chart }) => {
    const classes = useStyles() 
    const [minMax, setMinMax] = useState([0,0])

    useEffect(() => {
        if( chart.length > 1 ) {
            setMinMax([chart[1][0], chart[chart.length - 1][0]])
        }
    }, [ chart ])

    useEffect(() => {
        console.log('minMax', minMax)
    }, [minMax])

    return (
        <div className={classes.graphContainer}>  
            <Chart
                width={'100%'}
                height={'100%'}
                chartType="ColumnChart"
                loader={<div>Loading...</div>}
                data={chart}
                options={{
                    legend: { position: 'none' },
                    bar: { groupWidth: '95%' },
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
                            /* minSpacing: 3 */
                        },
                       /*  minValue: minMax[0], 
                        maxValue: minMax[1], */
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
                            /* minSpacing: 0  */
                        }
                    },
                    chartArea: {
                        width: '96%',
                        height: '95%',
                        left:50,
                        top:15,
                    }
                    /* axes: {
                        y: {
                            all: {
                                range: {
                                    max: minMax[1],
                                    min: minMax[0]
                                }
                            }
                        }
                    }, */
                }}
            />
        </div> 
    )
}

export default SpanVisualize