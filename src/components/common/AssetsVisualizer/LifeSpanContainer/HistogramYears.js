import React, { useEffect, useState } from 'react'

import { Chart } from "react-google-charts"; 
import { useSelector } from 'react-redux';
import PatenTrackApi from '../../../../api/patenTrack2';
import Loader from '../../Loader';
import useStyles from './styles' 

const HistogramYears = () => {
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
        colorAxis: {colors: ['#FFAA00', '#70A800', '#1565C0']}
    })
    const [height, setHeight] = useState('100%')
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const assetTypesCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesCompaniesSelectAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll);
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )  
    const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)

    const [data, setData] = useState([['Dinosaur', 'Length'],
    ['Acrocanthosaurus (top-spined lizard)', 12.2],
    ['Albertosaurus (Alberta lizard)', 9.1],
    ['Allosaurus (other lizard)', 12.2],
    ['Apatosaurus (deceptive lizard)', 22.9],
    ['Archaeopteryx (ancient wing)', 0.9],
    ['Argentinosaurus (Argentina lizard)', 36.6],
    ['Baryonyx (heavy claws)', 9.1],
    ['Brachiosaurus (arm lizard)', 30.5],
    ['Ceratosaurus (horned lizard)', 6.1],
    ['Coelophysis (hollow form)', 2.7],
    ['Compsognathus (elegant jaw)', 0.9],
    ['Deinonychus (terrible claw)', 2.7],
    ['Diplodocus (double beam)', 27.1],
    ['Dromicelomimus (emu mimic)', 3.4],
    ['Gallimimus (fowl mimic)', 5.5],
    ['Mamenchisaurus (Mamenchi lizard)', 21.0],
    ['Megalosaurus (big lizard)', 7.9],
    ['Microvenator (small hunter)', 1.2],
    ['Ornithomimus (bird mimic)', 4.6],
    ['Oviraptor (egg robber)', 1.5],
    ['Plateosaurus (flat lizard)', 7.9],
    ['Sauronithoides (narrow-clawed lizard)', 2.0],
    ['Seismosaurus (tremor lizard)', 45.7],
    ['Spinosaurus (spiny lizard)', 12.2],
    ['Supersaurus (super lizard)', 30.5],
    ['Tyrannosaurus (tyrant lizard)', 15.2],
    ['Ultrasaurus (ultra lizard)', 30.5],
    ['Velociraptor (swift robber)', 1.8]])

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
            const {data} = await PatenTrackApi.getAllAbandonedAssetsYears(form)
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



export default HistogramYears;