import React, { useState, useRef, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

import PatenTrackApi from '../../../api/patenTrack2'

import useStyles from './styles'


const CommentDialog = ({ open, onSubmit, onClose, entity }) => {
    const classes = useStyles()
    const ref = useRef()
    const [ commentText, setCommentText ] = useState(entity.comment || '')

    const handleSaveComment = async () => {
        let formData = new FormData(ref.current)   
        formData.append('comment', commentText ) 
        
        if(entity.hasOwnProperty('editData') === true && entity.editData != null){
            const { status } = await PatenTrackApi.updateCommentToEntity(entity.editData.comment_id, formData)
            if (status === 200) {
                setCommentText('')
                onSubmit && onSubmit()
                onClose()
            }
        } else {
            const subject = entity.id
            formData.append('subject', subject )
            const { status } = await PatenTrackApi.setCommentToEntity(entity.type, formData)
            if (status === 200) {
                setCommentText('')
                onSubmit && onSubmit()
                onClose()
            }
        }
    }

    useEffect(() => {
        if(entity.hasOwnProperty('editData') === true && entity.editData != null){
            setCommentText(entity.editData.comment)
        }
    }, [entity])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={'paper'}
            maxWidth={'sm'}
            fullWidth
            className={classes.root}
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {'Add a Comment'}
            </DialogTitle>

            <DialogContent>
                <form ref={ref}>
                    </form>     
                <TextareaAutosize 
                    name="comment" 
                    rowsMin={9} 
                    className={classes.textarea}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />         
            </DialogContent>

            <DialogActions>
                <Button  onClick={onClose} color="secondary">Cancel</Button>
                <Button autoFocus color="primary" className={classes.btn} onClick={handleSaveComment}>Save</Button>
            </DialogActions>
    </Dialog>
    )
}

export default CommentDialog