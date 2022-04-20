import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import useStyles from './styles'
import { pink } from '@mui/material/colors'

import FullScreen from '../../FullScreen'
import { Chart } from "react-google-charts";
import themeMode from '../../../../themes/themeMode';
import { Tabs, Tab, Paper } from '@mui/material'
import PatenTrackApi from '../../../../api/patenTrack2'


const GeoChart = ({ chartBar, visualizerBarSize, standalone }) => {
    const containerRef = useRef(null)
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ chartTabs, setChartTabs ] = useState(['Jurisdictions'])
    const [data, setData] = useState([])
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const assetTypesCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesCompaniesSelectAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll);
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const search_string = useSelector(state => state.patenTrack2.search_string)
    const search_rf_id = useSelector(state => state.patenTrack2.search_rf_id)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

    const classes = useStyles() 
    const menuItems = [
        {
            id: 1,
            label: 'Geo Chart Data',
            component: GeoChart,
            standalone: true,
            chartBar, 
            visualizerBarSize
        }
    ]
    const [height, setHeight] = useState('100%');
    const [minMax, setMinMax] = useState([0,0])
    const [option, setOption] = useState({
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        chartArea: {
            width: '83%',
            height: '92%',
            left:40,
            top:15,
        },
        colorAxis: {colors: ['#1565C0']}
    });

    useEffect(() => {
        const getAssetsForEachCountry = async() => {
            try {
                const   companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                customers = assetTypesCompaniesSelectAll === true ? [] :  assetTypesCompaniesSelected,
                rfIDs = selectedAssetAssignments.length > 0 ? selectedAssetAssignments : [];
                const { data } = await PatenTrackApi.getAssetTypeAssignmentAllAssetsWithFamily(companies, tabs, customers, rfIDs)
                setData(data)
            } catch(err) {
                console.log(err)
            }            
        }
        getAssetsForEachCountry()
    }, [selectedCompanies, selectedCompaniesAll, selectedAssetsPatents, selectedAssetAssignments, assetTypesSelectAll, assetTypesSelected, assetTypesCompaniesSelectAll, assetTypesCompaniesSelected, search_string, auth_token])
    
    
    useEffect(() => {    
        if(chartBar === false) {
            setHeight('100%')
            const opt = {...option}
            opt.chartArea.height = '92%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '92%'
            } else {
                opt.chartArea.width = '83%'
            }
            setOption(opt)
        } else {
            setHeight('95%')
            const opt = {...option}
            opt.chartArea.height = '91%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '92%'
            } else {
                opt.chartArea.width = '83%'
            }
            setOption(opt)
        }
        return () => {
            
        }
    }, [chartBar, visualizerBarSize])

    useEffect(() => {
        if(containerRef.current != null) {            
            DisplayChart()
        }
        return () => {

        }
    }, [height, containerRef])


    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)


    const DisplayChart = () => {
        if(data.length === 0) return null
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType="GeoChart"
                loader={<div>Loading...</div>}
                data={data}
                options={option}
            />
        )
    }

    return (
        <Paper className={classes.root} square>  
            <Tabs
                value={selectedTab}
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleChangeTab}
                className={classes.tabs}
            >
                {
                    chartTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            classes={{ root: classes.tab }}
                        />
                    )) 
                }
            </Tabs> 
            {
                typeof standalone === 'undefined' && (
                    <div className={classes.fullScreenContainer}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } 
            {
                selectedTab === 0
                ?
                    <div className={classes.graphContainer} ref={containerRef}>  
                        <DisplayChart />
                    </div> 
                :
                    ''
            }
        </Paper>  
    )
}

export default GeoChart