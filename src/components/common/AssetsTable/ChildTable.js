import useAssetFamily from '../../../queries/useAssetFamily'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@mui/material'
import './styles.css'
import VirtualizedTable from '../VirtualizedTable'

import {
    setAssetTypeAssignmentAllAssets
} from '../../../actions/patentTrackActions2'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import {
    updateHashLocation
} from '../../../utils/hashLocation'

import { numberWithCommas, applicationFormat } from '../../../utils/numbers'

import PatenTrackApi from '../../../api/patenTrack' 

import Loader from '../Loader'

const ChildTable = ({ asset, headerRowDisabled }) => {

    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 800 )
    const [ childHeight, setChildHeight ] = useState(500)
    const tableRef = useRef()
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ childSelected, setCheckedSelected] = useState( 0 )
    const [ currentSelection, setCurrentSelection] = useState(null)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypesCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected)
    const assetTypesCompaniesSelectAll = useSelector(state => state.patenTrack2.assetTypeCompanies.selectAll)
    const assignmentList = useSelector( state => state.patenTrack2.assetTypeAssignments.list)
    const assignmentSelectedList = useSelector( state => state.patenTrack2.assetTypeAssignments.selected)
    const assignmentListSelectAll = useSelector( state => state.patenTrack2.assetTypeAssignments.selectAll)
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.list)
    const selectedAssetsTransactions = useSelector( state => state.patenTrack2.selectedAssetsTransactions)
    const assetTypeAssignmentAssetsObj = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets)
    const assetTypeAssignmentAssets = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)


    const COLUMNS = [ 
        {
            width: 150,
            label: 'Assets', 
            dataKey: 'patent_number',
            validation: true,
            validationKey: 'empty',
            optionalKey: 'application_number',
            staticIcon: "",
            format: numberWithCommas,
            align: 'left'           
        }
    ]
       
    const { data: families = [], isFetching: familyLoading } = useAssetFamily(asset)

    // The fetch also had to publish a child_count back into Redux. That is a
    // side effect of the data arriving, not part of fetching it, so it stays an
    // effect - but one that only reacts to the result.
    useEffect(() => {
        if (families.length === 0) return
        const assetsList = assetTypeAssignmentAssets.map((row) =>
            row.appno_doc_num === asset || row.grant_doc_num === asset
                ? { ...row, child_count: families.length }
                : row
        )
        dispatch(
            setAssetTypeAssignmentAllAssets({
                ...assetTypeAssignmentAssetsObj,
                list: assetsList,
                append: false,
            })
        )
    }, [ families, asset, dispatch ])

    const onHandleSelectAll = useCallback((event, row) => {
        
    }, [ dispatch ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        
    }, [ dispatch, selectItems, currentSelection ])

    

    if (familyLoading) return <Loader />

    return (
        <Paper className={'pt-assets-table-root'} square id={`assets_family`} elevation={0}>
            <VirtualizedTable
            selected={selectItems}
            rowSelected={selectedRow}
            selectedKey={'id'}
            rows={families}
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