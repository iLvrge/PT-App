import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'

import { selectedLawFirmList, selectedCompaniesList } from '../../../../../../../actions/settingsActions'


const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
} 

const LawyerForm = ({ edited, onChangeField, companiesList,  list }) => {
  const dispatch = useDispatch()
  const [ selectedList, setSelectedList ] = useState([])

  const selectedCompanies  = useSelector(state => state.settings.companies_to_add_lawfirm)

  const handleChange = (event) => {
    setSelectedList(event.target.value)
    dispatch(selectedLawFirmList(event.target.value))
  }


  return (
  <Fragment>
      {/* {
        companiesList.length > 0 
        ?
        <div>
          <InputLabel id="mutiple-checkbox-label">Companies</InputLabel>
          <Select
            labelId="mutiple-checkbox-label"
            id="mutiple-checkbox"
            multiple
            value={selectedCompanyList}
            onChange={handleCompanyChange}
            input={<Input />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            name={'companies'}
          >
            {companiesList.map( company => (
              <MenuItem key={company.id} value={company.id}>
                <Checkbox checked={selectedCompanyList.indexOf(company.id) > -1} />
                <ListItemText primary={company.representative_name} />
              </MenuItem>
            ))}
          </Select>
        </div>
        :
        ''
      } */}

    
      {
        selectedCompanies.length > 0 &&  list.length > 0 
        ?
        <div style={{width: '100%'}} className={`address_form`}>
          <InputLabel id="mutiple-checkbox-label" >Law Firms</InputLabel>
          <Select
            labelId="mutiple-checkbox-label"
            id="mutiple-checkbox"
            multiple
            value={selectedList}
            onChange={handleChange}
            input={<Input />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            name={'lawfirms'}
          >
            {list.map( lawfirm => (
              <MenuItem key={lawfirm.lawfirm_id} value={lawfirm.lawfirm_id}>
                <Checkbox checked={selectedList.indexOf(lawfirm.lawfirm_id) > -1} />
                <ListItemText primary={lawfirm.name} />
              </MenuItem>
            ))}
          </Select>
        </div>
        :
        ''
      }
  </Fragment>
  )
}

export default LawyerForm
