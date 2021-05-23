import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'

import { DataSet } from 'vis-data/esnext'
import { Graph3d } from 'vis-graph3d/esnext'



import useStyles from './styles'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

const InventionVisualizer = () => {
    
    const classes = useStyles()
    const graphRef = useRef()
    const graphContainerRef = useRef()  
    const [ isLoadingCharts, setIsLoadingCharts ] = useState(false)

    const options = {
        height: '300px',
        width: '400px',
        style: 'dot-color',
        showPerspective: true,
        showGrid: true,
        keepAspectRatio: true,
        verticalRatio: 1.0,
        legendLabel: 'distance',
        cameraPosition: {
          horizontal: -0.35,
          vertical: 0.22,
          distance: 1.8
        },
        tooltip: function (point) {
            // parameter point contains properties x, y, z, and data
            // data is the original object passed to the point constructor
            return 'value: <b>' + point.z + '</b>' 
        },
        tooltipStyle: {
            content: {
              background    : 'rgba(255, 255, 255, 0.7)',
              padding       : '10px',
              borderRadius  : '10px'
            },
            line: {
              borderLeft    : '1px dotted rgba(0, 0, 0, 0.5)'
            },
            dot: {
              border        : '5px solid rgba(0, 0, 0, 0.5)'
            }
        }
    }

    useEffect(() => {
        const getChartData = async () => {
            
            setIsLoadingCharts(true)     
            const items = new DataSet()

            const sqrt = Math.sqrt
            const pow = Math.pow
            const random = Math.random

            for (let i = 0; i < 100; i++) {
                let x = pow(random(), 2)
                let y = pow(random(), 2)
                let z = pow(random(), 2)
                let style = (i%2==0) ? sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)) : '#00ffff'        
                items.add({ x:x,y:y,z:z,style:style })
            }
            graphRef.current = new Graph3d(graphContainerRef.current, items, options)

            setIsLoadingCharts(false)
        }

        getChartData()
    }, [ options ])

    


    return (
        <div className={classes.graphContainer}>
            {
                !isLoadingCharts
                ?
                <div
                    style={{
                    height: '100%',
                    width: '100%',
                    filter: `blur(${isLoadingCharts ? '4px' : 0})`,
                    }}
                    ref={graphContainerRef}
                    className={classes.timeline}
                />
                :
                ''
            }              
        </div>
    )
}




export default InventionVisualizer