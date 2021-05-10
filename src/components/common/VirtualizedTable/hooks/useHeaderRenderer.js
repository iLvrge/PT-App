import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TableCell from '@material-ui/core/TableCell'
import clsx from 'clsx'
import Checkbox from '@material-ui/core/Checkbox'
import { FilterList } from '@material-ui/icons'
import Badge from '@material-ui/core/Badge'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Menu from '@material-ui/core/Menu'
import Fade from '@material-ui/core/Fade'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Draggable from "react-draggable"
import _groupBy from 'lodash/groupBy'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

import { numberWithCommas } from '../../../../utils/numbers'

const useStyles = makeStyles(() => ({
  listItemIcon: {
    minWidth: 0,
  },
  filterList: {
    marginRight: 3,
    fontSize: 13,
  },
  th: {
    display: 'flex',
    border: 'none',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableCell: {
    flex: 1,
    whiteSpace: 'nowrap',
    border: 'none',
    alignItems: 'center',
    padding: '0',
  },
  paper: {
    maxHeight: 300,
    overflow: 'auto',
  },
  chip: {
    marginLeft: 15,
  },
  badge: {
    position: 'absolute',
    left: '35%',
    '& .MuiBadge-colorPrimary': {
      top: '12px',
      backgroundColor: 'inherit'
    }    
  }
}))

const HeadCell = ({
  headerHeight,
  createSortHandler,
  onSelectAll,
  allSelected,
  isIndeterminate,
  sortBy,
  dataKey,
  sortDirection,
  label,
  columns,
  columnIndex,
  rows,
  totalRows,
  onChangeColumnFilters,
  resizeColumnsWidth
}) => {
  const classes = useStyles()
  const { align, role, disableSort, filterable, paddingLeft, badge, draggable } = columns[columnIndex]
  const [ anchorEl, setAnchorEl ] = useState(null)
  const [ columnFilters, setColumnFilters ] = useState([])

  const openMenu = e => setAnchorEl(e.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  const filterValues = useMemo(() => {
    return Object.entries(_groupBy(rows, dataKey)).map(([ key, values ]) => ({ key, count: values.length }))
  }, [ rows, dataKey ])

  const onChangeFilter = (value) => () => (
    setColumnFilters(prevFilters => prevFilters.includes(value) ? prevFilters.filter((val) => val !== value) : [ ...prevFilters, value ])
  )

  useEffect(() => {
    onChangeColumnFilters(dataKey, columnFilters)
  }, [ onChangeColumnFilters, dataKey, columnFilters ])

  return (
    <TableCell
      component={'div'}
      padding={role === 'checkbox' ? 'none' : undefined}
      className={clsx(classes.tableCell, classes.flexContainer, classes.th)}
      variant="head"
      style={{ height: headerHeight, paddingLeft: paddingLeft != undefined ? paddingLeft : 'inherit' }}
      align={align}>
      {
        role === 'checkbox' ? (
          onSelectAll && <Checkbox checked={allSelected} onChange={onSelectAll} indeterminate={isIndeterminate} />
        ) : (
          <>
            {
              filterable && (
                <FilterList
                  className={classes.filterList}
                  color={columnFilters.length ? 'secondary' : 'inherit'}
                  size={'small'}
                  onClick={openMenu} />
              )
            }


            {
              disableSort ? label : (
                <TableSortLabel
                  onClick={createSortHandler(dataKey)}
                  active={dataKey === sortBy}
                  direction={sortDirection.toLowerCase()}>
                  {label} {badge === true ? <Badge color='primary' max={99999} className={classes.badge} badgeContent={`(${numberWithCommas(totalRows)})`} showZero></Badge> : ''}
                </TableSortLabel>
              )
            }

            { 
              (
                <Menu
                  anchorEl={anchorEl}
                  open={!!anchorEl}
                  onClose={closeMenu}
                  classes={{ paper: classes.paper }}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  TransitionComponent={Fade}>
                  {
                    filterValues.map(({ key, count }) => {
                      return (
                        <MenuItem key={key} onClick={onChangeFilter(key)}>
                          <ListItemIcon className={classes.listItemIcon}>
                            <Checkbox
                              checked={columnFilters.includes(key)}
                              edge="start"
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': 'labelId' }}
                            />
                          </ListItemIcon>
                          <ListItemText id={'labelId'} primary={key} />
                          <Chip className={classes.chip} label={count} size={'small'} variant={'outlined'} />
                        </MenuItem>
                      )
                    })
                  }
                </Menu>
              )
            }
          </>
        )
      }
      {
        draggable === true ?
        <Draggable
          axis="x"
          defaultClassName="DragHandle"
          defaultClassNameDragging="DragHandleActive"
          onDrag={(event, data) => 
            resizeColumnsWidth(
              dataKey,
              data
            )
          } 
          position={{ x: 0 }}
          zIndex={999}
        >
          <span className="DragHandleIcon">⋮</span>
        </Draggable>
        :
        ''
      }
    </TableCell>
  )
}

function useHeaderRenderer(rows, headerHeight, columns, createSortHandler, onSelectAll, allSelected, isIndeterminate, totalRows, onChangeColumnFilters, resizeColumnsWidth) {
  return useCallback(({ sortBy, dataKey, sortDirection, label, columnIndex }) => {
    return (
      <HeadCell
        columns={columns}
        columnIndex={columnIndex}
        headerHeight={headerHeight}
        createSortHandler={createSortHandler}
        onSelectAll={onSelectAll}
        allSelected={allSelected}
        isIndeterminate={isIndeterminate}
        sortBy={sortBy}
        dataKey={dataKey}
        sortDirection={sortDirection}
        label={label}
        rows={rows}
        totalRows={totalRows}
        onChangeColumnFilters={onChangeColumnFilters}
        resizeColumnsWidth={resizeColumnsWidth}
      />
    )
  }, [
    headerHeight,
    columns,
    createSortHandler,
    onSelectAll,
    allSelected,
    isIndeterminate,
    rows,
    totalRows,
    onChangeColumnFilters,
  ])
}


export default useHeaderRenderer

// checked={columnFilters.some((filter) => filter.columnName === column.name && filter.value === value)}
