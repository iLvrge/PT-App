import React, { useCallback, useMemo } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'
import useStyles from './styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Row from './Row'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import _get from 'lodash/get'

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
  return stabilizedThis.map((el) => el[0])
}

function filterSearch(array, search) {
  const text = (search || '').trim().toLowerCase()
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

export default function BaseTable({
  loading,
  search,
  rows,
  hideTableHead,
  selected = [],
  setSelected,
  expanded = [],
  setExpanded,
  childComponent,
  columns = [],
  idKey,
  setEditedRow,
  expandable,
  selectable,
  editable,
  editedRow,
  checkbox
}) {
  const classes = useStyles()
  const [ order, setOrder ] = React.useState(null)
  const [ orderBy, setOrderBy ] = React.useState(null)

  const allSelected = useMemo(() => selectable && (rows.length > 0 && selected.length === rows.length), [ rows, selected, selectable ])
  const allExpanded = useMemo(() => expandable && (rows.length > 0 && expanded.length === rows.length), [ rows, expanded, expandable ])

  const handleSelectAll = useCallback(() => {
    setSelected(allSelected ? [] : rows.map((row) => row[idKey]))
    
    if(checkbox){
      checkbox(allSelected ? [] : rows.map((row) => row[idKey]))
    }
  }, [ rows, idKey, allSelected, setSelected, checkbox ])

  const handleExpandAll = useCallback(() => {
    setExpanded(allExpanded ? [] : rows.map((row) => row[idKey]))
  }, [ rows, idKey, allExpanded, setExpanded ])

  const handleSelection = useCallback((id) => () => {
    setSelected((selected) => selected.includes(id) ? selected.filter(_id => _id !== id) : [ ...selected, id ])
    if(checkbox){
      checkbox(id)
    }
    
  }, [ setSelected, checkbox ])

  const handleExpand = useCallback((id) => (e) => {
    e.stopPropagation()
    setExpanded((expanded) => expanded.includes(id) ? expanded.filter(_id => _id !== id) : [ ...expanded, id ])
  }, [ setExpanded ])

  const onEdit = useCallback((row) => (e) => {
    e.stopPropagation()
    setEditedRow(row)
  }, [ setEditedRow ])

  const isSelected = useCallback((id) => selected.includes(id), [ selected ])
  const isExpanded = useCallback((id) => expanded.includes(id), [ expanded ])

  const createSortHandler = useCallback((property) => (event) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }, [ orderBy, order ])

  const filteredSortedRows = useMemo(() => {
    const filtered = filterSearch(rows || [], search)
    return stableSort(filtered, getComparator(order, orderBy))
  }, [ rows, search, order, orderBy ])

  return (
    <TableContainer className={classes.tableContainer}>
      <Table
        stickyHeader
        className={classes.table}
        aria-labelledby="tableTitle"
        size={'medium'}
        aria-label="enhanced table">
        {
          !hideTableHead && (
            <TableHead>
              <TableRow>
                {
                  expandable && (
                    <TableCell className={classes.actionTh} padding="none">
                      <IconButton size="small" onClick={handleExpandAll}>
                        {allExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                      </IconButton>
                    </TableCell>
                  )
                }

                {
                  selectable && (
                    <TableCell className={classes.actionTh} padding="none">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < rows.length}
                        checked={allSelected}
                        onChange={handleSelectAll}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                      />
                    </TableCell>
                  )
                }

                {
                  editable && (
                    <TableCell className={classes.actionTh} padding="none" />
                  )
                }

                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={classes.th}
                    align={column.alignCenter ? 'center' : (column.numeric ? 'right' : 'left')}
                    padding={column.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === column.id ? order : false}
                    style={column.width && {width: column.width}}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={createSortHandler(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )
        }
        <TableBody>
          {
            filteredSortedRows.length > 0 ? filteredSortedRows
              .map((row) => (
                <Row
                  childComponent={childComponent}
                  key={row[idKey]}
                  isSelected={isSelected(row[idKey])}
                  isExpanded={isExpanded(row[idKey])}
                  row={row}
                  isEdited={row[idKey] === _get(editedRow, idKey)}
                  selectable={selectable}
                  handleExpand={handleExpand(row[idKey])}
                  handleSelection={handleSelection(row[idKey])}
                  expandable={expandable}
                  editable={editable}
                  onEdit={onEdit}
                  columns={columns}
                />
              )) : (
              <TableRow className={classes.emptyTable}>
                <TableCell colSpan={columns.length + 2}>
                  <div>
                    {loading ? <CircularProgress /> : 'No Results'}
                  </div>
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
