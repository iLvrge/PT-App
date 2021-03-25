import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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

import { fetchDocuments, fetchProfessionals } from '../../../../actions/settingsActions'

import useStyles from './styles'

import axios from 'axios'


const AddNewRecordsDialog = ({ open, onSubmit, onClose, entity, title }) => {
    const classes = useStyles()
    const ref = useRef(null)
    const dispatch = useDispatch()
    const professionals = useSelector(state => state.settings.professionals.list)
    const documents = useSelector(state => state.settings.documents.list)
    const [ isSendingForm, setIsSendingForm ] = useState(false)

    useEffect(() => {
        dispatch(fetchDocuments());
        dispatch(fetchProfessionals());
    }, [])

    const handleSaveFixError = async () => {
        let formData = new FormData(ref.current)
        const subject_type = 2
        const formId = 2
        const subject = entity.rf_id || entity.id
        formData.append('subject', subject )
        formData.append('subject_type', subject_type )
        setIsSendingForm(true)
        const { status } = await PatenTrackApi.postRecordItems(formData, formId)
        setIsSendingForm(false)
        
        if (status === 200) {
            onSubmit()
            onClose()
        }
    }

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
                                    <option key={professional.professional_id} value={professional.professional_id}>{`${professional.first_name} ${professional.last_name}`}</option>
                                )
                            )}
                        </Select>
                        <FormHelperText>Select your professional to be assigned for this task</FormHelperText>
                    </FormControl>  

                    <FormControl margin='normal'>
                        <FormLabel>document</FormLabel>
                        <Select
                            native
                            displayEmpty
                            name="document_id" id="document_id"
                        >
                            {
                                documents.map(document => (
                                    <option key={document.document_id} value={document.document_id}>{document.name}</option>
                                )
                            )}
                        </Select>
                        <FormHelperText>Attach a document from hard drive</FormHelperText>   
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

export default AddNewRecordsDialog