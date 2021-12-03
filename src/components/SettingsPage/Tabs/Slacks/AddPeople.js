import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Box } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'

import { fetchCompaniesList } from '../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../api/patenTrack2'

import useStyles from './styles'           
import { setSettingText } from '../../../../actions/patenTrackActions'


function AddPeople(props) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false);
    const [inputText, setInputText] = useState('');
    const companiesList = useSelector(state => state.patenTrack.companiesList)

    const handleInvitation = async() => {
        if(inputText !== '') {
            if(props.rows.length == 1) {
                const findIndex = companiesList.findIndex( company => company.id == props.rows[0])
                if(findIndex !== -1) {
                    const form = new FormData()
                    form.append('email', inputText)
                    form.append('representative_name', companiesList[findIndex].original_name)
                    const {data} = await PatenTrackApi.inviteUserToWorkspace(form)
                    setOpenDialog(false);
                    if(data != null) {
                        alert(data)   
                        setInputText('')
                    }  
                }                
            } else {
                alert('Please select a company')
            }
        }             
    };
    console.log('props', props)
    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    
    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (event) => {
        console.log('event.value', event, event.target.value)
        setInputText(event.target.value)
    }
    if(props.rows.length == 0) return null
    return (
        <div className={classes.dialogButton}>
            <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleClickOpen}
                startIcon={<AddIcon className={classes.icon} />}
                className={classes.btnEmail}
            >
                Invite user to your workspace
            </Button>
            <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <Box m={2} p={3}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email_address"
                            label="Email Address"
                            color='secondary'
                            value={inputText}
                            onChange={handleInputChange}
                            fullWidth
                        />   
                    </Box>                  
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleInvitation} color="inherit">
                    Invite
                </Button>
                </DialogActions>
          </Dialog>
        </div>
    )
}


export default AddPeople