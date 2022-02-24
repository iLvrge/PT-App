import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Paper, TextField, InputLabel } from "@mui/material";
import Loader from "../Loader";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import { numberWithCommas, applicationFormat } from "../../../utils/numbers";

const LoadMaintainenceAssets = ({rows, onChangeFileName}) => {
    const classes = useStyles();
    const [rowHeight, setRowHeight] = useState(40)
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
    const [width, setWidth] = useState(800);
    const [currentSelection, setCurrentSelection] = useState(null)
    const [assets, setAssets] = useState([])
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [ name, setName ] = useState(`${moment(new Date()).format('MM-DD-YYYY')}_Patent_Maintenance_Fee_Bulk_File`)

    const COLUMNS = [
        {
            width: 110,
            minWidth: 110,   
            label: "Patent #",
            dataKey: "patent",
            staticIcon: "US",
            format: numberWithCommas,
            align: "left",
            paddingLeft: 20
        },
        {
            width: 110,
            minWidth: 110,   
            label: "Application #",
            dataKey: "application",
            staticIcon: "US",
            format: applicationFormat,
            align: "left",
        },
        {
            width: 135,  
            minWidth: 135,      
            label: "Attorney Docket #",
            dataKey: "attorney",
            align: "left",
        },
        {
            width: 80,  
            minWidth: 80,          
            label: "Fee Code",
            dataKey: "fee_code",
            align: "left",		
            styleCss: true,
            justifyContent: 'flex-end',
        },
        {
            width: 70,      
            minWidth: 70,   
            label: "Fee Amount",
            dataKey: "fee_amount",
            staticIcon: "$",
            format: numberWithCommas,
            align: "left",		
            styleCss: true,
            justifyContent: 'flex-end',
        },
    ]

    useEffect(() => {
        const maintainenceAssets = []
        if( rows.length > 0 ) {
            let total = 0
            rows.map( row => {
                maintainenceAssets.push({
                    id: ' ',
                    patent: row[0],
                    application: row[1],
                    attorney: row[2]+' ',
                    fee_code: row[3],
                    fee_amount: row[4],
                })
                total += parseInt(row[4]) > 0 ? parseInt(row[4]) : 0
            })

            maintainenceAssets.push({
                id: ' ',
                patent: '',
                application: '',
                attorney: '',
                fee_code: 'Total:',
                fee_amount: total,
                underline: true   
            })

        }
        setAssets(maintainenceAssets)
    }, [ rows ])

    const handleClickSelectCheckbox = () => {

    }

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
                    selectedKey={"asset"}
                    rows={assets}
                    rowHeight={rowHeight}
                    headerHeight={headerRowHeight}
                    columns={COLUMNS}
                    onSelect={handleClickSelectCheckbox}
                    onSelectAll={onHandleSelectAll}
                    defaultSelectAll={selectedAll}
                    collapsable={false}
                    showIsIndeterminate={false}
                    totalRows={assets.length}
                    defaultSortField={`asset`}
                    defaultSortDirection={`desc`}
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



export default LoadMaintainenceAssets;