import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import List from '@material-ui/core/List'
import { Paper, ListSubheader } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'

import {
  assetsTypes,
  defaultAssetsCountByTypeCounter,
  convertTabIdToAssetType,
} from '../../../utils/assetTypes'
import {
  setSelectedAssetsTypes
} from '../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../api/patenTrack2'

import useStyles from './styles'

import Loader from '../Loader'
import AssetsTypeRow from './AssetsTypeRow'


const AssetsController = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  /* const [totalCustomerCount, setTotalCustomerCount] = useState(0) */

  const [totalTabsCount, setTabsCount] = useState(0)

  const companies = useSelector(state => state.patenTrack2.companiesList)
  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)

  const isLoadingCompaniesList = useSelector(
    state => state.patenTrack2.companyListLoading,
  )
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

  const [ assetsCountByType, setAssetsCountByTypeCounter ] = useState(
    defaultAssetsCountByTypeCounter,
  )
  const [ isLoadingAssetsSummary, setIsLoadingAssetsSummary ] = useState(false)

  useEffect(() => {
    /* if (selectedCompaniesList.length === 0) return  */

    if (selectedCompaniesList.length === 0) {
      setAssetsCountByTypeCounter(defaultAssetsCountByTypeCounter)
    } 
    
    const initAssetsSummary = async () => {
      setIsLoadingAssetsSummary(true)
      const updatedAssetsCountByType = { ...defaultAssetsCountByTypeCounter }
      const { data } = await PatenTrackApi.getPorfolioSummary(
        selectedCompaniesList.map(selectedCompany => selectedCompany.id)
      )

      if (!data) return
      let tabsCount = 0;  
      data.tabs.forEach(tab => {
        const assetType = convertTabIdToAssetType(tab.tab_id)
        updatedAssetsCountByType[assetType] += parseInt(tab.customer_count)
        if(tab.customer_count > 0) tabsCount++
      })
      setAssetsCountByTypeCounter(updatedAssetsCountByType)
      setIsLoadingAssetsSummary(false)
      setTabsCount(tabsCount)
    }
    initAssetsSummary()
  }, [ companies, selectedCompaniesList, selectedAssetsTypes ])

  /* useEffect(() => {
    const initCustomerCount = async () => {
      let count = 0;
      if(selectedAssetsTypes.length > 0) {
        selectedAssetsTypes.forEach( currentValue => {
          count += assetsCountByType[currentValue];
        });
      }
      setTotalCustomerCount(count);
    }

    initCustomerCount();
  },[assetsCountByType, selectedAssetsTypes]) */

  const MultiSelectCheckboxIcon = () => {
    if (selectedAssetsTypes.length === assetsTypes.length) return <CheckBoxIcon />
    if (selectedAssetsTypes.length > 0 && selectedAssetsTypes.length < assetsTypes.length) return <IndeterminateCheckBoxIcon />
    return  <CheckBoxOutlineBlankIcon />
  }

  const handleClickSelectCheckbox = useCallback(() => {
    const updatedSelectedAssetsList = selectedAssetsTypes.length === assetsTypes.length ? [] : [ ...assetsTypes ]
    dispatch(setSelectedAssetsTypes(updatedSelectedAssetsList))
    
  }, [ companies, selectedAssetsTypes.length ])

  if (isLoadingCompaniesList) return <Loader />

  return (
    <Paper className={classes.root} square>
      {/* <div className={classes.controllersContainer}>
        <div className={classes.controllers}>
          <Tooltip title={`${selectedAssetsTypes.length === assetsTypes.length ? 'unselect' : 'select'} all`} placement='top'>
            <div>
            {
              <IconButton 
                variant='outlined' 
                onClick={handleClickSelectCheckbox} 
                className={classes.selectAllBtn}
              >
                <MultiSelectCheckboxIcon />
              </IconButton>
            }
            </div>
          </Tooltip>
          <Typography className={classes.headingText} >Activities</Typography>
          <div className={classes.totalSelected}>{`${selectedAssetsTypes.length}/${totalTabsCount}`}</div> 
        </div>
      </div>  */}
      <List 
        className={classes.list} 
        dense 
        disablePadding
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {
                <IconButton 
                  variant='outlined' 
                  onClick={handleClickSelectCheckbox} 
                  className={classes.selectAllBtn}
                >
                    <MultiSelectCheckboxIcon />
                </IconButton>
            } Activities <span className={classes.totalSelected}>{selectedAssetsTypes.length}/{totalTabsCount}</span>
          </ListSubheader> 
        }
      >
        {assetsTypes.map((assetType, index) => (
          <AssetsTypeRow
            key={`asset-type-${assetType}`}
            counter={assetsCountByType[assetType]}
            assetType={assetType}
            index={index}
            isLoading={isLoadingAssetsSummary}
          />
        ))}
      </List>
    </Paper>
  )
}

export default AssetsController
