import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import CircularProgress from '@material-ui/core/CircularProgress'
import AssetsRecordsTable from '../common/AssetsActivitiesManager/AssetsRecordsTable'
import AssetsCompletedActivitiesTable from '../common/AssetsActivitiesManager/AssetsCompletedActivitiesTable'


import {
  setAssetsRecordsDataCount,
  setAssetsCompletedActivitiesData,
  getAssetsActivitiesData,
  getAssetsCompletedActivitiesData,
  setAssetsErrorsDataCount,
  getAssetsErrorsDataCount
} from '../../actions/patentTrackActions2'

import { convertAssetTypeToTabId } from '../../utils/assetTypes'
import { numberWithCommas } from '../../utils/numbers'

import useStyles from './styles'


const ProgressView = () => {
  const classes = useStyles()

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)
  const selectedAssetsCustomers = useSelector(state => state.patenTrack2.selectedAssetsCustomers)
  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

  const lastRecordsCountTime = useSelector(state => state.assets.records.countTime)
  const assetsRecordsDataCount = useSelector(state => state.patenTrack2.assetsRecordsDataCount)
  const isLoadingAssetsRecordsDataCount = useSelector(state => state.patenTrack2.isLoadingAssetsRecordsDataCount)

  const assetsCompletedActivitiesDataCount = useSelector(state => state.patenTrack2.assetsCompActivitiesDataCount)
  const isLoadingAssetsCompletedActivitiesDataCount = useSelector(state => state.patenTrack2.isLoadingCompActivitiesDataCount)

  const [ selectedTab, setSelectedTab ] = useState(0)

  

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
                <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
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
            {selectedTab === 0 && <AssetsRecordsTable />}
            {selectedTab === 1 && <AssetsCompletedActivitiesTable />}
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

export default ProgressView