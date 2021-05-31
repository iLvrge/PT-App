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
    getAssetTypeCompanies,
    setAssetTypeCompanies,
    setAssetTypesSelect,
    setAllAssignmentCustomers,
    setSelectAssignmentCustomers,
    setMainCompaniesRowSelect,
    setAssetTypeChildCustomerSelectedRow,
    setAssetTypeChildCustomerSelected,
    setAssetTypeSelectedRow,
    setAssetsIllustration,
    setChildSelectedAssetsPatents,    
    setSelectedAssetsPatents,
    setSelectedAssetsTransactions,
    setAssetTypeCustomerSelectedRow,
    setChildSelectedAssetsTransactions
  } from '../../../actions/patentTrackActions2'

  import {
    setConnectionBoxView, 
    setPDFView,
  } from '../../../actions/patenTrackActions'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import {
    updateHashLocation
} from '../../../utils/hashLocation'  

const ChildTable = ({ assetType, headerRowDisabled, parentBarDrag, parentBar }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 800 )
    const tableRef = useRef()
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const assetTypes = useSelector(state => state.patenTrack2.assetTypes.list)
    const assetTypesCompaniesLoading = useSelector(state => state.patenTrack2.assetTypes.loading_companies)
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const assetTypeCompaniesSelectedRow = useSelector(state => state.patenTrack2.assetTypeChildCompanies.row_select)
    const assetTypeCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeChildCompanies.selected)
    const assetTypeCompaniesLoading = useSelector(state => state.patenTrack2.assetTypeCompanies.loading)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);

    const [ data, setData ] = useState( [] )

    const COLUMNS = [
        {
            width: 300,
            label: 'Parties',
            dataKey: 'entityName', 
            paddingLeft: '20px'           
        }
    ]

    useEffect(() => {
        if(assetTypeCompaniesSelectedRow.length === 0) {
            setSelectedRow([])
        }
    }, [ assetTypeCompaniesSelectedRow ])

    useEffect(() => {
        if(assetTypeCompaniesSelected.length === 0) {
            setSelectItems([])
        }
    }, [ assetTypeCompaniesSelected ])

    useEffect(() => {
        if( selectItems.length > 0 && data.length > 0 && selectItems.length === data.length) {
            let pastTypeSelected = [...assetTypesSelected]
            if(!pastTypeSelected.includes(parseInt(assetType))) {
                pastTypeSelected.push(parseInt(assetType))
                dispatch(setAssetTypesSelect(pastTypeSelected))
            }
        }
    }, [ dispatch, assetTypes, selectItems ])

    useEffect(() => {
        const findIndex = assetTypes.findIndex( tab => parseInt(tab.tab_id) === parseInt(assetType))
        if( findIndex >= 0 ) {
            setData(assetTypes[findIndex]['children'] != undefined ? assetTypes[findIndex]['children'] : [])
            if(assetTypesSelected.includes(assetTypes[findIndex].tab_id)){
                if(assetTypes[findIndex]['children'] != undefined && assetTypes[findIndex]['children'].length > 0) {
                    const items = []
                    assetTypes[findIndex]['children'].map( item => {
                        items.push(item.id)
                        return item
                    })
                    setSelectItems(items)
                    dispatch( setAssetTypeChildCustomerSelected(items) )
                } 
            }
        }        
    }, [ assetTypes ])

    useEffect(() => {
        if(assetType != null) {
            dispatch( getAssetTypeIDCompanies(selectedCompaniesAll === true ? [] : selectedCompanies, assetType, selectedCategory != '' ? selectedCategory : '', false ) )
        }
    }, [ dispatch, selectedCompanies, selectedCompaniesAll ] ) 

    const onHandleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        /* const { checked } = event.target;
        if(checked === false) {
            setSelectItems([])
            dispatch( setAllAssignmentCustomers([]) )
        } else if( checked === true ){
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
        dispatch( setAllAssignmentCustomers( checked ) ) */
    }, [ dispatch, data ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        const { checked } = e.target;
        let oldSelection = [...selectItems]
        if( checked !== undefined) {
            if(checked){
                if( !oldSelection.includes(row.id) ){
                    oldSelection.push(row.id)
                }
            } else {
                oldSelection = oldSelection.filter(
                    customer => customer !== parseInt( row.id ),
                )
            }
            history.push({
                hash: updateHashLocation(location, 'otherParties', oldSelection).join('&')
            })
            setSelectItems(oldSelection)
            setSelectAll((assetTypeCompanies.length == oldSelection.length || data.length == oldSelection.length ) ? true : false)
            dispatch( setAssetTypeChildCustomerSelected(oldSelection)) 
            /*dispatch( setAllAssignmentCustomers(assetTypeCompanies.length == oldSelection.length ||  data.length == oldSelection.length ? true : false ) ) */
            
        } else {
            getTimelineData(dispatch, row.id)
        }
    }, [ dispatch, selectItems ])

    const getTimelineData = (dispatch, id) => {
        parentBarDrag(0)
        parentBar(false)
        setSelectedRow([id])                       
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setSelectedAssetsTransactions([]))
        dispatch( setChildSelectedAssetsPatents([]))
        dispatch(setAssetTypeSelectedRow([]))
        dispatch(setAssetTypeCustomerSelectedRow([]))
        dispatch(setChildSelectedAssetsTransactions([]))
        dispatch(setMainCompaniesRowSelect([]))
        dispatch(setAssetTypeChildCustomerSelectedRow([id]))
        dispatch(setAssetsIllustration(null))
        dispatch(setConnectionBoxView( false ))
        dispatch(setPDFView( false ))
        dispatch(toggleUsptoMode( false ))
        dispatch(toggleFamilyMode( false ))
        dispatch(toggleFamilyItemMode( false )) 
    }

    if (assetTypesCompaniesLoading) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_type_id_companies`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedKey={'id'}
            rows={data}
            rowHeight={rowHeight}
            headerHeight={rowHeight}
            columns={COLUMNS}
            onSelect={onHandleClickRow}
            onSelectAll={onHandleSelectAll}
            defaultSelectAll={selectedAll}
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