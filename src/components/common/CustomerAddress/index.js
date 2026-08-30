import useCustomerAddresses from '../../../queries/useCustomerAddresses'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper, Button } from '@mui/material'
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

const CustomerAddress = ({onHandleSelectAddress}) => {

    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 600 )
    const [ childHeight, setChildHeight ] = useState(500)
    const tableRef = useRef()
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ childSelected, setCheckedSelected] = useState( 0 )
    const [ currentSelection, setCurrentSelection] = useState(null)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const assetTypeAddressSelected = useSelector(state => state.patenTrack2.assetTypeAddress.selected)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)

    const COLUMNS = [ 
        {
            width: 29, 
            label: '',
            dataKey: 'address_id',
            role: 'radio',
            disableSort: true
        },
        {
            width: 161,
            minWidth: 161,
            oldWidth: 161,
            label: 'Street Address',
            dataKey: 'street_address', 
            align: 'left'         
        },
        {
            width: 100,
            minWidth: 100,
            oldWidth: 100,
            label: 'Suite',
            dataKey: 'suite', 
            align: 'left'         
        },
        {
            width: 80,
            minWidth: 80,
            oldWidth: 80,
            label: 'City',
            dataKey: 'city', 
            align: 'left'         
        },
        {
            width: 80,
            minWidth: 80,
            oldWidth: 80,
            label: 'State',
            dataKey: 'state', 
            align: 'left'         
        },
        {
            width: 70,
            minWidth: 70,
            oldWidth: 70,
            label: 'Zip Code',
            dataKey: 'zip_code', 
            align: 'left'         
        },
        {
            width: 80,
            minWidth: 80,
            oldWidth: 80,
            label: 'Country',
            dataKey: 'country', 
            align: 'left'         
        }
    ]
       
    const hasAddress = assetTypeAddressSelected.length > 0
    const { data: assignments = [], isFetching: assignmentLoading } =
        useCustomerAddresses(selectedCompanies, { enabled: hasAddress })

    // The alert used to live inside the fetching effect, so it fired on mount
    // and again on every dependency change while no address was selected. It is
    // its own effect now, with the same condition, so the behaviour is unchanged
    // but it is no longer entangled with the request.
    useEffect(() => {
        if (!hasAddress) alert("Please select address first")
    }, [ hasAddress ])

    const onHandleSelectAll = useCallback((event, row) => {
        
    }, [ dispatch ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        setSelectItems([row.address_id])
    }, [ dispatch, selectItems, currentSelection ])

    const onHandleClick = useCallback((e) => {
        e.preventDefault()
        if( selectItems.length == 1) {
            onHandleSelectAddress(selectItems[0])
        } else {
            alert("Please selectt address first.")
        }
    }, [ selectItems ])

    if (assignmentLoading) return <Loader />

    return (
        <Paper className={"flex h-full flex-1 flex-col overflow-x-hidden overflow-y-auto"} square id={`assets_assignments`}>
            <VirtualizedTable
            selected={selectItems}
            rowSelected={selectedRow}
            selectedKey={'address_id'}
            rows={assignments}
            rowHeight={rowHeight}
            headerHeight={rowHeight} 
            columns={COLUMNS}
            defaultSelectAll={selectedAll}
            onSelect={onHandleClickRow}
            onSelectAll={onHandleSelectAll}
            responsive={false}
            width={width}
            containerStyle={{ 
                width: '100%',
                maxWidth: '100%'
            }}
            style={{ 
                width: '100%'
            }}/>
            <Button variant="outlined" onClick={onHandleClick} className={"absolute bottom-2.5 right-2.5"}>
                Select Address
            </Button>
        </Paper>
      )
}


export default CustomerAddress