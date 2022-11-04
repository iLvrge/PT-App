import React, { useCallback } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import clsx from 'clsx'
import useStyles from './styles'
import Box from '@mui/material/Box'
import SlackImage from '../../../../../../common/SlackImage'

function Row({ onSelect, isSelected, isChildSelected, row }) {
  const [ open, setOpen ] = React.useState(false)
  const classes = useStyles()
  const toggleOpen = useCallback((e) => {
    e.stopPropagation()
    setOpen(open => !open)
  }, [])

  const removeFromSlack = (companyID) => {

  }

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
            style={{ visibility: row.children.length > 0 ? 'visible' : 'hidden' }}>
            {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        </TableCell>

        <TableCell className={classes.actionTh} padding="none">
          <Checkbox
            checked={isSelected(row.id)}
            value={row.id}
          />
        </TableCell>

        {/* <TableCell>
          {row.slack !== ''
            ? 
              <a onClick={() => removeFromSlack(row.id)}>
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon slackIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg style={{width: '24px', height: '24px'}} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg>
                  </span>
                </span>
              </a>
            : ''}
        </TableCell> */}

        <TableCell className={classes.padLR0}>
          {row.representative_name === null
            ? row.original_name
            : row.representative_name} {row.children.length > 0 ? `(${row.children.length})` : ''}
        </TableCell>

        <TableCell align={'center'}>
          {row.counter === null ? row.instances : row.counter}
        </TableCell>
      </TableRow>
      {
        row.children.length > 0 && (
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
                          <TableCell></TableCell>      
                          <TableCell className={classes.padLR0}>
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