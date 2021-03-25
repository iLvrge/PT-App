import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'
import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import Loader from '../Loader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { getTransactions } from '../../../actions/patenTrackActions'

function TransactionsContainer(props) {
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ transactionCounter, setCounter ] = useState(0)
  const isExpanded = props.currentWidget === 'transactions'

  useEffect(() => {
    if (props.transactions.buy !== null) {
      const counter =
        parseInt(props.transactions.buy) +
        parseInt(props.transactions.sale) +
        parseInt(props.transactions.security) +
        parseInt(props.transactions.release) +
        parseInt(props.transactions.license_in) +
        parseInt(props.transactions.license_out)
      setCounter(counter)
    }
  }, [ props.transactions ])

  return (
    <div
      className={`info-box ${classes.transactionsContainer}`}
      onMouseOver={() => {
        setShowSwitcher(true)
      }}
      onMouseLeave={() => {
        setShowSwitcher(false)
      }}
    >
      <div
        className={classes.container}
        style={{ height: props.screenHeight / 7.5 }}
      >
        <div className={isExpanded ? classes.wrapperExpand : classes.wrapper}>
          <TableContainer>
            <Table
              className={'head_box_table update_table'}
              size="small"
              aria-label="a dense table"
            >
              <TableBody>
                <TableRow key={1}>
                  <TableCell
                    align="center"
                    colSpan={5}
                    className={'head_box_heading '}
                  >
                    <Typography variant="h6">
                      <span className={classes.fixedSpanWidth60}>
                        Transactions:&nbsp;
                      </span>
                      <span className={classes.fixedSpanWidth40}>
                        {transactionCounter.toLocaleString()}
                      </span>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key={2}>
                  <TableCell className={classes.cellText}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="left"
                    >
                      Buy
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cellNumber}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(props.transactions.buy).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell width="15px"></TableCell>
                  <TableCell className={classes.cellText}>
                    <Typography
                      variant="body1"
                      className={'white'}
                      align="left"
                    >
                      Sale
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cellNumber}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(props.transactions.sale).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key={3}>
                  <TableCell className={classes.cellText}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="left"
                    >
                      Security
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cellNumber}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(props.transactions.security).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell width="15px"></TableCell>
                  <TableCell className={classes.cellText}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="left"
                    >
                      Release
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cellNumber}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(props.transactions.release).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key={4}>
                  <TableCell className={classes.cellText}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="left"
                    >
                      LicIn
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cellNumber}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(props.transactions.license_in).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell width="15px"></TableCell>
                  <TableCell className={classes.cellText}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="left"
                    >
                      LicOut
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cellNumber}>
                    <Typography
                      variant="body1"
                      className={'white '}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(
                          props.transactions.license_out,
                        ).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <FullWidthSwitcher show={showSwitcher} widget={'transactions'} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    transactions: state.patenTrack.transactions,
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.transactionsLoading,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
  }
}

const mapDispatchToProps = {
  getTransactions,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionsContainer)
