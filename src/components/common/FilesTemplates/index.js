import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { Paper } from "@material-ui/core"

import Googlelogin from '../Googlelogin' 

import Loader from '../Loader'

import VirtualizedTable from "../VirtualizedTable"

import PatenTrackApi from '../../../api/patenTrack2'

import { getTokenStorage } from '../../../utils/tokenStorage'

import { capitalize } from '../../../utils/numbers'

import { 
    setTemplateDocument,
    setDocumentTransaction,
    getGoogleProfile,
} from '../../../actions/patentTrackActions2'

import {
    setDriveTemplateFrameMode
} from '../../../actions/uiActions.js'

import useStyles from "./styles"

const FilesTemplates = ({type}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const googleLoginRef = useRef(null)
    const [headerRowHeight, setHeaderRowHeight] = useState(47)
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
    const [ loading, setLoading ] = useState(false)
    const [ googleAuthLogin, setGoogleAuthLogin ] = useState(true)
    const [ callByAuthLogin, setCallByAuth ] = useState(false)
    
    
    const channel_id = useSelector(state => state.patenTrack2.channel_id)
    const document_transaction = useSelector(state => state.patenTrack2.document_transaction)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)

    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected )
    const selectedAssetsTransactions = useSelector( state => state.patenTrack2.selectedAssetsTransactions  )
    const selectedAssetAssignments = useSelector(state => state.patenTrack2.assetTypeAssignments.selected)
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
    const assetTypeAssignmentAssetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
    const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)

    const ASSET_COLUMNS = [  
        {
            width: 29, 
            minWidth: 29,
            oldWidth: 29,
            label: '',
            dataKey: 'id',
            role: 'checkbox',
            disableSort: true,
            show_selection_count: true
        },
        {
            width: 120,
            minWidth: 120,
            oldWidth: 120,
            draggable: true,
            label: 'Recorded',
            headingIcon: 'recorded',
            dataKey: 'date',  
            role: 'image', 
            imageURL: '',
            imageIcon: '',
            extension: true,
            badge: true,   
            align: 'left' 
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
            width: 29, 
            minWidth: 29,
            oldWidth: 29,
            label: '',
            dataKey: 'id',
            role: 'checkbox',
            disableSort: true,
            show_selection_count: true
        },
        {
            width: 300,
            minWidth: 300,
            oldWidth: 300,
            draggable: true,
            headingIcon: 'initiated',
            label: 'Initiated',
            dataKey: 'title',
            secondaryKey: 'name', 
            role: 'image',
            imageURL: 'iconLink',
            imageIcon: '',
            extension: true,
            badge: true,   
            align: 'left'    
        },
        {
            width: 120,
            minWidth: 120,
            oldWidth: 120,
            draggable: true,
            label: 'Created',
            dataKey: 'createdTime',
            secondaryKey: 'created',
            align: 'left'    
        },
        {
            width: 300,
            minWidth: 300,
            oldWidth: 300,
            draggable: true,
            label: 'Author',
            dataKey: 'displayName',
            secondaryKey: 'user',
            align: 'left'    
        }
    ]

    const [headerColumns, setHeaderColumns] = useState(ASSET_COLUMNS)
    const [documentHeaderColumns, setDocumentHeaderColumns] = useState(DOCUMENT_COLUMNS)


    useEffect(() => {
        if(type == 1) {
            checkButtons()
        }
    }, [type])


    useEffect(() => {
        if(selectedRow.length != document_transaction.length ) {
            setSelectedRow(document_transaction)
        }
    }, [document_transaction, selectedRow])

    useEffect(() => {
        let notFindItem = false
        if( assetFiles.length > 0 && document_transaction.length > 0) {
            const findIndex = assetFiles.findIndex( row => row.id == document_transaction[0])

            if(findIndex === -1) {
                notFindItem = true
            }
        }

        if( documentFiles.length > 0 && document_transaction.length > 0) {
            const findIndex = documentFiles.findIndex( row => row.id == document_transaction[0])

            if(findIndex === -1) {
                notFindItem = true
            }
        }

        if(notFindItem === true ) {
            dispatch(setDocumentTransaction([]))     
            dispatch(setDriveTemplateFrameMode(false))
            dispatch(setTemplateDocument(null))
        }
    }, [ assetFiles, document_transaction, documentFiles])

    useEffect(() => {
        const getDriveAndAssetFiles = async() => {
            setAssetFiles([])
            setDocumentsFiles([])
            setSelectedRow([])
            setCurrentSelection(null)

            if(type == 1) {
                await PatenTrackApi.cancelInitiated()
                if(channel_id != '' && channel_id != null) {
                    const getSlackToken = getTokenStorage("slack_auth_token_info");
                    if (getSlackToken && getSlackToken != "") {
                        const tokenJSON = JSON.parse( getSlackToken )
                        if( Object.keys(tokenJSON).length > 0 && tokenJSON.hasOwnProperty('access_token') ) {
                            setLoading(true)
                            const { data } = await PatenTrackApi.getDriveAndAssetFiles(1, channel_id, tokenJSON.access_token, selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString(), selectedCompanies, selectedCategory )
                            setLoading(false)
                            setDocumentsFiles(data.document_files)
                        }
                    }
                } else {
                    if(selectedCompanies.length > 0 || assetTypesSelected.length > 0 || selectedAssetCompanies.length > 0 || selectedAssetAssignments.length > 0 || assetTypeAssignmentAssetsSelected.length > 0){
                        getDriveFiles()                       
                    }
                }
            } else {
                await PatenTrackApi.cancelRecords()
                /* if(selectedCompanies.length > 0 && selectedAssetsPatents.length > 0 ) {
                    setLoading(true)
                    const { data } = await PatenTrackApi.getDriveAndAssetFiles(0, 'undefined', 'undefined', selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString(), selectedCompanies, selectedCategory )
                    setLoading(false)
                    setAssetFiles(data.assets_files)
                } else  */if(selectedCompanies.length > 0 || assetTypesSelected.length > 0 || selectedAssetCompanies.length > 0 || selectedAssetAssignments.length > 0 || assetTypeAssignmentAssetsSelected.length > 0){
                    setLoading(true)
                    const { data } = await PatenTrackApi.getDriveAndAssetFiles(0, 'undefined', 'undefined', 'undefined', selectedCompanies, selectedCategory, '', '', assetTypesSelected, selectedAssetCompanies, selectedAssetsTransactions.length > 0 ? selectedAssetsTransactions : selectedAssetAssignments, assetTypeAssignmentAssetsSelected)
                    setLoading(false)
                    setAssetFiles(data.assets_files)
                }
            }
        }
        getDriveAndAssetFiles()
    }, [ type, selectedAssetsPatents, channel_id, selectedCompanies, selectedCompaniesAll, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, assetTypeAssignmentAssetsSelected, selectedCategory, selectedAssetsTransactions ])

    useEffect(() => {
        if(callByAuthLogin === true) {
            getDriveFiles()
        }        
    }, [callByAuthLogin, google_auth_token])

    const dowloadPDFUrl = async(item) => {
        PatenTrackApi.cancelDownloadRequest()
        const {data} = await PatenTrackApi.downloadPDFUrl(item.id)

        if(data != null && typeof data.link !== 'undefined') {
            dispatch(setTemplateDocument(data.link))
        }
    }

    const openGoogleWindow = () => {
        if(googleLoginRef.current != null) { 
            if(googleLoginRef.current.querySelector('button') !== null) {
                setCallByAuth(true)
                googleLoginRef.current.querySelector('button').click()
            } else {
                setTimeout(openGoogleWindow, 1000)
            }          
        } else {
            setTimeout(openGoogleWindow, 1000)
        }
    }

    const getDriveFiles = async() => {
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
            await PatenTrackApi.cancelInitiated()
            const { data } = await PatenTrackApi.getDriveAndAssetFiles(1, 'undefined', 'undefined', selectedAssetsPatents.length > 0 ? selectedAssetsPatents[0] != '' ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString() : 'undefined', selectedCompanies, selectedCategory, gToken, gAccount )
            setLoading(false)
            setDocumentsFiles(data.document_files)
        }
    }

    const checkButtons = () => {
        try {
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            if(googleToken && googleToken != '') {
                const tokenParse = JSON.parse( googleToken )
                const { access_token } = tokenParse
                if( access_token ) {
                  dispatch(getGoogleProfile(tokenParse))  
                } else {
                    setTimeout(openGoogleWindow, 2000)
                }
            } else {
                setTimeout(openGoogleWindow, 2000)
            }
        } catch ( err ) {
            console.error( err )
        }
    }

    const onHandleSelectAll = () => {

    }

    const onHandleClickRow = useCallback((e, item) => {
        e.preventDefault()
        const { checked } = e.target;
        if( checked !== undefined) {           
             setSelectItems(prevItems =>
                prevItems.includes(item.id)
                ? prevItems.filter(row => item.id !== row)
                : [...prevItems, item.id],
            ); 
        }
        if(selectedRow.includes(item.id)) {
            dispatch(setDocumentTransaction([]))     
            dispatch(setDriveTemplateFrameMode(false))
            dispatch(setTemplateDocument(null))
            setSelectedRow([])
            setCurrentSelection(null)
        } else {            
            if(item.external_type == 'gdrive' || item.external_type == 'usptodrive') {
                dispatch(setDriveTemplateFrameMode(true))
                let webLink = item.url_private
                if(webLink.toString().indexOf('legacy-assignments')) {
                    dowloadPDFUrl(item)
                }
                dispatch(setTemplateDocument(webLink))
            } else {
                if(typeof item.webViewLink !== 'undefined') {
                    dispatch(setDriveTemplateFrameMode(true))
                    let webLink = item.mimeType == "application/pdf" ? item.webViewLink.toString().replace('view?usp=drivesdk', 'preview')  : item.webViewLink
                    if(webLink.toString().indexOf('legacy-assignments')) {
                        //webLink = `https://drive.google.com/viewerng/viewer?url=${webLink}&embedded=true`
                        dowloadPDFUrl(item)
                    }
                    dispatch(setTemplateDocument(webLink))
                } else {
                    window.open(item.url_private)
                }                
            }
            setSelectedRow([item.id])
            setCurrentSelection(item.id) 
            dispatch(setDocumentTransaction([item.id]))     
        }                   
    }, [ dispatch, selectedRow ]) 

    const onHandleDocumentSelectAll = () => { 
    }

    const onHandleClickDocumentRow = useCallback((e, item) => { 
        e.preventDefault()
        const { checked } = e.target;
        if( checked !== undefined) {
            setSelectDocumentItems(prevItems =>
                prevItems.includes(item.id)
                ? prevItems.filter(row => item.id !== row)
                : [...prevItems, item.id],
            );
        }        
        if(selectedDocumentRow.includes(item.id)) {
            dispatch(setDocumentTransaction([]))     
            dispatch(setDriveTemplateFrameMode(false))
            dispatch(setTemplateDocument(null))
            setSelectedDocumentRow([])
            setCurrentDocumentSelection(null)
        } else {
            console.log('item', item)
            if(item.external_type == 'gdrive' || item.external_type == 'usptodrive') {
                dispatch(setDriveTemplateFrameMode(true))
                let webLink = item.url_private
                if(webLink.toString().indexOf('legacy-assignments')) {
                   // webLink = `https://drive.google.com/viewerng/viewer?url=${webLink}&embedded=true`
                   dowloadPDFUrl(item)
                }
                dispatch(setTemplateDocument(webLink))
            } else {
                if(typeof item.webViewLink !== 'undefined') {
                    dispatch(setDriveTemplateFrameMode(true))
                    let webLink = item.mimeType == "application/pdf" ? item.webViewLink.toString().replace('view?usp=drivesdk', 'preview')  : item.webViewLink
                    if(webLink.toString().indexOf('legacy-assignments')) {
                        //webLink = `https://drive.google.com/viewerng/viewer?url=${webLink}&embedded=true`
                        dowloadPDFUrl(item)
                    }
                    dispatch(setTemplateDocument(webLink))
                } else {
                    window.open(item.url_private)
                } 
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

    const resizeColumnsStop = useCallback((dataKey, data) => {
        let previousColumns = [...headerColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )
    
        if( findIndex !== -1 ) {
            previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width 
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

    const resizeDocumentColumnsStop = useCallback((dataKey, data) => {
        let previousColumns = [...documentHeaderColumns]
        const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )
    
        if( findIndex !== -1 ) {
            previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width 
        }
        setDocumentHeaderColumns(previousColumns)
    }, [ documentHeaderColumns ] )

    return (
        <Paper className={classes.root} square id={`layout_templates`}>
            {
              googleAuthLogin && (
                <span ref={googleLoginRef}>
                  <Googlelogin/>
                </span>)
            }
            {
                type === 0
                ?
                    loading === true
                ?
                    <Loader />
                :
                    <VirtualizedTable
                        classes={classes}
                        selected={selectItems}
                        rowSelected={selectedRow}
                        selectedIndex={currentSelection}
                        selectedKey={"id"}
                        rows={assetFiles}
                        rowHeight={rowHeight}
                        headerHeight={headerRowHeight}
                        columns={headerColumns}
                        onSelect={onHandleClickRow}
                        onSelectAll={onHandleSelectAll}
                        defaultSelectAll={selectedAll}
                        resizeColumnsWidth={resizeColumnsWidth}
                        resizeColumnsStop={resizeColumnsStop}
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
                :
                ''  
            }            
            {
                type === 1
                ?
                    loading === true
                ?
                    <Loader />
                :
                    <VirtualizedTable
                        classes={classes}
                        selected={selectDocumentItems}
                        rowSelected={selectedDocumentRow}
                        selectedIndex={currentDocumentSelection}                        
                        selectedKey={"id"}
                        rows={documentFiles}
                        rowHeight={rowHeight}
                        headerHeight={headerRowHeight}
                        columns={documentHeaderColumns}
                        onSelect={onHandleClickDocumentRow}
                        onSelectAll={onHandleDocumentSelectAll}
                        defaultSelectAll={selectedDocumentAll}
                        resizeColumnsWidth={resizeDocumentColumnsWidth}
                        resizeColumnsStop={resizeDocumentColumnsStop}
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
                :
                ''
            }    
        </Paper>
    )
}

export default FilesTemplates