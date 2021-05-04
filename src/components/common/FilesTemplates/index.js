import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { Paper } from "@material-ui/core"

import {
    faFile
} from "@fortawesome/free-solid-svg-icons"

import VirtualizedTable from "../VirtualizedTable"

import PatenTrackApi from '../../../api/patenTrack2'

import { getTokenStorage } from '../../../utils/tokenStorage'

import { 
    setTemplateDocument    
} from '../../../actions/patentTrackActions2'

import {
    setDriveTemplateFrameMode
} from '../../../actions/uiActions.js'

import useStyles from "./styles"

const FilesTemplates = () => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [rowHeight, setRowHeight] = useState(40)
    const [width, setWidth] = useState(800)
    const [selectedAll, setSelectAll] = useState(false)
    const [selectItems, setSelectItems] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [currentSelection, setCurrentSelection] = useState(null)
    const [ assetFiles, setAssetFiles ] = useState([])

    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
    const channel_id = useSelector(state => state.patenTrack2.channel_id)



    useEffect(() => {

        const getDriveAndAssetFiles = async() => {
            if(selectedAssetsPatents.length > 0 && channel_id != '' && channel_id != null ) {
                const getSlackToken = getTokenStorage("slack_auth_token_info");
                if (getSlackToken && getSlackToken != "") {
                    const tokenJSON = JSON.parse( getSlackToken )
    
                    if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
                        const { data } = await PatenTrackApi.getDriveAndAssetFiles( channel_id, tokenJSON.access_token, selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                        setAssetFiles(data)
                    }
                } else {
                    const { data } = await PatenTrackApi.getDriveAndAssetFiles( '', '', selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                    setAssetFiles(data)
                }
            } else {
                const { data } = await PatenTrackApi.getDriveAndAssetFiles( '', '', selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                setAssetFiles(data)
            }
        }

        getDriveAndAssetFiles()
    }, [ selectedAssetsPatents, channel_id ])

    const COLUMNS = [  
        {
            width: 200,
            minWidth: 200,
            label: 'Document',
            dataKey: 'title', 
            role: 'image',
            imageURL: '',
            imageIcon: '',
            extension: true    
        } 
    ]

    const onHandleSelectAll = () => {

    }

    const onHandleClickRow = useCallback((e, item) => {
        if(item.external_type == 'gdrive' || item.external_type == 'usptodrive') {
            dispatch(setDriveTemplateFrameMode(true))
            dispatch(setTemplateDocument(item.url_private))
        } else {
            window.open(item.url_private)
        }
        setSelectedRow([item.id])
        setCurrentSelection(item.id)
    }, [ dispatch ])    

    return (
        <Paper className={classes.root} square id={`layout_templates`}>
            {
                assetFiles.length > 0  && 
                <VirtualizedTable
                    classes={classes}
                    selected={selectItems}
                    rowSelected={selectedRow}
                    selectedIndex={currentSelection}
                    selectedKey={"id"}
                    rows={assetFiles}
                    rowHeight={rowHeight}
                    headerHeight={rowHeight}
                    columns={COLUMNS}
                    onSelect={onHandleClickRow}
                    onSelectAll={onHandleSelectAll}
                    defaultSelectAll={selectedAll}
                    responsive={true}
                    collapsable={false}
                    showIsIndeterminate={false} 
                    totalRows={assetFiles.length}
                    width={width}
                    containerStyle={{
                        width: "100%",
                        maxWidth: "100%",
                    }}
                    style={{
                        width: "100%",
                    }}
                />
            }            
        </Paper>
    )
}

export default FilesTemplates