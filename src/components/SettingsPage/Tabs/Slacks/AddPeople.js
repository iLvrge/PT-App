import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react'

import { useDispatch } from 'react-redux'

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Box } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'

import { fetchCompaniesList } from '../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../api/patenTrack2'

import useStyles from './styles'           
import { setSettingText } from '../../../../actions/patenTrackActions'


function AddPeople() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false);
    const [inputText, setInputText] = useState('');

    const handleInvitation = async() => {
        if(inputText !== '') {
            const form = new FormData()
            form.append('email_address', inputText)
            const {data} = await PatenTrackApi.addGroup(form)
            setOpenDialog(false);
            if(data != null) {
                //dispatch(fetchCompaniesList())
            }  
        }             
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    
    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (event) => {
        setInputText(event.value)
    }

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