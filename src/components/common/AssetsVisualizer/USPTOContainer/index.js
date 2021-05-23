import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'

import PatenTrackApi from '../../../../api/patenTrack2'
import { getAssetsUSPTO } from '../../../../actions/patentTrackActions2'

import useStyles from './styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import axios from 'axios'

const USPTOContainer = ({ asset, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const isLoadingAssetUSPTO = useSelector(state => state.patenTrack2.loadingAssetIllustration)
  const USPTO = useSelector(state => state.patenTrack2.assetUSPTO)

  useEffect(() => {
    if( asset != null ) {
      if (asset.type === 'patent') {
        dispatch(getAssetsUSPTO(1, asset.id));
      } else if (asset.type === 'transaction') {
        dispatch(getAssetsUSPTO(0, asset.id));
      }
    }    
  }, [ asset, dispatch ])

  return (
    <div className={classes.root}>
      {/* {
        onClose && (
          <IconButton className={classes.close} onClick={onClose} size={'small'}>
            <CloseIcon />
          </IconButton>
        )
      } */}
      <div className={classes.forceStrech}>
        {
          isLoadingAssetUSPTO ?
            <CircularProgress className={classes.loader} /> :
            (USPTO && (
                <iframe className={classes.forceStrech} src={USPTO.url} title={USPTO.url} />
              )
            )
        }
      </div>
    </div>
  )
}

export default USPTOContainer
