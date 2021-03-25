import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TableHeaderRow } from '@devexpress/dx-react-grid-material-ui'
import { FilterList } from '@material-ui/icons'
import Menu from '@material-ui/core/Menu'
import Fade from '@material-ui/core/Fade'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import useStyles from './styles'
import MenuItem from '@material-ui/core/MenuItem'
import _isEqual from 'lodash/isEqual'
import _find from 'lodash/find'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'

const HeaderCell = ({
  column,
  columnFilterValues,
  setHeaderFilters,
  headerFilters,
  children,
  ...restProps
}) => {
  const classes = useStyles()
  const [ anchorEl, setAnchorEl ] = React.useState(null)
  const [ columnFilters, setColumnFilters ] = useState([])

  const openMenu = e => setAnchorEl(e.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  const getChangeFilter = useCallback(value => () => {
    const columnFilter = { columnName: column.name, value }

    setColumnFilters(
      (filters) => (
        filters.some((filter) => _isEqual(filter, columnFilter)) ? (
          filters.filter((filter) => !_isEqual(filter, columnFilter))
        ) : [ ...filters, columnFilter ]
      ),
    )

  }, [ column.name ])

  useEffect(() => {
    setHeaderFilters(headerFilters => {
      if (columnFilters.length) {
        if (_find(headerFilters, { id: column.name })) {
          return headerFilters.map((filter) => {
            if (filter.id === column.name) {
              return { ...filter, filters: columnFilters }
            }
            return filter
          })
        }
        return [
          ...headerFilters,
          {
            id: column.name,
            operator: 'or',
            filters: columnFilters,
          },
        ]
      }
      return headerFilters.filter(({ id }) => id === column.name)
    })
  }, [ setHeaderFilters, column.name, columnFilters ])

  const filterValues = useMemo(() => [ ...columnFilterValues[column.name] ], [ columnFilterValues, column.name ])

  return (
    <TableHeaderRow.Cell {...restProps} column={column}>
      <>
        <FilterList color={columnFilters.length ? 'secondary' : 'inherit'} size={'small'} onClick={openMenu} />
        {children}
      </>
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
              filterValues.map(value => {
                return (
                  <MenuItem key={value} dense button onClick={getChangeFilter(value)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={columnFilters.some((filter) => filter.columnName === column.name && filter.value === value)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': 'labelId' }}
                      />
                    </ListItemIcon>
                    <ListItemText id={'labelId'} primary={value} />
                  </MenuItem>
                )
              })
            }
          </Menu>
        )
      }
    </TableHeaderRow.Cell>
  )
}

export default HeaderCell
