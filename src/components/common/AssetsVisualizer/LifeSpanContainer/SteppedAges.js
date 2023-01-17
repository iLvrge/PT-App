import React, { useEffect, useState } from 'react' 
import { Chart } from "react-google-charts"; 
import { useSelector } from 'react-redux';
import PatenTrackApi from '../../../../api/patenTrack2';
import Loader from '../../Loader';
import useStyles from './styles' 


const SteppedAges = () => {
    const classes = useStyles() 
    const [loading, setLoading] = useState(false)
    const [option, setOption] = useState({
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        chartArea: {
            width: '83%',
            height: '92%',
            left:40,
            top:15,
        },
        isStacked: true,
        colorAxis: {colors: ['#FFAA00', '#70A800', '#1565C0']}
    });

    const [height, setHeight] = useState('100%');

    const [data, setData] = useState([
        ['Director (Year)',  'Rotten Tomatoes', 'IMDB'],
        ['Alfred Hitchcock (1935)', 8.4,         7.9],
        ['Ralph Thomas (1959)',     6.9,         6.5],
        ['Don Sharp (1978)',        6.5,         6.4],
        ['James Hawes (2008)',      4.4,         6.2]
    ])
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const assetTypesCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesCompaniesSelectAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll);
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )  
    const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)

    useEffect(() => {
        const getAbandonedData = async() => { 
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
            console.log("data", data)
        }   
        getAbandonedData()
    }, [])

    const DisplayChart = () => {
        if(loading) return <Loader/>
        if(data.length < 2) return null
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType="Histogram"
                loader={<div>Loading...</div>}
                data={data}
                options={option}
            />
        )
    }
    return (
        <DisplayChart/>
    )
}



export default SteppedAges;