import React, {useState, useEffect} from 'react'
import { Typography, Slider } from '@material-ui/core'
import useStyles from './styles'

const FilterCPC = ({ onClose, depthRange, scopeRange, depthRangeText, scopeRangeText, valueScope, valueRange, onChangeRangeSlider, onChangeScopeSlider }) => {
    const classes = useStyles()
    const [ scopeValue, setScopeValue ] = useState(valueScope)
    const [ rangeValue, setRangeValue ] = useState(valueRange)
    const CONTANT_HEIGHT = 18
    const [ height, setHeight] = useState('550px')
    
    useEffect(() => {
        setHeight(`${scopeRange.length * CONTANT_HEIGHT}px`)
    }, [ scopeRange ])

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
            <div className={classes.headingContainer}>
                <div className={`${classes.flexColumn} ${classes.flexColumnDepth}`}>
                    <div className={classes.heading}>
                        <Typography>Depth:</Typography>
                    </div>
                </div>   
                <div className={`${classes.flexColumn} ${classes.flexColumnScope}`}>
                    <div className={classes.heading}>
                        <Typography>Scope:</Typography> 
                    </div>    
                </div>   
            </div>  
            <div className={classes.selectorContainer}>  
                <div className={classes.holder} style={{height}}>  
                    <div className={`${classes.flexColumn} ${classes.flexColumnDepth}`}>
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
                    <div className={`${classes.flexColumn} ${classes.flexColumnScope}`}>
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
            </div>             
        </div> 
    )
}


export default FilterCPC