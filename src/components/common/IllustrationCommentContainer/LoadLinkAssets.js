import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { Paper, TextField, InputLabel, Typography } from "@material-ui/core";
import Loader from "../Loader";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import { numberWithCommas, applicationFormat } from "../../../utils/numbers";
import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";
import PatenTrackApi from '../../../api/patenTrack2'
import {
    setLinkAssetListSelected
  } from '../../../actions/patentTrackActions2'

const LoadLinkAssets = () => {
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
    const link_assets_sheet_list = useSelector(state => state.patenTrack2.link_assets_sheet_list)
    const link_assets_sheet_loading = useSelector(state => state.patenTrack2.link_assets_sheet_loading)
    const link_assets_sheet_type = useSelector(state => state.patenTrack2.link_assets_sheet_type)

    const COLUMNS = [
        { 
            width: 29, 
            minWidth: 29,   
            label: '',
            dataKey: 'name',
            role: 'checkbox',
            disableSort: true,
            show: false
        },
        {
            width: 300,
            minWidth: 300,   
            label: "Name",
            dataKey: "name",
            align: "left",
        },
        
    ]

    useEffect(() => {      
        if(link_assets_sheet_list.length > 0) {
            let list = [];  
            const promiseList = link_assets_sheet_list.map(item => {
                list.push({
                    name: item
                })
            })
            Promise.all(promiseList)
            setRows(list)
            getSelectedLinkAssets()
        } else {
            setRows([])
            setSelectItems([])
            dispatch(setLinkAssetListSelected([]))
        }
    }, [ link_assets_sheet_list ]) 

    const getSelectedLinkAssets = async() => {
        if(link_assets_sheet_type.type !== null && link_assets_sheet_type.type !== '' && link_assets_sheet_type.asset !== null && link_assets_sheet_type.asset != '') {
            const getGoogleToken = getTokenStorage("google_auth_token_info"), getGoogleProfile = getTokenStorage('google_profile_info')

            let gToken = '', gAccount = ''
            if (getGoogleToken && getGoogleToken != "") {
                const tokenJSON = JSON.parse( getGoogleToken )
                if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
                gToken = tokenJSON.access_token
                }
            }

            if( getGoogleProfile != '') {
                const profileInfo = JSON.parse(getGoogleProfile)
                if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                gAccount =  profileInfo.email
                }
            }
            if(gToken != '' && gAccount != '') {
                const form = new FormData()
                form.append('access_token', gToken)
                form.append('user_account', gAccount)
                const { data } = await PatenTrackApi.linkSheetSelectedData(link_assets_sheet_type.type, link_assets_sheet_type.asset, form)
                if(data.length > 0) {
                    setSelectItems(data)
                    dispatch(setLinkAssetListSelected(data))
                }
            }
        }
    }

    const handleClickSelectCheckbox = useCallback((event, row) => {
        event.preventDefault()
        let items = [...selectItems], list = [...rows]
        if(!items.includes(row.name)) {
            items.push(row.name)            
        } else {
            items = items.filter( item => item != row.name)
        } 
        setSelectAll(items.length == list.length ? true : false);
        setSelectItems(items)
        dispatch(setLinkAssetListSelected(items))      
    }, [dispatch, selectItems])

    const onHandleSelectAll = useCallback(async(event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        if (checked === false) {
            setSelectItems([]);
            dispatch(setLinkAssetListSelected([]))
        } else {
            let items = [], list = [...rows]
            const promise = list.map(item =>
                items.push(item.name),
            ); 
            await Promise.all(promise);
            setSelectItems(items)
            dispatch(setLinkAssetListSelected(items))   
        }
        setSelectAll(checked);
    }, [dispatch, rows])
    
    if(link_assets_sheet_loading) return <Loader/>

    return ( 
        <Paper
            className={classes.root}
            square
            id={`link_assets_to_product_technology_competition`}
            >            
            <div className={classes.headerContainer}>
                <Typography variant='body2'>{decodeURIComponent(link_assets_sheet_type.asset)}</Typography>
            </div>
            <div className={classes.container}>
                <VirtualizedTable
                    classes={classes}
                    selected={selectItems}
                    rowSelected={selectedRow}
                    selectedIndex={currentSelection}
                    selectedKey={"name"}
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



export default LoadLinkAssets;