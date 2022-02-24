import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@mui/material'
import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import PatenTrackApi from '../../../api/patenTrack2'
import {
    setAssetTypeCompanies,
    setMainCompaniesRowSelect,
    setAssetTypeSelectedRow,
    setAssetTypeCustomerSelectedRow,
    setSelectedAssetsTransactions,
    setChildSelectedAssetsTransactions,
    setSelectedAssetsPatents,
    setAssetsIllustration,
    getAssetsAllTransactionsEvents,
} from '../../../actions/patentTrackActions2'

import {
    setConnectionBoxView, 
    setPDFView,
} from '../../../actions/patenTrackActions'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import { 
    updateHashLocation
} from '../../../utils/hashLocation'

import { numberWithCommas } from '../../../utils/numbers'

import Loader from '../Loader'

const ChildTable = ({ partiesId, headerRowDisabled }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 800 )
    const [ childHeight, setChildHeight ] = useState(500)
    const tableRef = useRef()
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ assignmentLoading, setAssignmentLoading] = useState( true )
    const [ assignments, setAssignments] = useState( [] )
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ childSelected, setCheckedSelected] = useState( 0 )
    const [ currentSelection, setCurrentSelection] = useState(null)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies)
    const assetTypeAssignmentAssets = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)

    const COLUMNS = [ 
        {
            width: 100,
            label: 'Transactions', 
            dataKey: 'date',
            align: 'left'   
        },
        {
            width: 100,
            label: 'Assets', 
            dataKey: 'assets',
            staticIcon: '',
            format: numberWithCommas,
            align: 'left'           
        }
    ]
       
    useEffect(() => {
        const getAssignments = async () => {            
            if( partiesId > 0 ) {
                setAssignmentLoading( true )
                const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                    tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                    customers = [partiesId]
                
                const { data } = await PatenTrackApi.getAssetTypeAssignments(companies, tabs, customers, selectedCategory != '' ? selectedCategory : '', false)
                setAssignments(data.list)
                setAssignmentLoading( false )
                if( data.list != null && data != '' && data.list.length > 0 ){
                    let companiesList = [...assetTypeCompanies.list] 
                    const promise = companiesList.map( (row, index) => {
                        if( row.id == partiesId){                            
                            companiesList[index].totalTransactions = data.list.length
                        }
                        return row
                    })
                    await Promise.all(promise)
                    dispatch(
                        setAssetTypeCompanies({
                            ...assetTypeCompanies,
                            list: companiesList, 
                            append: false 
                        })
                    )
                }
            } else {
                setAssignmentLoading( false )
            }
        }
        getAssignments()
    }, [ dispatch, selectedCategory, selectedCompanies, selectedCompaniesAll, assetTypesSelected, assetTypesSelectAll, partiesId ])

    const onHandleSelectAll = useCallback((event, row) => {
        
    }, [ dispatch ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        /* getTransactionData(dispatch, row.rf_id) */
    }, [ dispatch, selectItems, currentSelection ])

    const getTransactionData = (dispatch, rf_id) => {
        setSelectedRow([rf_id])
        dispatch(setChildSelectedAssetsTransactions([rf_id]))
        dispatch(setConnectionBoxView( false ))
        dispatch(setPDFView( false ))
        dispatch(toggleUsptoMode( false ))
        dispatch(toggleFamilyMode( false ))
        dispatch(toggleFamilyItemMode( false ))  
        dispatch(setMainCompaniesRowSelect([]))
		dispatch(setAssetTypeSelectedRow([]))
        dispatch(setAssetTypeCustomerSelectedRow([]))  
        dispatch(setSelectedAssetsTransactions([])) 
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setAssetsIllustration({ type: 'transaction', id: rf_id }))
        //dispatch(getAssetsAllTransactionsEvents(selectedCategory == '' ? '' : selectedCategory, [], [], [], [rf_id]))
    }

    if (assignmentLoading) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_assignments`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedKey={'rf_id'}
            rows={assignments}
            rowHeight={rowHeight}
            headerHeight={rowHeight} 
            columns={COLUMNS}
            defaultSelectAll={selectedAll}
            onSelect={onHandleClickRow}
            onSelectAll={onHandleSelectAll}
            disableHeader={headerRowDisabled} 
            responsive={false}
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


export default ChildTable