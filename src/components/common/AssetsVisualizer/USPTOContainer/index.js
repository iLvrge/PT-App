import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'

import PatenTrackApi from '../../../../api/patenTrack2'
import { getAssetsUSPTO } from '../../../../actions/patentTrackActions2'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import axios from 'axios'

const USPTOContainer = ({ asset, onClose }) => {
  const dispatch = useDispatch()

  const isLoadingAssetUSPTO = useSelector(state => state.patenTrack2.loadingAssetIllustration)
  const USPTO = useSelector(state => state.patenTrack2.assetUSPTO)

  useEffect(() => {
    if( asset != null ) {
      if (asset.type === 'patent') {
        dispatch(getAssetsUSPTO(1, asset.id, asset.flag));
      } else if (asset.type === 'transaction') {
        dispatch(getAssetsUSPTO(0, asset.id));
      }
    }    
  }, [ asset, dispatch ])

  return (
    <div className="relative h-full w-full flex-1 overflow-auto [&_iframe]:border-0">
      {/* {
        onClose && (
          <IconButton className="absolute right-2.5 top-2.5 z-20 bg-[#303030] opacity-80 hover:bg-[#303030] hover:opacity-100" onClick={onClose} size={'small'}>
            <CloseIcon />
          </IconButton>
        )
      } */}
      <div className="absolute inset-0 h-full w-full">
        {
          isLoadingAssetUSPTO ?
            <CircularProgress className="absolute left-1/2 top-1/2 z-[100]" /> :
            (USPTO && (
                <iframe className="absolute inset-0 h-full w-full" src={USPTO.url} title={USPTO.url} />
              )
            )
        }
      </div>
    </div>
  )
}

export default USPTOContainer
