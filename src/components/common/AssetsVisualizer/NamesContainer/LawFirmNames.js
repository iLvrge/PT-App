import React, {useEffect, useState} from 'react'
import { Chart, registerables } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import ReactWordcloud from 'react-wordcloud'; 
import { useDispatch, useSelector } from 'react-redux'
import PatenTrackApi from '../../../../api/patenTrack2';
import useStyles from './styles';
import { Paper, Tab, Tabs, Typography } from '@mui/material';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { FaLightbulb } from "react-icons/fa";
import { wordCloudOptions } from '../../../../utils/options';  
import AgentsVisualizer from '../AgentsVisualizer';
import FullScreen from '../../FullScreen';
import InventionVisualizer from '../InventionVisualizer';


const LawFirmNames = (props) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const [ tabs, setTabs ] = useState(['Names', 'Agents (fillings)', 'Agents (transactions)', 'Agents (Technologies)'])
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ rawData, setRawData ] = useState([])
    const [ namesData, setNamesData ] = useState([])
    const [size, setSize] = useState([550, 400])
    const [options, setOptions] = useState(wordCloudOptions)

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
        if(namesData.length > 0) {
            DrawCloudChart()
        }
    }, [namesData]) 

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

    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)

    const DrawCloudChart =  () => {  
        return (
            <ReactWordcloud 
                words={namesData} 
                options={options}
            />
        )
    } 

    const LabelWithIcon = ({label}) => {
        return (
            <span className={classes.label}>
                {
                    label == 'Agents (fillings)' || label == 'Agents (transactions)' || label == 'Agents (Technologies)' 
                    ?
                        `Agent `
                    :
                        label
                    
                }
                {
                    label == 'Agents (fillings)'
                    ?
                        <NoteAddOutlinedIcon/>
                        :
                        label == 'Agents (transactions)' 
                        ?
                            <HandshakeOutlinedIcon/>
                        :
                            label == 'Agents (Technologies)' ?
                                <FaLightbulb/>
                            :
                                ''
                }
            </span>
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
                    tabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={<LabelWithIcon label={tab}/>}
                            classes={{ root: classes.tab }}
                        />
                    )) 
                }
            </Tabs>  
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
                    />
                )
            }
        </Paper> 
    )
}


export default LawFirmNames;