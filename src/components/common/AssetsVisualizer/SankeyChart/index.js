import React, {useState, useEffect, useCallback, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Tab, Tabs } from '@mui/material';
import DisplayChart from './DisplayChart';
import useStyles from './styles'
import clsx from 'clsx';
import PatenTrackApi from '../../../../api/patenTrack2'; 
import Loader from '../../Loader';
import { setAssetTypeAssignmentAllAssets, setCPCData, setCPCRequest, setSelectAssignmentCustomers } from '../../../../actions/patentTrackActions2'; 
import FullScreen from '../../FullScreen';
import LabelWithIcon from '../../LabelWithIcon';
import TitleBar from '../../TitleBar';


const SankeyChart = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const containerRef = useRef(null)
    const [loading, setLoading] = useState(false);
    const [loadingAssignor, setLoadingAssingor] = useState(false);
    const [ fullScreen, setFullScreen ] = useState(false)
    const [data, setData] = useState([]);
    const [height, setHeight] = useState('100%');
    const [assignorData, setAssignorData] = useState([]);    
    const [assigneeRawData, setAssigneeRawData] = useState([]);    
    const [assignorRawData, setAssignorRawData] = useState([]);    
    const selectedCategory = useSelector(state =>  state.patenTrack2.selectedCategory )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);

    const fullScreenItems = [
        {
          id: 1,
          label: '',
          component: SankeyChart,
          type: props.type,
          showTabs: props.showTabs,
          tabText: props.tabText,
          standalone: true,
          activeTab: 0
        }
    ]
    
    useEffect(() => {
        const getPartiesData = async() => {
            if(loading === false) {    
                setData([])
                setAssignorData([])
                setAssigneeRawData([])
                setAssignorRawData([])
                const formData = new FormData()
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies)); 
                if(typeof props.layout != 'undefined' && props.layout !== null && props.layout === true) { 
                    formData.append('layout', selectedCategory);  
                }
                if(typeof props.type != 'undefined' && props.type !== null && props.type != '') {
                    formData.append('type', props.type);  
                    //formData.append('search', 'all');  
                } else {
                    formData.append('type', selectedCategory);   
                }
                if((typeof props.type != 'undefined' && (props.type == 'acquired' || props.type == 'filled')) || (selectedCategory == 'acquired')) {
                    setLoading(true)
                    PatenTrackApi.cancelDashboardPartiesDataRequest()
                    const {data} = await PatenTrackApi.getDashboardPartiesData(formData) 
                    setLoading(false)
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
                    }
                }
                
                if((typeof props.type != 'undefined' && props.type == 'divested')) {
                    setLoadingAssingor(true) 
                    PatenTrackApi.cancelDashboardPartiesAssignorDataRequest()
                    const getAssignorData = await PatenTrackApi.getDashboardPartiesAssignorData(formData)  
                    setLoadingAssingor(false)
                    if(getAssignorData.data != null) {
                        const aorData  = getAssignorData.data   
                        const loadAssignorData = []
                        if(aorData.length > 0) {
                            setAssignorRawData(aorData)
                            loadAssignorData.push(["From", "To", "Assets"])
                            aorData.forEach( item => {
                                loadAssignorData.push([
                                    item.assignor,
                                    item.name,
                                    parseInt(item.number)
                                ])
                            });  
                        }  
                        setAssignorData(loadAssignorData)
                    }
                } 
            }
        }
        getPartiesData()
        return (() => {})
    }, [selectedCompanies, props.type])

    useEffect(() => {
        if((data.length > 0 || assignorData.length > 0) && containerRef != null && containerRef.current != null) { 
            const element = containerRef.current.parentElement
            if(element != null) { 
                const childElement = document.querySelectorAll('.cntSankeyChart') 
                if(childElement.length > 0 ) { 
                    childElement.forEach( (item, index) => {
                        const containerID = childElement[index].parentNode.parentNode.parentNode.getAttribute('id')
                        if(containerID == 'charts_container') { 
                            const {height} = childElement[index].parentNode.parentNode.parentNode.getBoundingClientRect();
                            childElement[index].style.height = `${parseInt(height) - 64 }px`
                        }
                    })
                } 
            }
        }
    }, [data, assignorData, props]) 

    const handleSelection = useCallback(async(items, type, event) => {
        let oldItems = type == 2 ? [...assignorRawData] : [...assigneeRawData]
        const filter = oldItems.filter( row => row.name === items[0].name)
        console.log('handleSelection', filter, event)
        if(filter.length > 0) {
            if(props.type == 'filled') {        
                const {data} = await PatenTrackApi.findInventor(filter[0].id)
                if(data != null && data?.id && data.id > 0) {
                    dispatch(setCPCRequest(false))
                    dispatch(setCPCData({list:[], group: [], sales: []}))
                    dispatch(setSelectAssignmentCustomers([data.id]))
                    dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))  
                }
            } else {
                dispatch(setCPCRequest(false))
                dispatch(setCPCData({list:[], group: [], sales: []}))
                dispatch(setSelectAssignmentCustomers([filter[0].id])) 
                dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))  
            } 
        }
    }, [assignorRawData, assigneeRawData]) 
    return (
        <Paper {...(typeof props.showTabs == 'undefined' ? {sx: {p: 0, overflow: 'auto'}} : {overflow: 'auto'})}  className={clsx(classes.container, classes.containerTop, 'cntSankeyChart')} square ref={containerRef} >
                 
            {
                typeof props.showTabs != 'undefined' && props.showTabs === true && typeof props.tabText != 'undefined' && (
                    <Tabs
                        value={0}
                        variant={'scrollable'} 
                        scrollButtons="auto"
                        className={classes.tabs} 
                    >
                        {
                            [props.tabText].map((tab) => (
                                <Tab
                                    key={tab}
                                    className={classes.tab} 
                                    label={tab} 
                                    icon={<LabelWithIcon label={tab}/>}
                                    iconPosition='start'

                                />
                            )) 
                        }
                    </Tabs> 
                )
            } 
            <div className={clsx(classes.child, typeof props.standalone != 'undefined' && props.standalone === true ? classes.padding16 : '')} >
            {
                ( data.length > 0   ||  assignorData.length > 0)  && (
                    <TitleBar title="Hover over the bars for details. Select one of the colored bars to the right of each name to filter the Assets table accordingly." enablePadding={false} underline={false} typography={true}/>
                )
            }  
            {    
                selectedCategory == 'acquired' || props.type == 'acquired' || props.type == 'filled'
                ?
                    loading === false ?  
                        <DisplayChart data={data} tooltip={true}  type={1} onSelect={handleSelection}/> 
                    :
                        <Loader />
                    
                :
                   ''
            }           
            
            {
                selectedCategory == 'divested' || props.type == 'divested'
                ?
                    loadingAssignor === false ? 
                        <DisplayChart data={assignorData} type={2} onSelect={handleSelection}/> 
                    :
                    <Loader />
                :
                    ''  
            }
            </div>  
            {
                typeof props.fullScreen != 'undefined' && props.fullScreen === true && (
                    <FullScreen 
                        componentItems={fullScreenItems} 
                        showScreen={fullScreen} 
                        setScreen={setFullScreen}
                    />
                )
            }
        </Paper>         
    )
}


export default SankeyChart;