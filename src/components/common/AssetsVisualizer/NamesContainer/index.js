import React, {useCallback, useEffect, useState} from 'react'
import { Chart, registerables } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import ReactWordcloud from 'react-wordcloud';
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
    const [ rawData, setRawData ] = useState([])
    const [ width, setWidth ] = useState(0)
    const [ height, setHeight ] = useState(0)
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
     
    useEffect(() => {
        const getIncorrectNamesData = async () => {
            setNamesData([])
            setRawData([])
            const companies = selectedCompaniesAll === true ? [] : selectedCompanies;
            if(selectedCompaniesAll === true || selectedCompanies.length > 0) { 
                const {data} = await PatenTrackApi.getIncorrectNames(companies);
                if(data.length > 0) {
                    setOptions({...options, fontSizes: [30, 90]})
                    setRawData(data)
                    const words = []
                    const promise = data.map(item => {
                        words.push({
                            text: item.name,
                            value: 40 + (item.distance * 2)
                        })
                    })
                    await Promise.all(promise)
                    console.log('words', words)
                    setNamesData(words) 

                }
            }
        }
        getIncorrectNamesData()
    }, [selectedCompanies, selectedCompaniesAll] )

    useEffect(() => {
        const element = document.getElementById('cntNames')

        if(element !== null) {
            const {width, height} = element.getBoundingClientRect();
            setSize([parseInt(width), parseInt(height)])
            setWidth(parseInt(width))
            setHeight(parseInt(height))
        }
    }, [props])

    useEffect(() => {
        if(namesData.length > 0) {
            DrawCloudChart()
        }
    }, [namesData]) 

    useEffect(() => {
        if(width > 0 && height > 0) {
            if(namesData.length > 0) { 
                if(width > 320 && width < 420) {
                    setOptions({...options, fontSizes: [20, 60]})
                } else if(width < 320) {
                    setOptions({...options, fontSizes: [10, 45]})
                }
                DrawCloudChart()
            }
        }
    }, [width, height]) 

    useEffect(() => {
        if(width > 0 && height > 0) {
            if(namesData.length > 0) {   
                DrawCloudChart()
            }
        }
    }, [options]) 

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
            <TitleBar 
                title={`Select one of the incorrect names below to see the list of assets that were assigned under it. Select an asset from the list to see the details of the incorrect assignment.`} 
                enablePadding={true} 
                underline={false}
                typography={true} 
            />  
             
            {
                selectedTab === 0 && namesData.length > 0 && (
                    <div style={{height: '78%', width: '100%', position: 'absolute', top: 100}} id='cntNames'>
                        <DrawCloudChart />
                    </div>
                )
            }
        </Paper> 
    )
}


export default NamesContainer;