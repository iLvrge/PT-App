import React, {useState, useEffect} from 'react'
import { Typography, Slider } from '@material-ui/core'
import useStyles from './styles'

const FilterCPC = ({ onClose, depthRange, scopeRange, depthRangeText, scopeRangeText, valueScope, valueRange, onChange }) => {
    const classes = useStyles()
    const [ scopeValue, setScopeValue ] = useState(valueScope)
    const [ rangeValue, setRangeValue ] = useState(valueRange)

    /*useEffect(() => {
        if(scopeRange.length > 1) {
            setScopeValue([2,3])
        }
    }, [scopeRange])*/


    const handleScopeChange = (event, newValue) => {
        setScopeValue(newValue)
        onChange(rangeValue, newValue)
    };

    const handleRangeChange = (event, newValue) => {
        setRangeValue(newValue)
        onChange(newValue, scopeValue)
    };


    const marks = [
        {
          value: 0,
          label: '0°C',
        },
        {
          value: 20,
          label: '20°C',
        },
        {
          value: 37,
          label: '37°C',
        },
        {
          value: 100,
          label: '100°C',
        },
    ];

   

    return (
        <div className={classes.displayFlex}>          
            <div className={classes.flexColumn}>
                <Typography gutterBottom>Depth:</Typography>
                <Slider
                    defaultValue={valueRange}
                    orientation="vertical"
                    onChangeCommitted={handleRangeChange}
                    getAriaValueText={depthRangeText}
                    aria-labelledby="vertical-slider"
                    marks={depthRange}
                    max={depthRange.length}
                    min={1}
                    step={1}  
                />
            </div>
            <div className={classes.flexColumn}>
                <Typography gutterBottom>Scope:</Typography>
                {/* <Slider
                    orientation="vertical"
                    defaultValue={[1,2]}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    getAriaValueText={scopeRangeText}
                    marks={scopeRange}
                    max={scopeRange.length}
                    min={1}
                    step={5}  
                /> */}
                <Slider
                    orientation="vertical"
                    defaultValue={valueScope}
                    onChange={handleScopeChange}
                    aria-labelledby="vertical-slider"
                    getAriaValueText={scopeRangeText}
                    marks={scopeRange}
                    max={scopeRange.length}
                    step={1} 
                    min={1} 
                /> 
            </div>             
        </div> 
    )
}


export default FilterCPC