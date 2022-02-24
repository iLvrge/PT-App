import React from 'react'

import { 
    TextField,
    CircularProgress,
    Checkbox,
    Radio
} from '@mui/material'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

import Autocomplete from '@mui/material/Autocomplete'

const AutoCompleteSearch = ({
        value,
        open, 
        setOpen, 
        setOptions, 
        onHandleChange, 
        options, 
        loading, 
        onInputChange, 
        id, 
        noOptionsText, 
        label, 
        multiple
    }) => {

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    const checkedIcon = <CheckBoxIcon fontSize="small" />

    return (
        <Autocomplete
            id={id}
            open={open}     
            multiple={multiple}    
            value={value}   
            disableCloseOnSelect
            onOpen={() => {
                setOpen(true)
            }}
            onClose={() => {
                setOpen(false)
                setOptions([])
                console.log("ONCLOSE")
            }}
            onChange={onHandleChange}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            noOptionsText={noOptionsText}
            onInputChange={onInputChange}
            renderOption={(option, { selected }) => (
                <React.Fragment>
                    {
                        multiple ? 
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={ selected }
                            value={option.name}
                        />
                        :
                        <Radio
                            style={{ marginRight: 8 }}
                            checked={ selected }
                            value={option.name}
                        />
                    }
                    {option.name}
                </React.Fragment>
                )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                    }}
                />
            )}
        />
    );
}


export default AutoCompleteSearch