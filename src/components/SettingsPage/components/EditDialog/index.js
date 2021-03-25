import React, { useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import _cloneDeep from 'lodash/cloneDeep'
import useStyles from './styles'
import CircularProgress from '@material-ui/core/CircularProgress'


const EditDialog = ({ setEditedRow, editedRow, onSubmit, fieldsComponent: FieldsComponent, name = 'item', idKey = 'id' }) => {
  const classes = useStyles()
  const [ edited, setEdited ] = useState({})
  const [ loading, setLoading ] = useState(false)
  const [ entered, setEntered ] = useState(false)
  const onClose = useCallback(() => setEditedRow(null), [ setEditedRow ])

  useEffect(() => {
    setEdited(_cloneDeep(editedRow) || {})
  }, [ editedRow ])

  const onChangeField = useCallback((field) => (e) => {
    const { value } = e.target
    setEdited(edited => ({ ...edited, [field]: value }))
  }, [])

  const submitHandled = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(edited)
    setLoading(false)
    onClose()
  }, [ onSubmit, edited, onClose ])

  const open = !!editedRow
  const onEnter = useCallback(() => setEntered(true), [])
  const onExit = useCallback(() => setEntered(false), [])

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      open={open}
      onEnter={onEnter}
      onExit={onExit}
      onClose={onClose}>

      {
        loading && (
          <div className={classes.loaderContainer}>
            <CircularProgress />
          </div>)
      }

      <form onSubmit={submitHandled}>
        <DialogTitle>
          {edited[idKey] ? `Edit ${name}` : `New ${name}`}
        </DialogTitle>

        <DialogContent dividers className={classes.dialogContent}>
          { entered && <FieldsComponent onChangeField={onChangeField} edited={edited} idKey={idKey} />}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="default" type={'button'}>
            Close
          </Button>

          <Button variant={'contained'} color="primary" type={'submit'}>
            {edited[idKey] ? 'SAVE' : 'CREATE'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditDialog