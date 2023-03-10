import React, { useEffect, useState } from 'react' 

import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useStyles from "./styles";
import PatenTrackApi from '../../../api/patenTrack2';
import { Checkbox, Chip, ListItem, ListItemText, Paper } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Category = ({handleSelectedCategoryProduct}) => { 
    const classes = useStyles()
    const [ category, setCategory] = useState('')
    const [ products, setProducts] = useState([])
    const [ selectedProducts, setSelectedProducts] = useState([])
    const [ categoryList, setCategoryList] = useState([])
    const [ productList, setProductList] = useState([])


    useEffect(() => {
        const getCategories = async() => {
            const {data} = await PatenTrackApi.getCategories()
            setCategoryList(data)
        }
        getCategories()
    }, [])

    useEffect(() => {
        setProductList([])
        if(category > 0) {
            getProductList()
        }
    }, [category])

    const getProductList = async() => {
        if(category > 0) {
            const {data} = await PatenTrackApi.getProductsByCategory(category)
            setProductList(data)
        }
    }

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    const handleChangeProdduct = (event) => {
        const selectedItem = event.target.value 
        setProducts(selectedItem)
        if(selectedItem.length > 0) {
            const oldSelectedList = [...selectedProducts]
            selectedItem.map( item => {
                const mainFindIndex = oldSelectedList.findIndex(row => row.product_id === item)
                if(mainFindIndex == -1) {
                    const findIndex = productList.findIndex( row => row.product_id === item)
                    if(findIndex !== -1) {
                        oldSelectedList.push({...productList[findIndex]})
                    }
                } 
            }) 
            setSelectedProducts(oldSelectedList)
            handleSelectedCategoryProduct(oldSelectedList)
        } 
    };

    const handleDeleteSelectedProduct = (item) => {
        let list = [...selectedProducts]
        list = list.filter( row => row.product_id != item.product_id )
        setSelectedProducts(list)
        handleSelectedCategoryProduct(list)
    } 
 
    return (
        <React.Fragment>
            <FormControl sx={{ m: 1, width: 300  }}>
                <InputLabel htmlFor="dialog-select-category">Category</InputLabel>
                    <Select 
                        labelId="dialog-select-category"
                        id="select-category"
                        value={category}
                        onChange={handleChange}
                        input={<OutlinedInput label="Category"  />}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            categoryList.map( item => (
                                <MenuItem value={item.category_id}>{item.name}</MenuItem>
                            ))
                        } 
                    </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300  }} className={classes.productDropdown}>
                <InputLabel id="dialog-select-product">Products</InputLabel>
                <Select
                    labelId="dialog-select-product"
                    id="select-product"
                    multiple
                    value={products}
                    onChange={handleChangeProdduct}
                    input={<OutlinedInput label="Products" />}
                    renderValue={(selected) => {
                        const itemsList = []
                        selected.map( item => { 
                            const findIndex = productList.findIndex( row => row.product_id === item)
                            if(findIndex !== -1) {
                                itemsList.push( productList[findIndex].name)
                            } 
                        })  
                        return itemsList.join(', ')
                    }}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        productList.map( item => (
                            <MenuItem key={item.product_id} value={item.product_id}>
                                <Checkbox checked={products.includes(item.product_id)} />
                                <ListItemText primary={item.name} />
                            </MenuItem> 
                        ))
                    }
                </Select>
            </FormControl> 
            {
                selectedProducts.length > 0 && (
                    <FormControl sx={{ m: 1, width: 300  }} className={classes.chip}> 
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0.5,
                                m: 0,
                            }}
                            component="ul"
                        >
                            {
                                selectedProducts.map(data => { 
                                    return (
                                        <ListItem key={data.product_id}>
                                            <Chip 
                                                label={data.name}
                                                onDelete={() => handleDeleteSelectedProduct(data)}
                                            />
                                        </ListItem>
                                    );
                                })
                            }
                            </Paper>
                    </FormControl> 
                )
            }
            
        </React.Fragment>
    )
}


export default Category