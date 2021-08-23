import React, { useCallback, useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@material-ui/core'
import useStyles from './styles' 
import _orderBy from 'lodash/orderBy' 
import VirtualizedTable from '../VirtualizedTable'

import {
    fetchParentCompanies,
    setMainCompaniesSelected,
    setMainCompaniesAllSelected,
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

import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import PatenTrackApi from '../../../api/patenTrack2'

import { numberWithCommas } from '../../../utils/numbers'

import {
    updateHashLocation
} from '../../../utils/hashLocation' 

import ChildTable from './ChildTable'

import Loader from '../Loader'
import { resetAllRowSelect } from '../../../utils/resizeBar'

const COLUMNS = [
    {
        width: 29,
        minWidth: 29,
        label: '',
        dataKey: 'representative_id',
        role: 'checkbox',
        selectedFromChild: true,     
        disableSort: true,
        show_selection_count: true,
        /* showOnCondition: '1' */

    },
    {
        width: 20,
        minWidth: 20,
        label: '',
        dataKey: 'representative_id',
        headingIcon: 'company',
        role: "arrow",
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
        badge: true,
    },
    {
        width: 80,  
        minWidth: 80, 
        label: 'Acitivites',
        staticIcon: '',
        dataKey: 'no_of_activities',
        format: numberWithCommas,
        style: true,
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
        style: true,
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
        style: true,
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
        style: true,
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
        style: true,
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
        style: true,
        justifyContent: 'flex-end'
    }
] 

const MainCompaniesSelector = ({selectAll, defaultSelect, addUrl, parentBarDrag, parentBar}) => {

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
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ currentSelection, setCurrentSelection ] = useState(null)   
    const [ intialization, setInitialization ] = useState( false ) 
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ companiesList, setCompaniesList ] = useState([])
    const companies = useSelector( state => state.patenTrack2.mainCompaniesList )
    const isLoadingCompanies = useSelector( state => state.patenTrack2.mainCompaniesLoadingMore )
    const selected = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)

    useEffect(() => {
        const initCompanies = async () => {
            dispatch(fetchParentCompanies( offset ) )
        } 
        initCompanies()
    }, []) 

    useEffect(() => {
        setCompaniesList( companies.list )
    }, [ companies.list ])

    useEffect(() => {
        if(selectedCategory === 'correct_names') {
            let headerColumns = [...COLUMNS]
            headerColumns[0].role = 'radio'
            headerColumns[0].selectedFromChild = false
            headerColumns[0].show_selection_count = false
            setHeaderColumns(headerColumns)
        } else {
            let headerColumns = [...COLUMNS]
            headerColumns[0].role = 'checkbox'
            headerColumns[0].selectedFromChild = true
            headerColumns[0].show_selection_count = true
            setHeaderColumns(headerColumns)
        }
    }, [selectedCategory])

    useEffect(() => {

        const getSelectedCompanies = async() => {
            if( companies.list.length > 0 ) {

                const { data } = await PatenTrackApi.getUserCompanySelections();

                if(data != null && data.list.length > 0) {
                    if(selectItems.length == 0) {
                        let insert = false, oldItems = [], names = []
                        if(selectedCategory === 'correct_names') {
                            setSelectItems([data.list[0].representative_id])
                            dispatch(setMainCompaniesSelected([data.list[0].representative_id], [{id: data.list[0].representative_id, name: data.list[0].original_name}]))
                        } else {
                            setSelectItems(prevItems => {
                                oldItems = [...prevItems]
                                const promise = data.list.map( representative => {
                                    if(!prevItems.includes(representative.representative_id)){
                                        insert = true
                                        oldItems.push(representative.representative_id)
                                    }
                                })
                                Promise.all(promise)
                                if(insert === true) {
                                    return oldItems
                                } else {
                                    return prevItems
                                }                            
                            })
    
                            if( insert === true ) {
                                oldItems.forEach( id => {
                                    companies.list.forEach( company => {
                                        if( id === company.representative_id ) {
                                            names.push( {id: company.representative_id, name: company.original_name} )
                                            return false;
                                        }
                                    })
                                })
                                dispatch(setMainCompaniesSelected(oldItems, names))
                            }
                        }                        
                    }
                } 
            }            
        }  

        getSelectedCompanies()
    }, [ companies.list ])

    

    /* useEffect(() => {
        setSelectedRow(companyRowSelect)
    }, [ companyRowSelect ]) */

    useEffect(() => {
        if( selectAll != undefined && selectAll === true && companies.list.length > 0 && intialization === false) {
            const all = [], allWithNames = []
            companies.list.map( company => {
                all.push( company.representative_id )
                allWithNames.push( {id: company.representative_id, name: company.original_name} )
            })
            setSelectItems(all)
            setInitialization( true )
            dispatch( setMainCompaniesSelected( all, allWithNames ) ) 
        }
    }, [ dispatch, selectAll, companies, intialization ])
    
    /* useEffect(() => {
        if(isLoadingCompanies === false){
            setCounter(companies.total_records)
        }        
    }, [isLoadingCompanies, companies]) */

    useEffect(() => {
        if( selectAll != undefined && (selectAll === false || selectAll === true )) {
            dispatch( setMainCompaniesAllSelected( selectAll ) ) 
        }
    }, [ dispatch, selectAll ])

    useEffect(() => {
        if((selectItems.length == 0 || selectItems.length != selected.length) ){
            setSelectItems(selected)
        }
    }, [ selected, selectItems ])

    /* useEffect(() => {
        
        if( defaultSelect != undefined && defaultSelect == 'first' ) {
            if(companies.list.length > 0 && initial === false) {
                setInitial( true )
                dispatch( setMainCompaniesAllSelected( false ) ) 
                updateCompanySelection( dispatch, companies.list[0], true, selected, defaultSelect )
            }
        }
    }, [ dispatch, companies, initial ]) */

    const updateCompanySelection = async(event, dispatch, row, checked, selected, defaultSelect, currentSelection) => {
        if(checked != undefined) {
            let updateSelected = [...selected], updateSelectedWithName = [...selectedWithName], sendRequest = false
            if(!updateSelected.includes(parseInt( row.representative_id ))) {
                if(selectedCategory === 'correct_names') {
                    updateSelected = [parseInt(row.representative_id)]
                    updateSelectedWithName = [{id: row.representative_id, name: row.original_name}]
                    if(parseInt(row.type) === 1) {
                        if(row.child_total > 0) {
                            const parseChild = JSON.parse(row.child),  parseChildDetails = JSON.parse(row.child_full_detail)
                            updateSelected = [...updateSelected, ...parseChild]
                            const childPromise = parseChildDetails.map(child => {
                                updateSelectedWithName.push({id: child.representative_id, name: child.original_name})
                                return row
                            }) 
                            updateSelected = [...new Set(updateSelected)]
                            await Promise.all(childPromise)
                        }
                    }                   
                } else {
                    updateSelected.push(parseInt( row.representative_id ))
                    updateSelectedWithName.push({id: row.representative_id, name: row.original_name})
                    if(parseInt(row.type) === 1) {
                        if(row.child_total > 0) {
                            const parseChild = JSON.parse(row.child),  parseChildDetails = JSON.parse(row.child_full_detail)
                            updateSelected = [...updateSelected, ...parseChild]
                            const childPromise = parseChildDetails.map(child => {
                                updateSelectedWithName.push({id: child.representative_id, name: child.original_name})
                                return row
                            }) 
                            updateSelected = [...new Set(updateSelected)]
                            await Promise.all(childPromise)
                        }
                    } 
                }                
            } else {
                updateSelected = updateSelected.filter(
                    existingCompany => existingCompany !== parseInt( row.representative_id )
                )
                updateSelectedWithName = updateSelectedWithName.filter(
                    existingCompany => existingCompany !== parseInt( row.representative_id )
                )
                if(parseInt(row.type) === 1) {
                    if(row.child_total > 0) {
                        const parseChild = JSON.parse(row.child)
                        const childFilterPromise = parseChild.map( child => {
                            updateSelected = updateSelected.filter(
                                existingCompany => existingCompany !== parseInt( child.representative_id )
                            )
                            updateSelectedWithName = updateSelectedWithName.filter(
                                existingCompany => existingCompany !== parseInt( child.representative_id )
                            )
                        })
                        await Promise.all(childFilterPromise)                            
                    }
                }
            }
            history.push({
                hash: updateHashLocation(location, 'companies', updateSelected).join('&')
            })
            dispatch(setMainCompaniesRowSelect([]))
            resetAll()
            setSelectItems(updateSelected)
            if(parseInt(row.type) !== 1){
                updateUserCompanySelection(updateSelected)
            }            
            dispatch( setMainCompaniesSelected( updateSelected, updateSelectedWithName ) ) 
            dispatch( setNamesTransactionsSelectAll( false ) )
            dispatch( setSelectedNamesTransactions([]) )
        } else {
            const element = event.target.closest('div.ReactVirtualized__Table__rowColumn')
            if( element != null ) {
                const index = element.getAttribute('aria-colindex')
                if(index == 2) {
                    if(currentSelection != row.representative_id) {
                        setCurrentSelection(row.representative_id)
                    } else { 
                        setCurrentSelection(null)
                    }
                }
            }
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

    const updateUserCompanySelection = async(representativeIDs) => {
        const form = new FormData();
        form.append('representative_id', JSON.stringify(representativeIDs))

        const { status } = await PatenTrackApi.saveUserCompanySelection(form)
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
        updateCompanySelection(event, dispatch, row, checked, selected, defaultSelect, currentSelection)
    }, [ dispatch, selected, display_clipboard, currentSelection ])
    
    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        /* dispatch(setMainCompaniesRowSelect([])) */
        dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
        dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
        if(checked === false) {
            setSelectItems([])
            dispatch( setMainCompaniesSelected([], []) )
            resetAll()
            clearOtherItems()
        } else if( checked === true ){
            if(selectedCategory !== 'correct_names') {
                if(companies.list.length > 0) {
                    let items = [], itemsWithName = []
                    companies.list.forEach( async company => {
                        items.push(company.representative_id)
                        itemsWithName.push({id: company.representative_id, name:company.original_name})
                        if( parseInt(company.type) === 1 ) {
                           if(company.child_total > 0) {
                               const parseChild = JSON.parse(company.child),  parseChildDetails = JSON.parse(company.child_full_detail)
                               items = [...items, ...parseChild]
                               const childPromise = parseChildDetails.map(row => {
                                    itemsWithName.push({id: row.representative_id, name: row.original_name})
                                    return row
                                })
                                 
                                items = [...new Set(items)]
                                await Promise.all(childPromise)
                           }
                        }
                    })
                    setSelectItems(items)
                    dispatch( setMainCompaniesSelected(items, itemsWithName) )
                } 
            }            
        }
        dispatch( setMainCompaniesAllSelected( checked ) )
    }, [ dispatch, companies ]) 

    const handleOnClickLoadMore = useCallback(() => {
        dispatch(fetchParentCompanies( offset + DEFAULT_CUSTOMERS_LIMIT))
        setOffset(currOffset => (currOffset + DEFAULT_CUSTOMERS_LIMIT))
    }, [ dispatch, offset])

    const resizeColumnsWidth = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )
        if( findIndex !== -1 ) {
          previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
          previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

    const resizeColumnsStop = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )
        if( findIndex !== -1 ) {
          previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width 
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

    const handleCounter = async(counter) => {
        let list = [...companiesList]
        const promise = list.map( (row, index) => {
            if( row.representative_id == currentSelection){                            
                list[index].child_total = counter
            }
            return row
        })
        await Promise.all(promise)
        setCompaniesList(list)
    }

    if (isLoadingCompanies && companies.list.length == 0) return <Loader />

  return (
    <Paper className={classes.root} square id={`main_companies`}>
        <VirtualizedTable
        classes={classes}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedIndex={currentSelection}
        selectedKey={'representative_id'} 
        /* disableRowKey={'type'} */
        rows={companiesList}
        rowHeight={rowHeight}
        headerHeight={headerRowHeight}
        columns={headerColumns}
        totalRows={companies.list.length}
        onSelect={handleClickRow}
        onSelectAll={handleSelectAll}
        defaultSelectAll={selectedCompaniesAll}
        resizeColumnsWidth={resizeColumnsWidth}
        resizeColumnsStop={resizeColumnsStop}
        collapsable={true}
        childHeight={childHeight}
        childSelect={childSelected}
        childRows={data}
        childCounterColumn={`child_total`}
        forceChildWaitCall={true}
        renderCollapsableComponent={
            <ChildTable parentCompanyId={currentSelection} headerRowDisabled={true} callBack={handleCounter}/>
        }
        defaultSortField={`original_name`}
        defaultSortDirection={`desc`}
        responsive={true}
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