import React, {useEffect,   useRef,   useState} from 'react'
import { useSelector } from 'react-redux'
import { Chart } from "react-google-charts";



const DisplayChart = (props) => {
    const CONSTANT_DECREMENT = 106; 
    const containerRef = useRef(null)
    const [height, setHeight] = useState('100%');
    const [tap, setTap] = useState(1);
    const [tooltip, setTooltip] = useState(typeof props.tooltip !== 'undefined' && props.tooltip === true ? {isHtml: true} : {})
    const [option, setOption] = useState({
        width: '100%',
        animation:{
            duration: 1000,
            easing: 'out',
        },
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

    useEffect(() => {
        if(typeof props.chartBar != 'undefined' || typeof props.analyticsBar != 'undefined') {
            CallChart()
        }
    }, [props])

    const chartEvents = [
        {
            eventName: "select",
            callback({ chartWrapper }) {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();  
                if(selection.length > 0) { 
                    props.onSelect(selection, props.chartType)
                } else {
                    props.onSelect(selection, props.chartType)
                }
            }
        }
    ];
  
     
    const CallChart = () => {  
        return (
            <Chart
                chartType="Sankey"
                width="100%"
                height={height}
                loader={<div>Loading...</div>}
                data={props.data}
                options={option}
                chartEvents={chartEvents}
            />
        )
    }


    return (
        <React.Fragment>
            {
                props.data.length > 0 && tap > 0  && containerRef != null && containerRef.current == null
                ?
                    <CallChart />
                :
                    ''
            }
        </React.Fragment>
    )
}

export default DisplayChart;