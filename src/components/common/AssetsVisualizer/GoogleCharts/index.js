import useMaintenanceEventsList from '../../../../queries/useMaintenanceEventsList'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
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
    const search_string = useSelector(state => state.patenTrack2.search_string)
    const search_rf_id = useSelector(state => state.patenTrack2.search_rf_id)

    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
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
    

    // The effect this replaces also derived tabs, customers and rfIDs from four
    // further selectors and passed none of them; the endpoint takes only the
    // company list.
    const { data = [] } = useMaintenanceEventsList({ selectedCompanies, selectedCompaniesAll })
    
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
        <Paper className={"relative flex h-full w-full flex-col [&_.MuiTabs-root]:!border-b [&_.MuiTabs-root]:!border-divider [&_.MuiTab-root]:min-w-[inherit] [&_.MuiTab-root]:max-w-[150px] [&_.MuiTab-wrapper]:whitespace-nowrap [&_.vis-timeline]:border-0 [&_.vis-time-axis_.vis-text]:text-text-primary [&_.vis-item]:text-text-primary [&_.vis-y-axis]:text-text-primary [&.vis-panel.vis-center]:border [&.vis-panel.vis-center]:border-divider [&_.vis-panel.vis-center]:border-divider [&_.vis-panel.vis-left]:border-divider [&_.vis-panel.vis-right]:border-divider [&_.vis-panel.vis-top]:border-divider [&_.vis-panel.vis-bottom]:border-divider [&_.vis-panel.vis-background.vis-horizontal_.vis-grid]:border-[#e5e5e51c]"} square>  
            <Tabs
                value={selectedTab}
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleChangeTab}
                className={"min-h-[47px]"}
            >
                {
                    chartTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            classes={{ root: "min-h-[47px] min-w-[25%] flex-1 text-[1.1rem]" }}
                        />
                    )) 
                }
            </Tabs> 
            {
                typeof standalone === 'undefined' && (
                    <div className={"absolute right-2.5 top-2.5 z-[999] cursor-pointer"}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } 
            {
                selectedTab === 0
                ?
                    <div className={"flex flex-1 items-center justify-center text-base"} ref={containerRef}>  
                        {DisplayChart()}
                    </div> 
                :
                    ''
            }
        </Paper>  
    )
}

export default GoogleCharts