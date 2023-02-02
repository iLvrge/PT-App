import React, { useEffect, useState, useRef } from 'react'
import { Paper } from '@mui/material';
 
import useStyles from "./styles";
import { useDispatch, useSelector } from 'react-redux'; 
import Loader from '../../Loader'
import { Chart } from "react-google-charts";

import PatenTrackApi from '../../../../api/patenTrack2' 
import themeMode from '../../../../themes/themeMode';
import { setLineChartData, setLineChartRequest } from '../../../../actions/patentTrackActions2';

const AgentsVisualizer = (props) => { 
    const containerRef = useRef(null)
    const dispatch = useDispatch()
    const classes = useStyles()
    const [data, setData] = useState([]) 
    const [rawData, setRawData] = useState([]) 
    const [loading, setLoading] = useState(false)
    const [assetRequest, setAssetRequest] = useState(false)
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const assetTypesCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesCompaniesSelectAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll);
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const search_string = useSelector(state => state.patenTrack2.search_string)
    const search_rf_id = useSelector(state => state.patenTrack2.search_rf_id)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

    
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const assetsTotal = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.total_records) //Assets records
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const maintainenceAssetsTotal = useSelector(state => state.patenTrack2.maintainenceAssetsList.total_records) //Assets records
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected   
    const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)
    const line_chart_data = useSelector(state => state.patenTrack2.line_chart_data)
    const selectedLawFirm = useSelector(state => state.patenTrack2.selectedLawFirm)

    const menuItems = [
        {
            id: 1,
            label: `Agent (${props.type == 1 ? 'filling' : 'transactions'})`,
            component: AgentsVisualizer,
            standalone: true,
            type: props.type
        }
    ]
    const [height, setHeight] = useState('98%');
    const [minMax, setMinMax] = useState([0,0])
    const [option, setOption] = useState({
        legend: { 
            position: 'right',
            textStyle: {
                color: '#fff',
                fontSize: '0.875rem',
                fontName: 'Roboto'
            }
        },
        animation:{
            duration: 1000,
            easing: 'out',
        },
        backgroundColor: 'transparent',
        chartArea: {
            width: '67%',
            height: '89%',
            left: 40,
            top: 10,
        },
        colorAxis: {colors: ['#FFAA00', '#70A800', '#1565C0']},
        hAxis: {
            baselineColor: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider,
            format: '0',
            textStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: '0.875rem',
                fontName: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: '0.875rem',
                fontName: 'Roboto'
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
                fontName: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 12,
                fontName: 'Roboto'
            },
            gridlines: {
                /* color: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider, */
                color: '#292a2b',
            },
            minorGridlines:{
                color:'transparent' 
            },
        },
        pointsVisible: true	
    });

    useEffect(() => {
        let isSubscribed = true;
        const getAssetsForEachCountry = async() => {
            try {
                if(line_chart_data[props.type].loading === false) { 
                    if(selectedCompanies.length > 0 || (process.env.REACT_APP_ENVIROMENT_MODE != 'PRO' && assetsList.length > 0)) { 
                        callChartData(assetsList, 0)
                    }
                } 
            } catch(err) {
                console.log(err)
            }            
        }
        if(isSubscribed) {
            getAssetsForEachCountry()
        }
        return () => (isSubscribed = false)
    }, [selectedCompanies, selectedCompaniesAll, selectedAssetsPatents, assetTypesSelectAll, assetTypesSelected, assetTypesCompaniesSelectAll, assetTypesCompaniesSelected, selectedAssetAssignmentsAll, selectedAssetAssignments, display_sales_assets, search_string, auth_token, props.type])

    useEffect(() => {
        if(props.analyticsBar === false) {
            setHeight('100%')
            setOption({...option, chartArea: {...option.chartArea, height: '93%'}})
        } else {
            setHeight('98%')
            setOption({...option, chartArea: {...option.chartArea, height: '89%'}})
        }
    }, [props])


    useEffect(() => {
        if(containerRef.current != null) {            
            DisplayChart()
        }
        return () => {

        }
    }, [height, containerRef])

    useEffect(() => {
        if(line_chart_data[props.type].data.length > 0) {
            const buiildChartData = async() => { 
                const chartData = [], years = [], agentsNames = []
                const rawData = line_chart_data[props.type].data
                if(rawData !== null && rawData.length > 0) {
                    const promise = rawData.map( row => {
                        if(!years.includes(row.year)) {
                            years.push(row.year)
                        }
                        if(!agentsNames.includes(row.name)) {
                            agentsNames.push(row.name)
                        }
                    })
                    await Promise.all(promise)
                    years.sort()
                    agentsNames.sort()
                    chartData.push(['Year', ...agentsNames])  
                    const promiseYear = years.map(async year => {
                        const yearsData = [];
                        yearsData.push(parseInt(year))
                        const promiseNames = agentsNames.map( name => {
                            const findIndex = rawData.findIndex( item => item.year == year && name == item.name)
                            let nameNumber = 0
                            if(findIndex !== -1) {
                                nameNumber = rawData[findIndex].counter
                            }
                            yearsData.push(parseInt(nameNumber))
                        })
                        await Promise.all(promiseNames)
                        chartData.push(yearsData)
                    })
                    await Promise.all(promiseYear) 
                    setData(chartData)
                }
            }
            buiildChartData()
        }
    }, [line_chart_data])

    const callChartData = async(list, totalRecords) => {
        if(line_chart_data[props.type].loading === false) {
            dispatch(setLineChartRequest(props.type, true))
            setAssetRequest(false)
            setLoading(true)
            setData([])
            setRawData([]) 
            const form = new FormData()
            form.append("list", JSON.stringify(list))
            form.append("total", totalRecords)
            form.append('selectedCompanies', JSON.stringify(selectedCompanies))
            form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
            form.append('customers', JSON.stringify(assetTypesCompaniesSelectAll === true ? [] : assetTypesCompaniesSelected))
            form.append('assignments', JSON.stringify(selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments))
            form.append('lawfirm', selectedLawFirm)
            form.append('other_mode', display_sales_assets) 
            form.append('type', selectedCategory)
            form.append('data_type', props.type)
            /* PatenTrackApi.cancelAgentsDataRequest() */
            const { data } = await PatenTrackApi.getAgentsData(form)
            setLoading(false)
            setRawData(data)
            dispatch(setLineChartData(props.type,  data))
        }
        
        if( assetsList.length > 0 || assetsSelected.length > 0 || maintainenceAssetsList.length > 0 ||  selectedMaintainencePatents.length == 0  ) {
            
        } 
    }

    const DisplayChart = () => {
        if(loading) return <Loader/>
        if(data.length == 0) return null
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType='LineChart'
                loader={<div>Loading...</div>}
                data={data}
                options={option}
                /* chartPackages={['corechart', 'controls']}
                controls={[
                    {
                        controlType: 'ChartRangeFilter',
                        controlPosition: 'bottom',
                        options: {
                            filterColumnIndex: 0,
                            ui: {
                                chartType: null,
                                chartOptions: {
                                    chartArea: { 
                                        left: 50,
                                        width: '70%', 
                                        height: '20%' , 
                                    },
                                    backgroundColor: { fill:'transparent' },  
                                    series: {
                                        0: { color: 'transparent' },
                                    },
                                    hAxis: { 
                                        baselineColor: 'none' ,
                                        gridlines: {
                                            color: 'transparent'
                                        },
                                        textStyle: { color: '#fff' } ,
                                    },
                                    vAxis: {
                                        textPosition: 'none',
                                        gridlines: {
                                            color: 'transparent' 
                                        },
                                        textStyle: { color: '#fff' } ,
                                    }
                                },
                            },
                        }, 
                    }
                ]} */
            />
        )
    }
 
    return (
        <Paper className={classes.root} square> 
            {/* {
                typeof standalone === 'undefined' && (
                    <div className={classes.fullScreenContainer}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } 
   */}          <div className={classes.graphContainer} ref={containerRef}> 
                <DisplayChart />
            </div>
        </Paper>
    )

}



export default AgentsVisualizer;