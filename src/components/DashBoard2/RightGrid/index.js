import Grid from '@material-ui/core/Grid'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import SplitPane from 'react-split-pane'
import IllustrationContainer from '../../common/AssetsVisualizer/IllustrationContainer'
import USPTOContainer from '../../common/AssetsVisualizer/USPTOContainer'
import FamilyItemContainer from '../../common/AssetsVisualizer/FamilyItemContainer'
import AssetsActivitiesManager from '../../common/AssetsActivitiesManager'
import FamilyContainer from '../../common/AssetsVisualizer/FamilyContainer'
import LifeSpanContainer from '../../common/AssetsVisualizer/LifeSpanContainer'
import PdfViewer from '../../common/PdfViewer'
import ConnectionBox from '../../common/ConnectionBox'
import AssetsCharts from '../../common/AssetsCharts'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTimelineSelectedItem, setTimelineSelectedAsset, toggleFamilyItemMode, toggleFamilyMode, toggleUsptoMode } from '../../../actions/uiActions'
import clsx from 'clsx'

const RightGrid = ({ classes, illustrationRecord }) => {
  
  const dispatch = useDispatch()
  const usptoMode = useSelector(state => state.ui.usptoMode)
  const lifeSpanMode = useSelector(state => state.ui.lifeSpanMode)
  const familyMode = useSelector(state => state.ui.familyMode)
  const familyItemMode = useSelector(state => state.ui.familyItemMode)
  const selectedTimelineAsset = useSelector(state => state.ui.timeline.selectedAsset)
  const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
  const selectedAssetsFamily = useSelector(state => state.patenTrack.assetFamily)
  const selectedAssetsFamilyItem = useSelector(state => state.patenTrack.familyItem)
  const pdfView = useSelector(state => state.patenTrack2.pdfView)
  const connectionBoxView = useSelector(state => state.patenTrack2.connectionBoxView)

  const onCloseUspto = useCallback(() => {
    dispatch(toggleUsptoMode( false ))
  }, [ dispatch ])

  const onCloseFamilyMode = useCallback(() => {
    dispatch(toggleFamilyMode())
  }, [ dispatch ])

  const onCloseFamilyItemMode = useCallback(() => {
    dispatch(toggleFamilyItemMode(false))
  }, [ dispatch ])

  const onClickAway = useCallback(() => {
    dispatch(setTimelineSelectedAsset(null))
  }, [ dispatch ])
  const [ isDrag, setIsDrag ] = useState(false)
  return (
    <Grid
      className={classes.flexColumn}
      item
      lg={4}
      md={4}
      sm={4}
      xs={4}
      style={{ flexGrow: 1, height: '100%' }}
    >
      {
        pdfView ? (<PdfViewer display={'false'} />) :
        <ClickAwayListener onClickAway={onClickAway}>
          <SplitPane
            className={clsx(classes.splitPane, { [classes.onDrag]: isDrag })}
            split="horizontal"
            minSize={100}
            defaultSize={'34.6%'}
            onDragStarted={() => setIsDrag(true)}
            onDragFinished={() => setIsDrag(false)}
            onChange={(size) => localStorage.setItem('midSplitPos', size)}
            primary='second'
          >

            {selectedTimelineAsset && (<IllustrationContainer asset={selectedTimelineAsset} />)}
            {selectedTimelineAsset && (<USPTOContainer asset={selectedTimelineAsset} />)}

            

            {
              connectionBoxView ?
              (<ConnectionBox display={'false'} assets={illustrationRecord} />)
              :
              (!selectedTimelineAsset && (
                familyItemMode ? (
                  <FamilyItemContainer item={selectedAssetsFamilyItem} onClose={onCloseFamilyItemMode} />) : (
                  <AssetsActivitiesManager />)
              ))
            }


            {
              !selectedTimelineAsset && (
                usptoMode ? (
                  <USPTOContainer
                    asset={assetIllustration} onClose={onCloseUspto} />
                ) : familyMode ? (
                  <FamilyContainer
                    family={selectedAssetsFamily}
                    onClose={onCloseFamilyMode} />) : lifeSpanMode ? (
                  <LifeSpanContainer />
                ) :  (<AssetsCharts />)
              )
            }

          </SplitPane>
        </ClickAwayListener>
      }
    </Grid>
  )
}

export default RightGrid
