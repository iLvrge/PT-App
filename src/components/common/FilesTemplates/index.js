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
    const [ documentFiles, setDocumentsFiles ] = useState([])
    const [selectedDocumentAll, setSelectDocumentAll] = useState(false)
    const [selectDocumentItems, setSelectDocumentItems] = useState([])
    const [selectedDocumentRow, setSelectedDocumentRow] = useState([])
    const [currentDocumentSelection, setCurrentDocumentSelection] = useState(null)

    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
    const channel_id = useSelector(state => state.patenTrack2.channel_id)
    const document_transaction = useSelector(state => state.patenTrack2.document_transaction)

    const ASSET_COLUMNS = [  
        {
            width: 120,
            minWidth: 120,
            oldWidth: 120,
            draggable: true,
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
            label: '1st Assignee', 
            dataKey: 'assignee'             
        },        
        {
            width: 60,
            minWidth: 60,
            label: 'Parties',
            dataKey: 'count_parties'
        }
    ]

    const DOCUMENT_COLUMNS = [  
        {
            width: 300,
            minWidth: 300,
            oldWidth: 300,
            draggable: true,
            label: 'Document',
            dataKey: 'title', 
            role: 'image',
            imageURL: '',
            imageIcon: '',
            extension: true    
        }
    ]

    const [headerColumns, setHeaderColumns] = useState(ASSET_COLUMNS)
    const [documentHeaderColumns, setDocumentHeaderColumns] = useState(DOCUMENT_COLUMNS)

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
                            setAssetFiles(data.assets_files)

                            setDocumentsFiles(data.document_files)
                        }
                    } else {
                        const { data } = await PatenTrackApi.getDriveAndAssetFiles( 'undefined', 'undefined', selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                        setAssetFiles(data.assets_files)
                        setDocumentsFiles(data.document_files)
                    }
                } else if( selectedAssetsPatents.length > 0 ) {
                    const { data } = await PatenTrackApi.getDriveAndAssetFiles( 'undefined', 'undefined', selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() )
                    setAssetFiles(data.assets_files)
                    setDocumentsFiles(data.document_files)
                }                
            } else {
                setAssetFiles([])
                setDocumentsFiles([])
                setSelectedRow([])
                setCurrentSelection(null)
            }
        }
        getDriveAndAssetFiles()
    }, [ selectedAssetsPatents, channel_id ])

    

    const onHandleSelectAll = () => {

    }

    const onHandleClickRow = useCallback((e, item) => {
        if(selectedRow.includes(item.id)) {
            dispatch(setDocumentTransaction([]))     
            dispatch(setDriveTemplateFrameMode(false))
            dispatch(setTemplateDocument(null))
            setSelectedRow([])
            setCurrentSelection(null)
        } else {
            if(item.external_type == 'gdrive' || item.external_type == 'usptodrive') {
                dispatch(setDriveTemplateFrameMode(true))
                dispatch(setTemplateDocument(item.url_private))
            } else {
                window.open(item.url_private)
            }
            setSelectedRow([item.id])
            setCurrentSelection(item.id) 
            dispatch(setDocumentTransaction([item.id]))     
        }           
    }, [ dispatch, selectedRow ]) 

    const onHandleDocumentSelectAll = () => {
    }

    const onHandleClickDocumentRow = useCallback((e, item) => {
        if(selectedDocumentRow.includes(item.id)) {
            dispatch(setDocumentTransaction([]))     
            dispatch(setDriveTemplateFrameMode(false))
            dispatch(setTemplateDocument(null))
            setSelectedDocumentRow([])
            setCurrentDocumentSelection(null)
        } else {
            if(item.external_type == 'gdrive' || item.external_type == 'usptodrive') {
                dispatch(setDriveTemplateFrameMode(true))
                dispatch(setTemplateDocument(item.url_private))
            } else {
                window.open(item.url_private)
            }
            setSelectedDocumentRow([item.id])
            setCurrentDocumentSelection(item.id) 
            dispatch(setDocumentTransaction([item.id]))     
        }           
    }, [ dispatch, selectedDocumentRow ]) 
    
    const resizeColumnsWidth = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

        if( findIndex !== -1 ) {
          previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
          previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
        }
        setHeaderColumns(previousColumns)
    }, [ headerColumns ] )

    const resizeDocumentColumnsWidth = useCallback((dataKey, data) => {
        let previousColumns = [...documentHeaderColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

        if( findIndex !== -1 ) {
          previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
          previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
        }
        setDocumentHeaderColumns(previousColumns)
    }, [ documentHeaderColumns ] )

    return (
        <Paper className={classes.root} square id={`layout_templates`}>
            <div style={{height: '50vh'}}>
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
            </div> 
            <div style={{height: '50vh'}}>
                {
                    documentFiles.length > 0  && 
                    <VirtualizedTable
                        classes={classes}
                        selected={selectDocumentItems}
                        rowSelected={selectedDocumentRow}
                        selectedIndex={currentDocumentSelection}                        
                        selectedKey={"id"}
                        rows={documentFiles}
                        rowHeight={rowHeight}
                        headerHeight={rowHeight}
                        columns={documentHeaderColumns}
                        onSelect={onHandleClickDocumentRow}
                        onSelectAll={onHandleDocumentSelectAll}
                        defaultSelectAll={selectedDocumentAll}
                        resizeColumnsWidth={resizeDocumentColumnsWidth}
                        disableHeader={true}
                        responsive={true}
                        collapsable={false}
                        showIsIndeterminate={false} 
                        totalRows={documentFiles.length}
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
            </div>        
        </Paper>
    )
}

export default FilesTemplates