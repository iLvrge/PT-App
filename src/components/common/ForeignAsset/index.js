import React, { useCallback, useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
    Paper, 
    Button, 
    Modal,
    Backdrop,
    CircularProgress,
    Typography,
    TextField
} from "@mui/material"
import { Add, Delete, Close, Save } from "@mui/icons-material"
import CloseIcon from '@mui/icons-material/Close'
import ImportAsset from './ImportAsset'
import Googlelogin from '../Googlelogin'
import VirtualizedTable from '../VirtualizedTable'
import DialogPopup from '../DialogPopup'
import Loader from '../Loader'
import useStyles from "./styles"


import {
    setAssetTypes,
    setAssetTypeInventor,
    setAssetTypeCompanies,
    setAssetTypeAssignments,
    setAssetTypeAssignmentAllAssets,
    setAssetsIllustration,
    setAssetsIllustrationData,
    setSelectedAssetsTransactions,
    setSelectedAssetsPatents,
    setAllAssetTypes,
    setAssetTypesSelect,
    setAllAssignmentCustomers,
    setSelectAssignmentCustomers,
    setAssetTypesPatentsSelected,
    setAssetTypesPatentsSelectAll,
    setAllAssignments, 
    setSelectAssignments,
    setSlackMessages,
    getGoogleProfile, 
    updateForeightAssetsSheetSelections
} from '../../../actions/patentTrackActions2'


import {
    setPDFView,
    setPDFFile
  } from "../../../actions/patenTrackActions";

import {
    toggleUsptoMode, 
    toggleFamilyMode,
    toggleFamilyItemMode,
    toggleLifeSpanMode
  } from "../../../actions/uiActions";

import PatenTrackApi from '../../../api/patenTrack2'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import { getTokenStorage } from '../../../utils/tokenStorage'


const ForeignAsset = ({sheetName, handleSheetName}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const textFiledRef = useRef(null)
    const selectedRef = useRef()
    const sheetsRef = useRef()
    const [ open, setOpen] = useState( false)
    const [ items, setItems] = useState([])
    const [ invalidItems, setInvalidItems] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const googleLoginRef = useRef(null)
    const [ googleToken, setGoogleToken ] = useState('')
    const [ width, setWidth ] = useState( 1900 )
    const [ offset, setOffset ] = useState(0)
    const [ totalRecords, setTotalRecords ] = useState(0)
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectNames, setSelectNames] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ isLoadingSheets, setIsLoadingSheets] = useState( false)
    const [ currentSelection, setCurrentSelection ] = useState(null) 
    const [ sendRequest, setSendRequest] = useState(false)
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ sheets, setSheets ] = useState([])

    const onHandleImport = (event) => {
        setOpen(!open)        
        
    }

    const COLUMNS = [
        {
            width: 29,
            minWidth: 29,
            label: '',
            dataKey: 'sheet_id',
            role: 'checkbox',
            disableSort: true,
            show_selection_count: true,
            /* showOnCondition: '1' */ 
        },
        {
            width: 200,  
            minWidth: 200,
            oldWidth: 200,
            draggable: true,
            label: 'External Lists',        
            dataKey: 'sheet_name',
            align: "left", 
            badge: true,
            show_button: true,
            button: <Button onClick={onHandleImport} className={classes.btnHeader}> <Add/> <span className={classes.headerButton}>New List</span></Button>
        }
    ]
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)  
    const google_profile = useSelector(state => state.patenTrack2.google_profile)

    const TIMER_OPEN = 3000

    useEffect(() => {
        if(googleLoginRef.current !== null) {
            checkGoogleToken()
        }
    }, [googleLoginRef])

    useEffect(() => {
        checkGoogleToken()
    }, [])

    useEffect(() => {
    }, [invalidItems])

    useEffect(() => {
        selectedRef.current = selectedRow
    }, [selectedRow])

    useEffect(() => {
        sheetsRef.current = sheets
    }, [sheets])

    useEffect(() => {   
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(google_profile !== null && google_profile.hasOwnProperty('email') && googleToken && googleToken !== '' && googleToken !== null ) { 
            const token = JSON.parse(googleToken)  
            const { access_token } = token  
            if(access_token && access_token !== null) {
                //
                getForeignAssetsSheets(google_profile.email, access_token)
            } else {
                setTimeout(openGoogleWindow, TIMER_OPEN)
            }
        } else {
            if(googleToken && googleToken !== '' && googleToken !== null && google_profile == null) {
                const token = JSON.parse(googleToken)  
                const { access_token } = token  
                if(access_token && access_token !== null) {
                    setGoogleToken(token)     
                    dispatch(getGoogleProfile(token))
                } else {
                    setTimeout(openGoogleWindow, TIMER_OPEN)
                }
            } else {
                setTimeout(openGoogleWindow, TIMER_OPEN)
            }
        }
    }, [dispatch, google_profile, googleToken])

    const getItemsFromSheet = async (sheetName) => {
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        const googleProfile = getTokenStorage('google_profile_info')
        const token = JSON.parse(googleToken)  
        const profile = JSON.parse(googleProfile)
        if( token !== null && profile !== null) {
            const { access_token } = token  
            const form = new FormData()
            form.append('account', profile.email)
            form.append('token', access_token)
            form.append('sheet_names', JSON.stringify([sheetName]))
            const {data} = await PatenTrackApi.getForeignAssetsBySheet(form)
            if(data !== null && data.list.length > 0) {
                const list = [];
                data.list.forEach( item => list.push(item.asset))
                setItems(list)
            }
        } else {
            openGoogleWindow()
        }
    }

    const handleDeleteItem = async( deleteItem ) => {
        if( deleteItem != '') {
            if(selectedRef.current.length > 0) {
                const selectedSheetID = selectedRef.current[selectedRef.current.length - 1]
                if(selectedSheetID !== '') {
                    const sheetItems = sheetsRef.current
                    const filterSheet = sheetItems.filter( sheet => sheet.sheet_id === selectedSheetID )
                    if(filterSheet.length > 0) {
                        const googleToken = getTokenStorage( 'google_auth_token_info' )
                        const googleProfile = getTokenStorage('google_profile_info')
                        const token = JSON.parse(googleToken)  
                        const profile = JSON.parse(googleProfile)
                        if( token !== null && profile !== null) {
                            const { access_token } = token  
                            const form = {
                                user_account: profile.email,
                                item_type: 'delete',
                                access_token: access_token,
                                sheet_name: filterSheet[0].sheet_name,
                                sheet_id: filterSheet[0].sheet_id,
                                delete_item: deleteItem
                            }
                            const {data} = await PatenTrackApi.deleteItemFromExternalSheet(form) 
                        }
                    }
                }
            }
        }
    }

    const handleUpdateItem = async( updateItem, newItem ) => {
        if( updateItem !== '' && newItem !== '') {
            if(selectedRef.current.length > 0) {
                const selectedSheetID = selectedRef.current[selectedRef.current.length - 1]
                if(selectedSheetID !== '') {
                    const sheetItems = sheetsRef.current
                    const filterSheet = sheetItems.filter( sheet => sheet.sheet_id === selectedSheetID )
                    if(filterSheet.length > 0) {
                        const googleToken = getTokenStorage( 'google_auth_token_info' )
                        const googleProfile = getTokenStorage('google_profile_info')
                        const token = JSON.parse(googleToken)  
                        const profile = JSON.parse(googleProfile)
                        if( token !== null && profile !== null) {
                            const { access_token } = token  
                            const form = new FormData();
                            form.append('user_account', profile.email)
                            form.append('access_token', access_token)
                            form.append('sheet_name', filterSheet[0].sheet_name)
                            form.append('sheet_id', filterSheet[0].sheet_id)
                            form.append('update_item', updateItem)
                            form.append('new_item', newItem)
                            const {data} = await PatenTrackApi.updateItemFromExternalSheet(form)
                            console.log('Return Update Item', data)
                        }
                    }
                }
            }
        }
    }

    const checkGoogleToken = () => {
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken && googleToken != '' && googleToken!= null) {
            const token = JSON.parse(googleToken)      
            const { access_token } = token  
            if(access_token) {
                setGoogleToken(token) 
                if(google_profile == null) {
                    dispatch(getGoogleProfile(token))
                } else {
                    //
                    getForeignAssetsSheets(google_profile.email, access_token)
                }
            } else { 
                // Not login
                setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
            }
        } else {
            // Not login
            console.log('OpenLoginWindow')
            setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
        }
    }

    const openGoogleWindow = useCallback(() => {
        if(googleLoginRef.current != null) {
            if(googleLoginRef.current.querySelector('button') !== null) {
                googleLoginRef.current.querySelector('button').click()
            } else { 
                // Not login
                setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
            }
        }  else { 
            // Not login
            setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
        }
    }, [ googleLoginRef ])

    const onHandleRetrieveList = () => {
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken && googleToken != '' && googleToken!= null) {
            const token = JSON.parse(googleToken)      
            const { access_token } = token  
            if(access_token && google_profile !== null) {
                getForeignAssetsSheets(google_profile.email, access_token, true)
            } else {
                dispatch(getGoogleProfile(token))
            }
        } else {
            setTimeout(openGoogleWindow, TIMER_OPEN)
        }
    }

    const getForeignAssetsSheets = async(email, token, t) => {
        if(sendRequest === false || (typeof t !== 'undefined' && t === true)) {
            const form = new FormData()
            form.append('account', email)
            form.append('token', token)
            PatenTrackApi.cancelForeignAssetsSheetRequest()
            const { data } = await PatenTrackApi.getForeignAssetsSheets(form)
    
            if(data != null ) {
                if(data.list.length > 0) {
                    setSendRequest( true )
                    setSheets(data.list)
                    setTotalRecords(data.total_records)
                } else if(data.message === 'Unable to retreive list, Please login again') {
                    setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
                }
            } else {                
                setSendRequest( true )
            }
        }        
    }
  
    /**
    * Click on row
    */

    const handleClickRow = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        if(checked != undefined) {
            let updateSelected = [...selectItems], updateSelectedNames = [...selectNames]
            if(!updateSelected.includes(row.sheet_id)) {
                updateSelected.push(row.sheet_id)
                updateSelectedNames.push(row.sheet_name)
            } else {
                const findIndex = updateSelected.findIndex( item => item === row.sheet_id)
                if(findIndex !== -1) {
                    updateSelected.splice(findIndex, 1)
                    updateSelectedNames.splice(findIndex, 1)
                }
            }
            setSelectItems(updateSelected)
            setSelectNames(updateSelectedNames)
            dispatch(updateForeightAssetsSheetSelections(updateSelected, updateSelectedNames))
            resetAll()
            clearOtherItems()
        } else {
            const element = event.target.closest('div.ReactVirtualized__Table__rowColumn')
            if( element != null ) {
                const index = element.getAttribute('aria-colindex')
                if(index == 2) {                    
                    if(!selectedRow.includes(row.sheet_id)) {
                        setSelectedRow([row.sheet_id])
                        setOpen(!open)     
                        handleSheetName(row.sheet_name)
                        getItemsFromSheet(row.sheet_name)
                    } else { 
                        setSelectedRow([])
                    }
                }
            }
        }        
    }, [ dispatch, selectItems, selectNames, selectedRow])

    /**
     * Select / Unselect All checkbox
     */

    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;

    }, [ ]) 

    /**
     * Reset all items
     */

    const resetAll = () => {
        dispatch(setAssetTypes([]))
        dispatch(setAssetTypeCompanies({ list: [], total_records: 0 }))
        dispatch(setAssetTypeInventor({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }))
        dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
        dispatch(setAssetTypesPatentsSelected([]))
        dispatch(setAssetTypesPatentsSelectAll(false))
        dispatch(setAllAssignments(false))
	    dispatch(setSelectAssignments([]))	
        dispatch(setSelectAssignmentCustomers([]))
        dispatch(setAllAssignmentCustomers(false))
    }

    const clearOtherItems = () => {
        dispatch(setAssetsIllustration(null))
        dispatch(setAssetsIllustrationData(null))
        dispatch(setSelectedAssetsTransactions([]))
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setSlackMessages([]))
        dispatch(
            setPDFFile(
            { 
                document: '',  
                form: '', 
                agreement: '' 
            }
            )
        )
        dispatch(
            setPDFView(false)
        )
        dispatch(setAssetsIllustrationData(null))
	    dispatch(setAssetsIllustration(null)) 
        dispatch(toggleLifeSpanMode(true));
        dispatch(toggleFamilyMode(false));
        dispatch(toggleUsptoMode(false));
        dispatch(toggleFamilyItemMode(false));	
        dispatch( setAllAssetTypes( false ) )
        dispatch( setAssetTypesSelect([]))	
        dispatch( setAllAssignmentCustomers( false ) )
        dispatch( setSelectAssignmentCustomers([]))														
    }

    /**
     * Resize name column width
     */

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

    const onHandleClearItems = () => {
        setItems([])
        setInvalidItems([])
    }

    const onHandleClearNonUSAItems = () => {
        const oldItems = [...items]
        const newItems = oldItems.filter( item => !invalidItems.includes(item) ? item : '') 
        setItems(newItems)
        setInvalidItems([])
    }


    const handleImport = async() => {  
        const sheetName = textFiledRef.current.value
        if(sheetName === '') {
            alert("Please enter sheet name.")
        } else {
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            const token = JSON.parse(googleToken)  
            if(token !== null) {
                setSendRequest( false )
                const form = new FormData()
                form.append('foreign_assets', JSON.stringify(items))
                const { data } = await PatenTrackApi.validateForeignAssets(form)
                if(data.length === 0) {
                    setIsLoading(true)    
                    const { access_token } = token  
                    const form = new FormData()                    
                    form.append('foreign_assets', JSON.stringify(items))
                    form.append('user_account', google_profile.email)
                    form.append('access_token', access_token)
                    let requestData = null
                    if(selectedRef.current.length > 0) {
                        const selectedSheetID = selectedRef.current[selectedRef.current.length - 1]
                        if(selectedSheetID !== '') {
                            const sheetItems = sheetsRef.current
                            const filterSheet = sheetItems.filter( sheet => sheet.sheet_id === selectedSheetID )
                            if(filterSheet.length > 0) {
                                form.append('sheet_name', filterSheet[0].sheet_name)
                                form.append('sheet_id', filterSheet[0].sheet_id)
                                requestData = await PatenTrackApi.appendItemFromExternalSheet(form)
                            }
                        }
                    } else {
                        form.append('sheet_name', sheetName)
                        requestData = await PatenTrackApi.saveForeignAssets(form)                        
                    }                     
                    if(requestData !== null &&  requestData.data !== null ) {
                        setIsLoading(false)         
                        if( requestData.data.error == '') {
                            onHandleRetrieveList()        
                            setItems([])
                            setInvalidItems([])
                            setIsLoading(false)
                            setOpen(!open)                                        
                            alert(requestData.data.message)
                        } else if(requestData.data.error !== ''){
                            alert(requestData.data.error)
                        } else {
                            alert('Error while saving foreign assets')
                        }
                    } else{      
                        setIsLoading(false)      
                        alert('Error while saving foreign assets')
                    }
                } else {
                    setInvalidItems(data)
                    alert(`The following items were not found in the USPTO database and should be removed from the list: \n ${data.join(", ")}`)
                }
            } else {
                openGoogleWindow()
            }            
        }       
    }

    const LoadingImportButton = () => {
        return(
            <Button 
                className={classes.button}
                onClick={handleImport}
                disabled={isLoading}
            >
                {
                    isLoading ? <CircularProgress size={12} /> :  <Save/>
                }
            </Button>
        )
    }
    
    const FooterItems = () => {
        return (
            <div className={classes.footer}>
                <Button
                    onClick={onHandleClearNonUSAItems}
                    className={classes.btnClear}
                >
                    <Close /> Clear non-USPTO Assets
                </Button>
                <Button
                    onClick={onHandleClearItems}
                    className={classes.btnClear}
                >
                    <Delete /> Clear List
                </Button>
                <Typography color="inherit" variant='body2' component="div">
                    Save As: 
                    <TextField  
                        variant="standard" 
                        className={classes.txtField}
                        inputRef={textFiledRef}
                        defaultValue={sheetName}
                        /* onChange={handleSheetName} */
                    /> 
                    <LoadingImportButton />
                </Typography>  
            </div>
        )
    }

    if (isLoadingSheets && sheets.length == 0) return <Loader />
    return (
        <Paper className={classes.root} square id={`foreign_assets_tabs`}>
            <VirtualizedTable
                classes={classes}
                selected={selectItems}
                rowSelected={selectedRow}
                selectedIndex={currentSelection}
                selectedKey={'sheet_id'} 
                rows={sheets}
                rowHeight={rowHeight}
                headerHeight={headerRowHeight}
                columns={headerColumns}
                totalRows={totalRecords}
                onSelect={handleClickRow}
                onSelectAll={handleSelectAll}
                defaultSelectAll={false}
                resizeColumnsWidth={resizeColumnsWidth}
                resizeColumnsStop={resizeColumnsStop}
                defaultSortField={`sheet_name`}
                defaultSortDirection={`desc`}
                responsive={true}
                width={width} 
                containerStyle={{ 
                    width: '100%',
                    maxWidth: '100%' 
                }}
                style={{
                    width: '100%'
                }}
            />
            <span ref={googleLoginRef}>
                <Googlelogin/>
            </span>
            
            <DialogPopup 
                open={open} 
                resizable={true}
                resizableWidth={660}
                resizableHeight={490} 
                minConstraints={[630, 450]}
                onClose={(e) => { 
                    setOpen(!open)
                    setSelectedRow([])
                }} 
                scroll={true}
                footerCallBack={ <FooterItems/> }
            >
                <CloseIcon 
                    onClick={(e) => { 
                    setOpen(!open)
                    setSelectedRow([])
                }}  
                    className={classes.close}/>
                <ImportAsset 
                    updateItems={setItems} 
                    updateInvalidItems={setInvalidItems} 
                    items={items} 
                    invalidItems={invalidItems}
                    deleteItem={handleDeleteItem}
                    handlePatchItem={handleUpdateItem}/>   
            </DialogPopup>
        </Paper>   
    )
}  

export default ForeignAsset;