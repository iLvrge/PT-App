import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from "react-router-dom";
import routes from "../../../routeList"; 
import _startCase from 'lodash/startCase'
import _intersection from 'lodash/intersection'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import ExpandMoreIcon from '@material-ui/icons/Remove'
import ExpandLessIcon from '@material-ui/icons/Add'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import CircularProgress from '@material-ui/core/CircularProgress'

import InfiniteScroll from 'react-infinite-scroll-component'

import {
  setSelectedAssetsTypes,
  getAssetsCustomers,
  getMoreAssetsCustomers,
  setSelectedAssetsCustomers,
  setSelectedAssetsTransactions,
  setSelectedAssetsPatents,
  setAssetsIllustration,
} from '../../../actions/patentTrackActions2'

import { toggleFamilyMode, toggleLifeSpanMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import { numberWithCommas } from '../../../utils/numbers'

import AssetCustomerRow from './AssetCustomerRow'
import useStyles from './styles'

const AssetTypeRow = ({ assetType, counter, isLoading }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)
  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const isLoadingCustomers = useSelector(state => state.patenTrack2.assetsCustomersLoading)
  const isLoadingMoreCustomers = useSelector(state => state.patenTrack2.assetsCustomersLoadingMore)
  const assetsCustomers = useSelector(state => state.patenTrack2.assets[assetType])
  const activeMenuButton = useSelector(state =>  state.patenTrack2.activeMenuButton )

  const [ isExpanded, setIsExpanded ] = useState(false) 
  const [ offset, setOffset ] = useState(DEFAULT_CUSTOMERS_LIMIT)

  const handleToggleAssetTypeCheckbox = useCallback(() => {
    let updatedSelectedAssetsTypes = []
    if (selectedAssetsTypes.includes(assetType)) {
      updatedSelectedAssetsTypes = selectedAssetsTypes.filter(
        existingAssetType => existingAssetType !== assetType,
      )
    } else {
      updatedSelectedAssetsTypes = [ ...selectedAssetsTypes, assetType ]
    }

    dispatch(setSelectedAssetsTypes(updatedSelectedAssetsTypes))
  }, [ assetType, dispatch, selectedAssetsTypes ])

  const handleToggleAssetsTypeListItem = useCallback(() => {
    if (!counter) return
    dispatch(setSelectedAssetsTypes([ assetType ]))
    dispatch(setAssetsIllustration(null))
  }, [ assetType, counter, dispatch ])

  const handleToggleExpandAssetType = useCallback(e => {
      e.stopPropagation()
      setIsExpanded(!isExpanded)
      if(!!isExpanded){
        if( activeMenuButton === 0 &&  location.pathname == "/review/transaction" ) history.push(routes.review) 
      }
    },
    [ isExpanded,  activeMenuButton],
  )

  useEffect(() => {
    if (!selectedAssetsTypes.includes(assetType)) {
      if(location.pathname === "/review") {
        dispatch(setSelectedAssetsCustomers([]))
        dispatch(setSelectedAssetsTransactions([]))
        dispatch(setSelectedAssetsPatents([]))
      }
    }
    dispatch(toggleFamilyMode(false))
    dispatch(toggleLifeSpanMode(false))
    dispatch(toggleFamilyItemMode(false))
  }, [ assetType, dispatch, selectedAssetsTypes, selectedCompaniesList, location ])

  useEffect(() => {
    if (isExpanded) {  
      const companyIds = selectedCompaniesList.map(company => company.id)
      dispatch(getAssetsCustomers(assetType, companyIds))
      setOffset(DEFAULT_CUSTOMERS_LIMIT)
    }
  }, [ assetType, dispatch, isExpanded, selectedCompaniesList ])

  useEffect(() => {
    setIsExpanded(false)
    setOffset(DEFAULT_CUSTOMERS_LIMIT)
  }, [ selectedCompaniesList ])

  const handleOnClickLoadMore = useCallback(() => {
    const companyIds = selectedCompaniesList.map(company => company.id)
    dispatch(getMoreAssetsCustomers(assetType, companyIds, offset))
    setOffset(currOffset => (currOffset + DEFAULT_CUSTOMERS_LIMIT))
  }, [ assetType, dispatch, offset, selectedCompaniesList ])

  return (
    <>
      <ListItem
        className={`${classes.listItem}`}
        disabled={!counter}
        button={Boolean(counter)}
        tabIndex={-1}
        selected={selectedAssetsTypes.includes(assetType) && Boolean(counter)}
        onClick={handleToggleAssetsTypeListItem}
        dense
      >
        <ListItemAvatar>
          {
            selectedAssetsTypes.includes(assetType) &&
            isLoadingCustomers &&
            isExpanded ? (
              <CircularProgress size={16} color='secondary' style={{marginTop: 4}} />
            ) : (
              <IconButton
                size="small"
                onClick={handleToggleExpandAssetType}
                disabled={!counter}
                className={classes.expandIcon}
              >
                {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            )
          }
        </ListItemAvatar>

        <ListItemText classes={{ primary: classes.listItemTextContainer }}>
          <Checkbox
            className={classes.checkbox}
            edge="end"
            onChange={handleToggleAssetTypeCheckbox}
            checked={selectedAssetsTypes.includes(assetType)}
          />
          <span className={classes.assetTitle}>{_startCase(assetType)}</span>
          <span className={classes.assetTitleTotalCount}>({numberWithCommas(counter)})</span>
        </ListItemText>
      </ListItem>

      <Divider component="li" />

      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
      > 
      {
        isExpanded &&
        <List
          dense
          disablePadding
          className={classes.listHeight}
          id={`collapse_list_${assetType}`}
        >
          <InfiniteScroll
            dataLength={Object.keys(assetsCustomers).length}
            next={handleOnClickLoadMore}
            hasMore={Object.keys(assetsCustomers).length < counter}
            scrollableTarget={`collapse_list_${assetType}`}
            loader={<div className={classes.listInfinityLoader} ><CircularProgress size={20} color='secondary' /></div>}
          >
            {
              assetsCustomers &&
                Object.keys(assetsCustomers).map(customerId => (
                  <AssetCustomerRow
                    key={`${assetType}-company-${assetsCustomers[customerId].company_id}-customer-${customerId}`}
                    assetType={assetType}
                    companyId={assetsCustomers[customerId].company_id}
                    customerId={customerId}
                  />
                ))
            }
          </InfiniteScroll>
        </List>
      }
      </Collapse>
    </>
  )
}

export default AssetTypeRow
