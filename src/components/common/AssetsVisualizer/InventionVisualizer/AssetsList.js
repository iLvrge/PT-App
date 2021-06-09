import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper } from '@material-ui/core'
import useStyles from './styles' 
import VirtualizedTable from '../../VirtualizedTable'




import { numberWithCommas } from '../../../../utils/numbers'

import { setClipboardAssets } from '../../../../actions/patentTrackActions2'

import Loader from '../../Loader'

const AssetsList = ({ assets, loading }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const [rowHeight, setRowHeight] = useState(40)
    const [width, setWidth] = useState(800)
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [selectedAssets, setSelectedAssets] = useState([])
    const COLUMNS = [
        {
            width: 29,
            minWidth: 29,
            label: "",
            dataKey: "id",
            role: "checkbox",
            disableSort: true
        },
        {
          width: 100,
          label: "Assets",
          dataKey: "assets",
          staticIcon: "US",
          format: numberWithCommas,
          align: "left",
          paddingLeft: '20px'    
        },
        {
            width: 671,
            label: "Title",
            dataKey: "title",
            align: "left"
        }
    ];

    /**
   * Click checkbox
   */
    const handleClickSelectCheckbox = useCallback((e, row) => {
        e.preventDefault();
        let oldItems = [...selectItems], oldAssets = [...selectedAssets]
        if( oldItems.length > 0 ) {
            const findIndex = oldItems.findIndex( id => id == row.id)
            if( findIndex !== -1 ) {
                oldItems.splice( findIndex, 1 )
                oldAssets.splice( findIndex, 1 )
            } else {
                oldItems.push(row.id)
                oldAssets.push({asset: row.assets})
            }
        } else {
            oldItems.push(row.id)
            oldAssets.push({asset: row.assets})
        }
        setSelectItems(oldItems)
        setSelectedAssets(oldAssets)
        dispatch(setClipboardAssets(oldAssets))
    }, [ dispatch, selectItems, selectedAssets ])

    /**
   * Click All checkbox
   */

    const onHandleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target
        if (checked === false) {
            setSelectItems([])
            dispatch(setClipboardAssets([]));
        } else if (checked === true) {
            if (assets.length > 0) {
                let items = [], assets = []
                assets.forEach(asset => {
                    items.push(asset.id)
                    assets.push(asset.assets)
                })
                setSelectItems(items)
                dispatch(setClipboardAssets(assets));
            }
        }
        setSelectAll(checked)
    }, [ dispatch, assets ])
    
    if (loading || assets.length == 0) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_cpc`}>
            <VirtualizedTable
                classes={classes}
                selected={selectItems}
                rowSelected={selectedRow}
                selectedKey={"assets"}
                rows={assets}
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


export default AssetsList