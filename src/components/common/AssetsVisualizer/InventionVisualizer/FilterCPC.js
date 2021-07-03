import React, {useState, useEffect} from 'react'
import { Typography, Slider } from '@material-ui/core'
import useStyles from './styles'

const FilterCPC = ({ onClose, depthRange, scopeRange, depthRangeText, scopeRangeText, valueScope, valueRange, onChangeRangeSlider, onChangeScopeSlider }) => {
    const classes = useStyles()
    const [ scopeValue, setScopeValue ] = useState(valueScope)
    const [ rangeValue, setRangeValue ] = useState(valueRange)

    console.log("reverse", scopeRange)
    

    const handleScopeChange = (event, newValue) => {
        setScopeValue(newValue)
        onChangeScopeSlider(rangeValue, newValue)
    }

    const handleRangeChange = (event, newValue) => {
        setRangeValue(newValue)
        onChangeRangeSlider(newValue)
    }   

    return (
        <div className={classes.displayFlex}>          
            <div className={`${classes.flexColumn} ${classes.flexColumnDepth}`}>
                <div className={classes.heading}>
                    <Typography>Depth:</Typography>
                </div>                
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
                <div className={classes.heading}>
                    <Typography>Scope:</Typography> 
                </div> 
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