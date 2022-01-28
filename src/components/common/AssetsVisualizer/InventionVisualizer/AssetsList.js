import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper } from '@material-ui/core'

import { Clear, NotInterested, KeyboardArrowDown } from '@material-ui/icons';

import useStyles from './styles' 
import VirtualizedTable from '../../VirtualizedTable'


import  { controlList } from '../../../../utils/controlList'

import { capitalize, numberWithCommas } from '../../../../utils/numbers'

import { setClipboardAssets, setMoveAssets } from '../../../../actions/patentTrackActions2'

import Loader from '../../Loader'

const AssetsList = ({ assets, loading, remoteAssetFromList }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const [rowHeight, setRowHeight] = useState(40)
    const [width, setWidth] = useState(800)
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [selectedAssets, setSelectedAssets] = useState([])
    const [ dropOpenAsset, setDropOpenAsset ] = useState(null)

    const move_assets = useSelector(state => state.patenTrack2.move_assets)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
    
    useEffect(() => {
        if( clipboard_assets.length != selectItems.length ) {
            setSelectedAssets(clipboard_assets)
            const items = []
            clipboard_assets.map( asset => items.push(asset.id))
            setSelectItems(items)
        }
    }, [ clipboard_assets ])
    const Clipboard = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className='clipboard' fill="#fff" enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M40,5c-3.3085938,0-6,2.6914062-6,6v3h-5c-0.4199219,0-0.7949219,0.262207-0.9394531,0.6567383l-0.880188,2.4077148	h-9.0836792C16.9404297,17.0644531,16,18.0048828,16,19.1611328v53.7421875C16,74.0595703,16.9404297,75,18.0966797,75h43.8066406
 C63.0595703,75,64,74.0595703,64,72.9033203V19.1611328c0-1.15625-0.9404297-2.0966797-2.0966797-2.0966797H52.755188
 L51.875,14.6567383C51.7304688,14.262207,51.3554688,14,50.9355469,14H46v-3C46,7.6914062,43.3085938,5,40,5z M53.1289062,22
 c0.3261719,0,0.6328125-0.1591797,0.8193359-0.4267578c0.1875-0.2680664,0.2324219-0.6098633,0.1201172-0.9165039
 l-0.5820923-1.5922852h8.4170532C61.9541016,19.0644531,62,19.1103516,62,19.1611328v53.7421875
 C62,72.9541016,61.9541016,73,61.9033203,73H18.0966797C18.0458984,73,18,72.9541016,18,72.9033203V19.1611328
 c0-0.0507812,0.0458984-0.0966797,0.0966797-0.0966797h8.3526001l-0.5820923,1.5922852
 c-0.1123047,0.3066406-0.0673828,0.6484375,0.1201172,0.9165039C26.1738281,21.8408203,26.4804688,22,26.8066406,22H53.1289062z
 M50.2363281,16l1.4619141,4H28.2373047l1.4619141-4H35c0.5527344,0,1-0.4477539,1-1v-4c0-2.2055664,1.7939453-4,4-4
 s4,1.7944336,4,4v4c0,0.5522461,0.4472656,1,1,1H50.2363281z" ></path><path d="M23,38h8V28h-8V38z M25,30h4v6h-4V30z" ></path><rect width="23" height="2" x="34" y="32" ></rect><rect width="17" height="2" x="23" y="44" ></rect><rect width="34" height="2" x="23" y="54" ></rect><rect width="34" height="2" x="23" y="64" ></rect><rect width="2" height="4" x="38.968" y="9" ></rect></svg>
        )
    }

    const dropdownList = [
        {
            id: 99,
            name: 'No action' ,
            icon: <NotInterested />,
            image: ''
        },
        {
            id: -1,
            name: '', 
            icon: <KeyboardArrowDown />,
            image: ''
        },
        {
          id: 0,
          name: 'Remove from this list', 
          icon: <Clear />,
          image: ''
        },
        {
          id: 2,
          name: 'Move to Sale',
          image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/sell.png',
          icon: ''
        },
        {
          id: 4,
          name: 'Move to License-Out',
          image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/licenseout.png',
          icon: ''
        },
        {
            id: 5,
            name: 'Add to Clipboard',
            image: '',
            icon: <Clipboard />
        }
    ]

    const onHandleHeadDropDownlist = useCallback(async(event) => { 
        console.log("adad")
        if(event.target.value == 5) {
            let oldItems = [...clipboard_assets, ...assets]
            dispatch(setClipboardAssets(oldItems))
        } else if( event.target.value == 0 ) {
            let oldItems = [...clipboard_assets]
            const promiseAsset = assets.map( row => {
                const findIndex = oldItems.findIndex( item => item.asset == row.asset )
                if( findIndex !== -1 ) {
                    oldItems.splice(findIndex, 1)
                }
            })
            await Promise.all(promiseAsset)
        }
        const currentLayoutIndex = controlList.findIndex(r => r.type == 'menu' && r.category == selectedCategory )
        if(currentLayoutIndex !== -1) {
            setDropOpenAsset(null)
            let oldMoveAssets = [...move_assets]           
            const promiseMoveAsset = assets.map( row => {
                const findIndex = oldMoveAssets.findIndex(item => item.asset == row.asset)
                if(findIndex !== -1) {
                    oldMoveAssets.splice(findIndex, 1)
                }
                if( event.target.value !== 99 ) {
                    oldMoveAssets.push({
                        asset: row.asset,
                        move_category: event.target.value,
                        currentLayout: controlList[currentLayoutIndex].layout_id,
                        grant_doc_num: row.grant_doc_num,
                        appno_doc_num: row.appno_doc_num,
                    })          
                }    
            })
            await Promise.all(promiseMoveAsset)
            dispatch(setMoveAssets(oldMoveAssets)) 
        }
    })
    const onHandleDropDownlist = useCallback(async(event, asset, row ) => { 
        console.log("onHandleDropDownlist", event.target.value)
        if(event.target.value == 5) {
           
            /* setSelectItems(prevItems =>
                prevItems.includes(row.asset)
                ? prevItems.filter(item => item !== row.asset)
                : [...prevItems, row.asset],
            ); */
            
            let oldItems = [...clipboard_assets]
            const findIndex = oldItems.findIndex(item => item.asset == row.asset)
            if(findIndex === -1) {
                oldItems.push(row)
            } else {
                oldItems = oldItems.filter( item => item.asset !== row.asset)
            }
            dispatch(setClipboardAssets(oldItems))
        } else if( event.target.value == 0 ) {
            if(clipboard_assets.length > 0) {
                const remAssets = clipboard_assets.filter( r => r.asset != row.asset)
                dispatch(setClipboardAssets(remAssets))
                setSelectedAssets(remAssets)
            }            
            remoteAssetFromList(row.asset)
        }
        
        const currentLayoutIndex = controlList.findIndex(r => r.type == 'menu' && r.category == selectedCategory )
        if(currentLayoutIndex !== -1) {
            setDropOpenAsset(null)
            let oldMoveAssets = [...move_assets]
            const findIndex = oldMoveAssets.findIndex(row => row.asset == asset)
            if(findIndex !== -1) {
                oldMoveAssets.splice(findIndex, 1)
            }
            if( event.target.value !== 99 ) {
                oldMoveAssets.push({
                    asset,
                    move_category: event.target.value,
                    currentLayout: controlList[currentLayoutIndex].layout_id,
                    grant_doc_num: row.grant_doc_num,
                    appno_doc_num: row.appno_doc_num,
                })          
            }   
            dispatch(setMoveAssets(oldMoveAssets)) 
        }
        /*  */
    }, [ dispatch, controlList, move_assets, display_clipboard, selectItems, selectedAssets, clipboard_assets ])
    
    const COLUMNS = [
        {
            width: 10,
            minWidth: 10,
            label: "", 
            dataKey: "asset",
            role: "checkbox",
            disableSort: true,
            show_selection_count: true,
            enable: false
        },
        {
            width: 20,
            minWidth: 20,
            disableSort: true,
            label: "",
            dataKey: "asset",
            role: "static_dropdown",
            list: dropdownList,
            onClick: onHandleDropDownlist
        },
        {
          width: 120,
          label: "Assets",
          dataKey: "asset",
          staticIcon: "US",
          format: numberWithCommas,
          align: "left",
          paddingLeft: '20px'   ,
          badge: true, 
        },
        {
            width: 671,
            label: "Title",
            dataKey: "title",
            staticIcon: "",
            format: capitalize,
            align: "left"
        }
    ];

    /**
   * Click checkbox
   */
    const handleClickSelectCheckbox = useCallback((e, row) => {
        /* e.preventDefault();
        let oldItems = [...selectItems], oldAssets = [...selectedAssets]
        if( oldItems.length > 0 ) {
            const findIndex = oldItems.findIndex( id => id == row.id)
            if( findIndex !== -1 ) {
                oldItems.splice( findIndex, 1 )
                oldAssets.splice( findIndex, 1 )
            } else {
                oldItems.push(row.id)
                oldAssets.push(row)
            }
        } else {
            oldItems.push(row.id)
            oldAssets.push(row)
        }
        setSelectItems(oldItems)
        setSelectedAssets(oldAssets)
        dispatch(setClipboardAssets(oldAssets)) */
        e.preventDefault();
        if(typeof e.target.closest == 'function') {
            const element = e.target.closest('div.ReactVirtualized__Table__rowColumn')
            if(element != null) {
                const index = element.getAttribute('aria-colindex')
                const findElement = element.querySelector('div.MuiSelect-select')
                if( index == 2 && findElement != null ) {
                    setDropOpenAsset(row.asset)
                }
            } else {
                if( row.asset == dropOpenAsset ) {
                    setDropOpenAsset(null)
                }
            }
        }

    }, [ dispatch, selectItems, selectedAssets, dropOpenAsset ])

    /**
   * Click All checkbox
   */

    const onHandleSelectAll = useCallback(async (event, row) => {
        event.preventDefault()
        const { checked } = event.target  
        if (checked === false) {
            setSelectItems([])
            dispatch(setClipboardAssets([]));
        } else if (checked === true) {
            if (assets.length > 0) {
                let items = [], allAssets = []
                const promises = assets.map(asset => {
                    items.push(asset.id)
                    allAssets.push(asset)
                })
                await Promise.all(promises)
                setSelectItems(items)
                dispatch(setClipboardAssets(allAssets));
            }
        }
        setSelectAll(checked)
    }, [ dispatch, assets, selectItems ])

    const ClipIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#fff" enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M40,5c-3.3085938,0-6,2.6914062-6,6v3h-5c-0.4199219,0-0.7949219,0.262207-0.9394531,0.6567383l-0.880188,2.4077148	h-9.0836792C16.9404297,17.0644531,16,18.0048828,16,19.1611328v53.7421875C16,74.0595703,16.9404297,75,18.0966797,75h43.8066406
        C63.0595703,75,64,74.0595703,64,72.9033203V19.1611328c0-1.15625-0.9404297-2.0966797-2.0966797-2.0966797H52.755188
        L51.875,14.6567383C51.7304688,14.262207,51.3554688,14,50.9355469,14H46v-3C46,7.6914062,43.3085938,5,40,5z M53.1289062,22
        c0.3261719,0,0.6328125-0.1591797,0.8193359-0.4267578c0.1875-0.2680664,0.2324219-0.6098633,0.1201172-0.9165039
        l-0.5820923-1.5922852h8.4170532C61.9541016,19.0644531,62,19.1103516,62,19.1611328v53.7421875
        C62,72.9541016,61.9541016,73,61.9033203,73H18.0966797C18.0458984,73,18,72.9541016,18,72.9033203V19.1611328
        c0-0.0507812,0.0458984-0.0966797,0.0966797-0.0966797h8.3526001l-0.5820923,1.5922852
        c-0.1123047,0.3066406-0.0673828,0.6484375,0.1201172,0.9165039C26.1738281,21.8408203,26.4804688,22,26.8066406,22H53.1289062z
         M50.2363281,16l1.4619141,4H28.2373047l1.4619141-4H35c0.5527344,0,1-0.4477539,1-1v-4c0-2.2055664,1.7939453-4,4-4
        s4,1.7944336,4,4v4c0,0.5522461,0.4472656,1,1,1H50.2363281z"  className="color000 svgShape"></path><path d="M23,38h8V28h-8V38z M25,30h4v6h-4V30z"  className="color000 svgShape"></path><rect width="23" height="2" x="34" y="32"  className="color000 svgShape"></rect><rect width="17" height="2" x="23" y="44"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="54"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="64"  className="color000 svgShape"></rect><rect width="2" height="4" x="38.968" y="9"  className="color000 svgShape"></rect></svg>
        )
    }

    const ClipCheckedIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#fff" enableBackground="new 0 0 80 80" viewBox="0 0 80 80" ><path d="M40,5c-3.3085938,0-6,2.6914062-6,6v3h-5c-0.4199219,0-0.7949219,0.262207-0.9394531,0.6567383l-0.880188,2.4077148	h-9.0836792C16.9404297,17.0644531,16,18.0048828,16,19.1611328v53.7421875C16,74.0595703,16.9404297,75,18.0966797,75h43.8066406
        C63.0595703,75,64,74.0595703,64,72.9033203V19.1611328c0-1.15625-0.9404297-2.0966797-2.0966797-2.0966797H52.755188
        L51.875,14.6567383C51.7304688,14.262207,51.3554688,14,50.9355469,14H46v-3C46,7.6914062,43.3085938,5,40,5z M53.1289062,22
        c0.3261719,0,0.6328125-0.1591797,0.8193359-0.4267578c0.1875-0.2680664,0.2324219-0.6098633,0.1201172-0.9165039
        l-0.5820923-1.5922852h8.4170532C61.9541016,19.0644531,62,19.1103516,62,19.1611328v53.7421875
        C62,72.9541016,61.9541016,73,61.9033203,73H18.0966797C18.0458984,73,18,72.9541016,18,72.9033203V19.1611328
        c0-0.0507812,0.0458984-0.0966797,0.0966797-0.0966797h8.3526001l-0.5820923,1.5922852
        c-0.1123047,0.3066406-0.0673828,0.6484375,0.1201172,0.9165039C26.1738281,21.8408203,26.4804688,22,26.8066406,22H53.1289062z
         M50.2363281,16l1.4619141,4H28.2373047l1.4619141-4H35c0.5527344,0,1-0.4477539,1-1v-4c0-2.2055664,1.7939453-4,4-4
        s4,1.7944336,4,4v4c0,0.5522461,0.4472656,1,1,1H50.2363281z"  className="color000 svgShape"></path><path d="M23,38h8V28h-8V38z M25,30h4v6h-4V30z"  className="color000 svgShape"></path><rect width="23" height="2" x="34" y="32"  className="color000 svgShape"></rect><rect width="17" height="2" x="23" y="44"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="54"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="64"  className="color000 svgShape"></rect><rect width="2" height="4" x="38.968" y="9"  className="color000 svgShape"></rect></svg>
        )
    }
    
    if (loading || assets.length == 0) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_cpc`}>
            <VirtualizedTable
                classes={classes}
                openDropAsset={dropOpenAsset}
                selected={selectItems}
                rowSelected={selectedRow}
                selectedKey={"id"}
                rows={assets}
                dropdownSelections={move_assets}
                rowHeight={rowHeight}
                headerHeight={rowHeight}
                columns={COLUMNS}
                onSelect={handleClickSelectCheckbox}
                onSelectAll={onHandleSelectAll}
                defaultSelectAll={selectedAll}
                totalRows={assets.length}
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