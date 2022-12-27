import React, {useEffect, useState, useMemo} from 'react'
import { Chart, registerables } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import ReactWordcloud from 'react-wordcloud'; 
import { useDispatch, useSelector } from 'react-redux'
import PatenTrackApi from '../../../../api/patenTrack2';
import useStyles from './styles';
import { Alert, Paper, Tab, Tabs, Typography } from '@mui/material';
import { wordCloudOptions } from '../../../../utils/options';  
import AgentsVisualizer from '../AgentsVisualizer';
import FullScreen from '../../FullScreen';
import InventionVisualizer from '../InventionVisualizer';
import LabelWithIcon from '../../LabelWithIcon';


const LawFirmNames = (props) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const [showAlert, setShowAlert] = useState(false)
    const [ tabs, setTabs ] = useState(['Names', 'Filling', 'Assignments', 'Innovations'])
    const [ selectedTab, setSelectedTab ] = useState(typeof props.activeTab != 'undefined' ? props.activeTab : 0)
    const [ rawData, setRawData ] = useState([])
    const [ namesData, setNamesData ] = useState([])
    const [ parentContainerSize, setParentContainerSize ] = useState(0)
    const [size, setSize] = useState([550, 400])
    //const [options, setOptions] = useState(wordCloudOptions)

    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected );
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll);
    const selectedLawFirm = useSelector( state => state.patenTrack2.selectedLawFirm);

    const menuItems = [
        {
            id: 1,
            label: 'Lawfirms',
            component: LawFirmNames, 
            activeTab: selectedTab,
            raw: rawData,
            standalone: true
        }
    ]
    
    const randomNumbers = () => {
        const min = 25, max = 50;
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    useEffect(() => {
        const getLawFirmNamesData = async () => {
            setNamesData([])
            if(typeof props.raw != 'undefined' && props.raw.length > 0) {
                setRawData(props.raw)
                formatData(props.raw)
            } else { 
                const companies = selectedCompaniesAll === true ? [] : selectedCompanies;
                if(selectedCompaniesAll === true || selectedCompanies.length > 0) {
                    const {data} = await PatenTrackApi.getLawFirmsByCompany(companies, selectedLawFirm)
                    if(data.length > 0) {
                        setRawData(data)  
                        formatData(data)
                    }
                } 
            }
        }
        getLawFirmNamesData()
    }, [selectedCompanies, selectedCompaniesAll, selectedLawFirm] )

    useEffect(() => {
        setShowAlert(false)
        if(namesData.length > 0) {
            DrawCloudChart()
            setTimeout(checkNamesOnDOM, 3000)
        }
    }, [namesData]) 

    useEffect(() => {
        setParentContainerSize(props.visualizerBarSize)
        if(namesData.length > 0) {
            setShowAlert(false)
            setTimeout(checkNamesOnDOM, 3000)
        }
    }, [props.visualizerBarSize]) 


    

    const checkNamesOnDOM = () => {
        if(selectedTab === 0) {
            const element = document.getElementById('lawfirm_cloud_names') 
            if(element != null) {
                const findSVG = element.querySelector('svg')
                if(findSVG !== null) {
                    const findTextElements = element.querySelectorAll('text') 
                    if(findTextElements.length > 0 && findTextElements.length != namesData.length) {
                        /**
                         * Show noftification
                         */
                        setShowAlert(true)
                    } else if(findTextElements.length == 0 && namesData.length > 0 ) {
                        setTimeout(checkNamesOnDOM, 2000)
                    } else {
                        setShowAlert(false)
                    }
                }
            }
        } 
    }

    const formatData = async(data) => {
        const words = []
        const promise = data.map(item => { 
            words.push({
                text: item.lawfirm,
                value: typeof item.distance != 'undefined' ? item.distance : randomNumbers()
            })
        })
        await Promise.all(promise)
        setNamesData(words)
    }

    const options = useMemo(() => {
        return wordCloudOptions
    })

    const handleChangeTab = (e, newTab) => {
        if(newTab > 0) {
            setShowAlert(false)
        } else if(newTab == 0) {
            checkNamesOnDOM()
        }
        setSelectedTab(newTab)
    }

    const DrawCloudChart =  () => {  
        return (
            <ReactWordcloud 
                words={namesData} 
                options={options}
            />
        )
    } 

    

    const handleClose = () => {
        setShowAlert(!showAlert)
    }

  
    return (
        <Paper className={classes.root} square id='lawfirm_cloud_names'>  
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
                            icon={<LabelWithIcon label={tab}/>} 
                            iconPosition="start"
                            classes={{ root: classes.tab }}
                        />
                    )) 
                } 
            </Tabs>  
            {
                showAlert === true && (
                    <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                        Widen the window to see additional names.
                    </Alert>
                )
            }
                
            {
                typeof props.standalone === 'undefined' && (
                    <FullScreen componentItems={menuItems}/>
                )
            }
            {
                selectedTab === 0 && namesData.length > 0 && ( 
                    <div style={{height: '100%', width: '100%', display: 'flex'}} id='cntNames'>
                        <DrawCloudChart />
                    </div>
                )
            }
            { 
                selectedTab === 1 && (
                    <AgentsVisualizer type={1}/>
                )
            }
            { 
                selectedTab === 2 && (
                    <AgentsVisualizer type={2}/>
                )
            }
            { 
                selectedTab === 3 && (
                    <InventionVisualizer 
                        visualizerBarSize={props.visualizerBarSize} 
                        type={props.type} 
                        tab={false}
                        standalone={true}
                        top={true}
                    />
                )
            }
        </Paper> 
    )
}


export default LawFirmNames;