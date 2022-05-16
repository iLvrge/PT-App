import React, {useState, useEffect, useRef} from 'react'
import { Typography, Slider, MenuItem, ListItemIcon, Divider, ListItemText, Checkbox } from '@mui/material'
import Loader from '../../Loader'
import useStyles from './styles'
import clsx from 'clsx'

const FilterDashboardCPC = ({ depthRange, scopeRange, yearRange, yearRangeText, depthRangeText, scopeRangeText, valueScope, valueRange, valueYear, onChangeRangeSlider, onChangeScopeSlider, onChangeYearSlider }) => {
    const classes = useStyles()
    const scopeRef = useRef(null)
    const [ scopeValue, setScopeValue ] = useState(valueScope)
    const [ rangeValue, setRangeValue ] = useState(valueRange)
    const [ yearValue, setYearValue ] = useState(valueYear)
    const [dashboardYearRange, setDashboardYearRange] = useState([])
    const [dashboardDepthRange, setDashboardDepthRange] = useState([])
    const CONTANT_HEIGHT = 18
    const [ height, setHeight] = useState('550px')
    const [ heightYear, setHeightYear] = useState('250px')
    const [filterSection, setFilterSection] = useState([
        {
            label: 'Human Necessities',
            value: 'A'
        },
        {
            label: 'Performaing Operations; Transporting',
            value: 'B'
        },
        {
            label: 'Chemistry; Metallurgy',
            value: 'C'
        },
        {
            label: 'Textiles; Paper',
            value: 'D'
        },
        {
            label: 'Fixed Constructions',
            value: 'E'
        },
        {
            label: 'Mechanical Engineering; Lighting; Heating; Weapons; Blasting',
            value: 'F'
        },
        {
            label: 'Physics',
            value: 'G'
        },
        {
            label: 'Electricity',
            value: 'H'
        }
    ])
    useEffect(() => {
        setHeight(`${(scopeRange.length * CONTANT_HEIGHT) + 15}px`)
    }, [ scopeRange ])

    useEffect(() => {
        setHeightYear(`${(yearRange.length * CONTANT_HEIGHT) + 15}px`)
        const year = []
        yearRange.forEach(item => year.push({value: item.value}))
        setDashboardYearRange(year)
    }, [ yearRange ])

    useEffect(() => {
        const depth = []
        depthRange.forEach(item => depth.push({value: item.value}))
        setDashboardDepthRange(depth)
    }, [depthRange])

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
    const onChangeSection = (event) => {
        let oldValue = [...scopeValue]
        if(oldValue.includes(event.target.value)) {
            oldValue = oldValue.filter(item => item != event.target.value)
        } else {
            oldValue.push(event.target.value)
        }
        setScopeValue(oldValue)
        onChangeScopeSlider(yearValue, rangeValue, oldValue)
    }
    let filters = filterSection.map((category_, i_) => {        
        return (
          <MenuItem
            key={`FilterElement_${i_}`}
            className={clsx(`listIconItem listIconItem1 checkboxItems`)}
          >
            <ListItemIcon className={'checkbox'}>
              <Checkbox
                checked={valueScope.includes(category_.value) ? true : false}
                id={`CheckBoxFilterElement_${i_}`}
                value={category_.value}
                onChange={onChangeSection}
              />
            </ListItemIcon>
            <ListItemText>{category_.label}</ListItemText>
          </MenuItem>
        );
    });
    return (
        <React.Fragment>
            <MenuItem> 
                <ListItemIcon className={'zoom_container'}>
                {
                    yearRange.length > 0
                    ?
                        <Slider
                            className={'zoom_slider'}
                            defaultValue={valueYear} 
                            key={`slider-year`}
                            onChangeCommitted={handleYearChange}
                            getAriaValueText={yearRangeText}
                            marks={dashboardYearRange}
                            max={yearRange.length}
                            step={1} 
                            min={1}
                        /> 
                    :
                    <Loader/>
                }
                </ListItemIcon>
                <ListItemText className={'show_label'}>{ yearRange.length > 0 ? `Filter ${yearRange[0].label} - ${yearRange[yearRange.length - 1].label}` : ''}</ListItemText>
            </MenuItem>
            <Divider /> 
            <MenuItem> 
                <ListItemIcon className={'zoom_container'}>
                {
                    yearRange.length > 0
                    ?
                        <Slider
                            className={'zoom_slider'}
                            key={`slider-range`}
                            defaultValue={valueRange}
                            onChangeCommitted={handleRangeChange}
                            getAriaValueText={depthRangeText}
                            marks={dashboardDepthRange}
                            max={depthRange.length}
                            min={1}
                            step={1}
                            track={'inverted'}  
                        />
                    :
                    <Loader/>
                }
                </ListItemIcon>
                <ListItemText className={'show_label'}>Zoom</ListItemText>
            </MenuItem>
            <Divider /> 
            {filters}
        </React.Fragment>
    )
}


export default FilterDashboardCPC