import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import 'font-awesome/css/font-awesome.min.css'
import Loader from '../Loader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { getValidateCounter } from '../../../actions/patenTrackActions'

function ValidateCounter(props) {
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const isExpanded = props.currentWidget === 'validateCounter'

  const [ validityCounter, setCounter ] = useState(0)

  useEffect(() => {
    if (props.validateCounter.application !== null) {
      const counter =
        parseInt(props.validateCounter.application) +
        parseInt(props.validateCounter.patent)
      setCounter(counter)
    }
  }, [ props.validateCounter ])

  return (
    <div
      className={`info-box ${classes.validateContainer}`}
      onMouseOver={() => {
        setShowSwitcher(true)
      }}
      onMouseLeave={() => {
        setShowSwitcher(false)
      }}
    >
      <div className={classes.container}>
        <div className={isExpanded ? classes.wrapperExpand : classes.wrapper}>
          <TableContainer>
            <Table
              className={`head_box_table update_table  ${classes.table}`}
              size="small"
              aria-label="a dense table"
            >
              <TableBody>
                <TableRow key={1}>
                  <TableCell align="center" colSpan={2}>
                    <Typography variant="h6" className={'red'}>
                      <span className={classes.fixedSpanWidth60}>
                        Assets:&nbsp;
                      </span>
                      <span className={classes.fixedSpanWidth40}>
                        {validityCounter.toLocaleString()}
                      </span>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key={2}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      className={'white'}
                      align="left"
                    >
                      Patents
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      className={'white'}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(props.validateCounter.patent).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key={3}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      className={'white'}
                      align="left"
                    >
                      Applications
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      className={'white'}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(
                          props.validateCounter.application,
                        ).toLocaleString()
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key={4}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      className={'white'}
                      align="left"
                    >
                      Encumbered
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      className={'white'}
                      align="right"
                    >
                      {props.isLoading ? (
                        <Loader />
                      ) : (
                        parseInt(
                          props.validateCounter.encumbered,
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
      <FullWidthSwitcher show={showSwitcher} widget={'validateCounter'} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    validateCounter: state.patenTrack.validateCounter,
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.validateCounterLoading,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
  }
}

const mapDispatchToProps = {
  getValidateCounter,
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidateCounter)
