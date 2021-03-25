import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import useStyles from './styles'

import TimelineContainer from './TimelineContainer'
import IllustrationContainer from './IllustrationContainer'
import IconButton from '@material-ui/core/IconButton'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import { ExpandLess, Close } from '@material-ui/icons'
import Modal from '@material-ui/core/Modal'
import Tooltip from '@material-ui/core/Tooltip'

const AssetsVisualizer = ({ toggleMinimize, isMinimized, setIllustrationRecord }) => {
  const classes = useStyles()

  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedAssetsCustomers = useSelector(state => state.patenTrack2.selectedAssetsCustomers)
  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  const companyListLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)

  const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)

  const handleClickOpenFullscreen = () => {
    setIsFullscreenOpen(true)
  }

  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false)
  }

  const shouldShowTimeline = useMemo(
    () => (!selectedAssetsPatents.length && !selectedAssetsTransactions.length && !assetIllustration),
    [ selectedAssetsPatents, selectedAssetsTransactions, assetIllustration ],
  )

  if (companyListLoading) {
    return null
  }

  const renderComponent = (wherefrom) => {
    if (shouldShowTimeline) {
      return <TimelineContainer />
    } else if((!wherefrom && !isFullscreenOpen) || (wherefrom && isFullscreenOpen)) {
      return <div className={classes.singleAssetContainer}>
          <IllustrationContainer isFullscreenOpen={isFullscreenOpen} asset={assetIllustration} setIllustrationRecord={setIllustrationRecord} />
        </div>
    }
  }

  return (
    <Paper className={classes.root} square>
      {renderComponent()}
      <IconButton size="small" className={classes.fullscreenBtn} onClick={handleClickOpenFullscreen}>
        <FullscreenIcon />
      </IconButton>

      {
        isMinimized && (
          <Tooltip title={'Shop Assets Timeline'}>
            <IconButton className={classes.undoMinimize} onClick={toggleMinimize}>
              <ExpandLess />
            </IconButton>
          </Tooltip>
        )
      }

      <Modal
        className={classes.fullscreenChartsModal}
        open={isFullscreenOpen}
      > 
        <Paper className={classes.fullscreenCharts} square>
          <IconButton onClick={handleCloseFullscreen} className={classes.right}>
            <Close />
          </IconButton>
          {renderComponent('fromModal')}
        </Paper>
      </Modal>


    </Paper>
  )
}

export default AssetsVisualizer
