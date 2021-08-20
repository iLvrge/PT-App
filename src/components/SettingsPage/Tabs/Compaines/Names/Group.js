import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react'

import { useDispatch } from 'react-redux'

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import { fetchCompaniesList } from '../../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../../api/patenTrack2'

import useStyles from './styles'


function Groups() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false);
    const inputGroup = useRef(null)

    const handleAddGroup = async() => {
        let name = inputGroup.current.querySelector("#group_name").value;
        const form = new FormData()
        form.append('group_name', name)
        const {data} = await PatenTrackApi.addGroup(form)
        setOpenDialog(false);
        if(data != null) {
            dispatch(fetchCompaniesList())
        }       
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    
    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <div className={classes.dialogButton}>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Add a Group
          </Button>
          <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Group</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To add several companies to a Group
                </DialogContentText>
                <TextField
                    autoFocus
                    ref={inputGroup}
                    margin="dense"
                    id="group_name"
                    label="Group Name"
                    fullWidth
                />     
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddGroup} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    )
}


export default Groups