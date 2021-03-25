import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import useStyles from './styles'
import Header from '../Header'
import Charts from '../common/Charts'
import PdfViewer from '../common/PdfViewer'
import ConnectionBox from '../common/ConnectionBox'  
import UserSettings from '../common/UserSettings'
import UpdatedAssets from '../common/UpdatedAssests'
import ValidateCounter from '../common/ValidateCounter'
/* import TimeLineContainer from '../common/TimeLineContainer' */
import FixItemsContainer from '../common/FixItemsContainer'
import CommentComponents from '../common/CommentComponents'
import LevelsNestedTreeGrid from '../common/LevelsNestedTreeGrid'
import RecordItemsContainer from '../common/RecordItemsContainer'
import TransactionsContainer from '../common/TransactionsContainer'

import PatentrackDiagram from '../common/PatentrackDiagram'

import * as authActions from '../../actions/authActions'
import * as patentActions from '../../actions/patenTrackActions'

function DashBoard(props) {
  const { authenticated } = props.auth
  const classes = useStyles()
  const isMountedRef = useRef(null)

  const errorProcess = useCallback(err => {
    if (
      err !== undefined &&
      err.status === 401 &&
      err.data === 'Authorization error' &&
      isMountedRef.current
    ) {
      props.actions.signOut()
    }
  }, [ props.actions ])

  const targetRef = useRef(null)
  const [ parent_width, setParentWidth ] = useState(0)

  const callOutsideClick = useCallback(() => {
    window.addEventListener('click', function(event) {
      const modal = document.getElementById('timeline')
      console.log(event, event.target)
      if (event.target !== modal) {
        props.patentActions.setDisplayPopupAsset('none')
      }
    })
  }, [ props.patentActions ])

  useEffect(() => {
    if (targetRef.current) {
      console.log('PARENTWIDTH', targetRef.current.offsetWidth)
      setParentWidth(targetRef.current.offsetWidth)
      callOutsideClick()
    }
  }, [ callOutsideClick, props.popup_assets ])

  useEffect(() => {
    isMountedRef.current = true
    if (targetRef.current) {
      console.log('PARENTWIDTH', targetRef.current.offsetWidth)
      setParentWidth(targetRef.current.offsetWidth)
    }
    if (props.profile === null) {
      props.patentActions.getProfile(isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getAssetsCount(isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getMessagesCount().catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getAlertsCount().catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getCharts('tab1', isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions
        .getCustomers('acquisitions', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('sales', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('licenseIn', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('licenseOut', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('securities', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('mergerin', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('mergerout', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('options', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('courtOrders', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('employees', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getCustomers('other', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getRecordItems(1, 'count', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getRecordItems(1, 'list', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getRecordItems(2, 'count', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getRecordItems(2, 'list', isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      
      props.patentActions.getTimeLine(0, isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions
        .getTransactions(0, isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions.getAssetsCount(0, isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions
        .getValidateCounter(0, isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions.getLawyers(isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getDocuments(isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getUsers(isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getChartsOne(1, isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getChartsOne(2, isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getChartsOne(3, isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      props.patentActions.getChartsOne(4, isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
      /*props.patentActions.getChartsOne(5, isMountedRef.current).catch(err => {
        errorProcess({...err}.response); 
      }); */
      props.patentActions
        .getErrorItems('count', 0, isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions
        .getErrorItems('list', 0, isMountedRef.current)
        .catch(err => {
          errorProcess({ ...err }.response)
        })
      props.patentActions.getCompanies(isMountedRef.current).catch(err => {
        errorProcess({ ...err }.response)
      })
    }
    return () => (isMountedRef.current = false)
  }, [ props.profile, props.patentActions, errorProcess ])

  /**End all frontend request */

  const renderContext = () => {
    const { currentWidget } = props
    if (currentWidget === 'all') {
      return (
        <Grid container className={classes.dashboard}>
          <Grid item lg={2} md={2} sm={2} xs={2} className={classes.flexColumn}>
            <Grid
              item
              className={classes.flexColumn}
              style={{ flexGrow: 1, height: '100%' }}
            >
              <div style={{ height: '20%' }}>
                <ValidateCounter />
              </div>
              <div style={{ height: '60%' }}>
                <LevelsNestedTreeGrid />
              </div>
              <div style={{ height: '20%' }}>
                <TransactionsContainer />
              </div>
            </Grid>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            className={classes.flexColumn}
            style={{ flexGrow: 1 }}
          >
            <Grid
              item
              className={classes.flexColumn}
              style={{ flexGrow: 1, height: '80%' }}
            >
              {/* <TimeLineContainer /> */}
            </Grid>
            <Grid container style={{ height: '20%' }}>
              <Grid item lg={4} md={4} sm={4} xs={4}>
                <UpdatedAssets />
              </Grid>
              <Grid
                item
                lg={8}
                md={8}
                sm={8}
                xs={8}
                className={classes.flexColumn}
              >
                <CommentComponents />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            ref={targetRef}
            className={classes.flexColumn}
            item
            lg={4}
            md={4}
            sm={4}
            xs={4}
          >
            <Grid container style={{ flexGrow: 1, height: '70%' }}>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={`${classes.flexColumn} ${classes.customIndex}`}
                style={{ position: 'relative', display: props.pdfView === true ? '' : 'none', zIndex:10001 }}
              >
                <PdfViewer display={'false'} />
              </Grid>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={`${classes.flexColumn} ${classes.customIndex}`}
                style={{ position: 'relative', display: props.connectionBoxView === true ? '' : 'none', zIndex:10001 }}
              >
                <ConnectionBox display={'false'} />
              </Grid>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={`${classes.flexColumn} ${classes.customIndex} ${classes.backColor}`}
                style={{
                  position: 'absolute',
                  display: props.display_popup_asset,
                  zIndex: 10002,
                }}
              >
                {Object.keys(props.popup_assets).length > 0 && (
                  <PatentrackDiagram
                    data={props.popup_assets}
                    parentWidth={parent_width}
                    key={props.popup_assets + '_' + Math.random()}
                  />
                )}
              </Grid>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.flexColumn}
              >
                <FixItemsContainer display={'false'} />
              </Grid>
            </Grid>
            <Grid container style={{ height: '30%' }}>
              <Charts />
            </Grid>
          </Grid>
        </Grid>
      )
    }
    if (currentWidget === 'nestedTree') {
      return <LevelsNestedTreeGrid />
    }
    if (currentWidget === 'fixItems') {
      return <FixItemsContainer display={'true'} />
    }
    if (currentWidget === 'recordItems') {
      return <RecordItemsContainer display={'true'} />
    }
    if (currentWidget === 'charts') {
      return <Charts />
    }
    if (currentWidget === 'timeline') {
      /* return <TimeLineContainer /> */
    }
    if (currentWidget === 'comments') {
      return <CommentComponents />
    }
    if (currentWidget === 'validateCounter') {
      return <ValidateCounter />
    }
    if (currentWidget === 'updatedAssets') {
      return <UpdatedAssets />
    }
    if (currentWidget === 'transactions') {
      return <TransactionsContainer />
    }
    if (currentWidget === 'agreement') {
      return <PdfViewer display={'true'} />
    }
    if (currentWidget === 'settings') {
      return <UserSettings />
    }
  }

  if (!authenticated) return <Redirect to={'/'} />

  return (
    <div className={classes.container}>
      <Header />
      <Grid container className={classes.dashboardWarapper}>
        {renderContext()}
      </Grid>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    currentWidget: state.patenTrack.currentWidget,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
    profile:
      typeof state.patenTrack.profile === 'undefined'
        ? null
        : state.patenTrack.profile,
    display_popup_asset: state.patenTrack.display_popup_asset,
    popup_assets: state.patenTrack.popup_assets,
    pdfView: state.patenTrack.pdfView,
    connectionBoxView: state.patenTrack.connectionBoxView,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch),
    patentActions: bindActionCreators(patentActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard)
