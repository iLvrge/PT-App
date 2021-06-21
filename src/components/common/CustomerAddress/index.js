import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper, Button } from '@material-ui/core'
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

const CustomerAddress = ({onHandleSelectAddress}) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 600 )
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
       
    useEffect(() => {
        const getAssignments = async () => {   
            if( selectedCompanies.length > 0 && assetTypeAddressSelected.length > 0 ) {
                setAssignmentLoading( true )

                const { data } = await PatenTrackApi.getCustomerAddressByCompanyIDs(selectedCompanies)
                setAssignments(data)
                setAssignmentLoading( false )
                
            } else {
                if( assetTypeAddressSelected.length == 0 ) {
                    alert("Please select address first")
                }
                setAssignmentLoading( false )
            }
        }
        getAssignments()
    }, [ selectedCompanies, assetTypeAddressSelected ])

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
        <Paper className={classes.root} square id={`assets_assignments`}>
            <VirtualizedTable
            classes={classes}
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
            <Button variant="outlined" onClick={onHandleClick} className={classes.btn}>
                Select Address
            </Button>
        </Paper>
      )
}


export default CustomerAddress