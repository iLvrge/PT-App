import { Dialog, DialogContent } from '../../../../../ui/Dialog'
import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react'

import { useDispatch } from 'react-redux'

import {Button, TextField, DialogContentText, CircularProgress} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import { fetchCompaniesList } from '../../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../../api/patenTrack2'



function Groups() {
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputGroup = useRef(null)

    const handleAddGroup = async() => {
        if(!loading) {
            setLoading(true)
            let name = inputGroup.current.querySelector("#group_name").value;
            const form = new FormData()
            form.append('group_name', name)
            const {data} = await PatenTrackApi.addGroup(form)
            setOpenDialog(false);
            setLoading(false)
            if(data !== null) {
                dispatch(fetchCompaniesList())
            }    
        }           
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    
    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <div className={"mx-2.5 ml-[50px] inline flex-[1_1_100%] [&_.MuiInputLabel-shrink]:text-base"}>
            <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleClickOpen}
                startIcon={<AddIcon className={undefined} />}
                className={"absolute border-0 px-[5px] normal-case"}
            >
                Add a New Group
            </Button>
            <Dialog open={openDialog} onOpenChange={(next) => { if (!next) handleClose() }}>
                <DialogContent description="Create a new company group">
                    <div className="px-6 py-2">
                      <TextField
                          autoFocus
                          ref={inputGroup}
                          margin="dense"
                          id="group_name"
                          label="Group Name"
                          color='secondary'
                          fullWidth
                      />
                    </div>
                    <div className="flex justify-end gap-2 p-2">
                      <Button onClick={handleClose} color="inherit">Cancel</Button>
                      <Button onClick={handleAddGroup} color="inherit">
                        {loading && <CircularProgress size={14} />}
                        {!loading && 'Create'}
                      </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export default Groups