import TableRow from '@material-ui/core/TableRow'
import clsx from 'clsx'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Checkbox from '@material-ui/core/Checkbox'
import EditIcon from '@material-ui/icons/Edit'
import React, { Fragment } from 'react'
import useStyles from './styles'
import Collapse from '@material-ui/core/Collapse'
import Box from '@material-ui/core/Box'

export default function Row({
  childComponent: ChildComponent,
  isSelected,
  isExpanded,
  row,
  isEdited,
  selectable,
  handleSelection,
  handleExpand,
  expandable,
  editable,
  onEdit,
  columns,
}) {
  const classes = useStyles()

  return (
    <Fragment>
      <TableRow
        className={clsx({ [classes.editedRow]: isEdited })}
        hover
        onClick={selectable ? handleSelection : undefined}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}>
        {
          expandable && (
            <TableCell padding="none">
              <IconButton onClick={handleExpand} size="small" style={{ visibility: row.expandable ? 'visible' : 'hidden' }}>
                {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            </TableCell>
          )
        }

        {
          selectable && (
            <TableCell padding="none">
              <Checkbox checked={isSelected} />
            </TableCell>
          )
        }

        {
          editable && (
            <TableCell padding="none">
              <IconButton onClick={onEdit(row)}>
                <EditIcon />
              </IconButton>
            </TableCell>
          )
        }

        {
          Object.values(columns).map(({ id, numeric, onClick, padding, render, alignCenter }) => (
            <TableCell
              key={id}
              padding={padding}
              align={alignCenter ? 'center' : (numeric ? 'right' : 'left')}
              component={row.component}
              onClick={onClick && onClick(row[id])}>
              {
                render ? render(row[id]) : row[id]
              }
            </TableCell>
          ))
        }
      </TableRow>
      {
        row.expandable && (
          <TableRow>
            <TableCell className={classes.childrenCell} colSpan={6}>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box className={classes.box}>
                  <ChildComponent className={classes.childrenCell} row={row} />
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )
      }
    </Fragment>
  )
}
