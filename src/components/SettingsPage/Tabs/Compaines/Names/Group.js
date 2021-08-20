import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react'

import { useDispatch } from 'react-redux'

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'

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
            <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleClickOpen}
                startIcon={<AddIcon className={classes.icon} />}
                className={classes.btnGroup}
            >
                Add a new Group
            </Button>
          <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <TextField
                    autoFocus
                    ref={inputGroup}
                    margin="dense"
                    id="group_name"
                    label="Group Name"
                    color='secondary'
                    fullWidth
                />     
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleAddGroup} color="inherit">
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    )
}


export default Groups