import React, { useEffect, useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux';
import { Chart } from "react-google-charts";  
import PatenTrackApi from '../../../../api/patenTrack2';
import Loader from '../../Loader';
import themeMode from '../../../../themes/themeMode';
import useStyles from './styles' 
import { pink } from '@mui/material/colors'
import { setAbandonedMaintainenceData, setAbandonedMaintainenceRequest } from '../../../../actions/patentTrackActions2';


const SteppedAges = () => {
    const classes = useStyles() 
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const [option, setOption] = useState({
        legend: { position: 'none' },
        bar: { groupWidth: '98%' },
        isStacked: false,
        backgroundColor: 'transparent',
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
        annotations: {
            style: 'line',
            stem: {
                color: pink[500],
                length: 50
            }
        },
        chartArea: {
            width: '83%',
            height: '80%',
            left:40,
            top:15,
        }
    });

    const [height, setHeight] = useState('100%');

     
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const assetTypesCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesCompaniesSelectAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll);
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )  
    const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)
    const abandonedMaintainenceRequest = useSelector(state => state.patenTrack2.abandoned_maintainence_request)
    const abandonedMaintainenceData = useSelector(state => state.patenTrack2.abandoned_maintainence_data) 

    useEffect(() => {
        const getAbandonedMaintainenceData = async() => { 
            if(abandonedMaintainenceRequest === false && selectedCompanies.length > 0) { 
                dispatch(setAbandonedMaintainenceRequest(true))
                const form = new FormData()
                form.append("list", [])
                form.append("total", 0)
                form.append('selectedCompanies', JSON.stringify(selectedCompanies))
                form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
                form.append('customers', JSON.stringify(assetTypesCompaniesSelectAll === true ? [] : assetTypesCompaniesSelected))
                form.append('assignments', JSON.stringify(selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments))
                form.append('other_mode', display_sales_assets) 
                form.append('type', selectedCategory)
                const {data} = await PatenTrackApi.getAllAbandonedAssetsAges(form)
                dispatch(setAbandonedMaintainenceData(data))
            } 
        }   
        getAbandonedMaintainenceData()
    }, [selectedCompanies])

    const DisplayChart = () => {
        if(loading) return <Loader/>
        if(abandonedMaintainenceData.length < 2) return null 
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType="ColumnChart"
                loader={<div>Loading...</div>}
                data={abandonedMaintainenceData}
                options={option}
            />
        )
    }
    return (
        <DisplayChart/>
    )
}



export default SteppedAges;