import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
import CollapseLevel3 from './CollapseLevel3'
import {
  getFilterTimeLine,
  getCustomersNameCollections,
  setTimelineTabIndex,
} from '../../../actions/patenTrackActions'
import { signOut } from '../../../actions/authActions'

const useRowStyles = makeStyles({
  root1: {
    '& > *': {
      borderBottom: '1px solid white !important',
    },
    table: {
      minWidth: 650,
    },
  },
})

function Row(props) {
  const { row2, parentNodeParent, parentNodeParent1 } = props
  const row = row2
  const [ open, setOpen ] = React.useState(false)
  const classes = useRowStyles()

  const errorProcess = err => {
    if (
      err !== undefined &&
      err.status === 401 &&
      err.data === 'Authorization error'
    ) {
      props.signOut()
      return true
    }
    return false
  }

  const handleSelect = (
    event,
    nodeIds,
    level1,
    name,
    parentCompany,
    parentNodeId,
    parentName,
  ) => {
    setOpen(!open)

    if (nodeIds !== '') {
      const targetEvent = event.currentTarget
      const selectElement = 'NODE'
      if (selectElement !== null && selectElement !== undefined) {
        const itemText = name
        const parentElement = targetEvent.parentNode
        if (parentElement !== null) {
          const level = parentElement.getAttribute('level')
          const tabId = parentElement.getAttribute('tabid')
          // eslint-disable-next-line default-case
          switch (parseInt(level)) {
            case 1:
              props
                .getCustomersNameCollections(
                  itemText,
                  tabId,
                  parentNodeId,
                  nodeIds,
                )
                .catch(err => errorProcess({ ...err }.response))
              props
                .getFilterTimeLine(parentName, itemText, 1)
                .catch(err => errorProcess({ ...err }.response))
              if (props.timelineTab === 1) {
                props.setTimelineTabIndex(0)
              }
              break
          }
        }
      }
    }
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root1}>
        <TableCell node1={row.id} level={row.level} tabid={0}>
          <IconButton
            aria-label="expand row"
            size="small"
            // onClick={() => setOpen(!open)}
            onClick={event =>
              handleSelect(
                event,
                row.id,
                row.level,
                row.name,
                parentNodeParent.name,
                parentNodeParent.id,
                parentNodeParent.name,
              )
            }
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row ? row.id : ''}
        </TableCell>
        <TableCell setNodeName={row.name} align="left">
          {row ? row.name : ''}
        </TableCell>
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
              <TableRow>
                <TableCell />
                <TableCell style={{ width: '41%' }}>ID</TableCell>
                <TableCell style={{ width: '31%' }}>Name</TableCell>
                <TableCell style={{ width: '7%' }}>Level</TableCell>
              </TableRow>
              <TableBody>
                {row.child ? (
                  row.child.map(historyRow => (
                    <CollapseLevel3
                      row3={historyRow}
                      parentNodeParent1={row}
                      parentNodeParent={parentNodeParent}
                      {...props}
                    />
                  ))
                ) : (
                  <CollapseLevel3 row3={[]} {...props} />
                )}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

function CollapsibleTable(props) {
  const { row2, parentNodeParent } = props
  return (
    <>
      <Row
        key={row2.name}
        row2={row2}
        parentNodeParent={parentNodeParent}
        {...props}
      />
    </>
  )
}

const mapDispatchToProps = {
  getFilterTimeLine,
  getCustomersNameCollections,
  setTimelineTabIndex,
  signOut,
}

export default connect(null, mapDispatchToProps)(CollapsibleTable)
