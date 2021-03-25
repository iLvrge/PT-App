import React, { useCallback } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import clsx from 'clsx'
import useStyles from './styles'
import Box from '@material-ui/core/Box'

function Row({ onSelect, isSelected, isChildSelected, row }) {
  const [ open, setOpen ] = React.useState(false)
  const classes = useStyles()
  const toggleOpen = useCallback((e) => {
    e.stopPropagation()
    setOpen(open => !open)
  }, [])

  return (
    <React.Fragment>
      <TableRow
        className={clsx({ [classes.expand]: open })}
        hover
        onClick={event => onSelect(event, row, 'parent')}
        selected={isSelected(row.id)}
        role="checkbox"
        tabIndex={-1}
        key={row.id}>

        <TableCell padding="none">
          <IconButton
            onClick={toggleOpen} size="small"
            style={{ visibility: row.children.length > 1 ? 'visible' : 'hidden' }}>
            {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        </TableCell>

        <TableCell className={classes.actionTh} padding="none">
          <Checkbox
            checked={isSelected(row.id)}
            value={row.id}
          />
        </TableCell>

        <TableCell>
          {row.representative_name === null
            ? row.original_name
            : row.representative_name} {row.children.length > 1 ? `(${row.children.length})` : ''}
        </TableCell>

        <TableCell align={'center'}>
          {row.counter === null ? row.instances : row.counter}
        </TableCell>
      </TableRow>
      {
        row.children.length > 1 && (
          <TableRow>
            <TableCell className={classes.collapsedCell} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box className={classes.box}>
                  <Table>
                    <TableBody>
                      {row.children.map((company, idx) => (
                        <TableRow
                          hover
                          onClick={event => !(isSelected(row.id)) && onSelect(event, company, 'child')}
                          role="checkbox"
                          aria-checked={isChildSelected(company.id)}
                          tabIndex={-1}
                          key={`${company.id}_child`}
                          selected={isChildSelected(company.id)}
                        >
                          <TableCell className={classes.actionCell}>
                            <Checkbox
                              checked={isChildSelected(company.id)}
                              inputProps={{
                                'aria-labelledby': `enhanced-table-checkbox-${idx}`,
                              }}
                              parent={row.id}
                              value={company.id}
                              disabled={isSelected(row.id)}
                            />
                          </TableCell>

                          <TableCell>
                            {company.original_name}
                          </TableCell>

                          <TableCell align={'center'}>
                            {company.counter}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )
      }
    </React.Fragment>
  )
}

export default Row