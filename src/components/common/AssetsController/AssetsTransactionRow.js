import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation  } from 'react-router-dom'
import routes from '../../../routeList'
import _startCase from 'lodash/startCase'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/Remove'
import ExpandLessIcon from '@material-ui/icons/Add'
import CircularProgress from '@material-ui/core/CircularProgress'

import {
  setAssetsPatents,
  getAssetsPatents,
  getAssetsTransactionsEvents,  
  setSelectedAssetsTransactions,
  setAssetsIllustration,
  setSelectedAssetsPatents,
  setCommentsEntity,
} from '../../../actions/patentTrackActions2'

import { toggleFamilyMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import InfiniteScroll from 'react-infinite-scroll-component'

import { DEFAULT_PATENTS_LIMIT } from '../../../api/patenTrack2'

import { numberWithCommas } from '../../../utils/numbers'
import queryString from 'query-string';

import AssetsPatentRow from './AssetsPatentRow'
import useStyles from './styles'

const AssetsTransactionRow = ({
  assetType,
  companyId,
  customerId,
  transactionId,
}) => {
  
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [ offset, setOffset ] = useState(0)
  const [width, setWidth] = useState(30)
  const [width2, setWidth2] = useState(10)

  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const isLoadingAssetsPatents = useSelector(state => state.patenTrack2.assetsPatentsLoading)
  const assetsTransaction = useSelector(state => state.patenTrack2.assets[assetType][customerId].transactions[transactionId])
  const activeMenuButton = useSelector(state =>  state.patenTrack2.activeMenuButton )
  const [ isExpanded, setIsExpanded ] = useState(false)

  const handleToggleAssetsTransactionListItem = useCallback(() => {
    dispatch(setSelectedAssetsPatents([])) //temporary disable
    dispatch(setSelectedAssetsTransactions([ transactionId ]))
    if(Object.keys(assetsTransaction).length > 0) {
      dispatch(
        setAssetsIllustration({ type: 'transaction', id: assetsTransaction.id }),
        dispatch(setCommentsEntity({ type: 'transaction', id: assetsTransaction.id }))
      )
    }
    
    dispatch(toggleFamilyMode(false))
    dispatch(toggleFamilyItemMode(false))
    dispatch(getAssetsTransactionsEvents(assetType, companyId, customerId, assetsTransaction.id))
    /* history.push(routes.review5) */ 
    if(activeMenuButton === 0 && location.pathname == "/review/transaction") {
      history.push({
        pathname: routes.review4,
        state: {transactionId: transactionId}
      })
    } else {
      const querystring = queryString.parse( location.search )
      if( Object.keys(querystring).length > 0 && querystring.select != '' ){
        history.push({
          pathname: routes.review4,
          search: '',
          state: {transactionId: transactionId}
        })
      }      
    }
  }, [ dispatch, assetType, companyId, customerId, transactionId, assetsTransaction, activeMenuButton ])

  const handleToggleExpandAssetTransaction = useCallback(e => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
    
  }, [ isExpanded ])

  useEffect(() => {
    if(location.state && Object.keys(location.state).length > 0){

      if(location.state.transactionId){
        if (!selectedAssetsTransactions.includes(transactionId)) {
          dispatch(setSelectedAssetsTransactions([ location.state.transactionId ]))
          setIsExpanded(true)
          setWidth(0)
          setWidth2(0)
        }
      }
      if(location.state.hasOwnProperty('width')){
        setWidth(0)
        setWidth2(0)
      }
    }
  }, [location, width])

  useEffect(() => {
    if (!selectedAssetsTransactions.includes(transactionId)) {
      setIsExpanded(false)
      dispatch(setSelectedAssetsPatents([])) //temporary disable
    } else {
      setIsExpanded(true)
    }
  }, [ transactionId, selectedAssetsTransactions, dispatch ])

  useEffect(() => {
    if (isExpanded) {
      
      dispatch(
        getAssetsPatents(assetType, companyId, customerId, transactionId, 0),
      )
      setOffset(DEFAULT_PATENTS_LIMIT)
    } else {
      dispatch(
        setAssetsPatents(assetType, companyId, customerId, transactionId, []),
      )
      setOffset(0)
    }
    
  }, [ assetType, companyId, customerId, dispatch, isExpanded, transactionId ])

  const handleInfinityLoadMore = useCallback(() => {
    dispatch(getAssetsPatents(assetType, companyId, customerId, transactionId, offset))
    setOffset(currOffset => (currOffset + DEFAULT_PATENTS_LIMIT))
  }, [ assetType, companyId, customerId, dispatch, isExpanded, transactionId, offset ])

  
  return  (
    <>
      <ListItem
        className={`${classes.listItem}`}
        tabIndex={-1}
        selected={selectedAssetsTransactions.includes(transactionId)}
        onClick={handleToggleAssetsTransactionListItem}
        dense
      >
        <Box width={width} />   
        <ListItemAvatar>
          {
            selectedAssetsTransactions.includes(transactionId) &&
            isLoadingAssetsPatents &&
            isExpanded ? (
              <CircularProgress size={16} color={'#fff'} style={{marginTop: 4}} />
            ) : (
              <IconButton 
                className={classes.expandIcon}
                size="small" 
                onClick={handleToggleExpandAssetTransaction}
              >
                {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            )
          }
        </ListItemAvatar>

        <Box width={width2} />

        <ListItemText
          primary={`${assetsTransaction.exec_dt} (${numberWithCommas(assetsTransaction.totalAssets)})`}
        />
      </ListItem>

      <Divider component="li" />

      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
      >
        <List
          dense
          disablePadding
          className={classes.listHeight}
          id={`collapse_list_patents_${transactionId}`}
        >
          {assetsTransaction.patents && Object.keys(assetsTransaction.patents).length >= 0 &&
            <InfiniteScroll
              dataLength={Object.keys(assetsTransaction.patents).length}
              next={handleInfinityLoadMore}
              hasMore={Object.keys(assetsTransaction.patents).length < assetsTransaction.totalAssets}
              scrollableTarget={`collapse_list_patents_${transactionId}`}
              loader={<div className={classes.listInfinityLoader} ><CircularProgress size={20} color='secondary' /></div>}
            >
              {Object.keys(assetsTransaction.patents).map((patentId, index) => (
                <AssetsPatentRow
                  key={`${assetType}-company-${companyId}-customer-${customerId}-transaction-${transactionId}-patent-${patentId}`}
                  index={index}
                  assetType={assetType}
                  companyId={companyId}
                  customerId={customerId}
                  transactionId={transactionId}
                  patentId={patentId}
                />
              ))}
            </InfiniteScroll>
          }
        </List>
      </Collapse>
      <Divider component="li" />
    </>
  )
}

export default AssetsTransactionRow
