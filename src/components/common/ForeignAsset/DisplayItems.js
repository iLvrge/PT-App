import React, {useRef, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Grid, Typography, TextField, Button, CircularProgress  } from  '@material-ui/core'
import { Close } from "@material-ui/icons"
import useStyles from "./styles"

const DisplayItems = ({items, invalidItems, updateItems, callbackDeleteItem, handlePatchItem}) => {
    const classes = useStyles()
    const [activeItem, setActiveItem] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)

    
    const onChangeItem = (event, index, item) => {
        console.log('Change', event.target.value)
        setCurrentItem(event.target.value)
    }

    const onItemKeyPress = (event, index, item) => {        
        if (event.key === 'Enter') {
            event.preventDefault()
            const element = event.target.offsetParent.offsetParent.offsetParent
            if(element.querySelector('.input_item') !== null) {
                element.querySelector('.input_item').style.display = 'none'
                element.querySelector('.MuiTypography-root').style.display = 'block'            
                const oldItems = [...items]
                const oldItem = oldItems[activeItem]
                handlePatchItem(oldItem, currentItem)
                oldItems[activeItem] = currentItem
                updateItems(oldItems)
                setActiveItem(null)
                setCurrentItem(null)      
            }
        }
    }


    const deleteItem = (event, index, item) => {
        const confirm = window.confirm("Delete the item?")
        if(confirm) {
            const oldItems = [...items]
            callbackDeleteItem(item)
            oldItems.splice(index, 1)            
            updateItems(oldItems)
        }        
    }

    const onDoubleClick = (event, index, item) => {
        const element = event.target.parentElement
        element.querySelector('.input_item').style.display = 'block'
        element.querySelector('.MuiTypography-root').style.display = 'none'
        setActiveItem(index)
        setCurrentItem(item)
    }

    console.log("invalidItems", invalidItems)

    return (
        <Paper className={classes.items} square>
            {
                items.length > 0 && items.map( (row, index) => (
                    <div 
                        key={index} 
                        className={classes.item} 
                        onDoubleClick = { (event) => { onDoubleClick(event, index, row)
                      }}>                        
                        <Typography color="inherit" variant='body2' className={invalidItems.includes(row) ? classes.item_error : classes.item_valid}>{row}</Typography>
                        <div className={'input_item'}>
                            {
                                index === activeItem
                                ?
                                    <TextField 
                                        value={currentItem} 
                                        onChange={(e) => setCurrentItem(e.target.value)}
                                        onKeyPress={(event) => onItemKeyPress(event, index, row)}
                                    />
                                :
                                ''
                            }
                        </div>
                        <Button className={'closeBtn'}><Close onClick={(event) => deleteItem(event, index, row)} /></Button>
                    </div>
                ))
            }
        </Paper>
    )
}

export default DisplayItems;