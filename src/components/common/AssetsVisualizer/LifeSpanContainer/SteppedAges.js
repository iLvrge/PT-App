import React, { useState } from 'react' 
import { useSelector } from 'react-redux';
import { Chart } from "react-google-charts";  
import Loader from '../../Loader';
import themeMode from '../../../../themes/themeMode';
import './styles.css'
import { pink } from '@mui/material/colors'
import useAbandonedAges from '../../../../queries/useAbandonedAges';


const SteppedAges = () => {
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const [option, setOption] = useState({
        legend: { position: 'none' },
        bar: { groupWidth: '100%' },
        isStacked: false,
        backgroundColor: 'transparent',
        hAxis: {
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
        annotations: {
            style: 'line',
            stem: {
                color: isDarkTheme ? themeMode.dark.palette.secondary.main : themeMode.light.palette.secondary.main,
                length: 50
            }
        },
        chartArea: {
            width: '83%',
            height: '83%',
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
    // Was a Redux request-flag pattern; both keys were read only here. The
    // effect also listed only [selectedCompanies] while reading seven other
    // values, so filter changes never refetched.
    const { data: abandonedMaintainenceData = [], isFetching } = useAbandonedAges({
        selectedCompanies,
        assetTypesSelectAll,
        assetTypesSelected,
        assetTypesCompaniesSelectAll,
        assetTypesCompaniesSelected,
        selectedAssetAssignmentsAll,
        selectedAssetAssignments,
        displaySalesAssets: display_sales_assets,
        selectedCategory,
    })

    // `loading` was local state whose setter was never called, so this loader
    // could never appear. isFetching actually reflects the request.
    if (isFetching) return <Loader/>
    if (abandonedMaintainenceData.length < 2) return null
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



export default SteppedAges;