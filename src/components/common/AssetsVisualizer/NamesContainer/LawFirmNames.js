import React, {useEffect, useState} from 'react'
import { Chart, registerables } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import ReactWordcloud from 'react-wordcloud'; 
import { useDispatch, useSelector } from 'react-redux'
import PatenTrackApi from '../../../../api/patenTrack2';
import useStyles from './styles';
import { Paper, Tab, Tabs, Typography } from '@mui/material';
import { numberWithCommas } from '../../../../utils/numbers';
import { setAllAssignmentCustomers, setAssetTypeAssignmentAllAssets, setSelectAssignmentCustomers } from '../../../../actions/patentTrackActions2';
import TitleBar from '../../TitleBar';
import AgentsVisualizer from '../AgentsVisualizer';


const LawFirmNames = (props) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const [ tabs, setTabs ] = useState(['Names', 'Agent (transactions)'])
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ rawData, setRawData ] = useState([])
    const [ namesData, setNamesData ] = useState([])
    const [size, setSize] = useState([550, 400])
    const [options, setOptions] = useState({
        rotations: 1,
        enableTooltip: true,
        rotationAngles: [0], 
        fontStyle: "normal",
        fontWeight: "900",
    })

    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected );
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll);
    const selectedLawFirm = useSelector( state => state.patenTrack2.selectedLawFirm);
    
    const randomNumbers = () => {
        const min = 25, max = 50;
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    useEffect(() => {
        const getLawFirmNamesData = async () => {
            setNamesData([])
            const companies = selectedCompaniesAll === true ? [] : selectedCompanies;
            if(selectedCompaniesAll === true || selectedCompanies.length > 0) {
                const {data} = await PatenTrackApi.getLawFirmsByCompany(companies, selectedLawFirm)
                if(data.length > 0) {
                    setRawData(data)
                    let PIXEL = 20;
                    /* const labels = [], values = [];
                    let PIXEL = 50;
                    const container = document.getElementById('analyticsBar')
                    if(container.childElementCount > 0 ) {
                        PIXEL = 10
                    }
                    
                    const promise = data.map( item => {
                        labels.push(item.lawfirm)
                        values.push( typeof item.distance != 'undefined' ? PIXEL + item.distance * 3 : randomNumbers() )
                    })
                    
                    await Promise.all(promise) */

                    const words = []
                    const promise = data.map(item => {
                        words.push({
                            text: item.lawfirm,
                            value: randomNumbers()
                        })
                    })
                    await Promise.all(promise)
                    setNamesData(words)
                    /* const ctx = document.getElementById('canvas')
           
                    Chart.register(...registerables, WordCloudController, WordElement);
                    new Chart(ctx, {
                        type: WordCloudController.id,
                        data: {
                            labels,
                            datasets: [
                                {
                                    label: '',
                                    data: [...values],
                                    color: ["#E60000","#228DE8","#FFAA00","#70A800","#C0C000”,”#FFFFFF","#CA7C46"], 
                                }
                            ]
                        },
                        options: {
                            chartArea: {
                                width: '95%',
                                height: '80%',
                                left: 30,
                                top: 20,
                            },
                            legend : {
                                display : false
                            },
                            title : {
                                display : false
                            },
                            padding: 10,
                            minRotation: 90,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                chartArea: {
                                    width: '95%',
                                    height: '50%',
                                    left: 30,
                                    top: 20,
                                },
                                tooltip: { 
                                    textStyle: { 
                                        fontName: 'Roboto', 
                                        fontSize: 12 
                                    },
                                    callbacks: {
                                        title: tooltipItems => {
                                            return tooltipItems[0].label
                                        },
                                        label: (tooltipItems) => { 
                                            return ''
                                        } 
                                    }
                                },
                            },
                        }
                    }); */
                }
            }
        }
        getLawFirmNamesData()
    }, [selectedCompanies, selectedCompaniesAll, selectedLawFirm] )

    useEffect(() => {
        if(namesData.length > 0) {
            DrawCloudChart()
        }
    }, [namesData]) 

    const DrawCloudChart =  () => {  
        console.log(namesData)
        return (
            <ReactWordcloud 
                words={namesData} 
            />
        )
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
            {
                selectedTab === 0 && namesData.length > 0 && ( 
                    <div style={{height: '78%', width: '100%', position: 'absolute', top: 100}} id='cntNames'>
                        <DrawCloudChart />
                    </div>
                )
            }
            { 
                selectedTab === 1 && (
                    <AgentsVisualizer type={2}/>
                )
            }
        </Paper> 
    )
}


export default LawFirmNames;