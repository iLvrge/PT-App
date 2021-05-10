import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { Paper } from "@material-ui/core"

import {
    faFile
} from "@fortawesome/free-solid-svg-icons"

import VirtualizedTable from "../VirtualizedTable"

import PatenTrackApi from '../../../api/patenTrack2'

import { getTokenStorage } from '../../../utils/tokenStorage'

import { capitalize } from '../../../utils/numbers'

import { 
    setTemplateDocument,
    setDocumentTransaction        
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
    const document_transaction = useSelector(state => state.patenTrack2.document_transaction)

    const COLUMNS = [  
        {
            width: 120,
            minWidth: 120,
            label: 'Document',
            dataKey: 'title', 
            role: 'image',
            imageURL: '',
            imageIcon: '',
            extension: true    
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Type', 
            dataKey: 'convey_ty',
            staticIcon: '',
            format: capitalize             
        },
        {
            width: 150,
            minWidth: 150,
            oldWidth: 150,
            draggable: true,
            label: '1st Assignor', 
            dataKey: 'assignor'             
        },
        {
            width: 150,
            minWidth: 150,
            oldWidth: 150,
            draggable: true,
            label: '2nd Assignee', 
            dataKey: 'assignee'             
        },        
        {
            width: 60,
            minWidth: 60,
            label: 'Parties',
            dataKey: 'count_parties'
        }
    ]

    const [headerColumns, setHeaderColumns] = useState(COLUMNS)


    useEffect(() => {
        if(selectedRow.length != document_transaction.length ) {
            setSelectedRow(document_transaction)
        }
    }, [document_transaction, selectedRow])

    useEffect(() => {

        const getDriveAndAssetFiles = async() => {
            if( selectedAssetsPatents.length > 0 ) {
                if(channel_id != '' && channel_id != null) {
                    const getSlackToken = getTokenStorage("slack_auth_token_info");
                    if (getSlackToken && getSlackToken != "") {
                        const tokenJSON = JSON.parse( getSlackToken )
        
                        if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
                            const { data } = await PatenTrackApi.getDriveAndAssetFiles( channel_id, tokenJSON.access_token, selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                            setAssetFiles(data)
                        }
                    } else {
                        const { data } = await PatenTrackApi.getDriveAndAssetFiles( 'undefined', 'undefined', selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                        setAssetFiles(data)
                    }
                } else if( selectedAssetsPatents.length > 0 ) {
                    const { data } = await PatenTrackApi.getDriveAndAssetFiles( 'undefined', 'undefined', selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                    setAssetFiles(data)
                }                
            }   
        }
        getDriveAndAssetFiles()
    }, [ selectedAssetsPatents, channel_id ])

    

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
        dispatch(setDocumentTransaction([item.id]))        
    }, [ dispatch ]) 
    
    const resizeColumnsWidth = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

        if( findIndex !== -1 ) {
          previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
          previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

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
                    columns={headerColumns}
                    onSelect={onHandleClickRow}
                    onSelectAll={onHandleSelectAll}
                    defaultSelectAll={selectedAll}
                    resizeColumnsWidth={resizeColumnsWidth}
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