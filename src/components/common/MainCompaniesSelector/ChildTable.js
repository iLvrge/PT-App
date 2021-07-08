import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@material-ui/core'
import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import PatenTrackApi from '../../../api/patenTrack2'
import {
    setMainCompaniesSelected,
    setMainCompaniesRowSelect
} from '../../../actions/patentTrackActions2'


import { numberWithCommas } from '../../../utils/numbers'

import Loader from '../Loader'

const ChildTable = ({ parentCompanyId, headerRowDisabled, callBack }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 1900 )
    const tableRef = useRef()
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ childCompaniesLoading, setChildCompaniesLoading] = useState( true )
    const [ companies, setChildCompanies] = useState( [] )
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const selected = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
	const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)

    const COLUMNS = [ 
        {
            width: 29,
            minWidth: 29,
            label: '',
            dataKey: 'representative_id',
            role: 'checkbox',
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
            badge: true
        },
    ]
       
    useEffect(() => {
        const getChildCompanies = async () => {            
            if( parentCompanyId > 0 ) { 
                setChildCompaniesLoading( true )
                const { data } = await PatenTrackApi.getChildCompanies(parentCompanyId)
                setChildCompanies(data.list)
                setChildCompaniesLoading( false )
                if( data.list != null && data != '' && data.list.length > 0 ){                   
                    callBack(data.list.length) 
                }
            } else {
                setChildCompaniesLoading( false )
            }
        }
        getChildCompanies()
    }, [ dispatch, parentCompanyId ])

    useEffect(() => {
        if(selectItems.length == 0) {
            setSelectItems(selectItems)
        }
    }, [selected, selectItems])

    const onHandleSelectAll = useCallback((event, row) => {
        
    }, [ dispatch ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        const { checked } = e.target;
        if(checked != undefined) {
            let updateSelected = [...selectItems], updateSelectedWithName = [...selectedWithName]
            if(!updateSelected.includes(parseInt( row.representative_id ))) {
                updateSelected.push(parseInt( row.representative_id ))
                updateSelectedWithName.push({id: row.representative_id, name: row.original_name})
            } else {
                updateSelected = updateSelected.filter(
                    existingCompany => existingCompany !== parseInt( row.representative_id )
                )
                updateSelectedWithName = updateSelectedWithName.filter(
                    existingCompany => existingCompany !== parseInt( row.representative_id )
                )
            }
            dispatch(setMainCompaniesRowSelect([]))
            setSelectItems(updateSelected)
            updateUserCompanySelection(updateSelected)
            dispatch( setMainCompaniesSelected( updateSelected, updateSelectedWithName ) ) 
        }
    }, [ dispatch, selectItems, selectedWithName ])

    const updateUserCompanySelection = async(representativeIDs) => {
        const form = new FormData();
        form.append('representative_id', JSON.stringify(representativeIDs))

        const { status } = await PatenTrackApi.saveUserCompanySelection(form)
    }

    if (childCompaniesLoading) return <Loader /> 

    return (
        <Paper className={classes.root} square id={`child_companies`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedKey={'representative_id'}
            rows={companies}
            rowHeight={rowHeight}
            headerHeight={rowHeight} 
            columns={COLUMNS}
            defaultSelectAll={selectedAll}
            onSelect={onHandleClickRow}
            onSelectAll={onHandleSelectAll}
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