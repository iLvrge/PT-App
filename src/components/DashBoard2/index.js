import React, { Fragment, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import SplitPane from 'react-split-pane'

import useStyles from './styles'
import Header from '../Header'
import Loader from '../common/Loader'
import CompaniesSelector from '../common/CompaniesSelector'
import AssetsController from '../common/AssetsController'
import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import AssetsCharts from '../common/AssetsCharts'

import AssetsVisualizer from '../common/AssetsVisualizer'

import AssetsActivitiesManager from '../common/AssetsActivitiesManager'
import AssetsSummary from '../common/AssetsSummary'
import USPTOContainer from '../common/AssetsVisualizer/USPTOContainer'
import LifeSpanContainer from '../common/AssetsVisualizer/LifeSpanContainer'
import FamilyContainer from '../common/AssetsVisualizer/FamilyContainer'
import FamilyItemContainer from '../common/AssetsVisualizer/FamilyItemContainer'
import { toggleFamilyItemMode, toggleFamilyMode, toggleUsptoMode } from '../../actions/uiActions'
import clsx from 'clsx'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import RightGrid from './RightGrid'

const DashBoard2 = () => {
  const classes = useStyles()
  const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
  const dispatch = useDispatch()
  const authenticated = useSelector(store => store.auth.authenticated)
  const usptoMode = useSelector(state => state.ui.usptoMode)
  const lifeSpanMode = useSelector(state => state.ui.lifeSpanMode)
  const familyMode = useSelector(state => state.ui.familyMode)
  const familyItemMode = useSelector(state => state.ui.familyItemMode)
  const selectedAsset = useSelector(state => state.ui.timeline.selectedAsset)
  const selectedItem = useSelector(state => state.ui.timeline.selectedItem)
  const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
  const [illustrationRecord, setIllustrationRecord] = useState()

  const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
    setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
  }, [])


  const selectedAssetsFamily = useSelector(state => state.patenTrack.assetFamily)
  const selectedAssetsFamilyItem = useSelector(state => state.patenTrack.familyItem)

  const isLoadingDataInitialized = false


  if (!authenticated) return <Redirect to={'/'} />

  return (
    <div className={classes.root}>
      <Header />

      <AssetsSummary />

      {isLoadingDataInitialized ? (
        <Loader />
      ) : (
        <Grid container className={classes.dashboardWarapper}>
          <Grid container className={classes.dashboard}>
            <Grid
              item
              lg={2}
              md={2}
              sm={2}
              xs={2}
              className={classes.flexColumn}
            >
              <Grid
                item
                className={classes.flexColumn}
                style={{ flexGrow: 1, height: '100%', marginRight: 10, position: 'relative' }}
              >
                <SplitPane
                  className={classes.splitPane}
                  split="horizontal"
                  minSize={100}
                  maxSize={550}
                  defaultSize={'35%'}
                  onChange={(size) => localStorage.setItem('leftSplitPos', size)}
                >
                  <CompaniesSelector />
                  <AssetsController />
                </SplitPane>

              </Grid>
            </Grid>

            <Grid
              item
              lg={6}
              md={6}
              sm={6}
              xs={6}
              className={classes.flexColumn}
              style={{ flexGrow: 1, height: '100%', paddingRight: 10 }}
            >

              <SplitPane
                className={clsx(classes.splitPane, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                split="horizontal"
                minSize={100}
                defaultSize={'70%'}
                onChange={(size) => localStorage.setItem('midSplitPos', size)}
              >
                <AssetsVisualizer
                  toggleMinimize={toggleMinimizeAssetsCommentsTimeline}
                  isMinimized={assetsCommentsTimelineMinimized}
                  setIllustrationRecord={setIllustrationRecord} />

                <AssetsCommentsTimeline toggleMinimize={toggleMinimizeAssetsCommentsTimeline} />
              </SplitPane>
            </Grid>

            <RightGrid classes={classes} illustrationRecord={illustrationRecord} />
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export default DashBoard2
