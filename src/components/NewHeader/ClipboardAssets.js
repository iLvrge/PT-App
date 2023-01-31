import React, { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper } from '@mui/material'
import useStyles from './styles' 
import VirtualizedTable from '../common/VirtualizedTable'

import { numberWithCommas } from '../../utils/numbers'

const ClipboardAssets = () => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const [rowHeight, setRowHeight] = useState(40)
    const [width, setWidth] = useState(800)
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [selectedAssets, setSelectedAssets] = useState([])

    const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)
 
    const COLUMNS = [
        {
          width: 100,
          label: "Assets",
          dataKey: "asset",
          staticIcon: "US",
          format: numberWithCommas,
          align: "left",
          paddingLeft: '20px'    
        }
    ];

    /**
   * Click checkbox
   */
    const handleClickSelectCheckbox = useCallback((e, row) => {
        e.preventDefault()     
    }, [])

    /**
   * Click All checkbox
   */

    const onHandleSelectAll = useCallback((event, row) => {
        event.preventDefault()        
    }, [])
    

    return (
        <Paper className={classes.rootClipboard} square id={`assets_clipboard`}>
            <VirtualizedTable
                classes={classes}
                selected={selectItems}
                rowSelected={selectedRow}
                selectedKey={"asset"}
                rows={clipboard_assets}
                rowHeight={rowHeight}
                headerHeight={rowHeight}
                columns={COLUMNS}
                onSelect={handleClickSelectCheckbox}
                onSelectAll={onHandleSelectAll}
                defaultSelectAll={selectedAll}
                responsive={false}
                width={width}
                containerStyle={{
                    width: "100%",
                    maxWidth: "100%",
                }}
                style={{
                    width: "100%",
                }}
            />
        </Paper>
    )
}


export default ClipboardAssets