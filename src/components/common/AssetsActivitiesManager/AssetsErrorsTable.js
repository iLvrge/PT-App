import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import _find from 'lodash/find'
import { setAssetsIllustration, setCommentsEntity } from '../../../actions/patentTrackActions2'

import useStyles from './styles'
import { fetchAssetsErrorsData, setAssetsErrorsData, setSelectedAssetsErrors } from '../../../actions/assetsActions'
import VirtualizedTable from '../VirtualizedTable'
import TableContainer from '@material-ui/core/TableContainer'

const getTypeFromNumber = n => {
  switch (n) {
    case 0:
      return 'Inventor'
    case 1:
      return 'Broken link'
    case 2:
      return 'Correspondense (lawyer)'
    case 3:
      return 'Address (company)'
    case 4:
      return 'Security'
    default:
      return 'Unknown'
  }
}

const ERROR_COLUMNS = [
  {
    label: 'Id',
    dataKey: 'id',
    role: 'checkbox',
    className: 'error_col0'
  },
  {
    label: 'Type',
    dataKey: 'type',
    filterable: true,
    className: 'error_col1'
  },
  {
    label: 'Asset',
    dataKey: 'assetId',
    className: 'error_col2'
  },
  {
    width: 90,
    flexGrow: 1.0,
    label: 'Lawyer',
    dataKey: 'lawyer',
    filterable: true,
    className: 'error_col3'
  },
  {
    label: 'Date',
    dataKey: 'date',
    className: 'error_col4'
  },
]

const AssetsErrorsTable = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

  const selected = useSelector(state => state.assets.errors.selected)
  const assetsErrorsData = useSelector(state => state.assets.errors.data)
  const isLoadingAssetsErrorsData = useSelector(state => state.assets.errors.isLoading)

  useEffect(() => {
    const noDataShouldDiplayed = (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0)
    dispatch(noDataShouldDiplayed ? setAssetsErrorsData([]) : fetchAssetsErrorsData())
  }, [ dispatch, selectedAssetsTypes, selectedCompaniesList ])
  
  useEffect(() => () => {
    dispatch(setSelectedAssetsErrors([]))
  }, [ dispatch ])

  const tableRows = useMemo(() => assetsErrorsData.map((item) => ({
    id: item.error_id,
    date: item.date,
    assetId: item.assetId,
    lawyer: item.lawyer_name,
    type: getTypeFromNumber(item.type),
    comment: item.comment || '-',
  })), [ assetsErrorsData ])

  useEffect(() => {
    if (selected.length) {
      const [ rowId ] = selected
      const row = _find(tableRows, { id: rowId })
      if(row != undefined) {
        dispatch(setAssetsIllustration({ type: 'patent', id: row.assetId }))
        dispatch(setCommentsEntity({ type: 'error', id: row.assetId }))
      }      
    } else {
      dispatch(setAssetsIllustration(null))
      dispatch(setCommentsEntity(null))
    }
  }, [ dispatch, selected, tableRows ])

  const handleClickRow = useCallback((event, row) => {
    dispatch(setSelectedAssetsErrors(selected.includes(row.id) ? [] : [ row.id ]))
  }, [ dispatch, selected ])

  return isLoadingAssetsErrorsData ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <TableContainer className={classes.tableContainer}>
      <VirtualizedTable
        classes={classes}
        selected={selected}
        rows={tableRows}
        columns={ERROR_COLUMNS}
        onSelect={handleClickRow}
        responsive={false} 
        width={400}
        containerStyle={{ 
          width: '100%',
          maxWidth: '100%'
        }}
        style={{
          width: '100%'
        }}/>
    </TableContainer>
  )
}

export default AssetsErrorsTable
