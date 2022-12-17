import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useStyles from './styles' 
import { 
    Fullscreen as FullscreenIcon} from '@mui/icons-material'  
import FullScreen from '../../FullScreen'
import { Chart } from "react-google-charts"; 
import { Tabs, Tab, Paper, IconButton } from '@mui/material'
import PatenTrackApi from '../../../../api/patenTrack2'
import {
    getCustomerAssets,
} from '../../../../actions/patentTrackActions2'
import Loader from '../../Loader'
import TitleBar from '../../TitleBar'
import InventionVisualizer from '../InventionVisualizer' 
import AgentsVisualizer from '../AgentsVisualizer' 
import SankeyChart from '../SankeyChart' 
import LabelWithIcon from '../../LabelWithIcon' 

const GeoChart = ({ chartBar, visualizerBarSize, standalone, openCustomerBar, tab, titleBar, disableOtherTabs, activeTab }) => {
    const containerRef = useRef(null)
    const dispatch = useDispatch()
    const [ fullScreen, setFullScreen ] = useState(false)
    const [loading, setLoading] = useState(false)
    const [assetRequest, setAssetRequest] = useState(false)
    const [selectedTab, setSelectedTab ] = useState(typeof disableOtherTabs != 'undefined' && disableOtherTabs === true ? 0 : typeof activeTab != 'undefined' ? activeTab : 1)
    const [chartTabs, setChartTabs ] = useState(typeof disableOtherTabs != 'undefined' && disableOtherTabs === true ? ['Jurisdictions'] :  ['Innovations', 'Jurisdictions', 'Invented', 'Acquired', 'Filling', 'Assignments'])
    const [data, setData] = useState([])
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const assetTypesCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesCompaniesSelectAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll);
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const search_string = useSelector(state => state.patenTrack2.search_string)
    const search_rf_id = useSelector(state => state.patenTrack2.search_rf_id)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

    
    const assetsListLoading = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.loading) 
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const assetsTotal = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.total_records) //Assets records
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const maintainenceAssetsTotal = useSelector(state => state.patenTrack2.maintainenceAssetsList.total_records) //Assets records
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected   
    const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)

    const classes = useStyles() 
    const menuItems = [
        {
            id: 1,
            label: 'Geo Chart Data',
            component: GeoChart,
            standalone: true,
            chartBar, 
            visualizerBarSize,
            activeTab: selectedTab
        }
    ]
    const [height, setHeight] = useState('100%');
    const [minMax, setMinMax] = useState([0,0])
    const [option, setOption] = useState({
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        chartArea: {
            width: '83%',
            height: '92%',
            left:40,
            top:15,
        },
        colorAxis: {colors: ['#FFAA00', '#70A800', '#1565C0']}
    });


    useEffect(() => {
        if(selectedCategory == 'proliferate_inventors') {
            setChartTabs(['Innovations', 'Location'])
        }
    }, [selectedCategory ])
 
    useEffect(() => {
        let isSubscribed = true;
        if(isSubscribed && dashboardScreen === true) {
            callChartData([], 0)
        }            
        return () => (isSubscribed = false)
    }, [selectedCompanies])


    useEffect(() => {
        let isSubscribed = true;
        const getAssetsForEachCountry = async() => {
            try {
                setData([])
                const list = [];
                let totalRecords = 0;
                if( (assetsList.length > 0 && assetsSelected.length > 0 && assetsList.length != assetsSelected.length ) || ( maintainenceAssetsList.length > 0 &&  selectedMaintainencePatents.length > 0 && selectedMaintainencePatents.length != maintainenceAssetsList.length ) ) {
                    if( assetsSelected.length > 0 ) {
                        const promise = assetsSelected.map(asset => {
                            const findIndex = assetsList.findIndex( row => row.appno_doc_num.toString() == asset.toString() || row.grant_doc_num.toString() == asset.toString() )
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
                            const findIndex = maintainenceAssetsList.findIndex( row => row.appno_doc_num.toString() == asset[1].toString() || row.grant_doc_num.toString() == asset[0].toString() )
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
                    } else {
                        /**
                         * Check which layout and get the assets list first and then 
                         */
                        if( selectedCategory == '' ) { //pay_maintenece_fee
    
                        } else {
                            const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                            tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                            customers =
                            assetTypesCompaniesSelectAll === true ? [] : assetTypesCompaniesSelected,
                            assignments =
                                selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;
                                
                            if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
                                /* if( auth_token != null ) {
                                    dispatch(
                                        process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ? 
                                        getCustomerAssets(
                                            selectedCategory == '' ? '' : selectedCategory,
                                            companies,
                                            tabs,
                                            customers,   
                                            assignments,
                                            false,
                                        )
                                        : 
                                        getCustomerSelectedAssets(location.pathname.replace('/', ''))
                                    );
                                } */
                            } else {
                                console.log("GEOCHART", openCustomerBar, selectedCompaniesAll, selectedCompanies.length, assetRequest, assetsListLoading)
                                if (openCustomerBar === false && (selectedCompaniesAll === true || selectedCompanies.length > 0) && assetRequest === false && assetsListLoading === false) {
                                    console.log("SEND REQUEST FROM GEOCHART")
                                    setAssetRequest(true)
                                    dispatch(
                                        getCustomerAssets(
                                            selectedCategory == '' ? '' : selectedCategory,
                                            companies,
                                            tabs,
                                            customers,
                                            assignments,
                                            false,
                                            0,
                                            0,
                                            'asset',
                                            'DESC',
                                            -1, 
                                            display_sales_assets,
                                            setAssetRequest
                                        ),
                                    );
                                }
                            }                        
                        }
                    }                
                } 
                /* if(list.length > 0 ) {
                    callChartData(list, totalRecords)
                } else {
                    setData([])
                } */
                callChartData(list, totalRecords)
            } catch(err) {
                console.log(err)
            }            
        }
        if(isSubscribed && dashboardScreen === false) {
            getAssetsForEachCountry()
        }
        return () => (isSubscribed = false)
    }, [selectedCompanies, selectedCompaniesAll, selectedAssetsPatents, assetTypesSelectAll, assetTypesSelected, assetTypesCompaniesSelectAll, assetTypesCompaniesSelected, selectedAssetAssignmentsAll, selectedAssetAssignments, display_sales_assets, search_string, auth_token, assetsListLoading])
    
    
    useEffect(() => {    
        if(chartBar === false) {
            setHeight('100%')
            const opt = {...option}
            opt.chartArea.height = '92%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '92%'
            } else {
                opt.chartArea.width = '83%'
            }
            setOption(opt)
        } else {
            setHeight('100%')
            const opt = {...option}
            opt.chartArea.height = '91%'
            if(visualizerBarSize == '100%'){
                opt.chartArea.width = '92%'
            } else {
                opt.chartArea.width = '83%'
            }
            setOption(opt)
        }
        return () => {
            
        }
    }, [chartBar, visualizerBarSize])

    useEffect(() => {
        if(containerRef.current != null) {            
            DisplayChart()
        }
        return () => {

        }
    }, [height, containerRef])

    const callChartData = async(list, totalRecords) => {
        setAssetRequest(false)
        setLoading(true)
        setData([])
        const form = new FormData()
        form.append("list", JSON.stringify(list))
        form.append("total", totalRecords)
        form.append('selectedCompanies', JSON.stringify(selectedCompanies))
        form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
        form.append('customers', JSON.stringify(assetTypesCompaniesSelectAll === true ? [] : assetTypesCompaniesSelected))
        form.append('assignments', JSON.stringify(selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments))
        form.append('other_mode', display_sales_assets)
        form.append('data_type', dashboardScreen === true ? 1 : 0)
        form.append('type', selectedCategory)
        if(selectedCategory == 'proliferate_inventors') {
            PatenTrackApi.cancelInventorGeoLocationRequest()
            const { data } = await PatenTrackApi.getInventorGeoLocation(form)
            setLoading(false)
            setData(data)
        } else {
            PatenTrackApi.cancelAssetTypeAssignmentAllAssetsWithFamilyRequest()
            const { data } = await PatenTrackApi.getAssetTypeAssignmentAllAssetsWithFamily(form)
            setLoading(false)
            if( assetsList.length > 0 || assetsSelected.length > 0 || maintainenceAssetsList.length > 0 ||  selectedMaintainencePatents.length == 0  ) {
                setData(data)
            } 
        }
    }


    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)


    const DisplayChart = () => {
        if(loading) return <Loader/>
        if(data.length < 2) return null
        return (
            <Chart
                width={'100%'}
                height={height}
                chartType="GeoChart"
                loader={<div>Loading...</div>}
                data={data}
                options={option}
            />
        )
    }

 

    return (
        <Paper className={classes.root} square style={{overflow: 'hidden'}}>  
            {
                ( (process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)) ) && fullScreen === false && typeof standalone === 'undefined' && (
                    <IconButton size="small" className={classes.fullscreenBtn} onClick={() => setFullScreen(!fullScreen)}>
                        <FullscreenIcon />
                    </IconButton>
                )
            }  
            {
                typeof tab == 'undefined' || tab === true 
                ?
                    <Tabs
                        value={selectedTab}
                        variant="scrollable"
                        scrollButtons="auto"
                        onChange={handleChangeTab}
                        className={classes.tabs}
                    >
                        {
                            chartTabs.map((tab) => (
                                <Tab
                                    key={tab}
                                    label={<LabelWithIcon label={tab}/>}
                                    classes={{ root: classes.tab }}
                                />
                            )) 
                        }
                    </Tabs> 
                :
                    ''
            }
            {
                typeof titleBar !== 'undefined' && titleBar === true && ((typeof disableOtherTabs !== 'undefined' && disableOtherTabs === true ) || selectedTab === 1) && (
                    <TitleBar title={loading === false && data.length < 2 ? `The company has no non-expired USA patents filed after 1997, and no foreign counterparts.` : `Non expired US patents filed after 1997 and their foreign counterparts:`} enablePadding={true}  underline={false} typography={true}/>   
                )
            }  
            <div className={classes.graphContainer} ref={containerRef}>  
                {
                    typeof disableOtherTabs !== 'undefined' && disableOtherTabs === true 
                    ?
                        <DisplayChart />
                        :
                            selectedTab === 0 
                            ?
                                <InventionVisualizer 
                                    visualizerBarSize={visualizerBarSize} 
                                    tab={false} 
                                    standalone={true}  
                                />
                            :
                                selectedTab === 1
                                ?
                                    <DisplayChart />
                                :
                                    selectedTab === 2
                                    ?
                                        <SankeyChart 
                                            type={'filled'}
                                            layout={true}
                                        />
                                    :
                                        selectedTab === 3
                                        ?
                                            <SankeyChart 
                                                type={'acquired'}
                                                layout={true}
                                            />
                                        :
                                            selectedTab === 4
                                            ?
                                                <AgentsVisualizer type='1'/>
                                            :
                                                selectedTab === 5
                                                ?
                                                    <AgentsVisualizer type='2'/>
                                                :
                                                    ''
                } 
            </div> 
            {  
                ( (process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)) )  && fullScreen === true && (
                    <FullScreen 
                        componentItems={menuItems} 
                        showScreen={fullScreen} 
                        setScreen={setFullScreen}
                    /> 
                )
            } 
        </Paper>  
    )
}

export default GeoChart