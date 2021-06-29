import React, {useState} from 'react'
import { Typography, Slider } from '@material-ui/core'


const FilterCPC = ({ onClose, depthRange, scopeRange, depthRangeText, scopeRangeText, value }) => {

    const [ scopeValue, setScopeValue ] = useState(value)


    const handleChange = (event, newValue) => {
        setScopeValue(newValue);
    };

    return (
        <>            
            <Typography gutterBottom>Scope:</Typography>
            <Slider
                value={scopeValue}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={scopeRangeText}
                marks={scopeRange}
                step={10}
            />
            <Typography gutterBottom>Depth:</Typography>
            <Slider
                defaultValue={3}
                getAriaValueText={depthRangeText}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                marks={depthRange}
                max={5}
                min={1}
                step={1}  
            />
        </>
    )
}


export default FilterCPC