import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import React, { Fragment, useCallback, useMemo } from 'react'
import AddNewRecordDialog from '../AddNewRecordDialog'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssetsRecordsData, handleRevertCompletedActivity, markAsComplete } from '../../../../actions/assetsActions'
import FixErrorDialog from '../FixErrorDialog'
import _find from 'lodash/find'
import { Undo } from '@material-ui/icons'


const Actions = ({ selectedTab }) => {
  const dispatch = useDispatch()
  const [ isAddNewRecordDialogOpen, setIsAddNewRecordDialogOpen ] = React.useState(false)
  const [ isFixErrorDialogOpen, setIsFixErrorDialogOpen ] = React.useState(false)
  const [ selectedErrorData, setSelectedErrorData ] = React.useState(null)

  const assetsRecordsData = useSelector(state => state.assets.records.data)

  const assetsErrorsData = useSelector(state => state.assets.errors.data)

  const selectedErrors = useSelector(state => state.assets.errors.selected)
  const selectedCompleted = useSelector(state => state.assets.completed.selected)
  const selectedRecords = useSelector(state => state.assets.records.selected)

  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

  const ID = useMemo(() => {
    return selectedAssetsPatents.length > 0 ? selectedAssetsPatents[selectedAssetsPatents.length - 1] : selectedAssetsTransactions.length > 0 ? selectedAssetsTransactions[selectedAssetsTransactions.length - 1] : 0
  }, [ selectedAssetsTransactions, selectedAssetsPatents ])

  const handleClickMarkAsComplete = useCallback(async () => {
    dispatch(markAsComplete() )
  }, [ dispatch ])

  const onSubmitAddNewRecord = useCallback(() => {
    dispatch(fetchAssetsRecordsData())
  }, [ dispatch ])

  const revertComplete = useCallback(() => {
    dispatch(handleRevertCompletedActivity(selectedCompleted[0]))
  }, [ dispatch, selectedCompleted ])

  const showAddNewRecordButton = (
    (selectedTab === 0 && (selectedErrors.length === 0 /* && ID === 0 */)) ||
    (selectedTab === 1 && selectedRecords.length === 0) ||
    (selectedTab === 2 && selectedCompleted.length === 0)
  )

  React.useEffect(() => {
    if(selectedErrors.length > 0) {
      const row = _find(assetsErrorsData, { error_id: selectedErrors[0] })
      if(row != undefined ){
        setSelectedErrorData(row)
      }
    }
  },[ selectedErrors ])

  return (
    <Fragment>
      {
        showAddNewRecordButton && (
          <Fragment>
            <AddNewRecordDialog
              open={isAddNewRecordDialogOpen}
              onClose={() => setIsAddNewRecordDialogOpen(false)}
              entity={{ type: 'record', id: assetsRecordsData[0], formId: 2 }}
              onSubmit={onSubmitAddNewRecord}
            />

            <Tooltip title="Add new record">
              <div>
                <IconButton
                  color={'secondary'}
                  onClick={() => setIsAddNewRecordDialogOpen(true)}
                >
                  <i className={'fad fa-plus'} title="Add new record" />
                </IconButton>
              </div>
            </Tooltip>
          </Fragment>
        )  
      }

      {
        (selectedTab === 0 && !showAddNewRecordButton) && (
          <Fragment>
            <FixErrorDialog
              open={isFixErrorDialogOpen}
              onClose={() => setIsFixErrorDialogOpen(false)}
              entity={{
                type: 'fix',
                // id must be the assetId
                id: selectedErrors.length > 0 && selectedErrors[0],
                assetId: selectedErrorData != null && selectedErrorData.assetId,
                subject_type: 1,
                formId: 1,
              }}
            />
            <Tooltip title="Fix error">
              <div>
                <IconButton
                  color={'secondary'}
                  onClick={() => setIsFixErrorDialogOpen(true)}>
                  <i className={'fad fa-tools'} title="Fix" />
                </IconButton>
              </div>
            </Tooltip>
          </Fragment>
        )
      }

      {
        (selectedTab === 1 && !showAddNewRecordButton) && (
          <Tooltip title="Mark as completed">
            <div>
              <IconButton
                color={'secondary'}
                onClick={handleClickMarkAsComplete}>
                <i className={'fad fa-check'} title="Check" />
              </IconButton>
            </div>
          </Tooltip>
        )
      }

      {
        (selectedTab === 2 && !showAddNewRecordButton) && (
          <Tooltip title="Revert complete">
            <div>
              <IconButton
                color={'secondary'}
                onClick={revertComplete}
              >
               <Undo />
              </IconButton>
            </div>
          </Tooltip>
        )
      }

    </Fragment>
  )
}

export default Actions
