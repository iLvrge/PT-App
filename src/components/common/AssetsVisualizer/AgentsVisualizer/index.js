import React, { useEffect, useState, useRef } from 'react'
import { Paper } from '@mui/material';
 
import useStyles from "./styles";
import { useDispatch, useSelector } from 'react-redux';

import FullScreen from '../../FullScreen'
import Loader from '../../Loader'
import { Chart } from "react-google-charts";

import PatenTrackApi from '../../../../api/patenTrack2'
import {
    getCustomerAssets,
} from '../../../../actions/patentTrackActions2'
import themeMode from '../../../../themes/themeMode';

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

    const menuItems = [
        {
            id: 1,
            label: `Agent (${props.type == 1 ? 'filling' : 'transactions'})`,
            component: AgentsVisualizer,
            standalone: true,
            type: props.type
        }
    ]
    const [height, setHeight] = useState('100%');
    const [minMax, setMinMax] = useState([0,0])
    const [option, setOption] = useState({
        legend: { 
            position: 'right',
            textStyle: {
                color: '#fff'
            }
        },
        backgroundColor: 'transparent',
        chartArea: {
            width: '67%',
            height: '75%',
            left:40,
            top:15,
        },
        colorAxis: {colors: ['#FFAA00', '#70A800', '#1565C0']},
        hAxis: {
            baselineColor: isDarkTheme ? themeMode.dark.palette.divider : themeMode.light.palette.divider,
            format: '0',
            textStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 12,
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 12,
                fontFamily: 'Roboto'
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
                fontFamily: 'Roboto'
            },
            titleTextStyle: {
                color: isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary,
                fontSize: 12,
                fontFamily: 'Roboto'
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
                setData([])
                setRawData([])
                callChartData([], 0)
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
        if(containerRef.current != null) {            
            DisplayChart()
        }
        return () => {

        }
    }, [height, containerRef])

    const callChartData = async(list, totalRecords) => {
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
        form.append('other_mode', display_sales_assets) 
        form.append('type', selectedCategory)
        form.append('data_type', props.type)
        const { data } = await PatenTrackApi.getAgentsData(form)
        setLoading(false)
        setRawData(data)
        if( assetsList.length > 0 || assetsSelected.length > 0 || maintainenceAssetsList.length > 0 ||  selectedMaintainencePatents.length == 0  ) {
            const chartData = [], years = [], agentsNames = []
            if(data !== null && data.length > 0) {
                const promise = data.map( row => {
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
                    yearsData.push(year)
                    const promiseNames = agentsNames.map( name => {
                        const findIndex = data.findIndex( item => item.year == year && name == item.name)
                        let nameNumber = 0
                        if(findIndex !== -1) {
                            nameNumber = data[findIndex].counter
                        }
                        yearsData.push(nameNumber)
                    })
                    await Promise.all(promiseNames)
                    chartData.push(yearsData)
                })
                await Promise.all(promiseYear)
                console.log('years', years, agentsNames, chartData)
                setData(chartData)
            }
        } 
    }

    const DisplayChart = () => {
        if(loading) return <Loader/>
        if(data.length == 0) return null
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType="LineChart"
                loader={<div>Loading...</div>}
                data={data}
                options={option}
            />
        )
    }
 
    return (
        <Paper className={classes.root} square> 
            {
                typeof standalone === 'undefined' && (
                    <div className={classes.fullScreenContainer}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } 
            <div className={classes.graphContainer} ref={containerRef}> 
                <DisplayChart />
            </div>
        </Paper>
    )

}



export default AgentsVisualizer;