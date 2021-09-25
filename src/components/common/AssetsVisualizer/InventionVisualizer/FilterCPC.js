import React, {useState, useEffect, useRef} from 'react'
import { Typography, Slider } from '@material-ui/core'
import Loader from '../../Loader'
import useStyles from './styles'

const FilterCPC = ({ onClose, depthRange, scopeRange, yearRange, yearRangeText, depthRangeText, scopeRangeText, valueScope, valueRange, valueYear, onChangeRangeSlider, onChangeScopeSlider, onChangeYearSlider }) => {
    const classes = useStyles()
    const scopeRef = useRef(null)
    const [ scopeValue, setScopeValue ] = useState(valueScope)
    const [ rangeValue, setRangeValue ] = useState(valueRange)
    const [ yearValue, setYearValue ] = useState(valueYear)
    const CONTANT_HEIGHT = 18
    const [ height, setHeight] = useState('550px')
    const [ heightYear, setHeightYear] = useState('250px')
    console.log('valueYear', valueYear)
    useEffect(() => {
        setHeight(`${(scopeRange.length * CONTANT_HEIGHT) + 15}px`)
    }, [ scopeRange ])

    useEffect(() => {
        setHeightYear(`${(yearRange.length * CONTANT_HEIGHT) + 15}px`)
    }, [ yearRange ])

    useEffect(() => {
        if(scopeRef.current !== null) {
            addTooltip()
        }
    }, [ scopeRef ])

    const addTooltip = () => {
        setTimeout(() => {
            const element = scopeRef.current
            if(element !== null && element.querySelectorAll('.MuiSlider-markLabel') !== null && element.querySelectorAll('.MuiSlider-markLabel').length > 0) {
                if(document.querySelector('.scopeTooltip') !== null){
                    document.querySelector('.scopeTooltip').remove()
                }
                element.querySelectorAll('.MuiSlider-markLabel').forEach( item => {
                    item.onmouseover = (e) => { 
                        //const rect = item.getBoundingClientRect();
                        //console.log('onmouseover', rect)
                        const div = document.createElement('div')
                            div.innerText = item.innerText
                            div.setAttribute('id', `element-${item.getAttribute('data-index')}`)
                            div.setAttribute('class', `scopeTooltip`)
                            div.style = `top: ${e.clientY + 10}px; left: ${e.clientX + 20}px`
                            document.body.appendChild(div)
                    }
                    item.onmouseleave = (e) => {
                        const element = document.querySelector(`.scopeTooltip`)
                        if(element !== null) {
                            element.remove()
                        } 
                    }
                })
                const containerElement = document.body.querySelector('.selContainer'), activeRange = containerElement.querySelectorAll('.MuiSlider-markLabelActive')
                containerElement.scrollTo(0, activeRange[activeRange.length - 1].offsetTop + 23)
            } else {
                addTooltip()  
            }
        }, 1000)
    } 

    const handleScopeChange = (event, newValue) => {
        setScopeValue(newValue)
        onChangeScopeSlider(yearValue, rangeValue, newValue)
    }

    const handleRangeChange = (event, newValue) => {
        setRangeValue(newValue)
        onChangeRangeSlider(yearValue, newValue)
    }   

    const handleYearChange = (event, newValue) => {
        onChangeYearSlider(rangeValue, newValue)
    }

    return (
        <div className={classes.displayFlex}>   
            <div className={classes.headingContainer}>
                <div className={`${classes.flexColumn} ${classes.flexColumnYear}`}> 
                    <div className={classes.heading}>
                        <Typography>Year:</Typography>
                    </div>
                </div>   
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
            <div className={classes.mainContainer}>
                <div className={`${classes.flexColumn} ${classes.flexColumnYear}`}>
                    <div className={classes.selectorContainer}>
                        <div className={`year ${classes.holder} ${classes.topMargin}`} style={{height: heightYear}}>  
                            {
                                yearRange.length > 0
                                ?
                                <Slider
                                    orientation="vertical"
                                    defaultValue={valueYear} 
                                    onChangeCommitted={handleYearChange}
                                    aria-labelledby="vertical-slider"
                                    getAriaValueText={yearRangeText}
                                    marks={yearRange}
                                    max={yearRange.length}
                                    step={1} 
                                    min={1}
                                /> 
                                :
                                <Loader/>
                            }
                        </div>             
                    </div>             
                </div>
                <div className={`depth ${classes.flexColumn} ${classes.flexColumnDepth} ${classes.topMargin} ${classes.customHeight}`}>
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
                    <div className={`selContainer ${classes.selectorContainer}`}>
                        <div className={`scope ${classes.holder} ${classes.topMargin}`} style={{height}}>  
                            {
                                scopeRange.length > 0
                                ?
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
                                    ref={scopeRef} 
                                /> 
                                :
                                <Loader/>
                            }                            
                        </div>             
                    </div>             
                </div>
            </div>      
        </div> 
    )
}


export default FilterCPC