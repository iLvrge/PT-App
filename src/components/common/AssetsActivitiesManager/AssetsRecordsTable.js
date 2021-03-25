import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'moment'
import _find from 'lodash/find'
import CircularProgress from '@material-ui/core/CircularProgress'
import TableContainer from '@material-ui/core/TableContainer'
import { setAssetsIllustration, setCommentsEntity } from '../../../actions/patentTrackActions2'
import VirtualizedTable from '../VirtualizedTable'

import useStyles from './styles'
import { fetchAssetsRecordsData, setAssetsRecordsData, setSelectedAssetsRecords } from '../../../actions/assetsActions'

const RECORDS_COLUMNS = [
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

const AssetsRecordsTable = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

  const assetsRecordsData = useSelector(state => state.assets.records.data)
  const selected = useSelector(state => state.assets.records.selected)
  const isLoading = useSelector(state => state.assets.records.isLoading)

  useEffect(() => {
    if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) {
      dispatch(setAssetsRecordsData([]))
    } else {
      dispatch(fetchAssetsRecordsData())
    }
  }, [ dispatch, selectedAssetsTypes.length, selectedCompaniesList.length ])

  const handleClickRow = useCallback((event, row) => {
    dispatch(setSelectedAssetsRecords([ row.id ]))
    dispatch(setAssetsIllustration({ type: 'patent', id: row.asset }))
    dispatch(setCommentsEntity(selected.includes(row.id) ? {} : { type: row.type == 1 ? 'fix' : 'record', id: row.type == 1 ? row.asset : row.id }))
  }, [ dispatch, selected ])


  const tableRows = useMemo(() => (
    assetsRecordsData.map((item) => ({
      id: item.id,
      date: Moment(item.updated_at).format('L'),
      type: item.type,
      asset: item.subject || `${item.id} (new)`,
      lawyer: item.professionals !== null
        ? `${item.professionals.first_name} ${item.professionals.last_name}`
        : `${item.users.first_name} ${item.users.last_name}`,
      file: (
        <Fragment>
          {
            item.documents.file && item.documents.file !== '' &&
            <a href={item.documents.file} target={'_blank'} rel="noopener noreferrer"
               className={classes.openFile}>
              <i className={
                item.documents.file.toString().toLowerCase().includes('.pdf') ? 'fal fa-file-pdf'
                  : item.documents.file.toString().toLowerCase().includes('.doc') ? 'fal fa-file-word'
                  : 'fal fa-file'
              } />
            </a>
          }
          {
            item.upload_file && item.upload_file !== '' &&
            <a href={item.upload_file} target={'_blank'} rel="noopener noreferrer"
               className={classes.openFile}>
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
  ), [ classes, assetsRecordsData ])

  return isLoading ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <>
      <TableContainer className={classes.tableContainer}>
        <VirtualizedTable
          classes={classes}
          selected={selected}
          rowCount={tableRows.length}
          rows={tableRows}
          columns={RECORDS_COLUMNS}
          onSelect={handleClickRow}
        />
      </TableContainer>
    </>
  )
}

export default AssetsRecordsTable
