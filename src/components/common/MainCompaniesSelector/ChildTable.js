import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@mui/material'
import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import PatenTrackApi from '../../../api/patenTrack2'
import {
    setMainChildCompanies,
    setMainCompaniesSelected,
    setMainCompaniesRowSelect,
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
    setSelectedNamesTransactions
} from '../../../actions/patentTrackActions2'

import {
    setPDFView,
    setPDFFile
  } from "../../../actions/patenTrackActions";

import {
    toggleUsptoMode, 
    toggleFamilyMode,
    toggleFamilyItemMode,
    toggleLifeSpanMode
  } from "../../../actions/uiActions";

import {
    updateHashLocation
} from '../../../utils/hashLocation' 


import { numberWithCommas } from '../../../utils/numbers'

import Loader from '../Loader'

const COLUMNS = [ 
    {
        width: 29,
        minWidth: 29,
        label: '',
        dataKey: 'representative_id',
        role: 'checkbox',
        disableSort: true
    },
    {
        width: 171,  
        minWidth: 171,
        oldWidth: 171,
        draggable: true,
        label: 'Companies',        
        dataKey: 'original_name',
        align: "left", 
        badge: true
    },
    {
        width: 80,  
        minWidth: 80, 
        label: 'Acitivites',
        staticIcon: '',
        dataKey: 'no_of_activities',
        format: numberWithCommas,
        styleCss: true,
        justifyContent: 'flex-end'
    },
    {
        width: 80,   
        minWidth: 80,
        label: 'Parties',
        staticIcon: '',
        dataKey: 'no_of_parties',
        format: numberWithCommas,
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
        styleCss: true,
        justifyContent: 'flex-end'
    },
    {
        width: 80,  
        minWidth: 80,
        label: 'Arrows',
        dataKey: 'product',
        staticIcon: '',
        format: numberWithCommas,
        styleCss: true,
        justifyContent: 'flex-end'
    }
]

const ChildTable = ({ parentCompanyId, headerRowDisabled, itemCallback, groups, companyColWidth }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 1900 )
    const tableRef = useRef()
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ childCompaniesLoading, setChildCompaniesLoading] = useState( true )
    const [ companies, setChildCompanies] = useState( [] )
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const selected = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const mainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.list )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const oldChildCompany = useSelector( state => state.patenTrack2.mainCompaniesList.childID )
    const oldChildList = useSelector( state => state.patenTrack2.mainCompaniesList.child_list )

    useEffect(() => {
        if(selectedCategory === 'correct_names') {
            let headerColumns = [...COLUMNS]
            headerColumns[0].role = 'radio'
            setHeaderColumns(headerColumns)
        } else {
            let headerColumns = [...COLUMNS]
            headerColumns[0].role = 'checkbox'
            setHeaderColumns(headerColumns)
        }
    }, [selectedCategory])

    useEffect(() => {
        if(companyColWidth !== 171) {
            let headerCol = [...headerColumns]
            headerCol[1].width = companyColWidth
            headerCol[1].minWidth = companyColWidth
            headerCol[1].oldWidth = companyColWidth
            setHeaderColumns(headerCol)
        }
    }, [companyColWidth])

    useEffect(() => {
        if(selectedCompaniesAll === false) {
            setSelectItems([])
        }
    }, [selectedCompaniesAll])
       
    useEffect(() => {
        const getChildCompanies = async () => {            
            if( parentCompanyId > 0 ) { 
                if( oldChildCompany !== parentCompanyId || (parentCompanyId === oldChildCompany && oldChildList.length === 0) ) {
                    setChildCompaniesLoading( true )
                    PatenTrackApi.cancelChildCompanies()
                    const { data } = await PatenTrackApi.getChildCompanies(parentCompanyId)
                    dispatch(
                        setMainChildCompanies(parentCompanyId, data.list)
                    )
                    setChildCompanies(data.list)
                    if(selected.includes(parentCompanyId)){
                        checkedAllChildCompanies(data.list)
                    }
                    setChildCompaniesLoading( false )                    
                } else {  
                    setChildCompaniesLoading( false )              
                    setChildCompanies(oldChildList)
                    if(selected.includes(parentCompanyId)){
                        checkedAllChildCompanies(oldChildList)
                    }
                }                
            } else {
                setChildCompaniesLoading( false )
            }
        }
        getChildCompanies()
    }, [ dispatch, parentCompanyId, oldChildList,  oldChildCompany])

    useEffect(() => {
        if(selectItems.length != selected.length) {
            setSelectItems([...new Set(selected)])
        }
    }, [selected])
    
    /**
     * it parent is selected then select all the items
     */

    /* const checkAllChildCompany = async(list, items) => {
        if(selectItems.length > 0 && list.length > 0 && selectedCategory !== 'correct_names') { 
            let oldSelected = items.length > 0 ? [ ...new Set(items)] : [...new Set(selectItems)]
            console.log('oldSelected', oldSelected)
            //Check All childs selected
            let included = true
            const promiseCheck = list.map( item => {
                if(!oldSelected.includes(item.representative_id)) {
                    included = false
                }
            })
            await Promise.all(promiseCheck)
            if(included === true && !oldSelected.includes(parseInt(parentCompanyId))) {                   
                oldSelected.push(parseInt(parentCompanyId))
                dispatch( setMainCompaniesSelected( oldSelected ) ) 
                groupCallBack(prevItems =>
                    prevItems.includes(parseInt(parentCompanyId))
                    ? prevItems.filter(item => item !== parseInt(parentCompanyId))
                    : [...prevItems, parseInt(parentCompanyId)],
                );
            } else {
                if(oldSelected.includes(parseInt(parentCompanyId))){
                    groupCallBack(prevItems =>
                        prevItems.includes(parseInt(parentCompanyId))
                        ? prevItems.filter(item => item !== parseInt(parentCompanyId))
                        : [...prevItems, parseInt(parentCompanyId)],
                    );
                }
            }
        }
    } */


    const onHandleSelectAll = useCallback((event, row) => {
        
    }, [ dispatch ])

    const checkedAllChildCompanies = async(list) => {
        const oldSelection = [...selected], childItems = [], findChildOldSelections = []
        
        const listPromise = list.map( row => {
            if(!oldSelection.includes(parseInt( row.representative_id ))) {
                oldSelection.push(row.representative_id)
            } else {
                findChildOldSelections.push(parseInt( row.representative_id ))
            }
            childItems.push(row.representative_id)
        })
        await Promise.all(listPromise) 
        if(findChildOldSelections.length === 0) {
            setSelectItems(childItems)
            let group = [...groups, parseInt(parentCompanyId)]
            dispatch( setMainCompaniesSelected( oldSelection, [...new Set(group)] ) ) 
        } else {
            setSelectItems(findChildOldSelections)
        }        
    }

    const handleClickRow = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        if(checked != undefined) {
            if(display_clipboard === false) {
                dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
                dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
            }
        } 
        updateCompanySelection(event, dispatch, row, checked, selectItems)
    }, [ dispatch, selectItems, display_clipboard ])

    /**
     * Save user selections
     * @param {*} representativeIDs 
     */

    const updateUserCompanySelection = async(representativeIDs) => {
        const form = new FormData();
        form.append('representative_id', JSON.stringify(representativeIDs))
        const { status } = await PatenTrackApi.saveUserCompanySelection(form)
    }

    const updateCompanySelection = (event, dispatch, row, checked, selected) => {
        if(checked != undefined) {
            let updateSelected = [...selected]
            if(!updateSelected.includes(parseInt( row.representative_id ))) {
                if(selectedCategory === 'correct_names') {
                    updateSelected = [parseInt(row.representative_id)]
                } else {
                    updateSelected.push(parseInt( row.representative_id ))
                }                
            } else {
                updateSelected = updateSelected.filter(
                    existingCompany => existingCompany !== parseInt( row.representative_id ) 
                )

                updateSelected = updateSelected.filter(
                    existingCompany => existingCompany !== parseInt( parentCompanyId ) 
                )    
            }
            history.push({
                hash: updateHashLocation(location, 'companies', updateSelected).join('&')
            })
            dispatch(setMainCompaniesRowSelect([]))
            resetAll()
            if(updateSelected.length === 0 ) {
                clearOtherItems()
            }            
            
            let included = true
            companies.forEach( item => {
                if(!updateSelected.includes(item.representative_id)) {
                    included = false
                    return false
                } 
            })
            let group = [...groups]
            if(included === true && !updateSelected.includes(parseInt(parentCompanyId))) {            
                //updateSelected.push(parseInt(parentCompanyId))
                group.push(parseInt(parentCompanyId))
            } else {
                if(updateSelected.includes(parseInt(parentCompanyId))){
                    if(group.includes(parseInt(parentCompanyId))){ 
                        const findIndex = group.findIndex( item => parseInt(item) === parseInt(parentCompanyId))
                        if(findIndex !== -1) {
                            group.splice(findIndex, 1)
                        }
                    }                    
                }
            }
            setSelectItems(updateSelected)
            itemCallback(updateSelected, groups)
            //checkAllChildCompany(companies, updateSelected)
            updateUserCompanySelection(updateSelected)
            dispatch( setMainCompaniesSelected( updateSelected, [...new Set(group)] ) )     
            dispatch( setNamesTransactionsSelectAll( false ) )
            dispatch( setSelectedNamesTransactions([]) )
        }
    }   

    const resetAll = () => {
        dispatch(setAssetTypes([]))
        dispatch(setAssetTypeCompanies({ list: [], total_records: 0 }))
        dispatch(setAssetTypeInventor({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
    }

    const clearOtherItems = () => {
        dispatch(setAssetsIllustration(null))
        dispatch(setAssetsIllustrationData(null))
        dispatch(setSelectedAssetsTransactions([]))
        dispatch(setSelectedAssetsPatents([]))
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
        dispatch(toggleLifeSpanMode(true));
        dispatch(toggleFamilyMode(false));
        dispatch(toggleUsptoMode(false));
        dispatch(toggleFamilyItemMode(false));	
        dispatch( setAllAssetTypes( false ) )
        dispatch( setAssetTypesSelect([]))	
        dispatch( setAllAssignmentCustomers( false ) )
        dispatch( setSelectAssignmentCustomers([]))														
    }

    if (childCompaniesLoading) return <Loader /> 

    return (
        <Paper className={classes.root} square id={`child_companies`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedKey={'representative_id'}
            disableRow={true}
            disableRowKey={'status'}  
            rows={companies}
            rowHeight={rowHeight}
            headerHeight={rowHeight} 
            columns={headerColumns}
            defaultSelectAll={selectedAll}
            onSelect={handleClickRow}
            onSelectAll={onHandleSelectAll}
            disableHeader={headerRowDisabled} 
            responsive={false}
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


export default ChildTable