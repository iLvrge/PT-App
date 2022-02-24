import React, {useState, useEffect} from 'react'

import { Paper, Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Typography  } from '@mui/material'
import Draggable from "react-draggable"
import CloseIcon from '@mui/icons-material/Close'
import {ResizableBox} from "react-resizable"
import useStyles from './styles'



const DialogPopup = (props) => {
    const classes = useStyles()
    const [minConstraints, setMinConstraints] = useState(typeof props.minConstraints !== 'undefined' ? props.minConstraints : [420, 350])
    const [maxConstraints, setMaxConstraints] = useState(typeof props.maxConstraints !== 'undefined' ? props.maxConstraints : [1500, 800])
    const [ filterDrag, setFilterDrag ] =  useState([0, 0])
    const [ resizableWidthHeight, setResizableWidthHeight ] = useState([typeof props.resizableWidth !== 'undefined' ? props.resizableWidth  : 665, typeof props.resizableHeight !== 'undefined' ? props.resizableHeight : 350])

    useEffect(() => {
    }, [resizableWidthHeight])

    const handleResize = (event, {element, size, handle}) => {
        setResizableWidthHeight([size.width, size.height])
    }

    const handleDragStop = (e, position) => {
        const {x, y} = position;
        const {availWidth, availHeight} = window.screen
        const calcHeight = ((availHeight - 105) - resizableWidthHeight[1]) 
        setFilterDrag([x < 0 ? 0 : x > availWidth - resizableWidthHeight[0] ? availWidth - resizableWidthHeight[0] : x, y < 0 ? 0 : y > calcHeight ? calcHeight : y])
    }

    const PaperComponentFilter = (props) => {
        return (
            <Draggable handle="#draggable-dialog-filter" defaultPosition={{x: filterDrag[0], y: filterDrag[1]}} cancel={'[class*="MuiDialogContent-root"]'} onStop={handleDragStop}>
                <ResizableBox
                    height={resizableWidthHeight[1]}
                    width={resizableWidthHeight[0]}
                    minConstraints={minConstraints} 
                    maxConstraints={maxConstraints}
                    className={classes.resizable}
                    onResizeStop={handleResize}
                >
                    <Paper square={true} {...props} />                    
                </ResizableBox>                
            </Draggable>
        );
    }


    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            className={`${classes.modal} ${classes.modalFilter} `}
            {...( props.resizable ===  true  ? {PaperComponent: PaperComponentFilter} : {})} 
            {...( props.scroll ===  true  ? { scroll: 'paper' } : {})}     
            
            aria-labelledby="filter-cpc"
        >                
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-filter">
                {
                    typeof props.title !== 'undefined' ? 
                        <Typography color="inherit" variant='body2' >{props.title}</Typography>
                    :
                    ''
                }
            </DialogTitle> 
            <DialogContent 
                className={classes.filterContent}
                {...( props.scroll ===  true  ? { dividers: true } : {})}   
            >
                {props.children}               
            </DialogContent>
            <DialogActions>
                {typeof props.footerCallBack !== 'undefined' ? props.footerCallBack : ''}
            </DialogActions>            
        </Dialog>
    )
}


export default DialogPopup;