import React, {useMemo, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {   addCategoryProduct, fetchCategories, deleteCategory, getProducts, deleteProduct, updateUser } from '../../../../actions/settingsActions'

import Page from '../../components/Page' 

import { setBreadCrumbs } from  '../../../../actions/patentTrackActions2'
import CategoryForm from './CategoryForm'
import Category from './Category'

const ID_KEY = 'product_id'
const TITLE = 'Category / Products'
const NAME = 'category / product'

const ACTIONS = {
  fetchItems: getProducts,
  deleteItem: deleteProduct,
  addItem: addCategoryProduct,
  /* updateItem: updateUser,
  fetchDropdown: fetchCategories */
}

const CategoryProducts = () => {
  const dispatch = useDispatch() 
  const [ childComponentList, setChildComponentList ] = useState([])

  useEffect(() => {
    setChildComponentList([{
        component: Category,      
    }])
  }, [])
  
  const { list, loading } = useSelector(state => state.settings.products)

  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Category'))
  }, [ dispatch ]) 

  
  const COLUMNS = [
    { id: 'name', label: 'Product' }, 
  ]

  
  return (
    <Page
      loading={loading}
      actions={ACTIONS}
      name={NAME}
      fieldsComponent={CategoryForm}
      idKey={ID_KEY}
      title={TITLE}
      columns={COLUMNS}
      data={list}
      dropdown={true}
      headerChildComponent={childComponentList}
    />
  )
} 

export default CategoryProducts;