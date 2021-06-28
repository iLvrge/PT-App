import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Dialog, DialogContent, DialogTitle, Typography, Slider } from '@material-ui/core'
import Draggable from "react-draggable"


import { DataSet } from 'vis-data/esnext'
import { Graph3d } from 'vis-graph3d/esnext'


import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import AssetsList from './AssetsList'
import PdfViewer from '../../PdfViewer'
import Loader from '../../Loader'
import {
    setAssetTypeAssignmentAllAssets,
    setMaintainenceAssetsList,
    getCustomerAssets,
    setAssetsIllustrationData
} from '../../../../actions/patentTrackActions2'
import { setPDFFile, setPdfTabIndex } from '../../../../actions/patenTrackActions' 
import PatenTrackApi from '../../../../api/patenTrack2'
import useStyles from './styles'

import { capitalize } from "../../../../utils/numbers";

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

const InventionVisualizer = ({ defaultSize, visualizerBarSize, analyticsBar }) => {
    
    const classes = useStyles()
    const dispatch = useDispatch()
    const graphRef = useRef()
    const graphContainerRef = useRef()  
    const items = useRef(new DataSet())

    const [ isLoadingCharts, setIsLoadingCharts ] = useState(false)
    const [ openModal, setModalOpen ] = useState(false)
    const [ assetLoading, setAssetsLoading ] = useState(false)
    const [ assets, setAssets ] = useState([])
    const [ filterList, setFilterList ] = useState([])
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ value, setValue ] = useState([])
    const [ scopeRange, setScopeRange ] = useState([])
    const [ depthRange, setDepthRange ] = useState([
        {
          value: 1,
          label: 'Section',
        },
        {
          value: 2,
          label: 'Class',
        },
        {
          value: 3,
          label: 'Sub Class',
        },
        {
          value: 4,
          label: 'Main Group',
        },
        {
            value: 5,
            label: 'Sub Group',
        },
    ])

    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const selectedAssetsTransactionLifeSpan = useSelector( state => state.patenTrack2.transaction_life_span )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected ) //companies
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll )
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected )
    const assetTypesSelectAll = useSelector( state => state.patenTrack2.assetTypes.selectAll )
    const selectedAssetCompanies = useSelector( state => state.patenTrack2.assetTypeCompanies.selected )
    const selectedAssetCompaniesAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )

    const assetIllustration = useSelector( state => state.patenTrack2.assetIllustration )
    const assetIllustrationData = useSelector( state => state.patenTrack2.assetIllustrationData )
    const selectedRow = useSelector( state => state.patenTrack2.selectedAssetsTransactions )

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

            return `<div class="graphTooltip"><ul class="tootlip_data"><li><strong>Filling Year</strong>: ${point.x}</li><li><strong>Patents</strong>: ${point.data.patent}</li>${point.data.application_number > 0 ? '<li><strong>Applications</strong>: '+ point.data.application_number +'</li>' : ''}<li><strong>Origin</strong>: ${origin != null ? origin : ''}</li><li><div class='noWrapText'><strong>Subject Matter</strong>: ${capitalize(defination)}</div></li></div>`
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
              boxShadow     : 'none',
              maxWidth      : '40%'
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
            const form = new FormData()
            form.append("list", JSON.stringify(filterList))
            const {data} = await PatenTrackApi.getAssetsByCPCCode(point.x, code,form) 
            setAssetsLoading(false)
            setAssets(data.list)
        }
    },[ graphRawGroupData, filterList ])

    useEffect(() => {
        const getChartData = async () => {
            if (selectedCompanies.length === 0) return null
            setIsLoadingCharts(true)   
            const list = [];
            
            if( (assetsList.length > 0 && assetsSelected.length > 0 && assetsList.length != assetsSelected.length ) || ( maintainenceAssetsList.length > 0 &&  selectedMaintainencePatents.length > 0 && selectedMaintainencePatents.length != maintainenceAssetsList.length ) ) {  
                if( assetsSelected.length > 0 ) {
                    const promise = assetsSelected.map(asset => {
                        const findIndex = assetsList.findIndex( row => row.appno_doc_num.toString() == asset.toString() || row.grant_doc_num.toString() == asset.toString() )
                        if( findIndex !== -1 ) {
                            if( assetsList[findIndex].appno_doc_num != '' ) {
                                list.push(assetsList[findIndex].appno_doc_num.toString())
                            }
                        }
                    })
                    await Promise.all(promise)
                } else {
                    const promise = selectedMaintainencePatents.map(asset => {
                        const findIndex = maintainenceAssetsList.findIndex( row => row.appno_doc_num.toString() == asset[1].toString() || row.grant_doc_num.toString() == asset[0].toString() )
                        if( findIndex !== -1 ) {
                            if( maintainenceAssetsList[findIndex].appno_doc_num != '' ) {
                                list.push(maintainenceAssetsList[findIndex].appno_doc_num.toString())
                            }
                        }
                    })
                    await Promise.all(promise)
                }                
            } else {
                if( assetsList.length > 0 || maintainenceAssetsList.length > 0 ) {
                    if( assetsList.length > 0 ) {
                        const promise = assetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
                    } else if ( maintainenceAssetsList.length > 0 ) {
                        const promise = maintainenceAssetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
                    }
                } else {
                    /**
                     * Check which layout and get the assets list first and then 
                     */
                    if( selectedCategory == '' ) { //pay_maintenece_fee

                    } else {
                        const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                        tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                        customers =
                          selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies,
                        assignments =
                          selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;
                        
                        if (selectedCompaniesAll === true || selectedCompanies.length > 0) {
                            dispatch(
                                getCustomerAssets(
                                  selectedCategory == '' ? '' : selectedCategory,
                                  companies,
                                  tabs,
                                  customers,
                                  assignments,
                                  false,
                                ),
                            );
                        }
                    }
                }                
            }

            if( list.length > 0 ) {
                setFilterList(list)
                const form = new FormData()
                form.append("list", JSON.stringify(list))
                const {data} = await PatenTrackApi.getCPC(form) 
                setIsLoadingCharts(false)
                setGraphRawData(data.list)
                setGraphRawGroupData(data.group)
                const scopeGroup = []
                const promise = data.group.map( group => {
                    scopeGroup.push({
                        value: group.id,
                        label: group.cpc_code,
                    })
                })
                setScopeRange(scopeGroup)
                setValue([data.group[0].id, data.group[data.group.length - 1].id])
                await Promise.all(promise)
            } 
        }
        getChartData()
        //console.log( "getChartData", selectedCategory, selectedCompanies, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments )
    }, [selectedCategory, selectedCategory, selectedCompanies, assetsList, maintainenceAssetsList, selectedMaintainencePatents, assetsSelected, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, selectedCompaniesAll, assetTypesSelectAll, selectedAssetCompaniesAll, selectedAssetAssignmentsAll ]) 

    const generateChart = async () => {
        if (isLoadingCharts || graphRawData.length == 0 || graphRawGroupData.length == 0) return null
        console.log("graphRawData", graphRawData.length, graphContainerRef, graphContainerRef.current)
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
                        stroke: '#50719C',
                        fill: '#395270'
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
           options = {...options, height: `${graphContainerRef.current.parentNode.parentNode.clientHeight - 50 }px`, axisFontSize: visualizerBarSize == '30%' ? 18 : 18, yStep:  visualizerBarSize == '30%' ? 8 : 1 }
           console.log("options", options)
        }     

        graphRef.current = new Graph3d(graphContainerRef.current, items.current, options)
        graphRef.current.on('click', graphClickHandler)      
    }

    useEffect(() => { 
        generateChart()
    }, [ isLoadingCharts, graphRawData, graphRawGroupData, graphContainerRef, defaultSize ])


    useEffect(() => {
        if( !isLoadingCharts && graphRawData.length > 0 && graphRawGroupData.length > 0 && graphContainerRef.current != null ) {
            if( graphContainerRef.current.childNodes.length == 0 ) { // if comes from different tab
                generateChart()
            }
        }
    })

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
            options = { ...options, height: `${graphContainerRef.current.parentNode.parentNode.clientHeight - 50 }px`, axisFontSize: fontSize, yStep: step, verticalRatio }
            graphRef.current.setOptions(options)
            graphRef.current.redraw()
        }
    }, [ visualizerBarSize, analyticsBar, defaultSize ]) 


    useEffect(() => {
        if(assetIllustration != null && Object.keys(assetIllustration).length > 0) {
            if((selectedAssetAssignments.length == 1 && selectedCategory == 'correct_details') || selectedRow.length == 1) {
                setAssets(assetIllustration)
                if(assetIllustrationData != null ) {                    
                    dispatch(
                        setPDFFile(
                          { 
                            document: assetIllustrationData.line[0].document1, 
                            form: assetIllustrationData.line[0].document1_form, 
                            agreement: assetIllustrationData.line[0].document1_agreement 
                          }
                        )
                    )
                    dispatch(
                        setPdfTabIndex(0)
                    )
                } else {
                    (async() => {
                        const { data } = await PatenTrackApi.getCollectionIllustration(assetIllustration.id)
                        dispatch(
                            setAssetsIllustrationData(data != '' ? data : null)
                        )
                    })();
                }
                
            }
        }
    }, [ assetIllustration, assetIllustrationData, selectedAssetAssignments, selectedRow, selectedCategory ])



    const remoteAssetFromList = useCallback(async (asset) => {
        const list = maintainenceAssetsList.length > 0 ? [...maintainenceAssetsList] : [...assetsList]

        if( list.length > 0 ) {
            const findIndex = list.findIndex( row => row.asset == asset)
            if(findIndex !== -1) {
                list.splice(findIndex, 1)
                if( maintainenceAssetsList.length > 0 ) {
                    dispatch(setMaintainenceAssetsList({list, total_records: list.length }, { append: false }))
                } else {
                    dispatch( setAssetTypeAssignmentAllAssets({list, total_records: list.length }, false) )
                }
            }
        }

    },[ dispatch, assetsList, maintainenceAssetsList ])

    const handleClose = () => {
        setModalOpen(false);
    }

    const PaperComponent = (props) => {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper square={true} {...props} />
            </Draggable>
        );
    }

    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)

    const depthRangeText = (value)=> {
        const findIndex = depthRange.findIndex( range => range.value === value)
        if(findIndex !== -1) {
            return depthRange[findIndex].label;
        } else {
            return ''
        }        
    }

    const scopeRangeText = (value) => {
        const findIndex = scopeRange.findIndex( range => range.value === value)
        if(findIndex !== -1) {
            return scopeRange[findIndex].label;
        } else {
            return ''
        }
        
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    /* if (assetsList.length === 0 || maintainenceAssetsList.length === 0 ) return null */

    return (
        <Paper className={classes.root} square>  
            <div className={classes.graphContainer}>
                
                {
                    selectedTab === 0
                    ?
                        !isLoadingCharts
                        ?
                            <>
                                <div className={classes.sliderContainer}>
                                    <Typography gutterBottom>Scope:</Typography>
                                    <Slider
                                        value={value}
                                        onChange={handleChange}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="range-slider"
                                        getAriaValueText={scopeRangeText}
                                        marks={scopeRange}
                                        step={30}
                                    />
                                    <Typography gutterBottom>Depth:</Typography>
                                    <Slider
                                        defaultValue={3}
                                        getAriaValueText={depthRangeText}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        marks={depthRange}
                                        max={5}
                                        min={1}
                                        step={1}  
                                    />
                                </div>
                                <div
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    filter: `blur(${isLoadingCharts ? '4px' : 0})`,
                                    }}
                                    ref={graphContainerRef}
                                    className={classes.timeline}
                                />
                            </>
                        :
                            <Loader />
                    :
                    selectedTab === 1
                    ?
                        <PdfViewer display={true} pdfTab={0} show_tab={false}/>         
                    :
                    selectedTab === 2
                    ?
                        <PdfViewer display={true} pdfTab={1} show_tab={false}/>        
                    :
                    selectedTab === 3
                    ?
                        <PdfViewer display={true} pdfTab={2} show_tab={false}/>
                    :
                    ''
                }                           
            </div> 
            <Tabs
                value={selectedTab}
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleChangeTab}
                className={classes.tabs}
            >
                {
                    [ 'Innovation', 'Agreement', 'Form', 'Main' ].map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            classes={{ root: classes.tab }}
                        />
                    )) 
                }
            </Tabs> 
            <Dialog
                open={openModal}
                onClose={handleClose}
                className={classes.modal}
                PaperComponent={PaperComponent}
                aria-labelledby="year-cpc-assets"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title"></DialogTitle>
                <DialogContent>
                    <AssetsList loading={assetLoading} assets={assets} remoteAssetFromList={remoteAssetFromList}/>
                </DialogContent>
            </Dialog>            
        </Paper>
    )
}




export default InventionVisualizer