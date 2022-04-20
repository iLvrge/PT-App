import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import useStyles from './styles'
import { pink } from '@mui/material/colors'

import FullScreen from '../../FullScreen'
import { Chart } from "react-google-charts";
import themeMode from '../../../../themes/themeMode';
import { Tabs, Tab, Paper } from '@mui/material'
import PatenTrackApi from '../../../../api/patenTrack2' 

const GoogleCharts = ({ chartBar, visualizerBarSize, standalone }) => {
    const containerRef = useRef(null)
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ chartTabs, setChartTabs ] = useState(['Maintainence Fees'])
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

    const [data, setData] = useState([])
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const classes = useStyles() 
    const menuItems = [
        {
            id: 1,
            label: 'Area Chart Data',
            component: GoogleCharts,
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
            width: '90%',
            height: '92%',
            left:40,
            top:15,
        },
        vAxis: {minValue: 0},
        colors: ['#1565c0'],
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
                color: 'transparent',   
            },
            minorGridlines:{
                color:'transparent' 
            },
        },
    });
    

    useEffect(() => {
        const getMaintainenceEventsAssets = async() => {
            try {
                const   companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                        tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                        customers = assetTypesCompaniesSelectAll === true ? [] :  assetTypesCompaniesSelected,
                        rfIDs = selectedAssetAssignments.length > 0 ? selectedAssetAssignments : [];
                const { data } = await PatenTrackApi.getMaintainenceAssetsEventsList(companies)
                setData(data)
            } catch (err) {
                console.log(err)
            }
        }
        getMaintainenceEventsAssets()
        
    }, [selectedCompanies, selectedCompaniesAll])   
    
    useEffect(() => {    
        if(chartBar === false) {
            setHeight('100%')
            const opt = {...option}
            opt.chartArea.height = '92%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '90%'
            } else {
                opt.chartArea.width = '90%'
            }
            setOption(opt)
        } else {
            setHeight('95%')
            const opt = {...option}
            opt.chartArea.height = '91%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '90%'
            } else {
                opt.chartArea.width = '90%'
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
            <React.Fragment>
                <Chart
                    width={'100%'}
                    height={height}
                    chartType="AreaChart"
                    loader={<div>Loading...</div>}
                    data={data}
                    options={option}
                    chartEvents={[
                        {
                            eventName: "ready",
                            callback: ({ chartWrapper, google }) => {
                                const chart = chartWrapper.getChart();
                                const container = chart.container
                                const observer = new MutationObserver(function () {
                                    Array.prototype.forEach.call(container.getElementsByTagName('path'), function(path) {
                                        console.log("path.getAttribute('fill')", path.getAttribute('fill'))
                                        if (path.getAttribute('fill') === '#1565c0') {
                                            path.setAttribute('fill', 'url(#gradient-expense) #1565c0');
                                        }
                                    });
                                });
                                observer.observe(container, {
                                    childList: true,
                                    subtree: true
                                }); 
                            }
                        }
                    ]} 
                />
                <svg style={{width:0,height:0,position:'absolute'}} aria-hidden="true" focusable="false">
                    <linearGradient id="gradient-expense" x1="0%" y1="0%" x2="0%" y2="100%" >
                    <stop offset="0%" stop-color="#0355e9" />
                    <stop offset="50%" stop-color="#1D2025" />
                    <stop offset="100%" stop-color="#1D2025" />
                    </linearGradient>
                </svg>  
            </React.Fragment>
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

export default GoogleCharts