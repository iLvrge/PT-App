import React, { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import _cloneDeep from 'lodash/cloneDeep'
import useStyles from './styles'
import CircularProgress from '@mui/material/CircularProgress'


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
    console.log('onChangeField', value)
    setEdited(edited => ({ ...edited, [field]: value }))
  }, [])

  const onPasteField =  (field, event) => {

    console.log(event.clipboardData.getData('text/html'))

    //const { value } = event.target 
    const value = event.clipboardData.getData('text')

    const data =  value.trim(); // Clean data by removing leading/trailing whitespace
    /* let json = ''
    // If data is in UL/Li format
    console.log("data.indexOf('<ul')", data.indexOf('<ul'))
    if (data.indexOf('<ul') !== -1 && data.indexOf('</ul>') !== -1) {
      // Use regular expression to extract list items
      const regex = /<li>(.*?)<\/li>/g;
      const matches = data.matchAll(regex);
      console.log('matches', matches)
      const items = [];
      for (const match of matches) {
        items.push(match[1]);
      }
      
      const obj = { list: items };
      json = JSON.stringify(obj);
    } else {
      // If data is in other formats, such as tab or comma-separated values
      const rows = data.split('\n');
      const headers = rows[0].split('\t'); // Use first row as headers
      console.log('rows', rows)
      const items = [];
      for (let i = 0; i < rows.length; i++) {
        const values = rows[i].split('\t');
        console.log('rows', values)
        //const item = {};
        
        for (let j = 0; j < values.length; j++) {
          items.push(values[j]); 
        }
        
        //items.push(item);
      }
      
      const obj = { data: items };
      json = JSON.stringify(obj);
    } */

    //console.log('json', json)


    setEdited(edited => ({ ...edited, [field]: data }))
  } 

  

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
      onClose={onClose}
      TransitionProps={{
        onEnter,
        onExit
      }}>

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
          { entered && <FieldsComponent onChangeField={onChangeField} onPasteField={onPasteField} edited={edited} idKey={idKey} />}
        </DialogContent>

        <DialogActions className={classes.dialogActions}>
          <Button onClick={onClose} type={'button'}>
            Close
          </Button>

          <Button variant={'contained'} color="primary" type={'submit'}>
            {edited[idKey] ? 'SAVE' : 'CREATE'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditDialog