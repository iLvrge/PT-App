import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import Paper from '@material-ui/core/Paper'

import { DataSet } from 'vis-data/esnext'
import { Graph3d } from 'vis-graph3d/esnext'

import Loader from '../../Loader'
import PatenTrackApi from '../../../../api/patenTrack2'
import useStyles from './styles'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

const InventionVisualizer = ({defaultSize}) => {
    
    const classes = useStyles()
    const graphRef = useRef()
    const graphContainerRef = useRef()  
    const items = useRef(new DataSet())

    const [ isLoadingCharts, setIsLoadingCharts ] = useState(false)

    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const selectedAssetsTransactionLifeSpan = useSelector( state => state.patenTrack2.transaction_life_span )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected ) //companies
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected) //activities
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected ) //parties + inventors
    const selectedAssetAssignments = useSelector(state => state.patenTrack2.assetTypeAssignments.selected) // Transactions

    const [ graphRawData, setGraphRawData ] = useState([])
    const [ graphRawGroupData, setGraphRawGroupData ] = useState([])
   
    let options = {
        height: '400px',
        width: '100%',
        style: 'bar-color',
        showPerspective: true,
        showGrid: true,
        xBarWidth: 10,
        yBarWidth: 10,
        axisColor: '#fff',
        keepAspectRatio: true,
        verticalRatio: 0.5,
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

        yValueLabel: function(value) {
            const findIndex = graphRawGroupData.findIndex( row => row.id == value)
            if( findIndex !== -1 ) {
                return graphRawGroupData[findIndex].cpc_code
            }
            return value;
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

    const custom = (x, y) =>{
        return (-Math.sin(x/Math.PI) * Math.cos(y/Math.PI) * 10 + 10);
    }

    useEffect(() => {
        const getChartData = async () => {
            if (selectedCompanies.length === 0) return null
            setIsLoadingCharts(true)   
            const {data} = await PatenTrackApi.getCPC(selectedCategory, selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments)
            setIsLoadingCharts(false)
            setGraphRawData(data.list)
            setGraphRawGroupData(data.group)
        }
        getChartData()
    }, [selectedCategory, selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments])




    useEffect(() => {
        
        const generateChart = async () => {
            if (isLoadingCharts || graphRawData.length == 0 || graphRawGroupData.length == 0) return null
            items.current = new DataSet()
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
            const promises = graphRawData.map( data => {
                const findIndex = graphRawGroupData.findIndex( row => row.cpc_code == data.cpc_code )
                if(findIndex !== -1) {
                    items.current.add({
                        x: parseInt(data.fillingYear),
                        y: graphRawGroupData[findIndex].id,
                        z: data.countAssets,
                        stroke: '#fff',
                        fill: colors[Math.floor((Math.random()*colors.length))],
                    })
                }                
            })

            await Promise.all(promises)            
            //TODO height 100% not working well, created allot of isues when we resize pane, 
            if(graphContainerRef.current != null && graphContainerRef.current.clientHeight > 0) {
                options = {...options, height: `${graphContainerRef.current.parentNode.parentNode.clientHeight}px`}
            }       
            graphRef.current = new Graph3d(graphContainerRef.current, items.current, options)
        }
        generateChart()
        
    }, [ isLoadingCharts, graphRawData, graphRawGroupData, graphContainerRef ])

    if (selectedAssetsTransactionLifeSpan.length === 0 || selectedCompanies.length === 0 ) return null

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
                    <Loader />
                }              
            </div>            
        </Paper>
    )
}




export default InventionVisualizer