import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'moment'
import CircularProgress from '@material-ui/core/CircularProgress'
import TableContainer from '@material-ui/core/TableContainer'
import { setCommentsEntity } from '../../../actions/patentTrackActions2'

import useStyles from './styles'
import VirtualizedTable from '../VirtualizedTable'
import { fetchAssetsCompletedData, setAssetsCompletedData, setSelectedAssetsCompleted } from '../../../actions/assetsActions'

const COLUMNS = [
  {
    width: 90,
    label: 'Asset',
    dataKey: 'asset',
  },
  {
    flexGrow: 1.0,
    width: 150,
    label: 'Lawyer',
    dataKey: 'lawyer',
  },
  {
    width: 90,
    label: 'File',
    dataKey: 'file',
  },
  {
    width: 90,
    label: 'Date',
    dataKey: 'date',
  },
]

const AssetsCompletedActivitiesTable = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

  const assetsCompletedData = useSelector(state => state.assets.completed.data)
  const selected = useSelector(state => state.assets.completed.selected)
  const isLoadingAssetsCompletedData = useSelector(state => state.assets.completed.isLoading)

  useEffect(() => {
    if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) return dispatch(setAssetsCompletedData([]))
    dispatch(fetchAssetsCompletedData())
  }, [ dispatch, selectedCompaniesList, selectedAssetsTypes ])

  const handleClick = useCallback((event, row) => {
    dispatch(setSelectedAssetsCompleted([ row.id ]))
    dispatch(setCommentsEntity(selected.includes(row.id) ? {} : { type: row.type == 1 ? 'fix' : 'record', id: row.type == 1 ? row.asset : row.id }))
  }, [ dispatch, selected ])

  const tableRows = useMemo(() => (
    assetsCompletedData.map((item) => ({
      id: item.id,
      type: item.type,
      date: Moment(item.updated_at).format('L'),
      asset: item.subject,
      lawyer: item.professionals !== null
        ? `${item.professionals.first_name} ${item.professionals.last_name}`
        : `${item.users.first_name} ${item.users.last_name}`,
      file: (
        <Fragment>
          {
            item.documents.file && item.documents.file !== '' &&
            <a href={item.documents.file} target={'_blank'} rel="noopener noreferrer" className={classes.openFile}>
              <i className={
                item.documents.file.toString().toLowerCase().includes('.pdf') ? 'fal fa-file-pdf'
                  : item.documents.file.toString().toLowerCase().includes('.doc') ? 'fal fa-file-word'
                  : 'fal fa-file'
              } />
            </a>
          }
          {
            item.upload_file && item.upload_file !== '' &&
            <a href={item.upload_file} target={'_blank'} rel="noopener noreferrer" className={classes.openFile}>
              <i className={
                item.upload_file.toString().toLowerCase().includes('.pdf') ? 'fal fa-file-pdf'
                  : item.upload_file.toString().toLowerCase().includes('.doc') >= 0 ? 'fal fa-file-word'
                  : 'fal fa-file'
              } />
            </a>
          }
        </Fragment>
      ),
      comment: item.comment || '-',
    }))
  ), [ classes, assetsCompletedData ])

  return isLoadingAssetsCompletedData ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <TableContainer className={classes.tableContainer}>
      <VirtualizedTable
        classes={classes}
        selected={selected}
        rowCount={tableRows.length}
        rows={tableRows}
        columns={COLUMNS}
        onSelect={handleClick}
      />
    </TableContainer>
  )
}

export default AssetsCompletedActivitiesTable
