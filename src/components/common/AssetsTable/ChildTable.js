import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@material-ui/core'
import useStyles from './styles' 
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

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 800 )
    const [ childHeight, setChildHeight ] = useState(500)
    const tableRef = useRef()
    const [ familyLoading, setFamilyLoading] = useState( true )
    const [ families, setFamilies] = useState( [] )
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
       
    useEffect(() => {
        const getAssignments = async () => {    
            setFamilyLoading( true)        
            if( asset != '' ) {
                const { data } = await PatenTrackApi.assetFamily(asset)
                
                if(data.length > 0) {
                    data.forEach((element, index) => {
                        data[index].patent_number = element.patent_number !== null ? `${element.publication_country} ${numberWithCommas(element.patent_number)}` : ''
                        data[index].application_number = element.application_number !== null ? `${element.publication_country} ${applicationFormat(element.application_number)}` : ''
                    });
                }                
                setFamilies(data)                
                setFamilyLoading( false )
                if( data != null && data != '' && data.length > 0 ){
                    let assetsList = [...assetTypeAssignmentAssets] 
                    const promise = assetsList.map( (row, index) => {
                        if( row.appno_doc_num == asset || row.grant_doc_num == asset ){
                            assetsList[index].child_count = data.length
                        }
                        return row
                    })
                    await Promise.all(promise)
                    dispatch(
                        setAssetTypeAssignmentAllAssets({
                            ...assetTypeAssignmentAssetsObj,
                            list: assetsList, 
                            append: false 
                        })
                    )
                }
            } else {
                setFamilies([])
                setFamilyLoading( false )
            }
        }
        getAssignments()
    }, [ dispatch,  asset ])

    const onHandleSelectAll = useCallback((event, row) => {
        
    }, [ dispatch ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        
    }, [ dispatch, selectItems, currentSelection ])

    

    if (familyLoading) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_family`} elevation={0}>
            <VirtualizedTable
            classes={classes}
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