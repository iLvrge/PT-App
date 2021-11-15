
import React from 'react';
import {
        Dialog,
        DialogActions,
        DialogContent,
        DialogContentText,
        Slide,
        Button
    } from '@material-ui/core'

import screenfull from 'screenfull'

import clsx from 'clsx'
import useStyles from './styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
    const classes = useStyles()
    const [open, setOpen] = React.useState(true);

    const handleConfirmation = (flag) => {
        setOpen(false)
        if(flag === true && screenfull.isEnabled) {
            screenfull.request();
        }
    }


    return (
        <div>
            <Dialog  
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => handleConfirmation(false)}
                aria-describedby="alert-dialog-slide-fullscreen"
                className={classes.dialogRoot}
            >    
                <DialogContent style={{padding: '10px !important'}}>
                <DialogContentText id="alert-dialog-slide-fullscreen" >
                    Open application in full screen mode?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => handleConfirmation(false)}>No</Button>
                <Button onClick={() => handleConfirmation(true)}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}