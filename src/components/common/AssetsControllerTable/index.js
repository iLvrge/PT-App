import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Box, Collapse, Tooltip, Checkbox,  TableRow, TableCell } from '@material-ui/core'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'
import clsx from 'clsx'
import { AutoSizer, Column, SortDirection, Table, defaultTableRowRenderer } from 'react-virtualized'
import CustomerTable from './CustomerTable'
import useStyles from './styles' 
import ExpandMoreIcon from '@material-ui/icons/Remove'
import ExpandLessIcon from '@material-ui/icons/Add'
import _orderBy from 'lodash/orderBy' 

import {
  assetsTypes,
  assetsTypesWithKey,
  defaultAssetsCountByTypeCounter,
  convertTabIdToAssetType,
} from '../../../utils/assetTypes'
import {
  setSelectedAssetsTypes
} from '../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../api/patenTrack2'

import Loader from '../Loader'
/* import AssetsTypeRow from './AssetsTypeRow' */

const AssetsControllerTable = () => { 
  const classes = useStyles()
  const dispatch = useDispatch()

  const [ rowHeight, setRowHeight ] = useState(40)
  const [ totalTabsCount, setTabsCount ] = useState(0)
  const [ activites, setActivities ] = useState([])
  const [ selectedIndex, setSelectedIndex ] = useState(-1);
  const [ selectedType, setSelectedType ] = useState(null)
  const tableRef = useRef();
  const _getRowHeight = ({ index }) => (index === selectedIndex ? 400 : rowHeight);  

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
      const updateActivities = [...assetsTypesWithKey]
      const { data } = await PatenTrackApi.getPorfolioSummary(
        selectedCompaniesList.map(selectedCompany => selectedCompany.id)
      )

      if (!data) return
      let tabsCount = 0;  
      
      data.tabs.forEach(tab => {
        const assetType = convertTabIdToAssetType(tab.tab_id)
        updatedAssetsCountByType[assetType] += parseInt(tab.customer_count)
        const findIndex = updateActivities.findIndex( activity => activity.type == assetType)
        if(findIndex >= 0) updateActivities[findIndex].counter += parseInt(tab.customer_count)
        if(tab.customer_count > 0) tabsCount++
      })
      console.log(updateActivities)
      setActivities(updateActivities)
      setAssetsCountByTypeCounter(updatedAssetsCountByType)
      setIsLoadingAssetsSummary(false)
      setTabsCount(tabsCount)
    }
    initAssetsSummary()
  }, [ companies, selectedCompaniesList, selectedAssetsTypes ])


  useEffect(() => {
    tableRef.current.recomputeRowHeights();
  }, [selectedIndex]);

  const MultiSelectCheckboxIcon = () => {
    if (selectedAssetsTypes.length === assetsTypes.length) return <CheckBoxIcon />
    if (selectedAssetsTypes.length > 0 && selectedAssetsTypes.length < assetsTypes.length) return <IndeterminateCheckBoxIcon />
    return  <CheckBoxOutlineBlankIcon />
  }

  const handleClickSelectCheckbox = useCallback(() => {
    const updatedSelectedAssetsList = selectedAssetsTypes.length === assetsTypes.length ? [] : [ ...assetsTypes ]
    dispatch(setSelectedAssetsTypes(updatedSelectedAssetsList))
    
  }, [ companies, selectedAssetsTypes.length ])

  const handleCollapse = (index, cellData) => {
    setSelectedIndex(index)
    setSelectedType(cellData)
    console.log(cellData, index)
  }

  const getRowClassName = useCallback(() => {
    return clsx(classes.tableRow, classes.flexContainer, classes.tableRowHover)
  }, [ classes ])

  const rowRenderer = props => {
    const { index, style, className, key, rowData } = props;
    if (index === selectedIndex) {
      return (
        <div
          style={{ ...style, display: "flex", flexDirection: "column" }}
          className={className}
          key={key}
        >
          {defaultTableRowRenderer({
            ...props,
            style: { width: style.width, height: rowHeight }
          })}
          <div
            style={{
              marginRight: "auto",
              marginLeft: 80,
              height: 400,
              display: "flex",
            }}
          >
            <CustomerTable assetType={selectedType} counter={rowData.counter}/>
          </div>
        </div>
      );
    }
    return defaultTableRowRenderer(props);
  }

  const collapseCellRender = useCallback(({ index, cellData, columnIndex, rowIndex }) => {
    return (        
      <TableCell
        className={clsx(classes.tableCell, classes.flexContainer)}
        variant="body"
        style={{ height: rowHeight }}>
        {
          rowIndex === selectedIndex 
          ?
          <ExpandMoreIcon onClick={() => handleCollapse(-1, cellData)} />
          :
          <ExpandLessIcon onClick={() => handleCollapse(rowIndex, cellData)} />
        }
      </TableCell>
    )
  }, [ classes, rowHeight, selectedIndex ])

  const checkBoxRender = useCallback(({ cellData, columnIndex, rowIndex }) => {
    return (
      <Tooltip title={cellData}>        
        <TableCell
          className={clsx(classes.tableCell, classes.flexContainer)}
          variant="body"
          style={{ height: rowHeight }}>
          <Checkbox  />
        </TableCell>
      </Tooltip>
    )
  }, [ classes, rowHeight ])

  const cellRenderer = useCallback(({ cellData, columnIndex, rowIndex }) => {
    return (
      <Tooltip title={cellData}>        
        <TableCell
          className={clsx(classes.tableCell, classes.flexContainer)}
          variant="body"
          style={{ height: rowHeight }}>
          {cellData}
        </TableCell>
      </Tooltip>
    )
  }, [ classes, rowHeight ])


  

  if (isLoadingAssetsSummary && activites.length == 0) return <Loader />

  return (
    <Paper className={classes.root} square>
        <AutoSizer>
            {({ height, width }) => (
                <Table
                  ref={tableRef}
                    className={classes.table}
                    rowRenderer={rowRenderer} 
                    rowClassName={getRowClassName}
                    headerHeight={rowHeight}
                    width={width}
                    height={height}
                    rowHeight={_getRowHeight}
                    rowCount={activites.length}
                    rowGetter={({ index }) => activites[index]}
                >
                    <Column
                      label=''
                      dataKey='type'
                      width={ width * 0.06 }
                      className={classes.flexContainer}
                      cellRenderer={collapseCellRender}
                    />
                    <Column
                      label=''
                      dataKey='type'
                      width={ width * 0.16 }
                      className={classes.flexContainer}
                      cellRenderer={checkBoxRender}
                    />
                    <Column
                      label='Type'
                      dataKey='name'
                      className={classes.flexContainer}
                      width={ width * 0.6 }
                      cellRenderer={cellRenderer}
                    />
                    <Column
                      label=''
                      dataKey='counter'
                      className={classes.flexContainer}
                      width={ width * 0.18 }
                      cellRenderer={cellRenderer}
                    />
                </Table>
            )}
        </AutoSizer> 
    </Paper>
  )
}

export default AssetsControllerTable
