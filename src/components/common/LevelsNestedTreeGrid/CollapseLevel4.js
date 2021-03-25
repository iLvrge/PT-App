import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
// import CollapsibleTable3 from './CollapsibleTable3'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: '1px solid white !important',
    },
  },
})

function RowWithoutCollapse(props) {
  const { row5 } = props
  const [ open, setOpen ] = React.useState(false)
  const row = row5

  const classes = useRowStyles()
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {' '}
          </IconButton>
        </TableCell>
        {/* <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell /> */}
        <TableCell component="th" scope="row">
          {row ? row.id : ''}
        </TableCell>
        <TableCell align="left">{row ? row.name : ''}</TableCell>
        <TableCell align="left">{row ? row.level : ''}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          colSpan={4}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table aria-label="collapsible table">
              <TableBody></TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function CollapsibleTable(props) {
  const { row4, parentNodeParent } = props
  return (
    <>
      <TableRow>
        {/* <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell /> */}
        <TableCell />
        <TableCell style={{ width: '37%' }}>ID</TableCell>
        <TableCell style={{ width: '23%' }}>Name</TableCell>
        <TableCell style={{ width: '7%' }}>Level</TableCell>
      </TableRow>
      {
        <RowWithoutCollapse
          key={row4.name}
          row5={row4}
          parentNodeParent={parentNodeParent}
        />
      }
    </>
  )
}