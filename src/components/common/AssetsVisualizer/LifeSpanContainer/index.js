import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useLocation} from 'react-router-dom'
import {Tab, Tabs, Paper, IconButton, Box} from '@mui/material'
import { Fullscreen as FullscreenIcon } from '@mui/icons-material' 
import SpanVisualize from './SpanVisualize'
import Acknowledgements from './Acknowledgements'
import ConnectionBox from '../../ConnectionBox'
import USPTOContainer from '../USPTOContainer'
import FullScreen from '../../FullScreen'
import { setConnectionData } from '../../../../actions/patenTrackActions' 
import { setAssetsIllustrationData, setAssetsTransactionsLifeSpan, getCustomerAssets, getCustomerSelectedAssets } from '../../../../actions/patentTrackActions2' 
import PatenTrackApi from '../../../../api/patenTrack2'
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../../api/patenTrack2";

import useStyles from './styles'
import InventionVisualizer from '../InventionVisualizer'
import Citation from '../LegalEventsContainer/Citation' 
import IllustrationContainer from '../IllustrationContainer'
import AgentsVisualizer from '../AgentsVisualizer'
import LabelWithIcon from '../../LabelWithIcon'
import HistogramYears from './HistogramYears'
import SteppedAges from './SteppedAges'

const LifeSpanContainer = ({chartBar, analyticsBar, openCustomerBar, visualizerBarSize, type, standalone, activeTab, setIllustrationRecord, chartsBarToggle, checkChartAnalytics, setAnalyticsBar, setChartBar, gap}) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const location = useLocation()
    const [offsetWithLimit, setOffsetWithLimit] = useState([0, DEFAULT_CUSTOMERS_LIMIT])
    const [ selectedTab, setSelectedTab ] = useState(typeof activeTab !== 'undefined' ? activeTab : 0)
    const [ assets, setAssets ] = useState(null)
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)
    const [ fullScreen, setFullScreen ] = useState(false)
    const [ filterList, setFilterList ] = useState([])
    const [ lifeSpanTabs, setLifeSpanTabs ] = useState(['Lifespan', 'Cited by', 'Salable', 'Licensable'])
    const selectedAssetsTransactionLifeSpan = useSelector(state => state.patenTrack2.transaction_life_span)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const assetIllustration = useSelector( state => state.patenTrack2.assetIllustration )
    const assetIllustrationData = useSelector( state => state.patenTrack2.assetIllustrationData )
    const selectedRow = useSelector( state => state.patenTrack2.selectedAssetsTransactions )
    const selectedCategory = useSelector( state => state.patenTrack2.selectedCategory )
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll )
    const assetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list) //Assets List
    const assetsTotal = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.total_records) //Assets records
    const maintainenceAssetsList = useSelector( state => state.patenTrack2.maintainenceAssetsList.list )
    const maintainenceAssetsTotal = useSelector(state => state.patenTrack2.maintainenceAssetsList.total_records) //Assets records
    const selectedMaintainencePatents = useSelector( state => state.patenTrack2.selectedMaintainencePatents )
    const assetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected) //Assets Selected
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected )
    const assetTypesSelectAll = useSelector( state => state.patenTrack2.assetTypes.selectAll )
    const selectedAssetCompanies = useSelector( state => state.patenTrack2.assetTypeCompanies.selected )
    const selectedAssetCompaniesAll = useSelector( state => state.patenTrack2.assetTypeCompanies.selectAll )
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const selectedAssetAssignmentsAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll )
    const connectionBoxView = useSelector( state => state.patenTrack.connectionBoxView)
    const display_sales_assets = useSelector( state => state.patenTrack2.display_sales_assets)
    const fullScreenItems = [
        {
          id: 1,
          label: '',
          component: LifeSpanContainer,
          chartBar,
          openCustomerBar,
          visualizerBarSize,
          type,
          standalone: true,
          activeTab: selectedTab
        }
    ]
 
    useEffect(() => {
        if(selectedRow.length  === 0) {
            /* setLifeSpanTabs(['Lifespan', 'Acknowledgements']) */
            if( (selectedCategory == 'late_recording' || selectedCategory == 'incorrect_recording')) {
                setLifeSpanTabs(['Lifespan', 'Lawyers'])
            } else if(selectedCategory == 'abandoned'){
                setLifeSpanTabs(['Years', 'Ages', 'Cited by', 'Salable', 'Licensable'])
            } else {
                setLifeSpanTabs(['Lifespan', 'Cited by', 'Salable', 'Licensable'])
            }
            setSelectedTab(typeof activeTab !== 'undefined' ? activeTab : 0)
        } else if( connectionBoxView === true || selectedRow.length > 0 ) {
            /*setLifeSpanTabs([ 'Lifespan', 'Assignment', 'USPTO' ])*/
            if(selectedCategory == 'late_recording' || selectedCategory == 'incorrect_recording') { 
                setLifeSpanTabs([ 'Lifespan', 'Rights'])
            } else { 
                setLifeSpanTabs([ 'Lifespan', 'Assignment'])
            }
            if(typeof activeTab !== 'undefined') {
                setSelectedTab(activeTab)
            }
        }
    }, [ connectionBoxView, selectedRow ])

    useEffect(() => {
        const getChartData = async () => {
            if ((process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && selectedCompanies.length === 0) || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token === null)){
                dispatch(setAssetsTransactionsLifeSpan(null, 0, 0, 0, []))
                return null
            } 
            dispatch(setAssetsTransactionsLifeSpan(null, 0, 0, 0, []))
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
                } else {
                    /**
                     * Check which layout and get the assets list first and then 
                     */
                    if( selectedCategory == '' ) { //pay_maintenece_fee

                    } else {
                        const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                        tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                        customers =
                          selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies,
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
                                      0,
                                      0,
                                      'asset',
                                      'DESC'
                                    )
                                    : 
                                    getCustomerSelectedAssets(location.pathname.replace('/', ''))
                                );
                            }  */
                        } else {
                            if (openCustomerBar === false && (selectedCompaniesAll === true || selectedCompanies.length > 0) && selectedCategory != 'top_law_firms') {
                                /* dispatch(
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
                                      display_sales_assets
                                    ),
                                ); */
                            }
                        }
                    }
                }                
            }
           /*  console.log('list', list) */
            if( list.length > 0 || selectedCategory == 'top_law_firms') {
                setFilterList(list)
                const form = new FormData()
                form.append("list", JSON.stringify(list)) 
                form.append("total", totalRecords)
                form.append('selectedCompanies', JSON.stringify(selectedCompanies))
                form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
                form.append('customers', JSON.stringify(selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies))
                form.append('assignments', JSON.stringify(selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments))
                form.append('type', selectedCategory)
                form.append('other_mode', display_sales_assets)
                //PatenTrackApi.cancelLifeSpanRequest()
                const {data} = await PatenTrackApi.getAssetLifeSpan(form) 
                dispatch(setAssetsTransactionsLifeSpan(null, 0, 0, 0, data))
            }  
        }
        getChartData()
    }, [selectedCategory,  selectedCompanies, assetsList, maintainenceAssetsList, selectedMaintainencePatents, assetsSelected, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, selectedCompaniesAll, assetTypesSelectAll, selectedAssetCompaniesAll, selectedAssetAssignmentsAll, auth_token, display_sales_assets ])

    useEffect(() => {
        if(assetIllustration != null && Object.keys(assetIllustration).length > 0) {
            if((selectedAssetAssignments.length == 1 && selectedCategory == 'correct_details') || selectedRow.length == 1) {
                setAssets(assetIllustration)
                if(assetIllustrationData != null ) {
                    dispatch(
                        setConnectionData(assetIllustrationData.line[0])
                    )
                } else {
                    (async() => {
                        PatenTrackApi.cancelCollectionIllustrationRequest()
                        const { data } = await PatenTrackApi.getCollectionIllustration(assetIllustration.id)
                        dispatch(
                            setAssetsIllustrationData(data != '' ? data : null)
                        )
                    })();
                }
                
            }
        }
    }, [ assetIllustration, assetIllustrationData, selectedAssetAssignments, selectedRow, selectedCategory ])



    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)

    const handleClickOpenFullscreen = () => {
        setIsFullscreenOpen(true)
    }
    
    const handleCloseFullscreen = () => {
        setIsFullscreenOpen(false)
    }
 
    
    return (
        <Paper className={classes.root} square>  
            {
                (/* selectedAssetsTransactionLifeSpan.length > 0 &&  */(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)) ) && fullScreen === false && typeof standalone === 'undefined' && (
                    <IconButton size="small" className={classes.fullscreenBtn} onClick={() => setFullScreen(!fullScreen)}>
                        <FullscreenIcon />
                    </IconButton>
                )
            }             
            <Tabs
                value={selectedTab}
                variant={'scrollable'} 
                scrollButtons="auto"
                className={classes.tabs}
                onChange={handleChangeTab} 
            >
                {
                    lifeSpanTabs.map((tab) => (
                        <Tab
                            key={tab}
                            className={classes.tab} 
                            icon={<LabelWithIcon label={tab}/>}
                            label={tab} 
                            iconPosition="start"
                        />
                    )) 
                }
            </Tabs> 
            <Box {...( lifeSpanTabs[selectedTab] !== 'Cited by' ? {sx: {p: 2}} : {})} style={{display: 'flex', height: '86%'}}>  
            {
                ((process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)) ) 
                ?
                    selectedTab === 0 
                    ?
                        selectedCategory == 'abandoned' ? 
                            <HistogramYears/>
                        :
                            selectedAssetsTransactionLifeSpan.length > 0 && (
                                <SpanVisualize chart={selectedAssetsTransactionLifeSpan} chartBar={chartBar} visualizerBarSize={visualizerBarSize}/>
                            )
                    :
                        selectedRow.length == 0
                        ?
                            selectedTab === 1 ?
                                selectedCategory == 'abandoned' 
                                ? 
                                    <SteppedAges/>
                                :
                                selectedCategory == 'late_recording' || selectedCategory == 'incorrect_recording'
                                ?
                                    <AgentsVisualizer
                                        type={2}
                                    />
                                :
                                    <Acknowledgements/>
                            :
                                selectedTab === 2 ? 
                                    selectedCategory == 'abandoned' 
                                    ?
                                        <Acknowledgements/>
                                    :
                                        '' 
                                :
                                    selectedTab === 3 ? 
                                        ''
                                    :
                                        ''
                        :
                            selectedTab === 1 ? 
                                selectedCategory == 'late_recording' || selectedCategory == 'incorrect_recording'
                                    ?
                                        <IllustrationContainer 
                                            isFullscreenOpen={isFullscreenOpen} 
                                            asset={assetIllustration} 
                                            setIllustrationRecord={setIllustrationRecord} 
                                            chartsBar={chartBar}
                                            analyticsBar={analyticsBar}
                                            chartsBarToggle={chartsBarToggle}
                                            checkChartAnalytics={checkChartAnalytics}
                                            setAnalyticsBar={setAnalyticsBar}
                                            setChartBar={setChartBar}
                                            fullScreen={handleClickOpenFullscreen}
                                            gap={gap}
                                        />
                                :
                                    <ConnectionBox display={"false"} assets={assets}/>
                            :
                                selectedTab === 2 ?
                                <USPTOContainer assets={assets}/>
                            :
                                ''     
                :
                    ''
            }
            </Box>
            {  
                ( (process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)) )  && fullScreen === true && (
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

export default LifeSpanContainer