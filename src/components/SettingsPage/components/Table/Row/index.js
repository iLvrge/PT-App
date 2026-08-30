import TableRow from '@mui/material/TableRow'
import clsx from 'clsx'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Checkbox from '@mui/material/Checkbox'
import EditIcon from '@mui/icons-material/Edit'
import React, { Fragment } from 'react'
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

  return (
    <Fragment>
      <TableRow
        className={clsx({ ["bg-white/[0.08]"]: isEdited })}
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
            <TableCell className={"!p-0 bg-[#121212]"} colSpan={6}>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box className={"mb-[-1px] ml-[25px] mt-0 shadow-[-1px_0px_2px_0_#292929]"}>
                  <ChildComponent className={"!p-0 bg-[#121212]"} row={row} />
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )
      }
    </Fragment>
  );
}
