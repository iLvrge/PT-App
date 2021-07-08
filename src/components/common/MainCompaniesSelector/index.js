import React, { useCallback, useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@material-ui/core'
import useStyles from './styles' 
import _orderBy from 'lodash/orderBy' 
import VirtualizedTable from '../VirtualizedTable'

import {
    fetchParentCompanies,
    setMainCompaniesSelected,
    setMainCompaniesAllSelected,
    setMainCompaniesRowSelect,
    setMaintainenceAssetsList,
    setAssetTypeAssignmentAllAssets
} from '../../../actions/patentTrackActions2'

import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import PatenTrackApi from '../../../api/patenTrack2'

import { numberWithCommas } from '../../../utils/numbers'

import {
    updateHashLocation
} from '../../../utils/hashLocation' 

import ChildTable from './ChildTable'

import Loader from '../Loader'

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
        width: 20,
        minWidth: 20,
        label: '',
        dataKey: 'representative_id',
        headingIcon: 'company',
        role: "arrow",
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
    {
        width: 80,  
        minWidth: 80, 
        label: 'Acitivites',
        staticIcon: '',
        dataKey: 'no_of_activities',
        format: numberWithCommas,
    },
    {
        width: 80,   
        minWidth: 80,
        label: 'Parties',
        staticIcon: '',
        dataKey: 'no_of_parties',
        format: numberWithCommas,
    },
    {
        width: 80,  
        minWidth: 80,
        label: 'Inventors',
        staticIcon: '',
        dataKey: 'no_of_inventor',
        format: numberWithCommas,
    },
    {
        width: 120,  
        minWidth: 120,
        label: 'Transactions',
        staticIcon: '',
        dataKey: 'no_of_transactions',
        format: numberWithCommas,
    },
    {
        width: 80,  
        minWidth: 80,
        label: 'Assets',
        staticIcon: '',
        dataKey: 'no_of_assets',
        format: numberWithCommas,
    },
    {
        width: 80,  
        minWidth: 80,
        label: 'Arrows',
        dataKey: 'product',
        staticIcon: '',
        format: numberWithCommas,
    }
] 

const MainCompaniesSelector = ({selectAll, defaultSelect, addUrl, parentBarDrag, parentBar}) => {

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
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ currentSelection, setCurrentSelection] = useState(null)   
    const [intialization, setInitialization] = useState( false ) 
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ companiesList, setCompaniesList ] = useState([])
    const companies = useSelector( state => state.patenTrack2.mainCompaniesList )
    const isLoadingCompanies = useSelector( state => state.patenTrack2.mainCompaniesLoadingMore )
    const selected = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    useEffect(() => {
        const initCompanies = async () => {
            dispatch(fetchParentCompanies( offset ) )
        } 
        initCompanies()
    }, []) 

    useEffect(() => {
        setCompaniesList( companies.list )
    }, [ companies.list ])

    useEffect(() => {

        const getSelectedCompanies = async() => {
            if( companies.list.length > 0 ) {

                const { data } = await PatenTrackApi.getUserCompanySelections();

                if(data != null && data.list.length > 0) {
                    const IDs = [], names = []
                    const promise = data.list.map( representative => {
                        IDs.push(representative.representative_id)
                        return representative
                    })
                    Promise.all(promise)
                    
                    
                    IDs.forEach( id => {
                        companies.list.forEach( company => {
                            if( id === company.representative_id ) {
                                names.push( {id: company.representative_id, name: company.original_name} )
                                return false;
                            }
                        })
                    })

                    
                    setSelectItems(IDs)
                    dispatch(setMainCompaniesSelected(IDs, names))
                } 
            }            
        }  

        getSelectedCompanies()
    }, [ companies.list ])

    

    /* useEffect(() => {
        setSelectedRow(companyRowSelect)
    }, [ companyRowSelect ]) */

    useEffect(() => {
        if( selectAll != undefined && selectAll === true && companies.list.length > 0 && intialization === false) {
            const all = [], allWithNames = []
            companies.list.map( company => {
                all.push( company.representative_id )
                allWithNames.push( {id: company.representative_id, name: company.original_name} )
            })
            setSelectItems(all)
            setInitialization( true )
            dispatch( setMainCompaniesSelected( all, allWithNames ) ) 
        }
    }, [ dispatch, selectAll, companies, intialization ])
    
    /* useEffect(() => {
        if(isLoadingCompanies === false){
            setCounter(companies.total_records)
        }        
    }, [isLoadingCompanies, companies]) */

    useEffect(() => {
        if( selectAll != undefined && (selectAll === false || selectAll === true )) {
            dispatch( setMainCompaniesAllSelected( selectAll ) ) 
        }
    }, [ dispatch, selectAll ])

    useEffect(() => {
        if((selectItems.length == 0 || selectItems.length != selected.length) ){
            setSelectItems(selected)
        }
    }, [ selected, selectItems ])

    /* useEffect(() => {
        
        if( defaultSelect != undefined && defaultSelect == 'first' ) {
            if(companies.list.length > 0 && initial === false) {
                setInitial( true )
                dispatch( setMainCompaniesAllSelected( false ) ) 
                updateCompanySelection( dispatch, companies.list[0], true, selected, defaultSelect )
            }
        }
    }, [ dispatch, companies, initial ]) */

    const updateCompanySelection = (event, dispatch, row, checked, selected, defaultSelect, currentSelection) => {
        if(checked != undefined) {
            let updateSelected = [...selected], updateSelectedWithName = [...selectedWithName]
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
            history.push({
                hash: updateHashLocation(location, 'companies', updateSelected).join('&')
            })
            dispatch(setMainCompaniesRowSelect([]))
            setSelectItems(updateSelected)
            updateUserCompanySelection(updateSelected)
            dispatch( setMainCompaniesSelected( updateSelected, updateSelectedWithName ) ) 
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

    const updateUserCompanySelection = async(representativeIDs) => {
        const form = new FormData();
        form.append('representative_id', JSON.stringify(representativeIDs))

        const { status } = await PatenTrackApi.saveUserCompanySelection(form)
    }

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
    
    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        /* dispatch(setMainCompaniesRowSelect([])) */
        if(checked === false) {
            setSelectItems([])
            dispatch( setMainCompaniesSelected([], []) )
        } else if( checked === true ){
            if(companies.list.length > 0) {
                const items = [], itemsWithName = []
                companies.list.forEach( company => {
                    items.push(company.representative_id)
                    itemsWithName.push({id: company.representative_id, name:company.original_name})
                })
                setSelectItems(items)
                dispatch( setMainCompaniesSelected(items, itemsWithName) )
            } 
        }
        dispatch( setMainCompaniesAllSelected( checked ) )
    }, [ dispatch, companies ]) 

    const handleOnClickLoadMore = useCallback(() => {
        dispatch(fetchParentCompanies( offset + DEFAULT_CUSTOMERS_LIMIT))
        setOffset(currOffset => (currOffset + DEFAULT_CUSTOMERS_LIMIT))
    }, [ dispatch, offset])

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

    const handleCounter = async(counter) => {
        let list = [...companiesList]
        const promise = list.map( (row, index) => {
            if( row.representative_id == currentSelection){                            
                list[index].child_total = counter
            }
            return row
        })
        await Promise.all(promise)
        console.log('handleCounter', list)
        setCompaniesList(list)
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
        rows={companiesList}
        rowHeight={rowHeight}
        headerHeight={headerRowHeight}
        columns={headerColumns}
        totalRows={companies.list.length}
        onSelect={handleClickRow}
        onSelectAll={handleSelectAll}
        defaultSelectAll={selectedCompaniesAll}
        resizeColumnsWidth={resizeColumnsWidth}
        resizeColumnsStop={resizeColumnsStop}
        collapsable={true}
        childHeight={childHeight}
        childSelect={childSelected}
        childRows={data}
        childCounterColumn={`child_total`}
        forceChildWaitCall={true}
        renderCollapsableComponent={
            <ChildTable parentCompanyId={currentSelection} headerRowDisabled={true} callBack={handleCounter}/>
        }
        responsive={true}
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