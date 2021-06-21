import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@material-ui/core'
import Loader from '../Loader'
import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'
import {
    getCustomerNormalizeNameTransactions,   
    setNamesTransactions,
    setSelectedNamesTransactions,
    setNamesTransactionsSelectAll,
    setAllNameGroupRfIDs
  } from '../../../actions/patentTrackActions2'

  import {
    setConnectionBoxView, 
    setPDFView,
  } from '../../../actions/patenTrackActions'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import {
    updateHashLocation
} from '../../../utils/hashLocation' 

import ChildTable from './ChildTable'

const CorrectAddressTable = ({ assetType, standalone, headerRowDisabled, parentBarDrag, parentBar, customerType }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ childHeight, setChildHeight ] = useState(500)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
    const [ width, setWidth ] = useState( 800 ) 
    const tableRef = useRef()
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ grandTotal, setGrandTotal ] = useState( 0 )
    const [ childSelected, setCheckedSelected] = useState( 0 )
    const [ currentSelection, setCurrentSelection] = useState(null)    
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    
    
    const assetTypesCompaniesLoading = useSelector(state => state.patenTrack2.assetTypes.loading_companies)
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)


    const assetTypeNames = useSelector(state => state.patenTrack2.assetTypeNames.list)
    const totalRecords = useSelector(state => state.patenTrack2.assetTypeNames.total_records)
    const assetNamesSelected = useSelector(state => state.patenTrack2.assetTypeNames.selected)
    const assetNamesLoading = useSelector(state => state.patenTrack2.assetTypeNames.loading)


    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
    const [ data, setData ] = useState( [] )

    const COLUMNS = [
        {
          width: 29, 
          label: '',
          dataKey: 'id',
          role: 'checkbox',
          disableSort: true
        },
        {
            width: 15,
            label: '',
            dataKey: 'id',
            role: 'arrow',
            disableSort: true
        },
        { 
            width: 300,
            minWidth: 300,
            oldWidth: 300,
            draggable: true,
            label: 'Name',   
            dataKey: 'name', 
            badge: true,   
            align: 'left'         
        },
        {
            width: 70,
            label: 'Transactions',
            dataKey: 'totalTransactions', 
            showGrandTotal: true,  
            align: 'center'             
        }
    ]
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    useEffect(() => {
        if( assetTypeNames.length > 0 ) {
            setGrandTotal(assetTypeNames[assetTypeNames.length - 1].grand_total)
        } else {
            setGrandTotal(0)
        }
    }, [ assetTypeNames ]) 
    

    useEffect(() => {
        if(assetNamesSelected.length > 0 && (selectItems.length == 0 || selectItems.length != assetNamesSelected.length) ){
            setSelectItems(assetNamesSelected)
        }
    }, [ assetNamesSelected, selectItems ]) 


    useEffect(() => {
        const getAllGroupIDs = async() => {
            if(assetNamesSelected.length > 0) {
                let allRFIDS = [];
                const promise =  assetNamesSelected.map( id => {
                    const findIndex = assetTypeNames.findIndex( row => row.id == id)
                    if(findIndex !== -1) {
                        const groupIDs = assetTypeNames[findIndex].group_ids.toString().split(',')
                        allRFIDS = [...allRFIDS, ...groupIDs]
                    }
                })
                await Promise.all(promise)
                dispatch(setAllNameGroupRfIDs(allRFIDS))
            }
        }
        getAllGroupIDs()
    }, [ dispatch, assetNamesSelected ])

    useEffect(() => {
        if(standalone) {            
            const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                tabs = assetTypesSelectAll === true ? [] : assetTypesSelected
            if(selectedCompaniesAll === true || selectedCompanies.length > 0) {
                dispatch(
                    getCustomerNormalizeNameTransactions(
                        companies, 
                        tabs, 
                        [],
                        false 
                    )
                ) 
            } else {
                dispatch(setNamesTransactions({list: [], total_records: 0}))
            }       
        }
    }, [ dispatch, selectedCompanies, selectedCompaniesAll ]) 

    const resizeColumnsWidth = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

        if( findIndex !== -1 ) {
          previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
          previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

    const onHandleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        if(!checked) {
            setSelectItems([])
            dispatch( setSelectedNamesTransactions([] ))
        } else {
            let items = [], list = [] ;
            if(standalone && assetTypeNames.length > 0) {
                list = [...assetTypeNames]
            } else if(!standalone && data.length > 0) {
                list = [...data]
            }
            list.forEach( item => items.push(item.id))
            setSelectItems(items)
            dispatch( setSelectedNamesTransactions(items) )
        }
        setSelectAll(checked)
        dispatch( setNamesTransactionsSelectAll( checked ) )
    }, [ dispatch, standalone, assetTypeNames, data ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        const { checked } = e.target;
        let oldSelection = [...selectItems]
        if( checked !== undefined) {
            if( !oldSelection.includes(row.id) ){
                oldSelection.push(row.id)
            } else {
                oldSelection = oldSelection.filter(
                    customer => customer !== parseInt( row.id ),
                )
            }
            history.push({
                hash: updateHashLocation(location, 'name', oldSelection).join('&')
            })
            setSelectItems(oldSelection)
            setSelectAll(false)
            dispatch( setNamesTransactionsSelectAll(assetTypeNames.length == oldSelection.length ||  data.length == oldSelection.length ? true : false ) )
            dispatch( setSelectedNamesTransactions(oldSelection) )
        }  else {
            
            const element = e.target.closest('div.ReactVirtualized__Table__rowColumn')
            if( element != null ) {
                const index = element.getAttribute('aria-colindex')
                if(index == 2) {
                    if(currentSelection != row.id) {
                        setCurrentSelection(row.id)
                    } else { 
                        setCurrentSelection(null)
                    }
                }
            }
            /*  else {                    
                getTimelineData(dispatch, row.id) 
            } */
        } 
    }, [ dispatch, currentSelection, selectItems ])


    if ((!standalone && assetNamesLoading) || (standalone && assetNamesLoading)) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_type_address`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
			selectedIndex={currentSelection}
            selectedKey={'id'}
            rows={assetTypeNames}
            rowHeight={rowHeight}
            headerHeight={headerRowHeight}  
            columns={headerColumns}
            onSelect={onHandleClickRow}
            onSelectAll={onHandleSelectAll}
            defaultSelectAll={selectedAll}
            collapsable={true}
            childHeight={childHeight}
			childSelect={childSelected}
            childRows={data} 
            childCounterColumn={`totalTransactions`}
            resizeColumnsWidth={resizeColumnsWidth}
            showIsIndeterminate={false}
            renderCollapsableComponent={
                <ChildTable addressId={currentSelection} headerRowDisabled={true} />
            }
            /* forceChildWaitCall={true} */
            totalRows={totalRecords}
            grandTotal={grandTotal}
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


export default CorrectAddressTable