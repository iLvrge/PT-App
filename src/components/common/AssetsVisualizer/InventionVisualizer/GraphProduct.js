import React, { useEffect, useRef } from 'react'

import { DataSet } from 'vis-data/esnext'
import { Graph3d } from 'vis-graph3d/esnext'
import Loader from '../../Loader' 
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import useStyles from './styles'

const GraphProduct = ({loading, productItems, productGroups, visualizerBarSize}) => { 
    const graphContainerRef = useRef()  
    const classes = useStyles()
    const graphRef = useRef()
    const items = useRef(new DataSet()) 

    let options = {
        height: '100%',
        width: '100%',
        style: 'bar-color',
        axisFontSize: 22,
        cameraPosition: {
            distance: 1.9,
            horizontal: 0.69,
            vertical: 0.2
        }, 
        xStep: 1,
        yStep: 1,
        zStep: 3,
        /* rotateAxisLabels: false, */
        yCenter: '35.5%',
        xCenter: '55%',
        axisColor: '#ffffff',
        gridColor: '#e5e5e51c',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: false,
        verticalRatio: 0.4,
        xLabel: 'Filling',
        yLabel: 'Products',
        zLabel: 'Assets',
        animationAutoStart: true,
        /* tooltip: function (point) {
            // parameter point contains properties x, y, z, and data
            // data is the original object passed to the point constructor
            const findIndex = productGroups.findIndex( row => row.id == point.y )
        }, */
        yValueLabel: function(value) {
            const findIndex = productGroups.findIndex( row => row.id == value)
            if( findIndex !== -1 ) {
                return productGroups[findIndex].name
            }  
            return value;
        },
        xValueLabel: function(value) {
            return parseInt(value)
        },
        zValueLabel: function(value) {
            return parseInt(value)
        },
        tooltipStyle: {
            content: {
              padding       : '10px',
              border        : '0px',
              borderRadius  : '0px',
              color         : '#fff',
              background    : 'rgba(0, 0, 0, 0.8)',
              boxShadow     : 'none',    
              /* bottom        : '0px', */
              /* width         : '90%', */
              /* left          : '0px' */
              /* maxWidth      : '40%' */
            },
            line: {
              borderLeft    : '0px dotted #e60000',
              height        : '0px'
            },
            dot: {
              border        : '0px solid rgba(230, 0, 0, 0.5)'
            }
        }
    }


    useEffect(() => {
        if(loading === false && productItems.length > 0) { 
            generateChart()
        }
    }, [loading, productItems])

    const graphClickHandler = async (point) => {

    }

    const onHandleMouseOver = (event) => { 
    }

    const onHandleMouseOut = (event) => { 
    } 

    const onCameraPositionChange = async (event) => {
        /* console.log(event) */
    }

    const generateChart = async () => {
        items.current = new DataSet()
        
        let xMin = 0, xMax = 0, years = [], zMax = [];
        const promises = productItems.map( (data, index) => {
            const findIndex = productGroups.findIndex( row => row.name == data.category )
            const year = parseInt(data.year)
            if(xMin == 0) {
                xMin = year     
            }
            if(xMax == 0) {
                xMax = year
            }
            if(!years.includes(year)){
                years.push(year)
            }

            if(year < xMin){
                xMin = year
            } else  if(year > xMax){
                xMax = year
            }
            zMax.push(data.countAssets) 
            let style = { 
                fill: '#1565C0',
                stroke: '#2196F3'
            }; 
            items.current.add({
                x: year,
                y: productGroups[findIndex].id,
                z: parseInt(data.countAssets),
                style: style
            })
        })
        await Promise.all(promises)            
        //TODO height 100% not working well, created allot of isues when we resize pane, 
        if(graphContainerRef.current != null && graphContainerRef.current.clientHeight > 0) {
            options = {...options, axisFontSize: visualizerBarSize == '30%' ? 22 : 22, yStep:  visualizerBarSize == '30%' ? 8 : 1, zStep: Math.max(...zMax) > 10 ? parseInt(Math.max(...zMax) / 10) : productItems.length > 2 ? 3 : 1, zMax: Math.max(...zMax) }
        }     
        /* options.axisColor = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary */
        graphRef.current = new Graph3d(graphContainerRef.current, items.current, options)
        graphRef.current.on('click', graphClickHandler)      
        graphRef.current.on('cameraPositionChange', onCameraPositionChange)
        if(graphContainerRef.current != null ) {
            graphContainerRef.current.removeEventListener('mouseover', onHandleMouseOver)
            graphContainerRef.current.addEventListener('mouseout', onHandleMouseOut)
            graphContainerRef.current.addEventListener('mouseover', onHandleMouseOver)            
        }
    }
    
    return ( 

            loading
            ?
                <Loader />
            :
            <div
                id='productCategoryAssets'
                style={{
                    height: '90%',
                    width: '100%',
                    filter: 0,
                }}
                ref={graphContainerRef}
                className={classes.timeline}
            />

    )
} 

export default GraphProduct