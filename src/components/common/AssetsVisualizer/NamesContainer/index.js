import React, {useEffect, useState} from 'react'
import { Chart, registerables } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

import { useDispatch, useSelector } from 'react-redux'
import PatenTrackApi from '../../../../api/patenTrack2';
import useStyles from './styles';
import { Paper, Tab, Tabs, Typography } from '@mui/material';
import { numberWithCommas } from '../../../../utils/numbers';
import { setAllAssignmentCustomers, setAssetTypeAssignmentAllAssets, setGridWidthClassNUmber, setSelectAssignmentCustomers } from '../../../../actions/patentTrackActions2';
import TitleBar from '../../TitleBar';


const NamesContainer = (props) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const [ tabs, setTabs ] = useState(['Incorrect Names'])
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ namesData, setNamesData ] = useState([])
    const [ width, setWidth ] = useState(0)
    const [ height, setHeight ] = useState(0)

    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected );
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll);
    
    useEffect(() => {
        const getIncorrectNamesData = async () => {
            setNamesData([])
            const companies = selectedCompaniesAll === true ? [] : selectedCompanies;
            if(selectedCompaniesAll === true || selectedCompanies.length > 0) {
                const {data} = await PatenTrackApi.getIncorrectNames(companies);
                if(data.length > 0) {
                    setNamesData(data) 
                }
            }
        }
        getIncorrectNamesData()
    }, [selectedCompanies, selectedCompaniesAll] )

    useEffect(() => {
        if(namesData.length > 0) {
            drawCloudChart()
        }
    }, [namesData])

    useEffect(() => {
        const element = document.getElementById('cntNames')

        if(element !== null) {
            const {width, height} = element.getBoundingClientRect();
            setWidth(parseInt(width))
            setHeight(parseInt(height))
        }
    }, [props])

    useEffect(() => {
        if(width > 0 && height > 0) {
            if(namesData.length > 0) {
                drawCloudChart()
            }
        }
    }, [width, height])

    const drawCloudChart = async() => { 
        const CONSTANT_VALUE = 1.2
        const labels = [], fontSizes = [];
        /**
         * All Characters
         * 
         */
        let allCharters = ''
        const promise1 = namesData.map( item => {
            allCharters += item.name
        })
        await Promise.all(promise1) 
        /**
         * FontSize Calculation
         */
        const promise = namesData.map( item => { 
            labels.push(item.name)
            fontSizes.push( parseInt(item.distance  * (CONSTANT_VALUE * (width / allCharters.length ))))  
        }) 
        await Promise.all(promise)
        
        /**
         * Display Chart
         */
        /**
         * Destroy canvas
         */
        let chartStatus = Chart.getChart("canvas"); 
        if (chartStatus != undefined) {
          chartStatus.destroy();
        }
        const ctx = document.getElementById('canvas')
        Chart.register(...registerables, WordCloudController, WordElement);
        new Chart(ctx, {
            type: WordCloudController.id,
            data: {
                labels,
                datasets: [
                    {
                        label: '',
                        data: [...fontSizes],
                        color: ["#E60000","#228DE8","#FFAA00","#70A800","#C0C000”,”#FFFFFF","#CA7C46"], 
                    }
                ]
            },
            options: {
                chartArea: {
                    /* width: '95%',
                    height: '80%', */
                    left: 0,
                    top: 0,
                },
                legend : {
                    display : false
                },
                title : {
                    display : false
                },
                padding: 10,
                minRotation: 0,
                plugins: {
                    legend: {
                        display: false,
                    },
                    chartArea: {
                        width: '95%',
                        height: '100%',
                        left: 0,
                        top: 0,
                    },
                    tooltip: { textStyle: { fontName: 'Roboto', fontSize: 12 } },
                    tooltip: {
                        callbacks: {
                            title: tooltipItems => {
                                const findData = namesData[tooltipItems[0].dataIndex].count_assets
                                return `Number of assets assigned under this incorrect name: ${numberWithCommas(findData)}`
                            } ,
                            label: (tooltipItems) => { 
                                return ''
                            } 
                        }
                    }
                },
                onClick: (event, item) => {
                    const partyID = namesData[item[0].index].id
                    dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }));
                    dispatch(setAllAssignmentCustomers(false))
                    dispatch(setSelectAssignmentCustomers([partyID]))
                }
            }
        });
    }

    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)
  
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
                    tabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            classes={{ root: classes.tab }}
                        />
                    )) 
                }
            </Tabs> 
            <TitleBar title={`Select one of the  incorrect names below to see the list of assets that were assigned under it.Select an asset from the list to see the details of the incorrect assignment.`} enablePadding={true} underline={false}/>  
             
            {
                selectedTab === 0 && namesData.length > 0 && (
                    <div style={{height: '85%', width: '95%'}} id='cntNames'>
                        <canvas id="canvas" style={{height: '100%', width: '100%'}}></canvas>
                    </div>
                )
            }
        </Paper> 
    )
}


export default NamesContainer;