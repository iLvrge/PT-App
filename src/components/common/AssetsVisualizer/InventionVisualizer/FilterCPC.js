import React, {useState, useEffect} from 'react'
import { Typography, Slider } from '@material-ui/core'
import useStyles from './styles'

const FilterCPC = ({ onClose, depthRange, scopeRange, depthRangeText, scopeRangeText, valueScope, valueRange, onChange }) => {
    const classes = useStyles()
    const [ scopeValue, setScopeValue ] = useState(valueScope)
    const [ rangeValue, setRangeValue ] = useState(valueRange)

    console.log("reverse", scopeRange)
    

    const handleScopeChange = (event, newValue) => {
        setScopeValue(newValue)
        onChange(rangeValue, newValue)
    }

    const handleRangeChange = (event, newValue) => {
        setRangeValue(newValue)
        onChange(newValue, scopeValue)
    }   

    return (
        <div className={classes.displayFlex}>          
            <div className={`${classes.flexColumn} ${classes.flexColumnDepth}`}>
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
                    track={'inverted'}  
                />
            </div>
            <div className={classes.flexColumn}>
                <Typography gutterBottom>Scope:</Typography>
                <Slider
                    orientation="vertical"
                    defaultValue={valueScope}
                    onChangeCommitted={handleScopeChange}
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