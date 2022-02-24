import React, { useCallback, useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper } from '@mui/material'
import useStyles from './styles' 
import VirtualizedTable from '../common/VirtualizedTable'
import Loader from '../common/Loader'
import {
    fetchParentCompanies,
} from '../../actions/patentTrackActions2'

const ClientList = () => {
    const COLUMNS = [
        {
            width: 20,
            minWidth: 20,
            label: '',
            dataKey: 'representative_id',
            headingIcon: 'company',
            role: "arrow",
            disableSort: true,
            showOnCondition: '0'
        },
        {
            width: 200,  
            minWidth: 200,
            oldWidth: 200,
            label: 'Clients',        
            dataKey: 'original_name',
            align: "left", 
        }
    ]
    const classes = useStyles()
    const dispatch = useDispatch()
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [ width, setWidth ] = useState( 1900 )
    const [ offset, setOffset ] = useState(0)
    const [sortField, setSortField] = useState(`original_name`)
    const [sortOrder, setSortOrder] = useState(`ASC`)
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ currentSelection, setCurrentSelection ] = useState(null)   
    const [ intialization, setInitialization ] = useState( false ) 
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectNames, setSelectNames] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ totalRecords, setTotalRecords ] = useState(0)
    const [ companiesList, setCompaniesList ] = useState([])
    const [ selectedGroup, setSelectGroups ] = useState([])
    const companies = useSelector( state => state.patenTrack2.mainCompaniesList )
    const isLoadingCompanies = useSelector( state => state.patenTrack2.mainCompaniesLoadingMore )
    const selected = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedWithName = useSelector( state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const selectedGroups = useSelector( state => state.patenTrack2.mainCompaniesList.selectedGroups)
    /**
     * Intialise company list
     */

    useEffect(() => {
        const initCompanies = async () => {
            dispatch(fetchParentCompanies( offset, sortField, sortOrder ) )
        } 
        initCompanies()  
    }, []) 

    /**
     * Set Total companies
     */

    useEffect(() => {
        setCompaniesList( companies.list )
        let counter = 0;

        if(companies.list.length > 0) {
            companies.list.map(row => {
                if(parseInt(row.type) == 1) {
                    const parseChild = JSON.parse(row.child)
                    if(parseChild.length > 0) {
                        counter += parseChild.length
                    } 
                }  else {
                    counter++;
                }
            })
            setTotalRecords(counter)
        }
    }, [ companies.list ])

    const handleClickRow = useCallback((event, row) => {

    })

    const handleSelectAll = useCallback((event, row) => {
        
    })

    if (isLoadingCompanies && companies.list.length == 0) return <Loader />

    return (
        <Paper className={classes.root} square id={`main_companies`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedIndex={currentSelection}
            selectedKey={'representative_id'} 
            selectedGroup={selectedGroup}
            disableRowKey={'type'}
            rows={companiesList}
            rowHeight={rowHeight}
            headerHeight={headerRowHeight}
            columns={headerColumns}
            totalRows={totalRecords}
            onSelect={handleClickRow}
            onSelectAll={handleSelectAll}
            defaultSelectAll={false}       
            defaultSortField={`original_name`}
            defaultSortDirection={`desc`}
            responsive={true}
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


export default ClientList;