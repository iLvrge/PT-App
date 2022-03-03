import React, {useState, useCallback, useMemo, useRef} from 'react'
import { 
    useDispatch, 
    useSelector 
} from 'react-redux'
import { 
    useHistory,
} from 'react-router-dom'  
import {
    Paper,
    Divider,
    Menu,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Button,
    Modal,
    Backdrop,
    TextField, 
    CircularProgress,
    Fab, 
    IconButton,
    Avatar,
    Checkbox
} from '@mui/material'

import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Contacts as ContactsIcon,
    LocationCity as LocationCityIcon,
    KeyboardArrowDown,
    Speed as SpeedIcon,
    MailOutline as MailOutlineIcon,
    Check
} from '@mui/icons-material'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons"
import copy from 'copy-to-clipboard'
import useStyles from './styles'

import AssetSwitchButton from './AssetSwitchButton'
import UserInputForm from '../common/QuillEditor/UserInputForm'
import CustomerAddress from '../common/CustomerAddress'
import { controlList } from "../../utils/controlList"
import { downloadFile, copyToClipboard } from '../../utils/html_encode_decode'
import { setTokenStorage, getTokenStorage } from '../../utils/tokenStorage'

import { setAssetTypeAssignments, 
    setSelectedAssetsTransactions, 
    setSelectedAssetsPatents, 
    setAssetsIllustration, 
    setBreadCrumbsAndCategory,  
    setAssetTypeAssignmentAllAssets,
    setSwitchAssetButton,
    setAssetTypes,
    setAssetTypeInventor,
    setAssetTypeCompanies,
    setAssetsIllustrationData,
    setAllAssetTypes,
    setAssetTypesSelect,
    setAllAssignmentCustomers,
    setSelectAssignmentCustomers,
    setAssetTypesPatentsSelected,
    setAssetTypesPatentsSelectAll,
    setAllAssignments, 
    setSelectAssignments,
    setSlackMessages,
    setMoveAssets, 
    getMaintainenceAssetsList,
    setAddressQueueDisplay,
    setAddressQueueData,
    setAddressQueueLoading,
    setNameQueueDisplay,
    setNameQueueData,
    setNameQueueLoading ,
	setLayoutTemplatesByID,
	getAddressQueue,
    getNameQueue,
    getLayoutTemplatesByID
} from '../../actions/patentTrackActions2'
  
import {  
    setPDFView,
    setPDFFile
} from '../../actions/patenTrackActions'
  
import { 
    setMaintainenceFeeFrameMode,
    setDriveTemplateFrameMode,
    setDriveTemplateMode,
    setDriveButtonActive,
    toggleFamilyMode,
    toggleFamilyItemMode,
    toggleUsptoMode,
    toggleLifeSpanMode,
} from '../../actions/uiActions'

import PatenTrackApi from '../../api/patenTrack2'
import clsx from 'clsx'

const ActionMenu = (props) => {
    const classes = useStyles()
    const history = useHistory()
    const googleLoginRef = useRef(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    
    const dispatch = useDispatch()
    const [ redo, setRedo ] = useState([])
    const [ btnActive, setBtnActive] = useState( false )
    const [ displayButton, setDisplayButton] = useState( true )
    const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
    const [ loadingUSPTO, setLoadingUSPTO ] = useState(false)
    const [ correctAddressModal, setCorrectAddressModal ] = useState(false)
    const [ changeNameModal, setChangeNameModal ] = useState(false)
    const [ modalOpen, setModalOpen] = useState(false)
    const [ newCompanyName, setNewCompanyName] = useState('')  
    const layout_id = useSelector(state => state.patenTrack2.layout_id)
    const driveTemplateMode = useSelector(state => state.ui.driveTemplateMode)
    const maintainenceFrameMode = useSelector(state => state.ui.maintainenceFrameMode)
    const addressQueuesDisplay = useSelector(state => state.patenTrack2.addressQueuesDisplay)
    const nameQueuesDisplay = useSelector(state => state.patenTrack2.nameQueuesDisplay)
    const maintainence_fee_file_name = useSelector(state => state.patenTrack2.maintainence_fee_file_name)
    const category = useSelector(state => state.patenTrack2.selectedCategory)
    const template_document_url = useSelector(state => state.patenTrack2.template_document_url)
    const maintainencePatentsList = useSelector(state => state.patenTrack2.maintainenceAssetsList.list)
    const move_assets = useSelector(state => state.patenTrack2.move_assets)
    const fixedTransactionAddress = useSelector(state => state.patenTrack2.fixedTransactionAddress)
    const fixedTransactionName = useSelector(state => state.patenTrack2.fixedTransactionName)
    const mainCompaniesSelected = useSelector(state => state.patenTrack2.mainCompaniesList.selected)
    const assetTypeAssignmentAssetsList = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedMainCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedAssetsTransactions = useSelector(state => state.patenTrack2.assetTypeAssignments.selected)
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)
    const assetTypeAssignmentAssetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
    const link_assets_sheet_display = useSelector(state => state.patenTrack2.link_assets_sheet_display)
    const link_assets_sheet_type = useSelector(state => state.patenTrack2.link_assets_sheet_type)
    const link_assets_selected = useSelector(state => state.patenTrack2.link_assets_selected)
    const assetTypeAddressSelected = useSelector(state => state.patenTrack2.assetTypeAddress.selected)
    const assetTypeAddressGroups = useSelector(state => state.patenTrack2.assetTypeAddress.all_groups)
    const assetTypeNamesGroups = useSelector(state => state.patenTrack2.assetTypeNames.all_groups)
    const assetTypeNamesSelected = useSelector(state => state.patenTrack2.assetTypeNames.selected)
    const google_profile = useSelector(state => state.patenTrack2.google_profile)
    const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)

    /**
     * Open Menu
     * @param {click event} event 
     */

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    /**
     * On close menu
     */
    const handleClose = () => {
        setAnchorEl(null)
    }
    /**
     * Create Google doc template
     */
    const createTemplate = () => {
        if( selectedAssetsPatents.length > 0 ) {
          const googleToken = getTokenStorage( 'google_auth_token_info' )
          if(googleToken && googleToken != '') {
            const tokenParse = JSON.parse( googleToken )
            const { access_token } = tokenParse
            if( access_token ) {
              setBtnActive(previousItem => {
                return !previousItem
              })
              getDriveDocumentList(!btnActive)
            } else {
              getDriveDocumentList(true)
            }        
          } else {
            getDriveDocumentList(true)
          }     
        } else {
          alert("Please select asset from list first.")
        }    
    }

    /**
     * Open google auth login window
     */
    const openGoogleWindow = useCallback(() => {
        /* if(googleLoginRef.current != null) {
          googleLoginRef.current.querySelector('button').click()
        } 
        setGoogleAuthLogin( true )
        setDisplayButton( true ) */
    }, [/* googleLoginRef */])

    const getLayout = useMemo(() => {
        return controlList.filter(item => item.category == category)
    }, [category, controlList])

    /**
     * Get list for Google Drive 
     * @param {*} flag 
     */

    const getDriveDocumentList = (flag) => {
        if( flag === true ) {      
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            if(googleToken && googleToken != '' && googleToken != null ) {
    
            const { access_token } = JSON.parse(googleToken)
    
            if(access_token) {
              /**
               * Get Layout templates according to selected category
               */
              
                let profileInfo = google_profile;
                if(profileInfo == null || profileInfo == '' || (profileInfo != null && !profileInfo.hasOwnProperty('email'))) {
                    const getGoogleProfile = getTokenStorage('google_profile_info')
                    if( getGoogleProfile != '') {
                        profileInfo = JSON.parse(getGoogleProfile)
                    }
                }
                let  layoutID = layout_id
                if(layoutID == 0 && category != '') {
                    const item = getLayout
                    if(item.length > 0) {
                        layoutID = item[0].layout_id
                    }
                }
                
                if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                    //dispatch(setDriveButtonActive( true )) // it will set when user click on drive file link
                    dispatch( 
                        setDriveTemplateMode(true) 
                    )
                    dispatch( 
                        getLayoutTemplatesByID(layoutID, profileInfo.email) 
                    )
                }
                } else {
                //alert("Please first login with google account.")
                if(googleLoginRef.current != null) {
                    googleLoginRef.current.querySelector('button').click()
                } 
                setGoogleAuthLogin( true )
                setDisplayButton( true )
                }
            } else {
                //alert("Please first login with google account.")
                if(googleLoginRef.current != null) {
                    googleLoginRef.current.querySelector('button').click()
                }
                setGoogleAuthLogin( true )
                setDisplayButton( true )
            }    
        } else {   
            dispatch(setDriveButtonActive( false ))
            dispatch(setDriveTemplateFrameMode( false ))
            dispatch(setDriveTemplateMode(false))
            dispatch(setLayoutTemplatesByID({ list: [], message: '' }))
        }        
    }

    /**
     * Open gmail compose box
     */

    const onAttachmentOpenedFileAndEmail = useCallback(() => {    
        const bodyURL = encodeURIComponent(`\n\n\n\n${template_document_url}`)
        let url = `https://mail.google.com/mail/u/0/?fs=1&tf=cm${template_document_url != '' ? '&body='+bodyURL : ''}`
        /* if( template_document_url != '') {
          copyToClipboard(template_document_url)
    
        } */
        window.open(url,'GMAIL')
    }, [ template_document_url ] )

    /**
     * Share a list of selected assets
     */

    const onShare = useCallback(async () => {
        if (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'){
            alert('Message..')
        } else {
            let selectAssetsList = [], selectedTransactions = []
    
            let list = maintainencePatentsList.length > 0 ? [...maintainencePatentsList] : [...assetTypeAssignmentAssetsList]
    
            let selectedItems = selectedMaintainencePatents.length > 0 ? [...selectedMaintainencePatents] : [...assetTypeAssignmentAssetsSelected]
    
            if(selectedItems.length > 0) {
                selectedItems.forEach( item => {
                    const findIndex = list.findIndex( row => row.asset == item)
                    if(findIndex !== -1) {
                    selectAssetsList.push({asset: item, flag: list[findIndex].grant_doc_num !== '' && list[findIndex].grant_doc_num !== null ? 4 : 5})
                    }
                }) 
            } else {
                selectedTransactions = [...selectedAssetsTransactions]
            }
            if( selectedTransactions.length == 0 &&  selectAssetsList.length == 0 ) {
                alert('Please select a asset')
            } else {
                // Share list of assets and create share link 
                let form = new FormData()
                form.append('assets', JSON.stringify(selectAssetsList))
                form.append('transactions', JSON.stringify(selectedTransactions))
                form.append('type', 2)      
                const {data} = await PatenTrackApi.shareIllustration(form)
                if (data.indexOf('sample') >= 0) {
                /**
                 * just for temporary replacing
                 * open share url new tab
                 */
                //const shareURL = data.replace('https://share.patentrack.com','http://167.172.195.92:3000')
                
                if(window.confirm("Copy a sharing link to your clipboard.")){
                    copy(data)
                }
                //window.open(data,'_BLANK')
                } 
            }
        }        
    }, [ dispatch, category, selectedMaintainencePatents, assetTypeAssignmentAssetsSelected, selectedAssetsTransactions ])
    /**
     * Add / Update assets list on google spreadsheet
     */

    const onHandleLinkAssetWithSheet = useCallback(async() => {
        if(link_assets_selected.length > 0 && link_assets_sheet_type.type !== null && link_assets_sheet_type.asset !== null && link_assets_sheet_display === true) {
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
                form.append('asset', decodeURIComponent(link_assets_sheet_type.asset))
                form.append('values', JSON.stringify(link_assets_selected))
                const { data } = await PatenTrackApi.linkSheetUpdateData(form, link_assets_sheet_type.type)
                console.log('updateSheet', data)
            }      
        }
    }, [link_assets_selected, link_assets_sheet_type])

    /**
     * 
     */

    const onHandleReviewMaintainenceFee = useCallback(async () => { 
        if( maintainenceFrameMode === false) {
            const action = ( selectedMaintainencePatents.length > 0 &&  move_assets.length > 0 ) ? true : move_assets.length > 0 ? true : selectedMaintainencePatents.length > 0 ? true : false
          
            if(action === true) {
                if( move_assets.length > 0 ) {
                    //move assets to other layout
                    const form = new FormData()
                    form.append('moved_assets', JSON.stringify(move_assets))
                    const { data } = await PatenTrackApi.moveAssetToLayout(form)
                    if( data != null && data.length > 0 ) {
                        setRedo(data)
                        dispatch(setMoveAssets([]))
                        if(selectedMaintainencePatents.length == 0) {
                            dispatch( getMaintainenceAssetsList( selectedMainCompanies ))
                        }
                    }
                }
                if(selectedMaintainencePatents.length > 0) {
                    dispatch(setMaintainenceFeeFrameMode( true ))
                }
            } else {
                alert("Please select assets from the maintainence list")
            }
        } else {
          //cancel
          dispatch(setMaintainenceFeeFrameMode( false )) 
            if( redo.length > 0 ) {
                //redo all activities
                const assetIDs = []
                redo.map( row => {
                    assetIDs.push(row.asset_id)
                })
                const { data } = await PatenTrackApi.moveAssetRollback(JSON.stringify(assetIDs))
                if( data ) {
                    // refresh patent list
                    setRedo([])
                    dispatch( getMaintainenceAssetsList( selectedMainCompanies ))
                }
            }
        }    
    }, [ dispatch, selectedMaintainencePatents, maintainenceFrameMode, move_assets, redo, selectedMainCompanies ])

    /**
     * Open uspto window 
     * @param {*} w 
     * @param {*} h 
     */

    const openUSPTOWindow = (w, h) => {
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY
    
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height
    
        const systemZoom = width / window.screen.availWidth
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
    
        window.open('https://fees.uspto.gov/MaintenanceFees/', 'Maintainence Fee', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)
    }

    /**
     * Create Maintainance CSV file and open USPTO window to upload file
     */

    const onMaintainenceFeeFile = useCallback(async () => {  
        if(selectedMaintainencePatents.length > 0) {
            const getGoogleToken = getTokenStorage('google_auth_token_info')
            if(getGoogleToken && getGoogleToken != '') {
                const tokenJSON = JSON.parse( getGoogleToken )
                if( tokenJSON && tokenJSON.access_token != '' && tokenJSON.access_token != undefined) {
                    let profileInfo = google_profile;
                    if(profileInfo == null) {
                        const getGoogleProfile = getTokenStorage('google_profile_info')
                        if( getGoogleProfile != '') {
                            profileInfo = JSON.parse(getGoogleProfile)
                        }
                    }
                    if(profileInfo != null && profileInfo.hasOwnProperty('email')) {
                        const promptBox = window.confirm('Create a csv payment file to be loaded to USPTO.')
                        /**
                         * True
                         */
                        if( promptBox ) {
                            const formData = new FormData()
                            formData.append('file_name',  maintainence_fee_file_name )
                            formData.append('file_data',  JSON.stringify(selectedMaintainencePatents))
                            formData.append('access_token',  tokenJSON.access_token)
                            formData.append('user_account',  profileInfo.email)
                        
                            const { data } = await PatenTrackApi.createMaintainenceFeeFile( formData )
                            console.log("data", data)
                            if( data != null && data != undefined && data.webViewLink != '') {
                                /**
                                 * Open USPTO Maintainence Fee window
                                 */
                                openUSPTOWindow(1200, 700)
                            }
                        }            
                    } else {
                        alert("Please first login with google account")
                    }          
                } else {
                    alert("Please first login with google account")
                }
            } else {
                alert("Please first login with google account")
                console.log("Google login popup")
                openGoogleWindow()
            }
        } else {
          alert("Please first select the assets")
        }
    }, [ selectedMaintainencePatents, maintainence_fee_file_name, google_profile  ])

    /**
     * Open form where user can select assignor, assignee and Lawfirm
     */

    const onHandleSubmitToUSPTO =  useCallback( async () => {      
        if( (category == 'correct_details' && selectedAssetsTransactions.length == 0) || (category != 'correct_details' && selectedAssetsPatents.length == 0)) {
            alert(category == 'correct_details' ? 'Please select a transaction' : 'Please select a asset') 
        } else {
            /**
             * Open model
             * where user can add assignee, assignor and correspondence
             * add Autocomplete component
             */
            setModalOpen(true)
        }
    }, [ selectedAssetsPatents, selectedAssetsTransactions, category ])

    const onHandleModalClose = () => {
        setModalOpen(false)
    }

    const onHandleAddressCancel = useCallback(() => {
        dispatch(setAddressQueueDisplay(false))
        dispatch(setAddressQueueData([]))
        dispatch(setAddressQueueLoading(false))    
    }, [dispatch])

    const onHandleSubmitAddressUSPTO = useCallback(async() => {
        if( fixedTransactionAddress.length > 0 ) {
            const form = new FormData()
            form.append('id', fixedTransactionAddress[0][0])
            form.append('update_address', fixedTransactionAddress[0][1])
            form.append('company_ids', JSON.stringify(selectedMainCompanies))
            const { data } = await PatenTrackApi.fixedTransactionAddressXML(form)
    
            if( data != null && data != '') {
                downloadFile(data)
            }
        }
    }, [ dispatch, fixedTransactionAddress ])

    const onCorrectAddress = () => {
        /**
         * Show selected company address list
         */
        setCorrectAddressModal(true)    
    }
    
    const onChangeAddress = () => {
        /**
         * Show selected company address list
         */
        setCorrectAddressModal(true)
    }
      
    const onChangeName = () => {
        //show Modal for enter new company 
        setChangeNameModal(true)    
    }

    const onHandleCorrectAddress = useCallback(() => {
        if(assetTypeAddressSelected.length > 0) {
            onCorrectAddress()
        } else {
            alert('Please select address first.')
        }
    }, [ assetTypeAddressSelected ])
    
    const onHandleChangeAddress = useCallback(() => {
        if(assetTypeAddressSelected.length > 0) {
            onChangeAddress()
        } else {
            alert('Please select address first.')
        }
    }, [ assetTypeAddressSelected ])
    
    const onHandleChangeName = useCallback(() => {
        if(assetTypeNamesSelected.length > 0) {
            onChangeName()
        } else {
            alert('Please select name first.')
        }
    }, [ assetTypeNamesSelected ])
    
    const onHandleCorrectName = useCallback(() => {
        if(assetTypeNamesSelected.length > 0) {
            onHandleGetNameQueue(undefined, assetTypeNamesGroups, mainCompaniesSelected)
            console.log("onHandleCorrectName", assetTypeNamesSelected, assetTypeNamesGroups, mainCompaniesSelected)
        } else {
            alert('Please select name first.')
        }
    }, [ assetTypeNamesSelected, assetTypeNamesGroups, mainCompaniesSelected ])
    
    const onHandleNamesCancel = useCallback(() => {
        dispatch(setNameQueueDisplay(false))
        dispatch(setNameQueueData([]))
        dispatch(setNameQueueLoading(false))    
    }, [dispatch])
      
    const onHandleGetNameQueue = useCallback((newName, assetTypeNamesGroups, mainCompaniesSelected) => {
        if( typeof newName == undefined && mainCompaniesSelected.length > 1) {
            alert('Please select only one company')
        } else {
            console.log("assetTypeNamesGroups", assetTypeNamesGroups)
            setChangeNameModal( false )
            const form = new FormData()
            form.append( 'group_ids', JSON.stringify(assetTypeNamesGroups) )
            form.append( 'new_name', newName )
            form.append( 'company_ids', mainCompaniesSelected[0] )
            dispatch(getNameQueue(form))
            dispatch(setNameQueueDisplay(true))
        }   
    }, [ dispatch ])
      
    const onHandleSubmitNamesUSPTO = useCallback(async() => {
        if( fixedTransactionName.length > 0 ) {
            const form = new FormData()
            form.append('id', fixedTransactionName[0][0])
            form.append('new_name', fixedTransactionName[0][1])
            form.append('company_ids', JSON.stringify(selectedMainCompanies))
            const { data } = await PatenTrackApi.fixedTransactionNameXML(form)
        
            if( data != null && data != '') {
                downloadFile(data)
            }
        }
    }, [ dispatch, fixedTransactionName ])

    const onSalesAssets = useCallback(async () => {
        if( assetTypeAssignmentAssetsSelected.length == 0) {
            alert('Please select assets from list for sale')
        } else {
            /**
             * check slack auth and google auth
             * create channel and document
             * add list of assets
             * 
             */
            const slackToken = getTokenStorage( 'slack_auth_token_info' ), googleToken = getTokenStorage( 'google_auth_token_info' )
            let slackTokenFlag = false, googleTokenFlag = false
            if(slackToken && slackToken!= '') {
                const token = JSON.parse(slackToken)
                if(typeof token === 'string') {
                    token = JSON.parse(token)
                }
                if(typeof token === 'object') {
                    const { access_token } = token          
                    if(access_token && access_token != '') {
                        slackTokenFlag = true
                    }
                }
            }
          
            if(googleToken && googleToken != '') {
                const tokenParse = JSON.parse( googleToken )
                const { access_token } = tokenParse
                if( access_token ) {
                    googleTokenFlag = true
                }
            }
    
            if( slackTokenFlag === true && googleTokenFlag === true ) {
                /**
                 * Send request
                */
            } else {
                if(slackToken == '' || slackToken == null) {
                    alert('Please login with slack first') //show slack login button
                }
        
                if( googleTokenFlag === false ) {
                    openGoogleWindow() //open google login window
                }
            }
        }
    }, [ dispatch, assetTypeAssignmentAssetsSelected ])

    const handleCorrectAddressModal = (event) => {
        event.preventDefault()
        setCorrectAddressModal(false)
    }
        
    const onHandleSelectAddress = useCallback((addressID) => {
        setCorrectAddressModal( false )
        const form = new FormData()
        form.append( 'group_ids', JSON.stringify(assetTypeAddressGroups) )
        form.append( 'new_address', addressID )
        form.append( 'company_ids', JSON.stringify(mainCompaniesSelected) )
        dispatch(getAddressQueue(form))
        dispatch(setAddressQueueDisplay(true))
    }, [ dispatch, assetTypeAddressGroups, mainCompaniesSelected ])
        
      
    const handleChangeNameModal = (event) => {
        event.preventDefault()
        setChangeNameModal(false)
    }

    const handleCompanyNameChange = (event)=>{
        event.preventDefault()
        setNewCompanyName(event.target.value)
    }  
        
    const onHandleSubmitName = useCallback(() => {
        if(newCompanyName != '') {
            onHandleGetNameQueue(newCompanyName, assetTypeNamesGroups, mainCompaniesSelected)
        } else {
            alert('Please enter company new name')
        }
    }, [ newCompanyName, assetTypeNamesGroups, mainCompaniesSelected ] )

    const handleChangeLayout = (event) => {
        let findIndex = -1
        if(category == 'due_dilligence') {
          findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'restore_ownership')
        } else {
          findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'due_dilligence')
        }
        if( findIndex !== -1 ) {
            //hideMenu(event, controlList[findIndex])
            resetAll()
            clearOtherItems()
            dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))      
            dispatch(setSwitchAssetButton(controlList[findIndex].category == 'due_dilligence' ? 0 : 1))
        }
    }
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
        dispatch(toggleLifeSpanMode(true))
        dispatch(toggleFamilyMode(false))
        dispatch(toggleUsptoMode(false))
        dispatch(toggleFamilyItemMode(false))	
        dispatch( setAllAssetTypes( false ) )
        dispatch( setAssetTypesSelect([]))	
        dispatch( setAllAssignmentCustomers( false ))
        dispatch( setSelectAssignmentCustomers([]))														
    }

    const onHandleDashbord = useCallback(() => {
        history.push('/reports')
    }, [ history ])

    return <>
        {
            props.t == 1
            ?
                <Fab 
                    style={{backgroundColor: '#e60000', color: '#fff'}}  
                    aria-label="Action"
                    id="action-menu"
                    aria-controls={props.t == 0 ? "app-patentrack-action-menu" : "app-patentrack-action-mobile-menu"}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    className={classes.mBtn}
                >
                    <CheckCircleOutlineIcon />
                </Fab>
            :
                <Button
                    id="action-menu"
                    aria-controls="app-patentrack-action-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="text"
                    disableElevation
                    onClick={handleClick}
                    startIcon={<KeyboardArrowDown />}
                    className={classes.btnActionMenu}
                >
                    Action
                </Button>
        }            
        <Menu       
            id={props.t == 0 ? "app-patentrack-action-menu" : "app-patentrack-action-mobile-menu"}
            keepMounted
            anchorEl={anchorEl} 
            open={open}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            transformOrigin={{vertical: 'bottom', horizontal: 'left'}}
            onClose={handleClose}
            className={classes.actionMenuList} 
        >   
            <MenuItem  onClick={() => props.setDashboardScreen(!props.dashboardScreen)} className={`iconItem`}>
                <ListItemIcon>
                    <SpeedIcon/>
                </ListItemIcon>
                <ListItemText>Dashboard</ListItemText>
            </MenuItem>
            <MenuItem  onClick={onAttachmentOpenedFileAndEmail}  className={`iconItem`}>
                <ListItemIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><path d="M11 20H2.5A2.503 2.503 0 0 1 0 17.5v-13C0 3.122 1.122 2 2.5 2h19C22.878 2 24 3.122 24 4.5V18c0 .275-.225.5-.5.5s-.5-.225-.5-.5V4.5c0-.827-.673-1.5-1.5-1.5h-19C1.673 3 1 3.673 1 4.5v13c0 .827.673 1.5 1.5 1.5H11a.5.5 0 0 1 0 1z"/><path d="M12 14.03c-1.014 0-1.962-.425-2.67-1.194L3.122 6.048a.5.5 0 0 1 .739-.675l6.207 6.787c1.03 1.12 2.834 1.121 3.866-.001l6.195-6.777a.5.5 0 0 1 .739.675l-6.196 6.778c-.71.77-1.658 1.195-2.672 1.195z"/><path d="M3.492 17.215a.5.5 0 01-.337-.87l5.458-4.982a.499.499 0 11.675.738L3.83 17.084a.506.506 0 01-.338.131zM19.168 16a.495.495 0 01-.337-.131l-4.127-3.771a.5.5 0 11.675-.738l4.127 3.77a.5.5 0 01-.338.87z"/><path d="M20.542 22h-7.147A2.398 2.398 0 0 1 11 19.605v-.211a2.399 2.399 0 0 1 2.395-2.396h7.147A1.46 1.46 0 0 1 22 18.456c0 .887-.654 1.542-1.458 1.542H15a.5.5 0 0 1 0-1h5.542A.46.46 0 0 0 21 18.54c0-.336-.206-.542-.458-.542h-7.147c-.769 0-1.395.626-1.395 1.396v.211c0 .769.625 1.395 1.395 1.395h7.147A2.463 2.463 0 0 0 23 18.542C23 17.104 21.896 16 20.542 16H15c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h5.542A3.462 3.462 0 0 1 24 18.458C24 20.449 22.449 22 20.542 22z"/></svg>
                </ListItemIcon>
                <ListItemText>Attach the open document and send email</ListItemText>
            </MenuItem>
            <MenuItem  onClick={onShare} className={`iconItem`}>
                <ListItemIcon>
                    <FontAwesomeIcon
                        icon={faShareAlt}
                    />
                </ListItemIcon>
                <ListItemText>Share Selected Assets</ListItemText>
            </MenuItem>
            {
                loadingUSPTO && (
                    <MenuItem className={`iconItem`}>
                        <ListItemIcon>
                            <CircularProgress size={24} className={classes.buttonProgress} />
                        </ListItemIcon>
                    </MenuItem>
                )
            }
            {
                link_assets_sheet_display === true && link_assets_selected.length > 0  && (
                    <MenuItem onClick={onHandleLinkAssetWithSheet}>
                        <ListItemText>Process Selections</ListItemText>
                    </MenuItem>
                )
            }
            {
                category == 'pay_maintainence_fee'
                ?
                    maintainenceFrameMode === false
                    ?
                        <MenuItem onClick={onHandleReviewMaintainenceFee}>
                            <ListItemText>Process Selections</ListItemText>
                        </MenuItem>
                    :
                        <>
                            <MenuItem onClick={onMaintainenceFeeFile}>
                                <ListItemText>Pay Maintenance Fees</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={onHandleReviewMaintainenceFee}>
                                <ListItemText>Cancel</ListItemText>
                            </MenuItem>
                        </>
                :
                    category == 'restore_ownership' || category == 'correct_details'
                    ?
                        <>
                            <MenuItem onClick={createTemplate} className={`iconItem`}>
                                <ListItemIcon>
                                    <svg viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><path d="M19,11c0.17,0,0.33,0.01,0.49,0.02L15,3H9l5.68,9.84C15.77,11.71,17.3,11,19,11z"/><polygon points="8.15,4.52 2,15.5 5,21 11.33,10.03"/><path d="M13.2,15.5H9.9L6.73,21h7.81C13.58,19.94,13,18.54,13,17C13,16.48,13.07,15.98,13.2,15.5z"/><polygon points="20,16 20,13 18,13 18,16 15,16 15,18 18,18 18,21 19,21 20,21 20,18 23,18 23,16"/></g></g></svg>
                                </ListItemIcon>
                                <ListItemText>{driveTemplateMode === true ? 'Close ' : 'Create a '}Document</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={onHandleSubmitToUSPTO}>
                                <ListItemText>Submit to USPTO</ListItemText>
                            </MenuItem>
                        </>
                    :
                    category == 'correct_address'
                    ?
                        addressQueuesDisplay === true   
                        ?
                            <>
                                <MenuItem onClick={onHandleSubmitAddressUSPTO}>
                                    <ListItemText>Submit to USPTO</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={onHandleAddressCancel}>
                                    <ListItemText>Cancel</ListItemText>
                                </MenuItem>
                            </>
                        :
                            <>
                                <MenuItem onClick={onCorrectAddress}>
                                    <ListItemText>Correct Addresses</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={onChangeAddress}>
                                    <ListItemText>Change Addresses</ListItemText>
                                </MenuItem>
                            </>
                    :
                    category == 'correct_names'
                    ?
                        <>
                            <MenuItem onClick={onHandleSubmitNamesUSPTO}>
                                <ListItemText>Submit to USPTO</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={onChangeName}>
                                <ListItemText>Change Name</ListItemText>
                            </MenuItem>
                        </>
                    :
                        category == 'sell_payments'     
                        ?
                            <MenuItem onClick={onSalesAssets}>
                                <ListItemText>Select Assets and Click Here</ListItemText>
                            </MenuItem>
                        :
                            <MenuItem onClick={createTemplate} className={`iconItem`}>
                                <ListItemIcon>
                                    <svg viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><path d="M19,11c0.17,0,0.33,0.01,0.49,0.02L15,3H9l5.68,9.84C15.77,11.71,17.3,11,19,11z"/><polygon points="8.15,4.52 2,15.5 5,21 11.33,10.03"/><path d="M13.2,15.5H9.9L6.73,21h7.81C13.58,19.94,13,18.54,13,17C13,16.48,13.07,15.98,13.2,15.5z"/><polygon points="20,16 20,13 18,13 18,16 15,16 15,18 18,18 18,21 19,21 20,21 20,18 23,18 23,16"/></g></g></svg>
                                </ListItemIcon>
                                <ListItemText>{driveTemplateMode === true ? 'Close ' : 'Create a '}Document</ListItemText>
                            </MenuItem>
            }                
            <Divider />
            <AssetSwitchButton
                click={handleChangeLayout}
                category={category}
            />                
            <MenuItem className={`iconItem`}>
                <ListItemIcon>
                    <MailOutlineIcon/>
                </ListItemIcon>
                <ListItemText>Correct Address</ListItemText>
            </MenuItem>                    
            <MenuItem className={`iconItem`}>
                <ListItemIcon>
                    <LocationCityIcon/>
                </ListItemIcon>
                <ListItemText>Correct Correspondence</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem  onClick={() => props.onClickSale(1)} className={`iconItem ${display_sales_assets === true ? 'active' : ''}`}>
                <ListItemIcon>
                    <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/sales.svg" variant="square" style={{width: 21, height: 21}}/>
                </ListItemIcon>
                <ListItemText>Our Assets for Sale</ListItemText>
            </MenuItem>                
            <Divider />
            <MenuItem  onClick={() => props.onClickSale(2)} className={`iconItem ${display_sales_assets === true ? 'active' : ''}`}>
                <ListItemIcon>
                    <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/acquisition.svg" variant="square" style={{width: 21, height: 21}}/>
                </ListItemIcon>
                <ListItemText>Other Assets Available for Purchase</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem style={{height: 100}}>
            </MenuItem>
            <Divider />
            <MenuItem>
                <ListItemIcon>
                    <Checkbox/>
                </ListItemIcon>
                <ListItemText>Lenders</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <Checkbox/>
                </ListItemIcon>
                <ListItemText>Lawyers</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <Checkbox/>
                </ListItemIcon>
                <ListItemText>The Patent Marketplace</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <Checkbox/>
                </ListItemIcon>
                <ListItemText>Inventors</ListItemText>
            </MenuItem>
        </Menu>
        <Modal
            open={modalOpen}
            onClose={onHandleModalClose}
            aria-labelledby="assignor-assignee"
            aria-describedby="">
            <React.Fragment>
                <UserInputForm />
            </React.Fragment>
        </Modal> 
        <Modal
            open={correctAddressModal}
            onClose={(e) => handleCorrectAddressModal(e)}
            aria-labelledby="Correct-Address-Modal"
            aria-describedby=""
        >
            <div style={{display: 'flex', height: '50vh', width: '600px', margin: '43px auto'}}>
                <CustomerAddress onHandleSelectAddress={onHandleSelectAddress}/>
            </div>
        </Modal>
        <Modal
            open={changeNameModal}
            onClose={(e) => handleChangeNameModal(e)}
            aria-labelledby="Change-Name-Modal"
            aria-describedby=""
        >
            <div style={{display: 'flex', height: '20vh', width: '300px', margin: '30vh auto', background: '#424242', position:' relative', padding: '0 10px'}}>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="change-name" label="Company Name" onChange={handleCompanyNameChange} placeholder="Enter a new company name"/>
                </form>
                <Button variant="outlined" onClick={onHandleSubmitName} className={classes.btn}>
                    Submit
                </Button>
            </div>
        </Modal>
    </>;
}

export default ActionMenu