import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { Chart } from "react-google-charts";



const DisplayChart = (props) => {
    const CONSTANT_DECREMENT = 106;
    const [height, setHeight] = useState('100%');
    const [tooltip, setTooltip] = useState(typeof props.tooltip !== 'undefined' && props.tooltip === true ? {isHtml: true} : {})
    const [option, setOption] = useState({
        width: '100%',
        sankey: {
            link: { color: { fill: "#1565C0" } },
            node: {
                interactivity: true,
                colors: ['#70A800', '#FFAA00','#1565C0', '#E60000'],
                label: { color: "#FFF", fontName: 'Roboto', fontSize: 12.25 },
                width: 15
            }
        },
        tooltip
    });
    
    const screenHeight = useSelector(state => state.patenTrack.screenHeight);

    useEffect(() => {
        let height = '100%'
        if(props.data.length > 10) {
            const chartHeight = props.data.length * 20
            setOption(prevItem => {
                return {...prevItem, height: chartHeight}
            }) 
        }  else if(props.data.length < 4) {
            height =  `${parseInt((screenHeight - CONSTANT_DECREMENT) * (props.data.length * 5.5) / 100)}px`
            setOption(prevItem => {
                let pre = {...prevItem}
                delete pre.height
                return {...pre}
            })
        } else {
            setOption(prevItem => {
                let pre = {...prevItem}
                delete pre.height
                return {...pre}
            })   
        }    
        setHeight(height)
    }, [props.data])

    
    return (
        <React.Fragment>
            {
                props.data.length > 0
                ?
                    <Chart
                        chartType="Sankey"
                        width="100%"
                        height={height}
                        loader={<div>Loading...</div>}
                        data={props.data}
                        options={option}
                        chartEvents={[
                            {
                                eventName: "ready",
                                callback: ({ chartWrapper, google }) => {
                                    const chart = chartWrapper.getChart();
                                    google.visualization.events.addListener(chart, "select", e => {
                                        const chart = chartWrapper.getChart();
                                        const selection = chart.getSelection();
                                        if(selection.length > 0) {
                                            props.onSelect(selection, props.type)
                                        }
                                    });
                                }
                            }
                        ]}
                    />
                :
                    ''
            }
        </React.Fragment>
    )
}

export default DisplayChart;