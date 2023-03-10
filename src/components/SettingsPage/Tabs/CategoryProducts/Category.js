import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCategories, getProducts, setSelectedCategory } from '../../../../actions/settingsActions';




const Category = () => {
    const dispatch = useDispatch() 
    const [category, setCategory] = useState('')
    const categoriesList = useSelector(state => state.settings.categories)


    console.log('categoriesList', categoriesList)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [])

    const handleChange = (event) => {
        setCategory(event.target.value);
        dispatch(setSelectedCategory(event.target.value))
        if(event.target.value > 0) {
            dispatch(getProducts(event.target.value))
        }
    }

    return (
        <Box style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <FormControl style={{position: 'absolute', top: -35, zIndex: 9999, width: 300, display: 'flex'}}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    id="category-label"
                    value={category}
                    label="Category"
                    onChange={handleChange}
                >
                    {
                        categoriesList.map( item => (
                            <MenuItem value={item.category_id}>{item.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl> 
        </Box> 
    )
}


export default Category;