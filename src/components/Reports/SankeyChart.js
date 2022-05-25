import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Paper } from '@mui/material';
import DisplayChart from './DisplayChart';
import Loader from '../common/Loader'
import PatenTrackApi from '../../api/patenTrack2'
import useStyles from './styles'
import clsx from 'clsx';
import { Box } from '@mui/system';
import TitleBar from '../common/TitleBar';

const SankeyChart = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [loadingAssignor, setLoadingAssingor] = useState(false);
    const [data, setData] = useState([]);
    const [assignorData, setAssignorData] = useState([]);    
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    
    useEffect(() => {
        const getPartiesData = async() => {
            if(loading === false) {    
                setLoading(true)
                setLoadingAssingor(true) 
                setData([])
                setAssignorData([])
                const formData = new FormData()
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies));                
                const {data} = await PatenTrackApi.getDashboardPartiesData(formData)
                const getAssignorData = await PatenTrackApi.getDashboardPartiesAssignorData(formData)
                const loadData = []
                if(data.length > 0) {
                    loadData.push([{ type: 'string', label: "From"}, { type: 'string', label: "To"}, { type: 'number', label: "Assets"}, { type: 'string', role: 'tooltip'}])
                    data.forEach( item => {
                        loadData.push([
                            item.name,
                            item.assignee,
                            item.name == 'Employees' ? 10 : parseInt(item.number),
                            `<p style="padding: 10px; margin: 0px;width: 238px;">${item.name} -> ${item.assignee}<br/> Assets: ${parseInt(item.number)}</p>`
                        ]) 
                    });    
                    setData(loadData)
                }
                setLoading(false)
                if(getAssignorData.data != null) {
                    const assignorData  = getAssignorData.data
                    const loadAssignorData = []
                    if(assignorData.length > 0) {
                        loadAssignorData.push(["From", "To", "Assets"])
                        assignorData.forEach( item => {
                            loadAssignorData.push([
                                item.assignor,
                                item.name,
                                parseInt(item.number)
                            ])
                        });  
                    }  
                    setAssignorData(loadAssignorData)
                }
                setLoadingAssingor(false)
            }
        }
        getPartiesData()
        return (() => {})
    }, [selectedCompanies])

    return (
        <Paper sx={{p: 2, overflow: 'auto'}} className={clsx(classes.container, classes.containerTop)} square>
            {
                data.length === 0 && assignorData.length === 0 && (
                    <TitleBar title="Acquistions and divestitures of patent assets filled after 1997:" enablePadding={false}/>
                )
            }            
            {
                !loading
                ?
                    data.length > 0 && (
                        <div className={classes.child}>
                            <TitleBar title="Acquistions:" enablePadding={false}/>
                            <DisplayChart data={data} tooltip={true}/>
                        </div>   
                    )   
                    
                :
                    <Loader />
            }           
            
            {
                !loadingAssignor
                ?
                    assignorData.length > 0 && (
                        <div className={clsx(classes.child, {[classes.maxChildHeight]: data.length > 0 ? true : false})} >
                            <TitleBar title="Divestitures:" enablePadding={false}/>
                            <DisplayChart data={assignorData}/>
                        </div>  
                    )
                :
                    <Loader />  
            }
        </Paper>         
    )
}


export default SankeyChart;