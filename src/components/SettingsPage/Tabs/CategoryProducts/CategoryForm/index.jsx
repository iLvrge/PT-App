import React from 'react'
import TextField from '@mui/material/TextField'

/**
 * The previous styles reached into MUI via `.MuiFormControl-root` to set the
 * field width and margin. The same geometry now lives on the wrapper, so no
 * selector depends on MUI's internal class names.
 */
const FIELD = 'm-2.5 w-[calc(100%-20px)]'

const CategoryForm = ({ onChangeField, onPasteField, edited }) => (
  <div className="flex w-full flex-col p-2.5">
    <div>
      <TextField
        className={FIELD}
        variant="outlined"
        required
        label="Category Name"
        color="secondary"
        value={edited.category_name || ''}
        onChange={onChangeField('category_name')}
      />
    </div>
    <div>
      <TextField
        className={FIELD}
        variant="outlined"
        color="secondary"
        required
        multiline
        rows={4}
        label="Paste Product List"
        value={edited.products || ''}
        onPaste={(e) => onPasteField('products', e)}
      />
    </div>
  </div>
)

export default CategoryForm
