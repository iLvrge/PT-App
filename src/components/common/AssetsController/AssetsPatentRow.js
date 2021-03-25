import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import routes from '../../../routeList'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import queryString from 'query-string';

import useStyles from './styles'
import { 
  setAssetsIllustration, 
  setSelectedAssetsPatents,
  setCommentsEntity,
} from '../../../actions/patentTrackActions2'



import { assetLegalEvents, assetFamily } from '../../../actions/patenTrackActions'
import { toggleLifeSpanMode } from '../../../actions/uiActions'

const AssetsPatentRow = ({ assetType, companyId, customerId, transactionId, patentId, index }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  const assetsPatent = useSelector(state => state.patenTrack2.assets[assetType][customerId].transactions[transactionId].patents[patentId])
  const activeMenuButton = useSelector(state =>  state.patenTrack2.activeMenuButton )
  const [width, setWidth] = useState(55)


  const handleClickListItem = useCallback(() => {
    if(activeMenuButton === 0) history.push({
      pathname: routes.review4,
      search: `select=${assetsPatent.patent || assetsPatent.application}`,
      state: {transactionId: transactionId}
    })
    dispatch(toggleLifeSpanMode(false))  
    dispatch(setSelectedAssetsPatents([ assetsPatent.patent, assetsPatent.application ]))
    dispatch(setAssetsIllustration({ type: 'patent', id: assetsPatent.patent || assetsPatent.application }))
    dispatch(setCommentsEntity({ type: 'asset', id: assetsPatent.patent || assetsPatent.application }))
    dispatch(assetLegalEvents(assetsPatent.application, assetsPatent.patent))
    dispatch(assetFamily(assetsPatent.application))
    
  }, [ assetsPatent, dispatch, activeMenuButton ]) 

  useEffect(() => {
    if(location.state && Object.keys(location.state).length > 0){
      if(location.state.width){
        setWidth(25)
      }
    }
    if( location.search && location.search != '' ) {
      const querystring = queryString.parse( location.search )
      if( Object.keys(querystring).length > 0 && querystring.select != '' && selectedAssetsPatents.length === 0 ){
        if( assetsPatent.patent == querystring.select || assetsPatent.application == querystring.select) dispatch(setSelectedAssetsPatents([ assetsPatent.patent, assetsPatent.application ]))
      }
    }   
  }, [ selectedAssetsPatents, assetsPatent, location, width ])
  
  return (
    <ListItem
      className={`${classes.assetListItem}`}
      button
      selected={selectedAssetsPatents.includes(assetsPatent.patent || assetsPatent.application)}
      tabIndex={-1}
      onClick={handleClickListItem}
    >
      <Box width={width} /> 
      {/* <ListItemAvatar>
        { <Checkbox
          className={classes.checkbox}
          edge="end"
          onChange={handleClickListItem}
          checked={selectedAssetsPatents.includes(assetsPatent.patent || assetsPatent.application)}
        /> }
      </ListItemAvatar> */}
        
      <ListItemText
        primary={assetsPatent.patent ? assetsPatent.patent : assetsPatent.application}
      />
    </ListItem>
  )
}

export default AssetsPatentRow
