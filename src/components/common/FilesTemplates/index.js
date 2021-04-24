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

    const driveFiles = useSelector(state => state.patenTrack2.template_layout_drive_files)
    const google_profile = useSelector(state => state.patenTrack2.google_profile)

    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
    const channel_id = useSelector(state => state.patenTrack2.channel_id)



    useEffect(() => {
        const getAssetsSlackFiles = async() => {
            if( channel_id != '' && channel_id != null ) {
                const getSlackToken = getTokenStorage("slack_auth_token_info");
                if (getSlackToken && getSlackToken != "") {
                    const tokenJSON = JSON.parse( getSlackToken )
    
                    if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
                        const { data } = await PatenTrackApi.getChannelFiles(channel_id, tokenJSON.access_token )
                        setAssetFiles(data)
                    }                
                }
            }
        }

        const getAssetsFiles = async() => {
            console.log("getAssetsFiles", selectedAssetsPatents)
        }
        getAssetsSlackFiles()
        getAssetsFiles()
    }, [ selectedAssetsPatents, channel_id ])

    const COLUMNS = [  
        {
            width: 100,
            minWidth: 100,
            label: 'File Name',
            dataKey: 'title', 
            role: 'image',
            imageURL: '',
            imageIcon: faFile    
        } 
    ]

    const onHandleSelectAll = () => {

    }

    const onHandleClickRow = useCallback((e, item) => {
        console.log("onHandleClickRow", e, item)
        if(item.external_type == 'gdrive') {
            dispatch(setDriveTemplateFrameMode(true))
            dispatch(setTemplateDocument(item.url_private))
        } else {
            window.open(item.url_private)
        }
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