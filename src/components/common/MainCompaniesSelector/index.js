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
    setSlackMessages
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
        width: 25, 
        minWidth: 25,
        label: '',
        dataKey: 'representative_id',
        headingIcon: 'company',
        role: "arrow",
        disableSort: true,
        showOnCondition: '0',
        disableColumnKey:'type'
    },
    {
        width: 171,  
        minWidth: 171,
        oldWidth: 171,
        draggable: true,
        label: 'Companies',        
        dataKey: 'original_name',
        classCol: 'font12Rem',
        showOnCondition: '0',
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
    }
] 

const MainCompaniesSelector = ({selectAll, defaultSelect, addUrl, parentBarDrag, parentBar, isMobile}) => {

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
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    /**
     * Intialise company list
     */

    useEffect(() => {
        const initCompanies = async () => {
            dispatch(fetchParentCompanies( offset, sortField, sortOrder ) )
        } 
        initCompanies()  
    }, []) 

    /**
     * Set Total companies
     */

    useEffect(() => {
        setCompaniesList( companies.list )
        let counter = 0;

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

    useEffect(() => {
        if(isMobile) {
            let headerColumns = [...COLUMNS]
            headerColumns[2].width =  250
            headerColumns[2].minWidth =  250
            setHeaderColumns(headerColumns)
        }
    }, [isMobile])
    /**
     * if category is correct names then row should show radio button instead of checkboxes
     */

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

    /**
     * Get user selected companies
     */

    useEffect(() => {
        const getSelectedCompanies = async() => {
            if( companies.list.length > 0 ) {
                /**
                 * Send Request to server
                 */
                const { data } = await PatenTrackApi.getUserCompanySelections();
                if(data != null && data.list.length > 0) {
                    if(selectItems.length == 0) {
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
                                        oldItems = [...oldItems, ...parseChild]
                                        oldItems = [...new Set(oldItems)]
                                    }
                                } else {
                                    oldItems.push(parseInt(representative.representative_id))
                                }
                            })
                            await Promise.all(promise)
                            //setSelectGroups(groups) 
                            setSelectItems(oldItems)
                            dispatch(setMainCompaniesSelected(oldItems, groups))
                        }                        
                    }
                } 
            }            
        }  
        getSelectedCompanies()
    }, [ companies.list ])

    useEffect(() => {
        if((selectedCompaniesAll === true || selected.length > 0 )) {
            if( assetTypesSelected.length === 0 && assetTypesSelectAll === false ) {
                const getUserSelection = async () => {
                    const { data } = await PatenTrackApi.getUserActivitySelection()
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
                getUserSelection();   
            }
        }
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

    /**
     * Reset all items
     */

    const resetAll = () => {
        dispatch(setAssetTypes([]))
        dispatch(setAssetTypeCompanies({ list: [], total_records: 0 }))
        dispatch(setAssetTypeInventor({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
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
        dispatch(setSlackMessages([]))
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
    const updateCompanySelection = async(event, dispatch, row, checked, selected, defaultSelect, currentSelection) => {
        if(checked != undefined) {
            let updateSelected = [...selected], sendRequest = false , updateGroup = [...selectedGroup] 
            if(!updateSelected.includes(parseInt( row.representative_id ))) {
                if(selectedCategory === 'correct_names') {
                   
                    if(parseInt(row.type) === 1) {
                        if(row.child_total > 0) {
                            const parseChild = JSON.parse(row.child)
                            updateSelected = [...updateSelected, ...parseChild]
                            updateSelected = [...new Set(updateSelected)]
                        }
                    }  else {
                        updateSelected = [parseInt(row.representative_id)]
                    }                  
                } else {                    
                    if(parseInt(row.type) === 1) {
                        if(row.child_total > 0) {
                            const parseChild = JSON.parse(row.child)
                            if(!updateSelected.includes(parseInt(parseChild[0]))) {
                                updateSelected = [...updateSelected, ...parseChild]
                                updateSelected = [...new Set(updateSelected)]
                            } else {
                                const childFilterPromise = parseChild.map( child => {
                                    updateSelected = updateSelected.filter(
                                        existingCompany => parseInt(existingCompany) !== parseInt( child )
                                    )
                                })
                                await Promise.all(childFilterPromise)
                            }                            
                        }   
                        //updateGroup.push(parseInt(row.representative_id))
                    } else {
                        updateSelected.push(parseInt( row.representative_id ))
                    }
                }                
            } else {
                updateSelected = updateSelected.filter(
                    existingCompany => parseInt(existingCompany) !== parseInt( row.representative_id )
                )
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
            resetAll() 
            clearOtherItems()
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

   /**
    * Click on row
    */

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

    /**
     * Select / Unselect All checkbox
     */
    
    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
        dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
        resetAll()
        if(checked === false) {
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
        dispatch( setMainCompaniesAllSelected( checked ) )
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

    if (isLoadingCompanies && companies.list.length == 0) return <Loader />

  return (
    <Paper className={classes.root} square id={`main_companies`}>
        <VirtualizedTable
        classes={classes}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedIndex={currentSelection}
        selectedKey={'representative_id'} 
        selectedGroup={selectedGroup}        
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
        collapsable={true}
        childHeight={childHeight}
        childSelect={childSelected}
        childRows={data}
        childCounterColumn={`child_total`}
        forceChildWaitCall={true}
        renderCollapsableComponent={
            <ChildTable parentCompanyId={currentSelection} headerRowDisabled={true} itemCallback={handleChildCallback} groups={selectedGroup} companyColWidth={companyColWidth}/>
        }
        disableRow={true}
        disableRowKey={'status'}  
        defaultSortField={`original_name`}
        defaultSortDirection={`desc`}
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