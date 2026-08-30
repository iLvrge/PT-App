import cn from '../../../../ui/cn'
import React, { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import _cloneDeep from 'lodash/cloneDeep'
import { Dialog, DialogContent } from '../../../../ui/Dialog'
import CircularProgress from '@mui/material/CircularProgress'


const EditDialog = ({ setEditedRow, editedRow, onSubmit, fieldsComponent: FieldsComponent, name = 'item', idKey = 'id' }) => {
  const [ edited, setEdited ] = useState({})
  const [ loading, setLoading ] = useState(false)
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

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent
        title={edited[idKey] ? `Edit ${name}` : `New ${name}`}
        className={cn(
          'min-w-[320px] max-w-[700px] p-0',
          '[&_.address_form_label]:inline',
          '[&_.address_form_.MuiSelect-select]:min-w-[100px]',
          '[&_.address_form_.MuiInputBase-root]:ml-5'
        )}
      >
        {
          loading && (
            <div className="absolute inset-0 z-[2] flex h-full w-full items-center justify-center bg-black/50">
              <CircularProgress />
            </div>)
        }

        <form onSubmit={submitHandled}>
          {/* The 50%-width field layout used to be applied through
              .MuiFormControl-root from this component's stylesheet; the fields
              are still MUI, so it stays an arbitrary variant. */}
          <div className="flex flex-wrap justify-between border-y border-divider px-6 py-2
                          [&_.MuiFormControl-root]:m-2.5 [&_.MuiFormControl-root]:w-[calc(50%-20px)]">
            { open && <FieldsComponent onChangeField={onChangeField} onPasteField={onPasteField} edited={edited} idKey={idKey} />}
          </div>

          <div className="m-5 flex justify-end gap-2 shadow-none">
            <Button onClick={onClose} type={'button'}>
              Close
            </Button>

            <Button variant={'contained'} color="primary" type={'submit'}>
              {edited[idKey] ? 'SAVE' : 'CREATE'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog