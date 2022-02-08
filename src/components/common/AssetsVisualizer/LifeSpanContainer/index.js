import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useLocation} from 'react-router-dom'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Paper from '@material-ui/core/Paper'

import SpanVisualize from './SpanVisualize'
import ConnectionBox from '../../ConnectionBox'
import USPTOContainer from '../USPTOContainer'

import { setConnectionData } from '../../../../actions/patenTrackActions' 
import { setAssetsIllustrationData, setAssetsTransactionsLifeSpan, getCustomerAssets, getCustomerSelectedAssets } from '../../../../actions/patentTrackActions2' 
import PatenTrackApi from '../../../../api/patenTrack2'
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../../api/patenTrack2";

import useStyles from './styles'

const LifeSpanContainer = ({chartBar, openCustomerBar, visualizerBarSize, type}) => {
    const classes = useStyles() 
    const dispatch = useDispatch()
    const location = useLocation()
    const [offsetWithLimit, setOffsetWithLimit] = useState([0, DEFAULT_CUSTOMERS_LIMIT])
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ assets, setAssets ] = useState(null)
    const [ filterList, setFilterList ] = useState([])
    const [ lifeSpanTabs, setLifeSpanTabs ] = useState(['Lifespan'])
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
    const display_sales_assets = useSelector( state => state.patenTrack.display_sales_assets)

    useEffect(() => {
        if(selectedRow.length  === 0) {
            setLifeSpanTabs(['Lifespan'])
            setSelectedTab(0)
        } else if( connectionBoxView === true || selectedRow.length > 0 ) {
            /*setLifeSpanTabs([ 'Lifespan', 'Assignment', 'USPTO' ])*/
            setLifeSpanTabs([ 'Lifespan', 'Assignment'])
            setSelectedTab(1)
        }
    }, [ connectionBoxView, selectedRow ])

    useEffect(() => {
        const getChartData = async () => {
            if ((process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && selectedCompanies.length === 0) || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token === null)){
                return null
            } 
            const list = [];
            
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
                }                
            } else {
                if( assetsList.length > 0 || maintainenceAssetsList.length > 0 ) {
                    if( assetsList.length > 0 ) {
                        const promise = assetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
                    } else if ( maintainenceAssetsList.length > 0 ) {
                        const promise = maintainenceAssetsList.map(row => row.appno_doc_num != '' ? list.push(row.appno_doc_num.toString()) : '')
                        await Promise.all(promise)
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
                             if( auth_token != null ) {
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
                            } 
                        } else {
                            if (openCustomerBar === false && (selectedCompaniesAll === true || selectedCompanies.length > 0)) {
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
                                      display_sales_assets
                                    ),
                                );
                            }
                        }
                    }
                }                
            }

            if( list.length > 0 ) {
                setFilterList(list)
                const form = new FormData()
                form.append("list", JSON.stringify(list)) 
                form.append("total", maintainenceAssetsList.length > 0 ? maintainenceAssetsTotal : assetsTotal)
                form.append('selectedCompanies', JSON.stringify(selectedCompanies))
                form.append('tabs', JSON.stringify(assetTypesSelectAll === true ? [] : assetTypesSelected))
                form.append('customers', JSON.stringify(selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies))
                form.append('assignments', JSON.stringify(selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments))
                form.append('type', selectedCategory)
                PatenTrackApi.cancelLifeSpanRequest()
                const {data} = await PatenTrackApi.getAssetLifeSpan(form) 
                dispatch(setAssetsTransactionsLifeSpan(null, 0, 0, 0, data))
            } 
        }
        getChartData()
    }, [selectedCategory,  selectedCompanies, assetsList, maintainenceAssetsList, selectedMaintainencePatents, assetsSelected, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, selectedCompaniesAll, assetTypesSelectAll, selectedAssetCompaniesAll, selectedAssetAssignmentsAll, auth_token ])

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

    
    
    if ((process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && (selectedAssetsTransactionLifeSpan.length === 0 || selectedCompanies.length === 0 || type === 9)) || (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token == null /* || selectedAssetsTransactionLifeSpan.length === 0 */) ) return null

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
                    lifeSpanTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            classes={{ root: classes.tab }}
                            disableFocusRipple={true}
                            disableRipple={true}
                        />
                    )) 
                }
            </Tabs>
            {selectedTab === 0 && <SpanVisualize chart={selectedAssetsTransactionLifeSpan} chartBar={chartBar} visualizerBarSize={visualizerBarSize}/>}
            {selectedTab === 1 && <ConnectionBox display={"false"} assets={assets}/>}
            {selectedTab === 2 && <USPTOContainer assets={assets}/>}            
        </Paper> 
    )
}

export default LifeSpanContainer