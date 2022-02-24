import TableRow from '@mui/material/TableRow'
import clsx from 'clsx'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Checkbox from '@mui/material/Checkbox'
import EditIcon from '@mui/icons-material/Edit'
import React, { Fragment } from 'react'
import useStyles from './styles'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'

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
              <IconButton onClick={onEdit(row)} size="large">
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
              onClick={onClick && onClick(row[id], row)}> 
              {
                render ? render(row[id], row) : row[id]
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
  );
}
