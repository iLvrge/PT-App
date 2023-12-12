import React, {useState, useEffect, useCallback, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Tab, Tabs } from '@mui/material';
import DisplayChart from './DisplayChart';
import useStyles from './styles'
import clsx from 'clsx';
import PatenTrackApi from '../../../../api/patenTrack2'; 
import Loader from '../../Loader';
import { setAssetTypeAssignmentAllAssets, setCPCData, setCPCRequest, setSankeyAssigneeData, setSankeyAssignorData, setSelectAssignmentCustomers, setRefreshSankeyChart } from '../../../../actions/patentTrackActions2'; 
import FullScreen from '../../FullScreen';
import LabelWithIcon from '../../LabelWithIcon';
import TitleBar from '../../TitleBar';
import { Box } from '@mui/system';


const SankeyChart = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const containerRef = useRef(null)
    const [loading, setLoading] = useState(false);
    const [loadingAssignor, setLoadingAssingor] = useState(false);
    const [ fullScreen, setFullScreen ] = useState(false)
    const [tabs, setTabs] = useState([props.tabText])
    const [data, setData] = useState([]);
    const [height, setHeight] = useState('100%');
    const [assignorData, setAssignorData] = useState([]);    
    const [assigneeRawData, setAssigneeRawData] = useState([]);    
    const [assignorRawData, setAssignorRawData] = useState([]);    
    const selectedCategory = useSelector(state =>  state.patenTrack2.selectedCategory )
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const assetsTotal = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.total_records) //Assets records
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const maintainenceAssetsTotal = useSelector(state => state.patenTrack2.maintainenceAssetsList.total_records) //Assets records
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected
    const selectedAssetCompanies = useSelector( state => state.patenTrack2.assetTypeCompanies.selected );
    const sankeyAssigneeData = useSelector( state => state.patenTrack2.sankeyAssigneeData );
    const sankeyAssignorData = useSelector( state => state.patenTrack2.sankeyAssignorData );
    const sankeyRefreshChart = useSelector( state => state.patenTrack2.sankeyRefreshChart );
    const fullScreenItems = [
        {
          id: 1,
          label: '',
          component: SankeyChart,
          type: props.type,
          showTabs: props.showTabs,
          tabText: props.tabText,
          standalone: true,
          activeTab: 0,
          activeFullScreen: true
        }
    ]
    
    useEffect(() => {
        const getPartiesData = async() => { 
            if(loading === false && (selectedCompanies.length > 0 || process.env.REACT_APP_ENVIROMENT_MODE == 'SAMPLE')) {    
                if((sankeyAssigneeData.length > 0 || sankeyAssignorData.length > 0) && typeof props.activeFullScreen != 'undefined' && props.activeFullScreen === true) {
                    if(sankeyAssigneeData.length > 0) { 
                        setAssigneeRawData(sankeyAssigneeData)
                        refineAssigneeData(sankeyAssigneeData)
                    } else if(sankeyAssignorData.length > 0) {
                        setAssignorRawData(sankeyAssignorData)
                        refineAssignorData(sankeyAssignorData)
                    }
                } else {  
                    setData([])
                    setAssignorData([])
                    setAssigneeRawData([])
                    setAssignorRawData([])
                    const formData = new FormData()
                    formData.append('selectedCompanies', JSON.stringify(selectedCompanies)); 
                    if(['PRO', 'KPI', 'SAMPLE'].includes(process.env.REACT_APP_ENVIROMENT_MODE)) {
                        const list = [];
                        let totalRecords = 0;
                
                        if( (assetsList.length > 0 && assetsSelected.length > 0 && assetsList.length != assetsSelected.length ) || ( maintainenceAssetsList.length > 0 &&  selectedMaintainencePatents.length > 0 && selectedMaintainencePatents.length != maintainenceAssetsList.length ) ) {   
                            if( assetsSelected.length > 0 ) {
                                const promise = assetsSelected.map(asset => {
                                    const findIndex = assetsList.findIndex( row => row.appno_doc_num.toString() == asset.toString() || row.grant_doc_num != null && row.grant_doc_num.toString() == asset.toString() )
                                    if( findIndex !== -1 ) {
                                        if( assetsList[findIndex].appno_doc_num != '' ) {
                                            list.push(assetsList[findIndex].appno_doc_num.toString())
                                        }
                                    }
                                })
                                await Promise.all(promise)
                                totalRecords = list.length
                            } else {
                                const promise = selectedMaintainencePatents.map(asset => {
                                    const findIndex = maintainenceAssetsList.findIndex( row => row.appno_doc_num.toString() == asset[1].toString() || row.grant_doc_num != null && row.grant_doc_num.toString() == asset[0].toString() )
                                    if( findIndex !== -1 ) {
                                        if( maintainenceAssetsList[findIndex].appno_doc_num != '' ) {
                                            list.push(maintainenceAssetsList[findIndex].appno_doc_num.toString())
                                        }
                                    }
                                })
                                await Promise.all(promise)
                                totalRecords = list.length
                            }                
                        } else {
                            if( assetsList.length > 0 || maintainenceAssetsList.length > 0 ) {
                                if( assetsList.length > 0 ) {
                                    const promise = assetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                                    await Promise.all(promise)
                                    totalRecords = assetsTotal
                                } else if ( maintainenceAssetsList.length > 0 ) {
                                    const promise = maintainenceAssetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                                    await Promise.all(promise)
                                    totalRecords = maintainenceAssetsTotal
                                }
                            }
                        }
                        formData.append('list', JSON.stringify(list)); 
                        formData.append('total', totalRecords); 
                    }
                    if(typeof props.layout != 'undefined' && props.layout !== null && props.layout === true) { 
                        formData.append('layout', selectedCategory);  
                    } 
                    if(typeof props.type != 'undefined' && props.type !== null && props.type != '') {
                        formData.append('type', props.type);  
                        //formData.append('search', 'all');  
                    } else {
                        formData.append('type', selectedCategory);   
                    }
                    if((typeof props.type != 'undefined' && ['acquired', 'filled', 'license_out'].includes(props.type)) || ['acquired', 'collateralization_transactions', 'license_out'].includes(selectedCategory)) {
                        setLoading(true)
                        PatenTrackApi.cancelDashboardPartiesDataRequest()
                        const {data} = await PatenTrackApi.getDashboardPartiesData(formData) 
                        setLoading(false)
                        if(data.length > 0) {
                            setAssigneeRawData(data)
                            dispatch(setSankeyAssigneeData(data))
                        }
                        refineAssigneeData(data)
                    }
                    
                    if((typeof props.type != 'undefined' && ['license_in', 'divested'].includes(props.type))) {
                        setLoadingAssingor(true) 
                        PatenTrackApi.cancelDashboardPartiesAssignorDataRequest()
                        const getAssignorData = await PatenTrackApi.getDashboardPartiesAssignorData(formData)  
                        setLoadingAssingor(false)
                        if(getAssignorData.data != null) {
                            const aorData  = getAssignorData.data   
                            if(aorData.length > 0) {
                                setAssignorRawData(aorData)
                                dispatch(setSankeyAssignorData(aorData))
                            }  
                            refineAssignorData(aorData)
                        }
                    } 
                }
            }
        }
        getPartiesData()
        return (() => {})
    }, [selectedCompanies, props.type, dispatch])

    useEffect(() => {  
        if((sankeyAssigneeData.length > 0 || sankeyAssignorData.length > 0) && typeof props.activeFullScreen != 'undefined' && props.activeFullScreen === true) { 
            if(sankeyAssigneeData.length > 0) {
                setAssigneeRawData(sankeyAssigneeData)
                refineAssigneeData(sankeyAssigneeData)
            } else if(sankeyAssignorData.length > 0) {  
                setAssignorRawData(sankeyAssignorData)
                refineAssignorData(sankeyAssignorData)
            }
        }
        return (() => {})
    }, [sankeyAssignorData, sankeyAssigneeData])

    useEffect(() => {
        if(['acquisition_transactions', 'divestitures_transactions'].includes(selectedCategory)) {
            setTabs([props.tabText, 'Owned'])
        }
        return (() => {})
    }, [selectedCategory])

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
        return (() => {})
    }, [data, assignorData, props]) 

    const refineAssigneeData = (data) => {
        const loadData = []
        if(data.length > 0 && sankeyRefreshChart === true ) {
            loadData.push([{ type: 'string', label: "From"}, { type: 'string', label: "To"}, { type: 'number', label: "Assets"}, { type: 'string', role: 'tooltip'}])
            data.forEach( item => {
                loadData.push([
                    item.name,
                    item.assignee,
                    item.name == 'Employees' ? 10 : parseInt(item.number),
                    `<p style="padding: 10px; margin: 0px;width: 238px;">${item.name} -> ${item.assignee}<br/> Assets: ${parseInt(item.number)}</p>`
                ]) 
            });    
        }  
        setData(loadData) 
    }

    const refineAssignorData = (aorData) => {
        const loadAssignorData = []
        if(aorData.length > 0 && sankeyRefreshChart === true) {
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


    const handleSelection = useCallback(async(items, chartType) => {
        let oldItems = chartType == 2 ? [...assignorRawData] : [...assigneeRawData] 
        const oldSelections = [...selectedAssetCompanies] 
        if(items.length > 0) {
            const filter = oldItems.filter( row => row.name === items[0].name)   
            if(filter.length > 0) {
                dispatch(setRefreshSankeyChart(false))
                if(props.type == 'filled') {        
                    const {data} = await PatenTrackApi.findInventor(filter[0].id)
                    dispatch(setCPCRequest(false))
                    dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))  
                    dispatch(setCPCData({list:[], group: [], sales: []}))
                    if(data != null && data?.id && data.id > 0 && !oldSelections.includes(data.id)) {
                        dispatch(setSelectAssignmentCustomers([data.id, filter[0].id]))
                    } else {
                        dispatch(setSelectAssignmentCustomers([])) 
                    }  
                } else {
                    dispatch(setCPCRequest(false))
                    dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))  
                    dispatch(setCPCData({list:[], group: [], sales: []}))
                    if(filter[0].id > 0 && !oldSelections.includes(filter[0].id)) {
                        dispatch(setSelectAssignmentCustomers([filter[0].id]))
                    } else {
                        dispatch(setSelectAssignmentCustomers([])) 
                    } 
                } 
            }
        } else {
            dispatch(setRefreshSankeyChart(true))
            dispatch(setCPCRequest(false))
            dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))  
            dispatch(setCPCData({list:[], group: [], sales: []}))
            dispatch(setSelectAssignmentCustomers([])) 
        }
        
    }, [assignorRawData, assigneeRawData, selectedAssetCompanies])  

    return (
        <Paper square className={classes.mainContainer} style={{overflow: typeof props.container != 'undefined' && props.container === true ? 'auto': 'inherit'}}> 
            {
                typeof props.showTabs != 'undefined' && props.showTabs === true && typeof props.tabText != 'undefined' && (
                    <Tabs
                        value={0}
                        variant={'scrollable'} 
                        scrollButtons="auto"
                        className={classes.tabs} 
                    >
                        {
                            tabs.map((tab) => (
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
            <Box sx={{p: typeof props.container != 'undefined' && props.container === true ? 2 : 0, display: 'flex', flex: 1, flexDirection: 'column', height: '100%'}}>
                {
                    ( data.length > 0   ||  assignorData.length > 0)  && (
                        <TitleBar title={`Hover over the bars for details. Select one of the colored bars to the ${props.type == 'divested' ? 'right' : 'left' } of each name to filter the Assets table accordingly. To release the filter - click the selected bar.`} enablePadding={false} underline={false} typography={true}/>
                    )
                }  
                <div className={clsx(classes.child, typeof props.standalone != 'undefined' && props.standalone === true ? typeof props.container == 'undefined' ? classes.padding16 : '' : '')} >
                
                {    
                    ['acquired', 'collateralization_transactions'].includes(selectedCategory) || ['filled', 'acquired', 'license_out'].includes(props.type)
                    ?
                        loading === false && (containerRef != null && containerRef.current == null) ?  
                            <DisplayChart data={data} tooltip={true}  chartType={1} rawItem={assigneeRawData} onSelect={handleSelection}/> 
                        :
                            <Loader />
                        
                    :
                    ''
                }           
                
                {
                    selectedCategory == 'divested' || ['divested', 'license_in'].includes(props.type)
                    ?
                        loadingAssignor === false && (containerRef != null && containerRef.current == null) ? 
                            <DisplayChart data={assignorData} chartType={2} rawItem={assignorRawData} onSelect={handleSelection} {...props}/> 
                        :
                        <Loader />
                    :
                        ''  
                }
                </div>  
            </Box>
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