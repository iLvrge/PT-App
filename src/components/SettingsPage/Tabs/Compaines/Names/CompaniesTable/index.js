import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import useStyles from './styles'
import Loader from '../../../../../common/Loader'
import Row from './Row'
import _map from 'lodash/map' 

import SlackImage from '../../../../../common/SlackImage'
import { Paper } from '@mui/material'
import PatenTrackApi from '../../../../../../api/patenTrack2' 
import { setCompanies } from '../../../../../../actions/patenTrackActions'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [ el, index ])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

function filterSearch(array, search) {
  const text = search.trim().toLowerCase()
  return array
    .filter(item => {
      return Object.values(item).some(prop => {
        if (typeof prop === 'string') {
          return prop.trim().toLowerCase().includes(text)
        }
        if (Array.isArray(prop)) {
          const res = filterSearch(prop, search)
          return res.length > 0
        }
        return false
      })
    })
}

const HEAD_CELLS = [
  /* {
    id: 'slack',
    numeric: false,
    disablePadding: true,
    label: 'Slack',
    align: 'left',
    class: '',
    width: 35
  }, */
  {
    id: 'original_name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
    align: 'left',
    class: '',
  },
  {
    id: 'counter',
    numeric: true,
    disablePadding: false,
    label: 'Assignments',
    align: 'center',
    class: '',
    alignCenter: true,
    width: 155
  },
]

function CompaniesTable({
  search,
  selected,
  setSelected,
  childCompaniesSelected,
  setChildCompaniesSelected,
}) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.patenTrack.companyListLoading)
  const companiesList = useSelector(state => state.patenTrack.companiesList)
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('name')

  useEffect(() => {
    setSelected([])
  }, [ setSelected, companiesList ])

  const rows = useMemo(() => {
    const filtered = filterSearch(companiesList, search)
    return stableSort(filtered, getComparator(order, orderBy))
  }, [ companiesList, search, order, orderBy ])

  const handleRequestSort = useCallback((event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }, [ order, orderBy ])

  const createSortHandler = useCallback(property => event => {
    handleRequestSort(event, property)
  }, [ handleRequestSort ])

  const onSelect = useCallback((event, row, type) => {
    if (type === 'parent') {
      setSelected((selected) => selected.includes(row.id) ? selected.filter(_id => _id !== row.id) : [ ...selected, row.id ])
      setChildCompaniesSelected((selection) => selection.filter(_id => row.children.findIndex(item => item.id === _id) === -1))
    } else {
      if(event.target.nodeName != 'DIV') { 
        setChildCompaniesSelected((selection) => selection.includes(row.id) ? selection.filter(_id => _id !== row.id) : [ ...selection, row.id ])
      }
    }
  }, [ setSelected, setChildCompaniesSelected ])

  const isSelected = id => selected.includes(id)
  // const isIndeterminate = children => !isSelected(children) && children.some(({ id }) => selected.includes(id))
  const isChildSelected = id => childCompaniesSelected.includes(id)

  // const allChildren = useMemo(() => rows.reduce((prev, item) => [ ...prev, ...item.children ], []), [ rows ])
  const isAllSelected =  useMemo(() => selected.length > 0 && selected.length === rows.length, [ selected, rows ])

  const onSelectAll = useCallback(() => {
    setSelected(isAllSelected ? [] : _map(rows, 'id'))
  }, [ setSelected, isAllSelected, rows ])

  const updateRowData = async(name, row) => {
    const form = new FormData()
    form.append('name', name)  
    const { data } = await PatenTrackApi.updateCompany(row.id, form) 
    if( data != null && data.length > 0) { 
      setSelected([])
      dispatch(setCompanies(data))
    }
  }

  const moveItem = async(parentId, item) => { 
    const form = new FormData()
    form.append('parent_id', parentId > 0 ? parentId : 0)  
    const { data } = await PatenTrackApi.updateCompany(item.id, form) 
    if( data != null && data.length > 0) {
      setSelected([])
      dispatch(setCompanies(data))
    }
  }

  return (
    <Paper square classes={classes.root}>
      {
        isLoading ? (
          <Loader />
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table
              className={classes.table}
              stickyHeader
              size={'medium'} 
              aria-label="collapsible table"> 
              <TableHead className={classes.tableHeading}>
                <TableRow className={classes.tableHeading}>
                  <TableCell className={classes.actionTh} padding="none" />

                  {/* <TableCell className={classes.actionTh} padding="none">
                    <Checkbox
                      onChange={onSelectAll}
                      checked={isAllSelected}
                      indeterminate={Boolean(selected.length && selected.length < rows.length)}
                    />
                  </TableCell> */}


                  {HEAD_CELLS.map(headCell => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.align}
                      padding={headCell.disablePadding ? 'none' : 'default'}
                      sortDirection={orderBy === headCell.id ? order : false}
                      className={
                        headCell.class !== '' ? classes[headCell.class] : ''
                      }
                      style={headCell.width && {width: headCell.width}}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}   
                        onClick={createSortHandler(headCell.id)}
                      >
                        
                        {
                          headCell.id === 'slack'
                          ?
                            <SlackImage/>
                          :
                            headCell.label
                        }
                        {orderBy === headCell.id ? (
                          <span className={classes.visuallyHidden}>
                              {order === 'desc'
                                ? 'sorted descending'
                                : 'sorted ascending'} 
                            </span>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map((row) => (
                    <Row
                      key={row.id}
                      row={row}
                      selected={selected}
                      onSelect={onSelect}
                      isSelected={isSelected}
                      isChildSelected={isChildSelected}
                      updateData={updateRowData}
                      moveItem={moveItem}
                    />
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
    </Paper>
  )
}

export default CompaniesTable
