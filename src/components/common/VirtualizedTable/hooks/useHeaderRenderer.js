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
  grandTotal,
  onChangeColumnFilters,
  resizeColumnsWidth,
  icon,
  checkedIcon
}) => {
  const classes = useStyles()
  const { align, role, disableSort, filterable, paddingLeft, badge, showGrandTotal, draggable } = columns[columnIndex]
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
          onSelectAll && <Checkbox checked={allSelected} onChange={onSelectAll} indeterminate={isIndeterminate} {...(icon != undefined ? { icon, checkedIcon } : {})}/>
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
                    {
                      role == 'slack_image'
                      ?
                      <svg style={{width: '24px', height: '24px'}} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg>
                      :
                      label
                    } {badge === true ? <Badge color='primary' max={99999} className={classes.badge} badgeContent={`(${numberWithCommas(totalRows)})`} showZero></Badge> : ''}
                    {showGrandTotal === true ? <Badge color='primary' max={99999} className={classes.badge} badgeContent={ `(${numberWithCommas(grandTotal > 0 ? grandTotal : rows.length > 0 && rows[rows.length - 1].grand_total ? rows[rows.length - 1].grand_total : 0)})`} showZero></Badge> : ''}
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

function useHeaderRenderer(rows, headerHeight, columns, createSortHandler, onSelectAll, allSelected, isIndeterminate, totalRows, grandTotal, onChangeColumnFilters, resizeColumnsWidth, icon, checkedIcon) {
  return useCallback(({ sortBy, dataKey, sortDirection, label, columnIndex }) => {
    return (
      <HeadCell
        columns={columns}
        columnIndex={columnIndex}
        headerHeight={headerHeight}
        createSortHandler={createSortHandler}
        onSelectAll={onSelectAll}
        icon={icon}
        checkedIcon={checkedIcon}
        allSelected={allSelected}
        isIndeterminate={isIndeterminate}
        sortBy={sortBy}
        dataKey={dataKey}
        sortDirection={sortDirection}
        label={label}
        rows={rows}
        totalRows={totalRows}
        grandTotal={grandTotal}
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
