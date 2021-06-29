import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@material-ui/core'
import Loader from '../Loader'
import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'
import {
    getAssetTypeIDCompanies,
    getCustomerParties,
    setAssetTypeCompanies,
    setAssetTypesSelect,
    setAllAssignmentCustomers,
    setSelectAssignmentCustomers,
    setAssetTypeCustomerSelectedRow,
    setAssetTypeChildCustomerSelectedRow,
    setChildSelectedAssetsTransactions,
    setAssetTypeSelectedRow,
    setAssetsIllustration,
    setMainCompaniesRowSelect,
    setChildSelectedAssetsPatents,
    setSelectedAssetsPatents,
    setSelectedAssetsTransactions
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

const CustomerTable = ({ assetType, standalone, headerRowDisabled, parentBarDrag, parentBar, customerType }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ childHeight, setChildHeight ] = useState(500)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
    const [ width, setWidth ] = useState( 1900 ) 
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
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const totalRecords = useSelector(state => state.patenTrack2.assetTypeCompanies.total_records)
    /* const assetTypeCompaniesSelectedRow = useSelector(state => state.patenTrack2.assetTypeCompanies.row_select) */
    const assetTypeCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected)
    const assetTypeCompaniesLoading = useSelector(state => state.patenTrack2.assetTypeCompanies.loading)
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
            width: 200,
            minWidth: 200,
            oldWidth: 200,
            draggable: true,
            headingIcon: 'parties',
            label: 'Parties',
            dataKey: 'entityName', 
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
        if( assetTypeCompanies.length > 0 ) {
            setGrandTotal(assetTypeCompanies[assetTypeCompanies.length - 1].grand_total)
        } else {
            setGrandTotal(0)
        }
    }, [ assetTypeCompanies ]) 
    

    useEffect(() => {
        if(assetTypeCompaniesSelected.length > 0 && (selectItems.length == 0 || selectItems.length != assetTypeCompaniesSelected.length) ){
            setSelectItems(assetTypeCompaniesSelected)
        }
    }, [ assetTypeCompaniesSelected, selectItems ]) 

    useEffect(() => {
        if(standalone) {            
            const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                tabs = assetTypesSelectAll === true ? [] : assetTypesSelected
            if(selectedCompaniesAll === true || selectedCompanies.length > 0) {
                dispatch(
                    getCustomerParties(
                        selectedCategory == '' ? '' : selectedCategory,
                        companies, 
                        tabs, 
                        customerType,
                        false 
                    )
                ) 
            } else {
                dispatch(setAssetTypeCompanies({list: [], total_records: 0}))
            }       
        }
    }, [ dispatch, selectedCompanies, selectedCompaniesAll, assetTypesSelectAll, assetTypesSelected, customerType ]) 

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
          previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width + data.x
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

    const onHandleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        if(!checked) {
            setSelectItems([])
            dispatch( setSelectAssignmentCustomers([] ))
        } else {
            let items = [], list = [] ;
            if(standalone && assetTypeCompanies.length > 0) {
                list = [...assetTypeCompanies]
            } else if(!standalone && data.length > 0) {
                list = [...data]
            }
            list.forEach( item => items.push(item.id))
            setSelectItems(items)
            dispatch( setSelectAssignmentCustomers(items) )
        }
        setSelectAll(checked)
        dispatch( setAllAssignmentCustomers( checked ) )
    }, [ dispatch, standalone, assetTypeCompanies, data ])

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
                hash: updateHashLocation(location, 'otherParties', oldSelection).join('&')
            })
            setSelectItems(oldSelection)
            setSelectAll(false)
            dispatch( setAllAssignmentCustomers(assetTypeCompanies.length == oldSelection.length ||  data.length == oldSelection.length ? true : false ) )
            dispatch( setSelectAssignmentCustomers(oldSelection) )
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

    const getTimelineData = (dispatch, id) => {
        parentBarDrag(0)
        parentBar(false)
        setSelectedRow([id])
        dispatch(setMainCompaniesRowSelect([]))
        dispatch(setAssetTypeSelectedRow([]))
        dispatch(setAssetTypeChildCustomerSelectedRow([]))
        dispatch(setSelectedAssetsTransactions([]))     
        dispatch(setChildSelectedAssetsTransactions([]))          
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setChildSelectedAssetsPatents( [] ))        
        dispatch(setAssetTypeCustomerSelectedRow([id]))
        dispatch(setAssetsIllustration(null))
        dispatch(setConnectionBoxView( false ))
        dispatch(setPDFView( false ))
        dispatch(toggleUsptoMode( false ))
        dispatch(toggleFamilyMode( false ))
        dispatch(toggleFamilyItemMode( false )) 
    }

    if ((!standalone && assetTypesCompaniesLoading) || (standalone && assetTypeCompaniesLoading)) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_type_companies`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
			selectedIndex={currentSelection}
            selectedKey={'id'}
            rows={assetTypeCompanies}
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
            resizeColumnsStop={resizeColumnsStop}
            showIsIndeterminate={false}
            renderCollapsableComponent={
                <ChildTable partiesId={currentSelection} headerRowDisabled={true} />
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


export default CustomerTable