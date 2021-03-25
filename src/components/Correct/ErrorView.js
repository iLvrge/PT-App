import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import AssetsErrorsTable from '../common/AssetsActivitiesManager/AssetsErrorsTable'

import {
  setAssetsErrorsDataCount,
  getAssetsErrorsDataCount
} from '../../actions/patentTrackActions2'

import { convertAssetTypeToTabId } from '../../utils/assetTypes'
import { numberWithCommas } from '../../utils/numbers'

import useStyles from './styles'

const ErrorView = ({ data }) => {
  const classes = useStyles()

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)
  const selectedAssetsCustomers = useSelector(state => state.patenTrack2.selectedAssetsCustomers)
  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

  const lastErrorsCountTime = useSelector(state => state.assets.errors.countTime)

  const [ selectedTab, setSelectedTab ] = React.useState(0)

  const assetsErrorsDataCount = useSelector(state => state.patenTrack2.assetsErrorsDataCount)
  const isLoadingAssetsErrorsDataCount = useSelector(state => state.patenTrack2.isLoadingAssetsErrorsDataCount)

  const handleChangeTab = (event, newTab) => setSelectedTab(newTab)

  const paramsUrl = useMemo(() => {
    const tabIds = selectedAssetsTypes.map(assetsType =>
      convertAssetTypeToTabId(assetsType),
    )
    return [
      selectedAssetsTypes.length && `tabs=[${encodeURI(tabIds)}]`,
      selectedCompaniesList.length && `companies=[${encodeURI(selectedCompaniesList.map(company => company.id))}]`,
      selectedAssetsCustomers.length && `customers=[${encodeURI(selectedAssetsCustomers)}]`,
      selectedAssetsTransactions.length && `transactions=[${encodeURI(selectedAssetsTransactions)}]`,
      selectedAssetsPatents.length && `patents=[${encodeURI(selectedAssetsPatents)}]`,
      'count=true',
    ].filter(Boolean).join('&')
  }, [ selectedCompaniesList, selectedAssetsCustomers, selectedAssetsPatents, selectedAssetsTransactions, selectedAssetsTypes ])

  useEffect(() => {
    if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) {
      dispatch(setAssetsErrorsDataCount(0))
    } else {
      dispatch(getAssetsErrorsDataCount(paramsUrl))
    }
  }, [ lastErrorsCountTime, selectedAssetsTypes, selectedCompaniesList ])

  return isLoading ? null : (
    <Paper className={classes.root} square>
        <div className={classes.toolbar}>
            <Typography>
                <TabLabel
                    label={'Errors'}
                    isLoading={isLoadingAssetsErrorsDataCount}
                    count={assetsErrorsDataCount}
                />
            </Typography> 
        </div>
      {selectedTab === 0 && <AssetsErrorsTable />}
    </Paper>
  )
}

const TabLabel = ({ label, isLoading, count }) => {
  const classes = useStyles()

  return (
    <>
      <span className={classes.tabLabel}>{label}</span>
      {isLoading ? (
        <CircularProgress size={12} color="secondary" />
      ) : (
        <span>({numberWithCommas(count)})</span>
      )}
    </>
  )
}

export default ErrorView