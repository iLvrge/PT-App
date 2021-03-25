import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import AssetsErrorsTable from './AssetsErrorsTable'
import AssetsRecordsTable from './AssetsRecordsTable'
import AssetsCompletedActivitiesTable from './AssetsCompletedActivitiesTable'

import PatenTrackApi from '../../../api/patenTrack2'

import {
  setAssetsRecordsDataCount,
  setAssetsCompletedActivitiesData,
  getAssetsActivitiesData,
  getAssetsCompletedActivitiesData,
  setAssetsErrorsDataCount,
  getAssetsErrorsDataCount
} from '../../../actions/patentTrackActions2'

import { convertAssetTypeToTabId } from '../../../utils/assetTypes'
import { numberWithCommas } from '../../../utils/numbers'

import useStyles from './styles'
import Actions from './Actions'

import axios from 'axios'

const AssetsActivitiesManager = ({ data }) => {
  const classes = useStyles()

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)
  const selectedAssetsCustomers = useSelector(state => state.patenTrack2.selectedAssetsCustomers)
  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  

  /* const lastErrorsCountTime = 0//useSelector(state => state.assets.errors.countTime)
  const lastRecordsCountTime = 0//useSelector(state => state.assets.records.countTime)
  const lastCompletedCountTime = 0//useSelector(state => state.assets.completed.countTime) */

  const lastErrorsCountTime = useSelector(state => state.assets.errors.countTime)
  const lastRecordsCountTime = useSelector(state => state.assets.records.countTime)
  const lastCompletedCountTime = useSelector(state => state.assets.completed.countTime)

  const [ selectedTab, setSelectedTab ] = React.useState(0)

  const assetsErrorsDataCount = useSelector(state => state.patenTrack2.assetsErrorsDataCount)
  const isLoadingAssetsErrorsDataCount = useSelector(state => state.patenTrack2.isLoadingAssetsErrorsDataCount)

  const assetsRecordsDataCount = useSelector(state => state.patenTrack2.assetsRecordsDataCount)
  const isLoadingAssetsRecordsDataCount = useSelector(state => state.patenTrack2.isLoadingAssetsRecordsDataCount)

  const assetsCompletedActivitiesDataCount = useSelector(state => state.patenTrack2.assetsCompActivitiesDataCount)
  const isLoadingAssetsCompletedActivitiesDataCount = useSelector(state => state.patenTrack2.isLoadingCompActivitiesDataCount)

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
      dispatch(setAssetsRecordsDataCount(0))
      dispatch(setAssetsCompletedActivitiesData(0))
      dispatch(setAssetsErrorsDataCount(0))
    } else {
      dispatch(getAssetsActivitiesData())
      dispatch(getAssetsCompletedActivitiesData())
      dispatch(getAssetsErrorsDataCount(paramsUrl))
    }
  }, [ lastRecordsCountTime, selectedAssetsTypes, selectedCompaniesList ])

  return isLoading ? null : (
    <Paper className={classes.root} square>
      <div className={classes.toolbar}>
        <div className={classes.toolbarActions}>
          <Actions selectedTab={selectedTab} />
        </div>
        <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
          <Tab
            className={classes.tab}
            label={
              <TabLabel
                label={'Errors'}
                isLoading={isLoadingAssetsErrorsDataCount}
                count={assetsErrorsDataCount}
              />
            }
          />

          <Tab
            className={classes.tab}
            label={
              <TabLabel
                label={'In Process'}
                isLoading={isLoadingAssetsRecordsDataCount}
                count={assetsRecordsDataCount}
              />
            }
          />
          <Tab
            className={classes.tab}
            label={
              <TabLabel
                label={'Completed'}
                isLoading={isLoadingAssetsCompletedActivitiesDataCount}
                count={assetsCompletedActivitiesDataCount}
              />
            }
          />
        </Tabs>
      </div>
      
      {selectedTab === 0 && <AssetsErrorsTable />}
      {selectedTab === 1 && <AssetsRecordsTable />}
      {selectedTab === 2 && <AssetsCompletedActivitiesTable />}
      
    </Paper>
  )
}

const TabLabel = ({ label, isLoading, count }) => {
  const classes = useStyles()

  return (
    <div>
      <span className={classes.tabLabel}>{label}</span>
      {isLoading ? (
        <CircularProgress size={12} color="secondary" />
      ) : (
        <span>({numberWithCommas(count)})</span>
      )}
    </div>
  )
}

export default AssetsActivitiesManager