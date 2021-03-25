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
import { getAssetsCount } from '../../../actions/patenTrackActions'

function UpdatedAssests(props) {
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const isExpanded = props.currentWidget === 'updatedAssets'
  const [ updateCounter, setCounter ] = useState(0)

  useEffect(() => {
    if (props.assetsCount.weekly_transactions !== null) {
      const counter =
        parseInt(props.assetsCount.weekly_transactions) +
        parseInt(props.assetsCount.weekly_applications) +
        parseInt(props.assetsCount.monthly_transactions) +
        parseInt(props.assetsCount.montly_applications) +
        parseInt(props.assetsCount.quaterly_transactions) +
        parseInt(props.assetsCount.quaterly_applications)
      setCounter(counter)
    }
  }, [ props.assetsCount ])

  return (
    <div
      className={`info-box ${classes.updatedAssetContainer}`}
      onMouseOver={() => {
        setShowSwitcher(true)
      }}
      onMouseLeave={() => {
        setShowSwitcher(false)
      }}
    >
      <div
        className={classes.container}
        style={{ minHeight: props.screenHeight / 7.5 }}
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
                  <TableCell align="center" colSpan={3}>
                    <Typography variant="h6">
                      <span className={classes.fixedSpanWidth70}>
                        Updates:&nbsp;
                      </span>
                      <span className={classes.fixedSpanWidth30}>
                        {updateCounter.toLocaleString()}
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
                      7 days
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
                          props.assetsCount.weekly_transactions,
                        ).toLocaleString()
                      )}
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
                          props.assetsCount.weekly_applications,
                        ).toLocaleString()
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
                      30 days
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
                          props.assetsCount.monthly_transactions,
                        ).toLocaleString()
                      )}
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
                          props.assetsCount.montly_applications,
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
                      100 days
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
                          props.assetsCount.quaterly_transactions,
                        ).toLocaleString()
                      )}
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
                          props.assetsCount.quaterly_applications,
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
      <FullWidthSwitcher show={showSwitcher} widget={'updatedAssets'} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    assetsCount: state.patenTrack.assetsCount,
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.assetsCountLoading,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
  }
}

const mapDispatchToProps = {
  getAssetsCount,
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatedAssests)
