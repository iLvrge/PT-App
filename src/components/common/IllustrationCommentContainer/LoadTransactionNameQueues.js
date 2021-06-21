import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { Paper, TextField, InputLabel } from "@material-ui/core";
import Loader from "../Loader";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import { numberWithCommas, applicationFormat } from "../../../utils/numbers";

import {
    setFixedTransactionName
  } from '../../../actions/patentTrackActions2'

const LoadTransactionNameQueues = ({}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [rowHeight, setRowHeight] = useState(40)
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
    const [width, setWidth] = useState(1200)
    const [currentSelection, setCurrentSelection] = useState(null)
    const [rows, setRows] = useState([])
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const nameQueues = useSelector(state => state.patenTrack2.nameQueues)

    const COLUMNS = [
        { 
            width: 29, 
            minWidth: 29,   
            label: '',
            dataKey: 'id',
            role: 'radio',
            disableSort: true
        },
        {
            width: 80,
            minWidth: 80,   
            label: "Rf/Id",
            dataKey: "id",
            align: "left",
        },
        {
            width: 200,
            minWidth: 200,   
            label: "Current Assignee Name",
            dataKey: "name",
            align: "left",
        },
        {
            width: 200,
            minWidth: 200,   
            label: "New Name",
            dataKey: "new_name",
            align: "left",
        },
        {
            width: 130,
            minWidth: 130,   
            label: "Conveyance Type",
            dataKey: "convey_ty",
            align: "left",
        },
        {
            width: 110,
            minWidth: 110,   
            label: "Executed Date",
            dataKey: "exec_dt",
            align: "left",
        },
        {
            width: 110,
            minWidth: 110,   
            label: "Recorded Date",
            dataKey: "record_dt",
            align: "left",
        },
        {
            width: 100,
            minWidth: 100,   
            label: "Assets",
            dataKey: "assets",
            staticIcon: "",
            format: numberWithCommas,
            align: "left",
        },        
        {
            width: 120,      
            minWidth: 120,   
            label: "Original Correspondence",
            dataKey: "original_correspondence",
            align: "left",		  
        }
    ]

    useEffect(() => {        
        setRows(nameQueues)
    }, [ nameQueues ])

    const handleClickSelectCheckbox = useCallback((event, row) => {
        event.preventDefault()
        setSelectItems([row.id])
        dispatch(setFixedTransactionName([[row.id, row.new_name]]))
    }, [dispatch])

    const onHandleSelectAll = () => {
        
    }
    
    return (
        <Paper
            className={classes.root}
            square
            id={`pay_maintainence_assets_to_uspto`}
            >
            {/* <InputLabel shrink>File Name</InputLabel>   
            <TextField 
                id='file_name' 
                label={false}
                placeholder='File Name' 
                defaultValue={name} 
                onChange={onChangeFileName}
            /> */}
            <div className={classes.container}>
                <VirtualizedTable
                    classes={classes}
                    selected={selectItems}
                    rowSelected={selectedRow}
                    selectedIndex={currentSelection}
                    selectedKey={"id"}
                    rows={rows}
                    rowHeight={rowHeight}
                    headerHeight={headerRowHeight}  
                    columns={COLUMNS}
                    onSelect={handleClickSelectCheckbox}
                    onSelectAll={onHandleSelectAll}
                    defaultSelectAll={selectedAll}
                    collapsable={false}
                    showIsIndeterminate={false}
                    totalRows={rows.length}
                    /* defaultSortField={`exec_dt`}
                    defaultSortDirection={`desc`} */
                    responsive={true}
                    width={width}
                    containerStyle={{
                        width: "100%",
                        maxWidth: "100%",
                    }}
                    style={{
                        width: "100%",
                    }}
                />
            </div>
        </Paper>
    ) 
}



export default LoadTransactionNameQueues;