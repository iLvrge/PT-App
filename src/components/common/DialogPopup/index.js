import './resizable.css'
import React, {useState, useEffect} from 'react'

import { Paper, Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Typography  } from '@mui/material'
import Draggable from "react-draggable"
import CloseIcon from '@mui/icons-material/Close'
import {ResizableBox} from "react-resizable"



const DialogPopup = (props) => {
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
                    className={"pt-resizable relative flex flex-col"}
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
            className={`${"[&_.react-draggable]:h-[50vh] [&_.react-draggable]:w-[800px] [&_.MuiDialog-paperWidthSm]:max-w-[inherit] [&_.MuiDialogContent-root]:overflow-x-hidden [&_.MuiDialogContent-dividers]:border-0"} ${"[&_.react-draggable]:h-[70vh] [&_.react-draggable]:w-[70vw] [&_.MuiDialog-paperWidthSm]:m-0 [&_.MuiDialog-paperWidthSm]:h-full [&_.MuiDialog-paperWidthSm]:max-h-[inherit] [&_.MuiDialog-paperWidthSm]:max-w-[inherit] [&_.MuiDialog-scrollPaper]:items-start [&_.MuiDialog-scrollPaper]:justify-start"} `}
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
                className={"mx-10 [&_.MuiInputBase-multiline]:p-0"}
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