import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Paper } from '@mui/material';
import DisplayChart from './DisplayChart';
import Loader from '../common/Loader'
import PatenTrackApi from '../../api/patenTrack2'
import useStyles from './styles'
import clsx from 'clsx';
import { Box } from '@mui/system';

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
                    loadData.push(["From", "To", "Assets"])
                    data.forEach( item => {
                        loadData.push([
                            item.name,
                            item.assignee,
                            parseInt(item.number)
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

    const Title = (props) => {
        return (
            <Box>
                <span className={classes.heading}>{props.name}</span>
            </Box>
        )
    }

    return (
        <Paper sx={{p: 2, overflow: 'auto'}} className={clsx(classes.container, classes.containerTop)} square>
            
            {
                !loading
                ?
                    data.length > 0 && (
                        <div className={classes.child}>
                            <Title name="Acquistions"/>
                            <DisplayChart data={data}/>
                        </div> 
                    )   
                    
                :
                    <Loader />
            }           
            
            {
                !loadingAssignor
                ?
                    assignorData.length > 0 && (
                        <div className={classes.child}>
                            <Title name="Divestitures"/>
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