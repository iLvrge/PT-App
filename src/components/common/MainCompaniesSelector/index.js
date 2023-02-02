import React, { useCallback, useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@mui/material'
import useStyles from './styles' 
import _orderBy from 'lodash/orderBy' 
import VirtualizedTable from '../VirtualizedTable'

import {
    fetchParentCompanies,
    setMainCompaniesSelected,
    setMainCompaniesAllSelected,
    setMainCompaniesRowSelect,
    setMainCompanies,
    setMaintainenceAssetsList,
    setAssetTypes,
    setAssetTypeInventor,
    setAssetTypeCompanies,
    setAssetTypeAssignments,
    setAssetTypeAssignmentAllAssets,
    setAssetsIllustration,
    setAssetsIllustrationData,
    setSelectedAssetsTransactions,
    setSelectedAssetsPatents,
    setAllAssetTypes,
    setAssetTypesSelect,
    setAllAssignmentCustomers,
    setSelectAssignmentCustomers,
    setNamesTransactionsSelectAll,
    setSelectedNamesTransactions,
    setAssetTypesPatentsSelected,
    setAssetTypesPatentsSelectAll,
    setAllAssignments, 
    setSelectAssignments,
    setSlackMessages,
    getSlackMessages,
    setChannelID,
    getChannels,
    setCompanyTableScrollPos,
    setCPCRequest,
    setJurisdictionRequest,
    setCPCData,
    setJurisdictionData,
    setTimelineRequest,
    setTimelineData,
    setCPCSecondData,
    setLineChartReset,
} from '../../../actions/patentTrackActions2'


import {
    setPDFView,
    setPDFFile,
    setConnectionData,
    setConnectionBoxView
  } from "../../../actions/patenTrackActions";

import {
    toggleUsptoMode, 
    toggleFamilyMode,
    toggleFamilyItemMode,
    toggleLifeSpanMode
  } from "../../../actions/uiActions";

import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import PatenTrackApi from '../../../api/patenTrack2'

import { numberWithCommas } from '../../../utils/numbers'
import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";
import {
    updateHashLocation
} from '../../../utils/hashLocation' 

import ChildTable from './ChildTable'

import Loader from '../Loader'
import { resetAllRowSelect } from '../../../utils/resizeBar'



const MainCompaniesSelector = ({selectAll, defaultSelect, addUrl, parentBarDrag, parentBar, isMobile, checkChartAnalytics}) => {
    const COLUMNS = [
        {
            width: 10,
            minWidth: 10,
            label: '',
            dataKey: 'representative_id',
            role: 'checkbox',
            selectedFromChild: true,     
            disableSort: true,
            enable: false,
            show: false
            /* showOnCondition: '1' */ 
        },
        {
            width: 25,     
            minWidth: 25,
            label: '',
            dataKey: 'representative_id',
            headingIcon: 'company',
            role: "arrow",
            disableSort: true,
            showOnCondition: '0',
            disableColumnKey:'type',
            checkboxSelect: true,
            group: true
        },
        {
            width: 170,  
            minWidth: 170,
            oldWidth: 170,
            draggable: true,
            label: 'Companies',        
            dataKey: 'original_name',
            /* classCol: 'font12Rem', */
            showOnCondition: '0',
            align: "left", 
            show_selection_count: true,
            badge: true,
        },
        {
          width: isMobile === true ? 60 : 40,
          minWidth: isMobile === true ? 60 : 40,
          label: "",
          dataKey: "channel", 
          formatCondition: 'representative_name',
          headingIcon: 'slack_image',
          role: 'slack_image',      
        },
        /* {
            width: 80,  
            minWidth: 80, 
            label: 'Acitivites',
            staticIcon: '',
            dataKey: 'no_of_activities',
            format: numberWithCommas,
            styleCss: true,
            headerAlign: 'right',
            justifyContent: 'flex-end'
        },
        {
            width: 80,   
            minWidth: 80,
            label: 'Parties',
            staticIcon: '',
            dataKey: 'no_of_parties',
            format: numberWithCommas,
            headerAlign: 'right',
            styleCss: true,
            justifyContent: 'flex-end'
        },
        {
            width: 80,  
            minWidth: 80,
            label: 'Inventors',
            staticIcon: '',
            dataKey: 'no_of_inventor',
            format: numberWithCommas,
            headerAlign: 'right',
            styleCss: true,
            justifyContent: 'flex-end'
        },
        {
            width: 120,  
            minWidth: 120,
            label: 'Transactions',
            staticIcon: '',
            dataKey: 'no_of_transactions',
            format: numberWithCommas,
            headerAlign: 'right',
            styleCss: true,
            justifyContent: 'flex-end'
        },
        {
            width: 80,  
            minWidth: 80,
            label: 'Assets',
            staticIcon: '',
            dataKey: 'no_of_assets',
            format: numberWithCommas,
            headerAlign: 'right',
            styleCss: true,
            justifyContent: 'flex-end'   
        },
        {
            width: 80,  
            minWidth: 80,
            label: 'Rights',
            dataKey: 'product',
            staticIcon: '',
            format: numberWithCommas,
            headerAlign: 'right',
            styleCss: true,
            justifyContent: 'flex-end'
        } */
    ] 
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [childHeight, setChildHeight] = useState(500)
    const [childSelected, setCheckedSelected] = useState(0)
    const [childCounter, setChildCounter] = useState(0)    
    const [ data, setData ] = useState( [] )
    const [ width, setWidth ] = useState( 1900 )
    const [ offset, setOffset ] = useState(0)
    const [ totalRecords, setTotalRecords ] = useState(0)
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectNames, setSelectNames] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ companyColWidth, setCompanyColWidth] = useState( COLUMNS[2].width )   
    const [ currentSelection, setCurrentSelection ] = useState(null)   
    const [ intialization, setInitialization ] = useState( false ) 
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [sortField, setSortField] = useState(`original_name`)
    const [sortOrder, setSortOrder] = useState(`ASC`)
    const [ companiesList, setCompaniesList ] = useState([])
    const [ selectedGroup, setSelectGroups ] = useState([])
    const companies = useSelector( state => state.patenTrack2.mainCompaniesList )
    const isLoadingCompanies = useSelector( state => state.patenTrack2.mainCompaniesLoadingMore )
    const selected = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const selectedGroups = useSelector( state => state.patenTrack2.mainCompaniesList.selectedGroups)
    const childID = useSelector( state => state.patenTrack2.mainCompaniesList.chilID)
    const childList = useSelector( state => state.patenTrack2.mainCompaniesList.child_list)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
    const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)
    const slack_channel_list_loading = useSelector(state => state.patenTrack2.slack_channel_list_loading)
    const channel_id = useSelector(state => state.patenTrack2.channel_id)
    const dashboard_share_selected_data = useSelector(state => state.patenTrack2.dashboard_share_selected_data)
    const companyTableScrollPosition = useSelector(
        state => state.patenTrack2.companyTableScrollPosition,
    );
    /**
     * Intialise company list
    */

    useEffect(() => {
        const initCompanies = async () => {
            dispatch(fetchParentCompanies( offset, sortField, sortOrder ) )
        } 
        initCompanies() 
        return () => {
            
        } 
    }, []) 

    /**
     * Set Total companies
     */

    useEffect(() => {
        setCompaniesList( companies.list )
        let counter = 0, items = [];

        if(companies.list.length > 0) {
            companies.list.map(row => {
                if(parseInt(row.type) == 1) {
                    const parseChild = JSON.parse(row.child)
                    if(parseChild.length > 0) {
                        counter += parseChild.length        
                    } 
                }  else {
                    counter++;
                }
            })
            setTotalRecords(counter)
            
        }
    }, [ companies.list ])

    /**
     * For Mobile screen
     */

    useEffect(() => {
        if(isMobile) {
            let headerColumns = [...COLUMNS]
            headerColumns[2].width =  250
            headerColumns[2].minWidth =  250
            setHeaderColumns(headerColumns)
        }
    }, [isMobile])

    /**
     * Get Slack channels
     */

    useEffect(() => {
        if(slack_channel_list.length == 0 && slack_channel_list_loading === false) {
          const slackToken = getTokenStorage( 'slack_auth_token_info' )
          if(slackToken && slackToken!= '' && slackToken!= null && slackToken!= 'null' ) {
            let token = JSON.parse(slackToken)
            
            if(typeof token === 'string') {
              token = JSON.parse(token)
              setTokenStorage( 'slack_auth_token_info', token )
    
            }
            
            if(typeof token === 'object') {
              const { access_token } = token          
              if(access_token && access_token != '') {
                dispatch(getChannels(access_token))
              }
            }
          }      
        }
    }, [slack_channel_list, slack_channel_list_loading])


    /**
     * Find compoanies channel to add inidication to the list
     */

    useEffect(() => {
        const checkAssetChannel = async () => {
            if(companiesList.length > 0 && slack_channel_list.length > 0) {
                let findChannel = false, oldCompanies = [...companies.list]
                let name = ''
                const promises = slack_channel_list.map( channelAsset => {
                    name = ''
                    const findIndex = oldCompanies.findIndex(company => {
                        if(company.type == 1) {
                            const child = JSON.parse(company.child)
                            if(child.length > 0) {
                                const mapIndex = child.findIndex(childCompany => childCompany.representative_name.toString().replace(/ /g,'').toLowerCase() == channelAsset.name)
                                if(mapIndex !== -1) {
                                    name = channelAsset.name
                                    return true
                                }
                            }
                        } else {
                            if(company.representative_name.toString().replace(/ /g,'').toLowerCase() == channelAsset.name){
                                name = channelAsset.name
                                return true
                            }
                        }
                    })
                    if(findIndex !== -1) {
                        oldCompanies[findIndex]['channel'] = name
                        if(findChannel === false) {
                            findChannel = true
                        }
                    }
                })
                await Promise.all(promises)
                if(findChannel === true){
                    setCompaniesList(oldCompanies)
                } 
            } else {
                const oldCompanies = [...companies.list]
                const newArray = oldCompanies.map(({channel, ...keepOtherAttrs}) => keepOtherAttrs)
                setCompaniesList(newArray)
            }
        }    
        checkAssetChannel()
    },[ slack_channel_list, companies])

    /**
     * Get slack messages for selected company and if the screen is dashboard
     */


    useEffect(() => {        
                
        /**
         * If company selected find ChannelID
         */
        /* console.log("asdasdasd", selected.length, slack_channel_list.length, dashboardScreen) */
        if(selected.length > 0 && slack_channel_list.length > 0  &&  dashboardScreen === true ) {
            /* console.log("asdasdasd", selected.length, slack_channel_list.length, dashboardScreen) */
            let name = ''
            const findIndex = companiesList.findIndex( company => {
                if(company.type == 1) {
                    const child = JSON.parse(company.child)
                    const childIndex = child.findIndex(c => c.representative_id == selected[0] )
                    if(childIndex !== -1) {
                        name = child[childIndex].representative_name.toString().replace(/ /g,'').toLowerCase()
                        return true
                    }
                } else {
                    if(company.representative_id == selected[0]) {
                        name = company.representative_name.toString().replace(/ /g,'').toLowerCase()
                        return true
                    }
                }
            })
            
            if(findIndex !== -1 && name != '') {
                const channelID = findChannelID(name)
                if( channelID != '') {
                    dispatch(setChannelID({channel_id: channelID}))  
                    dispatch(getSlackMessages(channelID))                          
                }
            }
        }
    }, [slack_channel_list, companiesList, selected, dashboardScreen ])

    /**
     * if category is correct names then row should show radio button instead of checkboxes
     */

    useEffect(() => {
        if(selectedCategory === 'correct_names') {
            let headerColumns = [...COLUMNS]
            headerColumns[0].role = 'radio'
            headerColumns[0].selectedFromChild = false
            setHeaderColumns(headerColumns)
        } else {
            let headerColumns = [...COLUMNS]
            headerColumns[0].role = 'checkbox'
            headerColumns[0].selectedFromChild = true
            setHeaderColumns(headerColumns)
        }
    }, [selectedCategory])


    /**
     * Get user selected companies
     */

    useEffect(() => {
        let isSubscribed = true;
        const getSelectedCompanies = async() => {
            if( companies.list.length > 0 && selected.length == 0 && process.env.REACT_APP_ENVIROMENT_MODE != 'DASHBOARD') {
                /**
                 * Send Request to server
                 */
                let activeItems = [], parentChild = []
                companies.list.map(row => {
                    if(parseInt(row.type) === 1) {
                        const parseChild = JSON.parse(row.child_full_detail), parentChildIDs = JSON.parse(row.child)
                        parentChild.push({parent: parseInt(row.representative_id), child: [...parentChildIDs] })
                        const filters = parseChild.reduce((acc, item) => {
                            if (!acc) acc = [];  
                            if(item.status == 1){
                                acc.push(parseInt(item.representative_id))
                            }
                            return acc
                        }, [])
                        if(filters.length > 0) {
                            activeItems = [...activeItems, ...filters]
                        }
                    } else {
                        if(row.status == 1) {
                            activeItems.push(parseInt(row.representative_id))
                        }
                    }
                })
                const { data } = await PatenTrackApi.getUserCompanySelections();
                if(data != null && data.list.length > 0) {
                    let insert = false, oldItems = [], groups = []
                    if(selectedCategory === 'correct_names') { 
                        setSelectItems([data.list[0].representative_id])
                        dispatch(setMainCompaniesSelected([data.list[0].representative_id], []))
                    } else {
                        const promise =  data.list.map( representative => {
                            
                            /**
                             * If selected item is Group then select all the companies under group
                             */
                            if(parseInt(representative.type) === 1) {
                                groups.push(parseInt(representative.representative_id))
                                const parseChild = JSON.parse(representative.child)
                                if(parseChild.length > 0) {
                                    const filterItems = parseChild.filter(c => activeItems.includes(parseInt(c.representative_id)) ? parseInt(c.representative_id) : '')
                                    /* if(dashboardScreen === true) {
                                        oldItems = filterItems.length > 0 ? [parseInt(filterItems[0])] : []
                                    } else {                                       
                                        oldItems = [...oldItems, ...filterItems]
                                        oldItems = [...new Set(oldItems)]
                                    } */ 
                                    oldItems = filterItems.length > 0 ? [parseInt(filterItems[0])] : []                                   
                                }  
                            } else {
                                if(activeItems.includes(parseInt(representative.representative_id))) {
                                   /*  if(dashboardScreen === true) {
                                        oldItems = [parseInt(representative.representative_id)]
                                    } else {
                                        oldItems.push(parseInt(representative.representative_id))
                                    } */        
                                    oldItems = [parseInt(representative.representative_id)]                            
                                }
                            }
                        })
                        await Promise.all(promise)
                        //setSelectGroups(groups) 
                        if(isSubscribed) {
                            setSelectItems(oldItems)
                            dispatch(setMainCompaniesSelected(oldItems, groups))
                        }                        
                    } 
                } 
            }            
        }  
        if(isSubscribed) {
            getSelectedCompanies()    
        }            
        return () => (isSubscribed = false)
    }, [ companies.list ])
    


    useEffect(() => {   
        if(dashboard_share_selected_data != undefined && Object.keys(dashboard_share_selected_data).length > 0 && (process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI')) {
            let { selectedCompanies, tabs, customers } = dashboard_share_selected_data
            if(typeof selectedCompanies != 'undefined' && selectedCompanies != '') {
                try{
                    selectedCompanies = JSON.parse(selectedCompanies)
                    if(selectedCompanies.length > 0) {
                        setSelectItems(selectedCompanies)
                        dispatch(setMainCompaniesSelected(selectedCompanies, []))

                        (async () => {
                            const promise = companies.list.map((row, index) => {
                                if(!selectedCompanies.includes(row.representative_id)) {
                                    companies.list[index].status = 0
                                }
                            })
                            await Promise.all(promise)
                            dispatch(setMainCompanies(companies, { append: false }))
                        })()
    
                        if(typeof tabs != 'undefined' && tabs != '') {
                            dispatch( setAssetTypesSelect([tabs]) )
                        }
                        if(typeof customers != 'undefined' && customers != '') {
                            customers = JSON.parse(customers)
                            if(customers.length > 0) {
                                dispatch( setSelectAssignmentCustomers(customers) )
                            }
                        }
                    }                    
                } catch (e){
                    console.log(e)
                }
            }
        }
    }, [dashboard_share_selected_data, dispatch])

    /**
     * Get list of user activity
     */

    useEffect(() => {
        let isSubscribed = true;
        if((selectedCompaniesAll === true || selected.length > 0 ) && process.env.REACT_APP_ENVIROMENT_MODE != 'DASHBOARD') {
            if( assetTypesSelected.length === 0 && assetTypesSelectAll === false && selectedCategory == 'due_dilligence') {
                const getUserSelection = async () => {
                    const { data } = await PatenTrackApi.getUserActivitySelection()
                    if(isSubscribed) {
                        if(data != null && Object.keys(data).length > 0) {
                            dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
                            dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
                            dispatch( setAssetTypeInventor({ list: [], total_records: 0 }) )
                            dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
                            dispatch( setAssetTypesSelect([data.activity_id]) )
                            dispatch( setAllAssetTypes( false ) )
                        } else {
                            dispatch( setAssetTypesSelect([]) )
                            dispatch( setAllAssetTypes( true ) )
                        }
                    }
                }
                getUserSelection();   
            }
        }
        return () => (isSubscribed = false)
    }, [ dispatch, selectedCompaniesAll, selected])

    useEffect(() => {
        if( selectAll != undefined && selectAll === true && companies.list.length > 0 && intialization === false) {
            const all = [], groups = []
            companies.list.map( company => {
               
                if(company.type === 1) {
                    groups.push( company.representative_id )
                    const parseChild = JSON.parse(company.child)
                    if(parseChild.length > 0) {
                        all = [...all, ...parseChild]
                        all = [...new Set(all)]
                    }
                } else {
                    all.push( parseInt(company.representative_id) )                
                }
            })
            setSelectItems(all)
           // setSelectGroups(groups)
            setInitialization( true )
            dispatch( setMainCompaniesSelected( all, groups )) 
        }
    }, [ dispatch, selectAll, companies, intialization ])

    useEffect(() => {
        if( selectAll != undefined && (selectAll === false || selectAll === true )) {
            dispatch( setMainCompaniesAllSelected( selectAll ) ) 
        }
    }, [ dispatch, selectAll ])

    /**
     * If redux item is not equal to local selected items
     */

    useEffect(() => {
        if((selectItems.length == 0 || selectItems.length != selected.length) ){
            setSelectItems(selected)
        }
    }, [ selected, selectItems ])

    useEffect(() => {
        const getGroupItems = async() => {
            /* const groupList = companiesList.filter( company => parseInt(company.type) === 1)
            if(groupList.length > 0) {
                const groupItems = []
                const groupPromise = groupList.map(item => {
                    if(selectItems.includes(parseInt(item.representative_id))) {
                        groupItems.push(parseInt(item.representative_id))
                    }
                }) 
                await Promise.all(groupPromise)
                setSelectGroups(groupItems)
            } */
        }
        getGroupItems()
    }, [ selectItems ])


    const findChannelID = useCallback((name) => {
        let channelID = ''
        if(slack_channel_list.length > 0) {
          const findIndex = slack_channel_list.findIndex( channel => channel.name == name)
      
          if( findIndex !== -1) {
            channelID = slack_channel_list[findIndex].id
          }
        }
        return channelID
    }, [ slack_channel_list ])

    /**
     * Reset all items
     */

    const resetAll = () => {
        dispatch(setAssetTypes([]))
        dispatch(setAssetTypeCompanies({ list: [], total_records: 0 }))
        dispatch(setAssetTypeInventor({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
        dispatch(setMaintainenceAssetsList({list: [], total_records: 0}, {append: false}))
        dispatch(setAssetTypesPatentsSelected([]))
        dispatch(setAssetTypesPatentsSelectAll(false))
        dispatch(setAllAssignments(false))
	    dispatch(setSelectAssignments([]))	
        dispatch(setSelectAssignmentCustomers([]))
        dispatch(setAllAssignmentCustomers(false))
    }

    const clearOtherItems = () => {
        dispatch(setAssetsIllustration(null))
        dispatch(setAssetsIllustrationData(null))
        dispatch(setSelectedAssetsTransactions([]))
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setSlackMessages({messages: [], users: []}))
        dispatch(
            setPDFFile(
            { 
                document: '',  
                form: '', 
                agreement: '' 
            }
            )
        )
        dispatch(
            setPDFView(false)
        )
        dispatch(
            setConnectionBoxView(false)
        )
        dispatch(
            setConnectionData({})
        )
        dispatch(setAssetsIllustrationData(null))
	    dispatch(setAssetsIllustration(null)) 
        dispatch(toggleLifeSpanMode(true));
        dispatch(toggleFamilyMode(false));
        dispatch(toggleUsptoMode(false));
        dispatch(toggleFamilyItemMode(false));	
        dispatch( setAllAssetTypes( false ) )
        dispatch( setAssetTypesSelect([]))	
        dispatch( setAllAssignmentCustomers( false ) )
        dispatch( setSelectAssignmentCustomers([]))														
    }

    /**
     * Save user selections
     * @param {*} representativeIDs 
     */

    const updateUserCompanySelection = async(representativeIDs) => {
        const form = new FormData();
        form.append('representative_id', JSON.stringify(representativeIDs))
        const { status } = await PatenTrackApi.saveUserCompanySelection(form)
    }

    /**
     * 
     * @param {*} event 
     * @param {*} dispatch 
     * @param {*} row 
     * @param {*} checked 
     * @param {*} selected 
     * @param {*} defaultSelect 
     * @param {*} currentSelection 
     */
    const updateCompanySelection = async(event, dispatch, row, cntrlKey, selected, defaultSelect, currentSelection) => {
        if(cntrlKey !== undefined) {
            let updateSelected = [...selected], sendRequest = false , updateGroup = [...selectedGroup] 
            if(!updateSelected.includes(parseInt( row.representative_id ))) {
                if(selectedCategory === 'correct_names') { 
                    if(parseInt(row.type) === 1) {
                        if(row.child_total > 0) {
                            const parseChild = JSON.parse(row.child)
                            if(dashboardScreen === true) {
                                updateSelected = [parseChild[0]]
                            } else {
                                updateSelected = [...updateSelected, ...parseChild]
                                updateSelected = [...new Set(updateSelected)]
                            }                            
                        }
                    }  else {
                        updateSelected = [parseInt(row.representative_id)]
                    }                  
                } else {                    
                    if(parseInt(row.type) === 1) {
                        if(row.child_total > 0 || row.representative_id == childID) {
                            const parseChild =  typeof row.child != 'undefined' ? JSON.parse(row.child) : childList
                            if(dashboardScreen === true) {
                                updateSelected = [parseInt( parseChild[0] )]
                            } else {
                                updateSelected = [parseInt( parseChild[0] )]
                                /* if(!updateSelected.includes(parseInt(parseChild[0]))) {
                                    updateSelected = [...updateSelected, ...parseChild]
                                    updateSelected = [...new Set(updateSelected)]
                                } else {
                                    const childFilterPromise = parseChild.map( child => {
                                        updateSelected = updateSelected.filter(
                                            existingCompany => parseInt(existingCompany) !== parseInt( child )
                                        )
                                    })
                                    await Promise.all(childFilterPromise)
                                }  */  
                            }
                                                     
                        }   
                        //updateGroup.push(parseInt(row.representative_id))
                    } else {
                        if(dashboardScreen === true) {
                            updateSelected = [parseInt( row.representative_id )]
                        } else {
                            updateSelected.push(parseInt( row.representative_id ))
                        }
                        
                    }
                }                
            } else {
                if(dashboardScreen === true) {
                    updateSelected = []
                } else {
                    updateSelected = updateSelected.filter(
                        existingCompany => parseInt(existingCompany) !== parseInt( row.representative_id )
                    )
                }
                
            }
            history.push({
                hash: updateHashLocation(location, 'companies', updateSelected).join('&')
            })
            dispatch(setMainCompaniesRowSelect([]))
            setSelectItems(updateSelected)
            //setSelectGroups(updateGroup)
            updateUserCompanySelection(updateSelected)
            dispatch( setMainCompaniesSelected( updateSelected, updateGroup ) ) 
            dispatch( setNamesTransactionsSelectAll( false ) )
            dispatch( setSelectedNamesTransactions([]) )
            dispatch( setMainCompaniesAllSelected( updateSelected.length === totalRecords ? true : false ) )
            dispatch(setCPCRequest(false))
            dispatch(setJurisdictionRequest(false))
            dispatch(setTimelineRequest(false))
            dispatch(setTimelineData([]))
            dispatch(setCPCData({list:[], group: [], sales: []}))
            dispatch(setCPCSecondData({list:[], group: [], sales: []}))
            dispatch(setLineChartReset())
            dispatch(setJurisdictionData([]))
            resetAll() 
            clearOtherItems()
        } else {
            if(row.status == 1) {
                if(parseInt(row.type) === 1) {
                    if(currentSelection != row.representative_id) {
                        setCurrentSelection(row.representative_id)
                    } else { 
                        setCurrentSelection(null)
                    }
                } else {
                    const element = event.target.closest('div.ReactVirtualized__Table__rowColumn')
                    let index = -1
                    if(element !== null ) {
                        index = element.getAttribute("aria-colindex");
                    } 
                    if(index == 2) {
                        if(currentSelection != row.representative_id) {
                            setCurrentSelection(row.representative_id)
                        } else { 
                            setCurrentSelection(null)
                        }
                    } else {
                        const updateSelected = [parseInt(row.representative_id)]
                        dispatch(setMainCompaniesRowSelect([]))
                        setSelectItems(updateSelected)
                        //setSelectGroups(updateGroup)
                        updateUserCompanySelection(updateSelected)
                        dispatch( setMainCompaniesSelected( updateSelected, [] ) ) 
                        dispatch( setNamesTransactionsSelectAll( false ) )
                        dispatch( setSelectedNamesTransactions([]) )
                        dispatch( setMainCompaniesAllSelected( updateSelected.length === totalRecords ? true : false ) )
                        dispatch(setCPCRequest(false))
                        dispatch(setJurisdictionRequest(false))
                        dispatch(setTimelineRequest(false))
                        dispatch(setTimelineData([]))
                        dispatch(setCPCData({list:[], group: [], sales: []}))
                        dispatch(setCPCSecondData({list:[], group: [], sales: []}))
                        dispatch(setLineChartReset())
                        dispatch(setJurisdictionData([]))
                        resetAll() 
                        clearOtherItems()
                    } 
                }
            }          
        }
    } 

   /**
    * Click on row
    */

    const handleClickRow = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        let cntrlKey = event.ctrlKey ? event.ctrlKey : event.metaKey ? event.metaKey : undefined;
        if(cntrlKey !== undefined) {
            if(display_clipboard === false) {
                dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
                dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
            }
        } 
        if(dashboardScreen === true) {
            checkChartAnalytics(null, null, false)
        }
        updateCompanySelection(event, dispatch, row, cntrlKey, selected, defaultSelect, currentSelection)
    }, [ dispatch, selected, display_clipboard, currentSelection ])

    /**
     * Select / Unselect All checkbox
     */
    
    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
        dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
        resetAll()
        setSelectItems([])
        dispatch( setMainCompaniesSelected([], []) )            
        clearOtherItems()
        dispatch( setMainCompaniesAllSelected( false ) )
        /* if(checked === false) {
            setSelectItems([])
            dispatch( setMainCompaniesSelected([], []) )            
            clearOtherItems()
        } else if( checked === true ){
            if(selectedCategory !== 'correct_names') {
                if(companies.list.length > 0) {
                    let items = [], groups = []
                    companies.list.forEach( async company => {
                        
                        if( parseInt(company.type) === 1 ) {
                            //groups.push(company.representative_id)
                            let parseChild = JSON.parse(company.child)                            
                            if(parseChild.length > 0) {                                
                                parseChild = parseChild.filter(child => child.status === 1 ? child : '')
                                items = [...items, ...parseChild]                               
                                items = [...new Set(items)]       
                            }
                        } else {
                            if(company.status === 1) {
                                items.push(parseInt(company.representative_id))
                            }
                        }
                    })
                    setSelectItems(items)
                    //setSelectGroups(groups)
                    dispatch( setMainCompaniesSelected(items, groups) )
                } 
            }            
        } 
        dispatch( setMainCompaniesAllSelected( checked ) ) */
    }, [ dispatch, companies ]) 

    const handleOnClickLoadMore = useCallback(() => {
        dispatch(fetchParentCompanies( offset + DEFAULT_CUSTOMERS_LIMIT, sortField, sortOrder ))
        setOffset(currOffset => (currOffset + DEFAULT_CUSTOMERS_LIMIT))
    }, [ dispatch, offset])

    /**
     * Resize name column width
     */

    const resizeColumnsWidth = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )
        if( findIndex !== -1 ) {
            previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
            previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
            if(findIndex === 2) {
                setCompanyColWidth(previousColumns[findIndex].width)
            }
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

    const resizeColumnsStop = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )
        if( findIndex !== -1 ) {
            previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width 
            if(findIndex === 2) {
                setCompanyColWidth(previousColumns[findIndex].width)
            }
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

    const handleChildCallback = useCallback((items, groups) => {        
        //setSelectGroups([...groups])
        setSelectItems([...items])
        if(selectedGroups.length != groups.length) {
            dispatch(setMainCompaniesSelected([...new Set(items)], [...new Set(groups)]))
        }
    }, [dispatch, selectedGroups])

    const handleSortData = (direction, column) => {
        setSortField(column)
        setSortOrder(direction)

    }

    const onScrollTable = (scrollPos) => {
        dispatch(setCompanyTableScrollPos(scrollPos))   
    }

    if (isLoadingCompanies && companies.list.length == 0) return <Loader />

  return (
    <Paper className={classes.root} square id={`main_companies`}>
        <VirtualizedTable
        classes={classes}
        scrollTop={companyTableScrollPosition}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedIndex={currentSelection}
        selectedKey={'representative_id'} 
        selectedGroup={selectedGroup} 
        scrollToIndex={true}       
        rows={companiesList}
        rowHeight={rowHeight}  
        headerHeight={headerRowHeight}
        columns={headerColumns}
        totalRows={totalRecords}
        onSelect={handleClickRow}
        onSelectAll={handleSelectAll}
        defaultSelectAll={selectedCompaniesAll}
        resizeColumnsWidth={resizeColumnsWidth}
        resizeColumnsStop={resizeColumnsStop}
        /* sortDataLocal={false}
        sortDataFn={handleSortData} */
        onScrollTable={onScrollTable}
        collapsable={true}
        childHeight={childHeight}
        childSelect={childSelected}
        childRows={childList}
        /* childCounterColumn={`child_total`} */
        forceChildWaitCall={true}
        renderCollapsableComponent={
            <ChildTable parentCompanyId={currentSelection} headerRowDisabled={true} itemCallback={handleChildCallback} groups={selectedGroup} companyColWidth={companyColWidth} isMobile={isMobile} reset={resetAll} cleared={clearOtherItems}/>
        }
        disableRow={true}
        disableRowKey={'status'}  
        /* defaultSortField={`original_name`}
        defaultSortDirection={`desc`} */
        responsive={true}
        noBorderLines={true}
        width={width} 
        containerStyle={{ 
            width: '100%',
            maxWidth: '100%' 
        }}
        style={{
            width: '100%'
        }}/>
    </Paper> 
  )
}

export default MainCompaniesSelector