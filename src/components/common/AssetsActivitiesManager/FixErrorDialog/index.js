import React, { useCallback, useEffect, useRef, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'

import PatenTrackApi from '../../../../api/patenTrack2'

import useStyles from './styles'
import { saveFixError } from '../../../../actions/assetsActions'
import { useDispatch } from 'react-redux'


const FixErrorDialog = ({ open, onClose, entity, title, setUpdatedCounterTime }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const ref = useRef(null)
  const [ professionals, setProfessionals ] = useState([])
  const [ isSendingForm, setIsSendingForm ] = useState(false)

  useEffect(() => {
    const getProfessionals = async () => {
      const { data } = await PatenTrackApi.getProfessionals()
      setProfessionals(data)
    }
    getProfessionals()
  }, [])

  const handleSaveFixError = useCallback(async () => {
    setIsSendingForm(true)
    await dispatch(saveFixError(ref.current, entity))
    setIsSendingForm(false)
    onClose()
  }, [ entity, dispatch, ref, onClose ])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={'paper'}
      aria-labelledby="draggable-dialog-title"
      maxWidth={'sm'}
      fullWidth
      className={classes.root}
    >
      <DialogTitle>Correct a Record</DialogTitle>

      <DialogContent>
        <form ref={ref}>
          <FormControl margin='normal'>
            <FormLabel>professional</FormLabel>
            <Select
              native
              displayEmpty
              name="professional_id" id="professional_id"
            >
              {
                professionals.map(professional => (
                    <option key={professional.professional_id}
                            value={professional.professional_id}>{`${professional.first_name} ${professional.last_name}`}</option>
                  ),
                )}
            </Select>
            <FormHelperText>Select your professional to be assigned for this task</FormHelperText>
          </FormControl>

          <FormControl margin='normal'>
            <FormLabel>Attach a document from hard drive:</FormLabel>
            <Input
              type="file"
              name="file"
            />
          </FormControl>

          <FormControl margin='normal'>
            <FormLabel>Write your instructions</FormLabel>
            <TextareaAutosize
              id="comment"
              name="comment"
              rowsMin={9}
              className={classes.textarea}
            />
          </FormControl>
        </form>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose} color="secondary">Cancel</Button>
        <Button
          variant="contained"
          autoFocus
          color="primary"
          className={classes.btn}
          onClick={handleSaveFixError}
          disabled={isSendingForm}
          startIcon={isSendingForm && <CircularProgress size={12} />}
        >Send </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FixErrorDialog