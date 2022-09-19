import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@mui/material'
import moment from  'moment'
import clsx from 'clsx'
import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'
import { numberWithCommas } from '../../../utils/numbers'
import {
    getCustomerActivites,
    setAssetTypes,
    setAllAssetTypes,
    setAssetTypesSelect,
    setSelectedAssetsPatents,
    setSelectedAssetsTransactions,
    setAssetsIllustration,
    setAssetTypeSelectedRow,
    setAssetTypeCustomerSelectedRow,
    setMainCompaniesRowSelect,
    setAssetTypeChildCustomerSelectedRow,
    setAssetTypeChildCustomerSelected,
    setChildSelectedAssetsTransactions,
    setChildSelectedAssetsPatents,
    setMaintainenceAssetsList,
    setAssetTypeAssignmentAllAssets,
    setAssetTypeAssignments,
    setAssetTypeInventor,
    setAssetTypeCompanies
} from '../../../actions/patentTrackActions2'

import {
    setConnectionBoxView, 
    setPDFView,
} from '../../../actions/patenTrackActions'

import {
    assetsTypesWithKey,
    convertTabIdToAssetType,
    otherGroup,
    financingGroup,
    licensingGroups,
    ownershipGroups,
    employeesGroups
  } from '../../../utils/assetTypes'

import PatenTrackApi from '../../../api/patenTrack2'
import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import {
    updateHashLocation
} from '../../../utils/hashLocation'

import Loader from '../Loader'
import ChildTable from './ChildTable' 

const AssignmentsType = ({parentBarDrag, parentBar, isMobile }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ headerRowHeight, setHeaderRowHeight] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ childHeight, setChildHeight ] = useState(500)
    const [ width, setWidth ] = useState( 800 )
    const tableRef = useRef()
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ grandTotal, setGrandTotal ] = useState( 0 )
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ childSelected, setCheckedSelected] = useState( 0 )
    const [ typeData, setTypeData ] = useState( [] )
    const [ currentSelection, setCurrentSelection] = useState(null)
    const assetTypes = useSelector(state => state.patenTrack2.assetTypes.list)
    
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    
    const assetTypesLoading = useSelector(state => state.patenTrack2.assetTypes.loading)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    
    const assetTypeCompaniesList = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    const profile = useSelector(store => (store.patenTrack.profile))
    const tabs = [1,2,6,7,3,4,81,8,9,15,14,10,17] 
    /* const tabs = [1,2,6,7,3,4,5,11,12,13,8,9,15,14,10,16]  */
    /*const tabs = [1,2,6,7,3,4,5,11,12,13,8,9,15,14]*/

    const COLUMNS = [        
        {
          width: 10,
          minWidth: 10,
          label: '',
          dataKey: 'tab_id',
          role: 'none',
          disableSort: true,
          enable: false
        },
        {
            width: 25,
            minWidth: 25,
            label: '',
            dataKey: 'icon',
            headingIcon: 'activities', 
            role: 'image',
            imageURL: 'imageURL',
            disableSort: true, 
            extension: false
        },
        /* {
            width: 15,
            minWidth: 15,
            label: '', 
            dataKey: 'tab_id',
            role: 'arrow',
            disableSort: true
        }, */
        {
            width: isMobile === true ? 150 : 100,
            minWidth: isMobile === true ? 150 : 100,
            label: 'Activities', 
            dataKey: 'tab_name', 
            badge: true,              
        },
        {
            width: 80,
            label: 'Parties',
            dataKey: 'customer_count', 
            staticIcon: '',
            format: numberWithCommas,
            align: 'center',
            showGrandTotal: true,              
        }
    ]

    useEffect(() => {        
        if((selectedCompaniesAll === true || selectedCompanies.length > 0 ) && assetTypes.length == 0) {
            dispatch(
                getCustomerActivites(
                    selectedCategory == '' ? '' : selectedCategory,
                    selectedCompaniesAll === true ? [] : selectedCompanies
                )
            )
        } else if(selectedCompaniesAll === false && selectedCompanies.length == 0 ) {
            dispatch( setAssetTypes([]) )

        }
    }, [ dispatch, selectedCompaniesAll, selectedCompanies ])


    useEffect(() => {
        /* if(assetTypes.length > 0) {
            fillTable()
        } */
        fillTable()
    }, [ assetTypes ])

    const fillTable = () => {
        const list = [], updateActivities = [...assetsTypesWithKey]
        tabs.forEach( tab => {
            
            const assetType = convertTabIdToAssetType(tab)
            const findNameIndex = updateActivities.findIndex( activity => activity.type == assetType )
            
            let image = '';
            switch(parseInt(tab)) {
                case 1:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/acquisition.svg'
                    break;
                case 2:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/sales.svg'
                    break;
                case 3:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/licensein.svg'
                    break;
                case 4:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/licenseout.svg'
                    break;
                case 81:
                case 5:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/secure.svg'
                    break;
                case 6:
                    image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerin.png'
                    break;
                case 7:
                    image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerout.png'
                    break;
                case 8:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/options.svg'
                    break;
                case 9:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/courtorder.svg'
                    break;
                case 10:
                    image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png'
                    break;
                case 11:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/release.svg'
                    break;
                case 12:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/secure.svg'
                    break;
                case 13:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/secure.svg'
                    break;
                case 15:
                    image =  'https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/correction.svg'
                    break;
                case 14:
                default:
                    image =  'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png'
                    break;
            }
            
            let item = {
                        tab_id: tab, 
                        customer_count: 0, 
                        icon: '',
                        imageURL: image,
                        tab_name: findNameIndex >= 0 ? updateActivities[findNameIndex].name : assetType, 
                        children: [], 
                        /* background: backgroundRowColor */
                    }
            if(assetTypes.length > 0) {
                if(tab === 17) {
                    /**
                     * Temporary add 
                     */
                    const listData = [];
                    [1, 6].forEach( i => {
                        const findIndex = assetTypes.findIndex( aTab => aTab.tab_id == i )
                        if(findIndex >= 0) {   
                            listData.push(assetTypes[findIndex])      
                        }
                    })
                    if(listData.length > 0) {
                        let totalTransactions = 0, customer_count = 0;
                        listData.forEach( row => {
                            totalTransactions +=  parseInt(row.totalTransactions)
                            customer_count +=  parseInt(row.customer_count)
                        })
                        item = {...item, totalTransactions, customer_count}
                    }
                } else {
                    const findIndex = assetTypes.findIndex( aTab => aTab.tab_id == tab )
                    if(findIndex >= 0) {                    
                        item = {...item, ...assetTypes[findIndex]}
                    }
                }
               
                setGrandTotal(assetTypes[assetTypes.length - 1].grand_total)
            }
            list.push(item)
        })
        
        if(assetTypes.length == 0 ) {
            if(selectItems.length > 0 || assetTypesSelected.length > 0) {
                setSelectItems([])
                setSelectedRow([])
                dispatch( setAssetTypesSelect([]) )
            }           
        } else {
            if( assetTypesSelected.length === 0 && assetTypesSelectAll === false ) {
                if(profile.user.organisation.organisation_type == 'Bank') {
                    dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
                    dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
                    dispatch( setAssetTypeInventor({ list: [], total_records: 0 }) )
                    dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
                    setSelectItems([5, 81])
                    setSelectedRow([5, 81])
                    dispatch( setAssetTypesSelect([5, 81]) )
                } else {
                    const getUserSelection = async () => {
                        const { data } = await PatenTrackApi.getUserActivitySelection()
                        if(data != null && Object.keys(data).length > 0) {
                            
                            const findIndex = assetTypes.findIndex( aTab => aTab.tab_id == data.activity_id )
        
                            if(findIndex !== -1 ) {                            
                                dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
                                dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
                                dispatch( setAssetTypeInventor({ list: [], total_records: 0 }) )
                                dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
                                setSelectItems([data.activity_id])
                                setSelectedRow([data.activity_id])
                                dispatch( setAssetTypesSelect([data.activity_id]) )
                            } else {
                                selectedAllActiveItems()
                            }
                        } else {
                            selectedAllActiveItems()
                        }
                    }
                    getUserSelection();   
                }
            } else {
                if( assetTypesSelected.length > 0 ) {
                    setSelectItems(assetTypesSelected)
                    setSelectedRow(assetTypesSelected) /**Only one row selection in this component */
                } else if (assetTypesSelectAll === true) {
                    selectedAllActiveItems()
                }
            }                     
        } 
        setTypeData(list)
    }   

    const selectedAllActiveItems = useCallback(async() => {
        if (assetTypesSelectAll === false || assetTypesSelected.length == 0) {
            setSelectAll(true)
            dispatch( setAllAssetTypes( true ) )
            setSelectedRow([])
            setCurrentSelection(null)
            const selectedItems = []
            const promise = assetTypes.map(row => row.tab_id !== 10 ? selectedItems.push(row.tab_id) : '')
            await Promise.all(promise)
            setSelectItems(selectedItems)
            dispatch( setAssetTypesSelect(selectedItems) )
        }
    },[dispatch, assetTypesSelectAll, assetTypes, assetTypesSelected])

    const onHandleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        if (assetTypesSelectAll === false) {
            selectedAllActiveItems()
        } else {
            setSelectAll(false)
            setSelectItems([])  
            setSelectedRow([])  
            setCurrentSelection(null)
            dispatch( setAllAssetTypes( false ) )    
        }
        dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
        dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
        dispatch( setAssetTypeInventor({ list: [], total_records: 0 }) )
        dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
        deleteAssetTypeSelected(0)
    }, [ dispatch, assetTypes ])  

    const onHandleClickRow = useCallback((e,  row, t) => {
        e.preventDefault()
        const { checked } = e.target;
        //let oldSelection = [...selectItems]
        if(row.customer_count > 0) {
            if(display_clipboard === false) {
                dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
                dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
            }
            dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
            dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
            dispatch( setAssetTypeInventor({ list: [], total_records: 0 }) )
            history.push({
                hash: updateHashLocation(location, 'activities', [row.tab_id]).join('&')
            })
            if(!selectItems.includes(row.tab_id) || assetTypesSelectAll === true) {
                setSelectItems([row.tab_id])
                setSelectedRow([row.tab_id])
                setSelectAll(false)
                dispatch( setAllAssetTypes( false ) )
                dispatch( setAssetTypesSelect([row.tab_id]) )
                updateAssetTypeSelected( row.tab_id )
                setCurrentSelection(row.tab_id)
            } else {
                deleteAssetTypeSelected( row.tab_id )
                selectedAllActiveItems()
            }

            /* if( checked !== undefined) {
                if(display_clipboard === false) {
                    dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
                    dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
                }
                dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
                dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
                dispatch( setAssetTypeInventor({ list: [], total_records: 0 }) )
                history.push({
                    hash: updateHashLocation(location, 'activities', [row.tab_id]).join('&')
                })
                if(!selectItems.includes(row.tab_id)) {
                    setSelectItems([row.tab_id])
                    setSelectAll(false)
                    dispatch( setAllAssetTypes( false ) )
                    dispatch( setAssetTypesSelect([row.tab_id]) )
                    updateAssetTypeSelected( row.tab_id )
                } else {
                    setSelectItems([])
                    dispatch( setAssetTypesSelect([]) )
                    deleteAssetTypeSelected( row.tab_id )
                }                
            } else {                
                const element = e.target.closest('div.ReactVirtualized__Table__rowColumn')
                const index = element.getAttribute('aria-colindex')
                if(index == 2) {
                    if(currentSelection != row.tab_id) {
                        setCurrentSelection(row.tab_id)
                    } else { 
                        setCurrentSelection(null)
                    }
                } 
            } */
        }
    }, [ dispatch, selectItems, currentSelection, display_clipboard ]) 

    const updateAssetTypeSelected = async(activityID) => {
        const form = new FormData();
        form.append('activity_id', activityID)

        const { status } = await PatenTrackApi.updateAssetTypeSelected(form)
    } 

    const deleteAssetTypeSelected = async(activityID) => {
        const form = new FormData(); 
        form.append('activity_id', activityID)
        const { status } = await PatenTrackApi.deleteAssetTypeSelected(form)
    } 

    const getTimelineData = (dispatch, tab_id) => {
        parentBarDrag(0)
        parentBar(false)
        setSelectedRow([tab_id])
        
        dispatch(setAssetTypeSelectedRow([tab_id]))
        dispatch(setAssetsIllustration(null))
        dispatch(setConnectionBoxView( false ))
        dispatch(setPDFView( false ))
        dispatch(toggleUsptoMode( false ))
        dispatch(toggleFamilyMode( false ))
        dispatch(toggleFamilyItemMode( false )) 
        dispatch(setMainCompaniesRowSelect([]))
        dispatch(setChildSelectedAssetsTransactions([]))
        dispatch(setAssetTypeChildCustomerSelectedRow([]))
        dispatch(setAssetTypeCustomerSelectedRow([]))
        dispatch(setSelectedAssetsTransactions([]))        
        dispatch(setChildSelectedAssetsPatents([]))       
        dispatch(setSelectedAssetsPatents([]))
    }

    if (assetTypesLoading && typeData.length == 0) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_type`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedIndex={currentSelection}
            selectedKey={'tab_id'}
            rows={typeData}
            rowHeight={rowHeight}
            headerHeight={headerRowHeight}
            columns={COLUMNS}
            onSelect={onHandleClickRow}
            onSelectAll={onHandleSelectAll}
            defaultSelectAll={selectedAll}
            backgroundRow={true}
            backgroundRowKey={`background`}
            disableRow={true}
            disableRowKey={'customer_count'}
            totalRows={assetTypes.length}
            grandTotal={grandTotal}
            responsive={true}
            /* collapsable={true}
            childHeight={childHeight}
            childSelect={childSelected}
            childRows={assetTypeCompaniesList}
            showIsIndeterminate={true}
            renderCollapsableComponent={<ChildTable assetType={currentSelection} headerRowDisabled={true} parentBarDrag={parentBarDrag} parentBar={parentBar}/>} */
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


export default AssignmentsType;