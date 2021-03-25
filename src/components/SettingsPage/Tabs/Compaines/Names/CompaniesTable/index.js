import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import useStyles from './styles'
import Loader from '../../../../../common/Loader'
import Row from './Row'
import Checkbox from '@material-ui/core/Checkbox'
import _map from 'lodash/map'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

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
    width: 135
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
      setChildCompaniesSelected((childCompaniesSelected) => childCompaniesSelected.filter(_id => row.children.findIndex(item => item.id === _id) === -1))
    } else {
      setChildCompaniesSelected((childCompaniesSelected) => childCompaniesSelected.includes(row.id) ? childCompaniesSelected.filter(_id => _id !== row.id) : [ ...childCompaniesSelected, row.id ])
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

  return (
    <Fragment>
      {
        isLoading ? (
          <Loader />
        ) : (
          <TableContainer>
            <Table
              className={classes.table}
              stickyHeader
              size={'medium'}
              aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.actionTh} padding="none" />

                  <TableCell className={classes.actionTh} padding="none">
                    <Checkbox
                      onChange={onSelectAll}
                      checked={isAllSelected}
                      indeterminate={Boolean(selected.length && selected.length < rows.length)}
                    />
                  </TableCell>


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
                        {headCell.label}
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
                      onSelect={onSelect}
                      isSelected={isSelected}
                      isChildSelected={isChildSelected}
                    />
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
    </Fragment>
  )
}

export default CompaniesTable
