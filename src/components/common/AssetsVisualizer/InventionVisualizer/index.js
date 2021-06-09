import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Backdrop, Paper } from '@material-ui/core'

import { DataSet } from 'vis-data/esnext'
import { Graph3d } from 'vis-graph3d/esnext'

import AssetsList from './AssetsList'
import Loader from '../../Loader'
import PatenTrackApi from '../../../../api/patenTrack2'
import useStyles from './styles'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import { setAssets } from '../../../../actions/patenTrackActions'

const InventionVisualizer = ({ defaultSize, visualizerBarSize, analyticsBar }) => {
    
    const classes = useStyles()
    const graphRef = useRef()
    const graphContainerRef = useRef()  
    const items = useRef(new DataSet())

    const [ isLoadingCharts, setIsLoadingCharts ] = useState(false)
    const [ openModal, setModalOpen ] = useState(false)
    const [ assetLoading, setAssetsLoading ] = useState(false)
    const [ assets, setAssets ] = useState([])

    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const selectedAssetsTransactionLifeSpan = useSelector( state => state.patenTrack2.transaction_life_span )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected ) //companies
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected) //activities
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected ) //parties + inventors
    const selectedAssetAssignments = useSelector(state => state.patenTrack2.assetTypeAssignments.selected) // Transactions

    const [ graphRawData, setGraphRawData ] = useState([])
    const [ graphRawGroupData, setGraphRawGroupData ] = useState([])

    let options = {
        height: '100%',
        width: '100%',
        style: 'bar-color',
        axisFontSize: 18,
        /* yBarWidth:  30, */
        yStep: 1,
        yCenter: '30%',
        showPerspective: true,
        showGrid: true,
        axisColor: '#fff',
        keepAspectRatio: false,
        verticalRatio: 0.5,
        xLabel: '',
        yLabel: '',
        zLabel: '',
        tooltip: function (point) {
            console.log('point, data', point)
            // parameter point contains properties x, y, z, and data
            // data is the original object passed to the point constructor
            const findIndex = graphRawGroupData.findIndex( row => row.id == point.y )
            let code = '', defination = '', origin = point.data.origin
            if(findIndex !== -1) {
                code = graphRawGroupData[findIndex].cpc_code
                defination = graphRawGroupData[findIndex].defination
            }
            if( origin != null ) {
                origin = origin.split('@@').join('<br/>')
            }

            return `<div class="graphTooltip">Filling Year: ${point.x}<br/>Patents: ${point.data.patent}<br/>${point.data.application_number > 0 ? 'Applications: '+ point.data.application_number +'<br/>' : ''}Origin: ${origin}<br/> Subject Matter : ${defination}</div>`
        },
        yValueLabel: function(value) {
            const findIndex = graphRawGroupData.findIndex( row => row.id == value)
            if( findIndex !== -1 ) {
                return graphRawGroupData[findIndex].cpc_code
            } 
            return value;
        },
        gridColor: '#e5e5e51c',
        tooltipStyle: {
            content: {
              padding       : '10px',
              border        : '0px',
              borderRadius  : '0px',
              color         : '#fff',
              background    : '#000',
              boxShadow     : 'none'
            },
            line: {
              borderLeft    : '1px dotted #e60000'
            },
            dot: {
              border        : '5px solid rgba(230, 0, 0, 0.5)'
            }
        }
    }

    const graphClickHandler = useCallback(async (point) => {
        const findIndex = graphRawGroupData.findIndex( row => row.id == point.y )

        if(findIndex !== -1) {
            const code = graphRawGroupData[findIndex].cpc_code
            setModalOpen(true)
            setAssetsLoading(true)
            const {data} = await PatenTrackApi.getAssetsByCPCCode(point.x, code, selectedCategory, selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments)
            setAssetsLoading(false)
            setAssets(data.list)
        }
    },[ graphRawGroupData, selectedCategory, selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments ])

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
            const colors = ['#70A800', '#00a9e6', '#E69800', '#ff0000']
            let xMin = 0, xMax = 0, years=[];
            const promises = graphRawData.map( (data, index) => {
                const findIndex = graphRawGroupData.findIndex( row => row.cpc_code == data.cpc_code )
                if(findIndex !== -1) {
                    const year = parseInt(data.fillingYear)
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
                    //const col = colors[Math.floor((Math.random()*colors.length))]
                    items.current.add({
                        x: year,
                        y: graphRawGroupData[findIndex].id,
                        z: data.countAssets,
                        style: {
                            stroke: '#5a5a5a',
                            fill: '#4f81bd',
                        },
                        patent: data.patent_number,
                        application_number: data.application_number,   
                        origin: data.group_name
                    })
                }                
            })

            await Promise.all(promises)            
           
            //TODO height 100% not working well, created allot of isues when we resize pane, 
            if(graphContainerRef.current != null && graphContainerRef.current.clientHeight > 0) {
               options = {...options, height: `${graphContainerRef.current.parentNode.parentNode.clientHeight}px`, xMin, xMax, axisFontSize: visualizerBarSize == '30%' ? 18 : 18, yStep:  visualizerBarSize == '30%' ? 8 : 1 }
            }     
            graphRef.current = new Graph3d(graphContainerRef.current, items.current, options)
            graphRef.current.on('click', graphClickHandler)
        }
        generateChart()
        
    }, [ isLoadingCharts, graphRawData, graphRawGroupData, graphContainerRef, defaultSize ])

    useEffect(() => {
        if( graphRef.current != undefined && graphRawGroupData.length > 0 && graphRawData.length > 0 && !isLoadingCharts ) {
            let fontSize = 18, step = 1, verticalRatio = 0.5
            if( visualizerBarSize == '100%' ) {
                if(defaultSize != '0') {
                    step = 3
                    verticalRatio = 0.2
                } 
            } else if(visualizerBarSize == '30%') {
                fontSize = 18
                step = 8
            }
            options = { ...options, height: `${graphContainerRef.current.parentNode.parentNode.clientHeight}px`, axisFontSize: fontSize, yStep: step, verticalRatio }
            graphRef.current.setOptions(options)
            graphRef.current.redraw()
        }
    }, [ visualizerBarSize, analyticsBar, defaultSize ]) 

    const handleClose = () => {
        setModalOpen(false);
    }

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
                <Modal
                    disableBackdropClick={false}
                    open={openModal}
                    onClose={handleClose}
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                    aria-labelledby="year-cpc-assets"
                    aria-describedby=""
                    className={classes.modal}
                >
                    <>
                        <AssetsList loading={assetLoading} assets={assets}/>
                    </>
                </Modal>           
            </div>            
        </Paper>
    )
}




export default InventionVisualizer