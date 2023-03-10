import React, { Fragment, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField' 

import useSytles from './styles'


const CategoryForm = ({ onChangeField, onPasteField, edited }) => {
    const classes = useSytles() 

     

    return (
        <Box className={classes.root}>
            <div>
                <TextField
                size={'large'}
                variant="outlined"
                required
                label="Category Name"
                color={'secondary'}
                value={edited.category_name || ''}
                onChange={onChangeField('category_name')} />
            </div>
            
            <div>
                <TextField
                size={'large'}
                variant="outlined"
                color={'secondary'}
                required
                multiline
                rows={4}
                label="Paste Product List"
                value={edited.products || ''}
                onPaste={(e) => { onPasteField('products', e)}} /> 
            </div>
        </Box>
    )
}

export default CategoryForm