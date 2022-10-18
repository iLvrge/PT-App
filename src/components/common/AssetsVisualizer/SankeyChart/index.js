import React, {useState, useEffect, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper } from '@mui/material';
import DisplayChart from './DisplayChart';
import useStyles from './styles'
import clsx from 'clsx';
import PatenTrackApi from '../../../../api/patenTrack2';
import TitleBar from '../../TitleBar';
import Loader from '../../Loader';


const SankeyChart = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [loadingAssignor, setLoadingAssingor] = useState(false);
    const [data, setData] = useState([]);
    const [assignorData, setAssignorData] = useState([]);    
    const [assigneeRawData, setAssigneeRawData] = useState([]);    
    const [assignorRawData, setAssignorRawData] = useState([]);    
    const selectedCategory = useSelector(state =>  state.patenTrack2.selectedCategory )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    
    useEffect(() => {
        const getPartiesData = async() => {
            if(loading === false) {    
                setData([])
                setAssignorData([])
                setAssigneeRawData([])
                setAssignorRawData([])
                const formData = new FormData()
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies));  
                console.log(props)
                if(typeof props.type != 'undefined' && props.type !== null && props.type != '') {
                    formData.append('type', props.type);  
                    formData.append('search', 'all');  
                } else {
                    formData.append('type', selectedCategory);   
                }
                if((typeof props.type != 'undefined' && props.type == 'acquired') || selectedCategory == 'acquired') {
                    setLoading(true)
                    const {data} = await PatenTrackApi.getDashboardPartiesData(formData)
                    
                    const loadData = []
                    if(data.length > 0) {
                        setAssigneeRawData(data)
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
                        setLoading(false)
                    }
                }
                
                if((typeof props.type != 'undefined' && props.type == 'divested') || selectedCategory == 'divested') {
                    setLoadingAssingor(true) 
                    const getAssignorData = await PatenTrackApi.getDashboardPartiesAssignorData(formData)
                    
                    if(getAssignorData.data != null) {
                        const assignorData  = getAssignorData.data
                        const loadAssignorData = []
                        if(assignorData.length > 0) {
                            setAssignorRawData(assignorData)
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
                        setLoadingAssingor(false)
                    }
                } 
            }
        }
        getPartiesData()
        return (() => {})
    }, [selectedCompanies])

    const handleSelection = useCallback((items, type) => {
        console.info(items, type)
        /* let oldItems = type == 2 ? [...assigneeRawData] : [...assigneeRawData]
        const filter = oldItems.filter( row => row.name === items[0].name)
        if(filter.length > 0) {
            dispatch(setSelectAssignmentCustomers([filter[0].id]))
            dispatch(setDashboardScreen(false))
            dispatch(setTimelineScreen(false))
            dispatch(setPatentScreen(true))
        } */
    }, [assigneeRawData, assigneeRawData])

    return (
        <Paper sx={{p: 2, overflow: 'auto'}} className={clsx(classes.container, classes.containerTop)} square>
            {
                (selectedCategory == 'acquired' && !loading && data.length === 0 ) || (!loadingAssignor && selectedCategory == 'divested' && assignorData.length === 0) && (
                    <TitleBar title="The company had no acquistions and divestitures of patent assets filled after 1997:" enablePadding={false} underline={false}/>
                )
            }            
            {    
                selectedCategory == 'acquired'
                ?
                    data.length > 0 ?
                        <div className={clsx(classes.child)}>
                            <TitleBar title="Acquistions:" enablePadding={false}/>
                            <DisplayChart data={data} tooltip={true} type={1} onSelect={handleSelection}/>
                        </div>   
                    :
                        <Loader />
                    
                :
                   ''
            }           
            
            {
                selectedCategory == 'divested'
                ?
                    assignorData.length > 0 ?
                        <div className={clsx(classes.child)} >
                            <TitleBar title="Divestitures:" enablePadding={false}/>
                            <DisplayChart data={assignorData} type={2} onSelect={handleSelection}/>
                        </div>  
                    :
                    <Loader />
                :
                    ''  
            }
        </Paper>         
    )
}


export default SankeyChart;