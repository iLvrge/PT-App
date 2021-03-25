import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
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

    const [ selectedTab, setSelectedTab ] = useState(0)

    const selectedAssetsTransactionLifeSpan = useSelector(state => state.patenTrack2.transaction_life_span)

    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)

     let options = {
        height: '400px',
        width: '100%',
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
              padding       : '10px',
              borderRadius  : '10px',
              color         : 'rgba(255, 255, 255, 0.7)'
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
            if (selectedAssetsTransactionLifeSpan.length === 0) return null
            
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
            //TODO height 100% not working well, created allot of isues when we resize pane, 
            if(graphContainerRef.current != null && graphContainerRef.current.clientHeight > 0) {
                options = {...options, height: `${graphContainerRef.current.clientHeight}px`}
            }
            graphRef.current = new Graph3d(graphContainerRef.current, items, options)

            setIsLoadingCharts(false)
        }

        getChartData()
    }, [ options, selectedAssetsTransactionLifeSpan, graphContainerRef ])

    if (selectedAssetsTransactionLifeSpan.length === 0) return null 

    return (
        <Paper className={classes.root} square>  
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
        </Paper>
    )
}




export default InventionVisualizer