import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'moment'
import CircularProgress from '@material-ui/core/CircularProgress'
import TableContainer from '@material-ui/core/TableContainer'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import PatenTrackApi from '../../../api/patenTrack2'
import { setAssetsIllustration, setCommentsEntity } from '../../../actions/patentTrackActions2'

import useStyles from './styles'
import VirtualizedTable from '../VirtualizedTable'
import CommentDialog from '../CommentDialog'



const FIXES_COLUMNS = [
  {
    width: 90,
    label: 'Asset',
    dataKey: 'asset',
  },
  {
    width: 150,
    label: 'Lawyer',
    dataKey: 'lawyer',
  },
  {
    width: 120,
    label: 'Date',
    dataKey: 'date',
  },
]

const AssetsFixesTable = ({ setUpdatedCounterTime }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

  const [ selected, setSelected ] = React.useState([])
  const [ assetsFixesData, setAssetsFixesData ] = useState([])
  const [ isLoadingAssetsFixesData, setIsLoadingAssetsFixesData ] = useState(false)
  const [ isCommentDialogOpen, setIsCommentDialogOpen ] = React.useState(false)

  useEffect(() => {
    if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) return setAssetsFixesData([])

    const getAssetsActivitiesDataFunction = async () => {
      setIsLoadingAssetsFixesData(true)
      const { data } = await PatenTrackApi.getAssetsActivitiesData('fix')
      setAssetsFixesData(data)
      setIsLoadingAssetsFixesData(false)
    }

    getAssetsActivitiesDataFunction()
  }, [ selectedAssetsTypes, selectedCompaniesList ])

  const handleClickRow = useCallback((event, row) => {
    setSelected([ row.id ])
    dispatch(setAssetsIllustration({ type: 'patent', id: row.assetId }))
    dispatch(setCommentsEntity(selected.includes(row.id) ? {} : { type: 'fix', id: row.id }))
  }, [ dispatch, selected ])

  const handleClickMarkAsComplete = async () => {
    const recordId = selected[0]
    let formData = new FormData()
    formData.append('complete', 1)
    const { status } = await PatenTrackApi.setRecordAsCompleted(recordId, formData)

    if (status === 200) {
      setUpdatedCounterTime(new Date())
      const updatedAssetsFixesData = assetsFixesData.filter(activity => activity.id !== selected[0])
      setAssetsFixesData(updatedAssetsFixesData)
    }
  }

  const tableRows = useMemo(() => (
    assetsFixesData.map((item) => ({
      id: item.id,
      date: Moment(item.updated_at).format('L'),
      asset: item.subject,
      lawyer: item.professionals !== null
        ? `${item.professionals.first_name} ${item.professionals.last_name}`
        : `${item.users.first_name} ${item.users.last_name}`,
      comment: item.comment || '-',
    }))
  ), [ assetsFixesData ])

  return isLoadingAssetsFixesData ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <>
      <TableContainer className={classes.tableContainer}>
        <VirtualizedTable
          classes={classes}
          selected={selected}
          rowCount={tableRows.length}
          rows={tableRows}
          columns={FIXES_COLUMNS}
          onSelect={handleClickRow}
        />
      </TableContainer>

      <Toolbar size="small" className={classes.tableToolbar}>
        <Tooltip title="Mark as completed">
          <div>
            <IconButton
              disabled={selected.length === 0}
              onClick={handleClickMarkAsComplete}
            >
              <i className={'fad fa-check'} title="Check"></i>
            </IconButton>
          </div>
        </Tooltip> 

        <Tooltip title="Comment error">
          <div>
            <IconButton
              disabled={selected.length === 0}
              onClick={() => setIsCommentDialogOpen(true)}
            >
              <i className={'fad fa-comment'} title="Comment"></i>
            </IconButton>
          </div>
        </Tooltip>
      </Toolbar>

      <CommentDialog
        open={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        entity={{ type: 'asset', id: selected[0], formId: 1 }}
      />
    </>
  )
}

export default AssetsFixesTable
