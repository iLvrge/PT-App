import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react'
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
    KeyboardArrowUp,
    Speed as SpeedIcon,
    MailOutline as MailOutlineIcon,
    FindInPage as FindInPageIcon,
    Link as LinkIcon,
    Tv as TvIcon,
    Check,
    AppsOutage,
    Speed,
    ViewTimeline,
    HandshakeOutlined,
    Settings
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
import { TransactionIcon, ASSET_ICON_SPAN } from '../../utils/icons'

import { 
    setBreadCrumbsAndCategory,  
    setSwitchAssetButton,
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
} from '../../actions/uiActions'

import PatenTrackApi from '../../api/patenTrack2'
import clsx from 'clsx'
import Googlelogin from '../common/Googlelogin'
import themeMode from '../../themes/themeMode'

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
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
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
    const profile = useSelector(store => (store.patenTrack.profile))
    const selectedAssetCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies.selected);
    const assetTypesSelected = useSelector( state => state.patenTrack2.assetTypes.selected);
    const viewDashboard = useSelector(state => state.ui.viewDashboard) 

    const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list) 
    const childID = useSelector( state => state.patenTrack2.mainCompaniesList.childID)
    const child_list = useSelector( state => state.patenTrack2.mainCompaniesList.child_list)

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
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
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
          alert("Please select an asset from the list first.")
        }    
    }

    /**
     * Open google auth login window
     */
    const openGoogleWindow = useCallback(() => {
        alert("Token Expired, please first login with google account.")
        if(googleLoginRef.current != null) {
            if(googleLoginRef.current.querySelector('button') !== null) {
                googleLoginRef.current.querySelector('button').click()
            }            
        }
    }, [googleLoginRef])



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
                    openGoogleWindow()
                }
            } else {
                openGoogleWindow()
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
        if(template_document_url !== '' && template_document_url !== null && template_document_url != 'about:blank') {
            const bodyURL = encodeURIComponent(`\n\n\n\n${template_document_url}`)
            let url = `https://mail.google.com/mail/u/0/?fs=1&tf=cm${template_document_url != '' ? '&body='+bodyURL : ''}`
            /* if( template_document_url != '') {
              copyToClipboard(template_document_url)
        
            } */
            window.open(url,'GMAIL')
        } else {
            alert("Please open a document to attach to your email message.")
        }
    }, [ template_document_url ] )

    

    /**
     * Share a list of selected assets
     */

    
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
            }      
        }
    }, [link_assets_selected, link_assets_sheet_type])

    /**
     * 
     */

    const onHandleReviewMaintainenceFee = useCallback(async () => { 
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
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
                            dispatch( getMaintainenceAssetsList( mainCompaniesSelected ))
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
                    dispatch( getMaintainenceAssetsList( mainCompaniesSelected ))
                }
            }
        }    
    }, [ dispatch, selectedMaintainencePatents, maintainenceFrameMode, move_assets, redo, mainCompaniesSelected ])

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
        
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
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
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
        if( (category == 'correct_details' && selectedAssetsTransactions.length == 0) || (category != 'correct_details' && selectedAssetsPatents.length == 0)) {
            alert(category == 'correct_details' ? 'Please select a transaction' : 'Please select an asset first') 
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
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
        if( fixedTransactionAddress.length > 0 ) {
            const form = new FormData()
            form.append('id', fixedTransactionAddress[0][0])
            form.append('update_address', fixedTransactionAddress[0][1])
            form.append('company_ids', JSON.stringify(mainCompaniesSelected))
            const { data } = await PatenTrackApi.fixedTransactionAddressXML(form)
    
            if( data != null && data != '') {
                downloadFile(data)
            }
        }
    }, [ dispatch, fixedTransactionAddress ])

    const onCorrectAddress = () => {
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
        /**
         * Show selected company address list
         */
        setCorrectAddressModal(true)    
    }
    
    const onChangeAddress = () => {
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
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
            /* console.log("onHandleCorrectName", assetTypeNamesSelected, assetTypeNamesGroups, mainCompaniesSelected) */
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
            /* console.log("assetTypeNamesGroups", assetTypeNamesGroups) */
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
            form.append('company_ids', JSON.stringify(mainCompaniesSelected))
            const { data } = await PatenTrackApi.fixedTransactionNameXML(form)
        
            if( data != null && data != '') {
                downloadFile(data)
            }
        }
    }, [ dispatch, fixedTransactionName ])

    const onSalesAssets = useCallback(async () => {
        if(props.dashboardScreen){
            props.setActivityTimeline()
        }
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
            if(slackToken && slackToken!= '' && slackToken!= null && slackToken!= 'null' ) {
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
        props.setPatentAssets(category == 'due_dilligence' ? "Broken Chain-of-Title" : 'Assets')
        handleClose()
        props.resetAllActivity(category == 'due_dilligence' ? 'restore_ownership' : 'due_dilligence')
    }    

    const locateLostAssets = () => {
        props.setPatentAssets('Locate Lost Assets')
        handleClose()
        const findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'locate_lost_assets')        
        if(findIndex !== -1) {
            props.resetAll()
            props.clearOtherItems()
            dispatch(setBreadCrumbsAndCategory(controlList[findIndex])) 
            props.resetAllActivity('locate_lost_assets') 
        }
        //
    }

    

    const onHandleMaintainencePatentAssets = () => {
        handleClose()
        props.resetAllActivity('pay_maintainence_fee')
        props.setMaintaincePatentAssets()
    }


    const formattedCompanyname = useMemo(() => {
        let name = ''
        let filterList =  mainCompaniesSelected.length > 0 && companiesList.filter( company => company.representative_id === mainCompaniesSelected[0]) 
        if(filterList.length == 0) { 
            let findCompany = mainCompaniesSelected.length > 0 && child_list.filter( company => company.representative_id === mainCompaniesSelected[0]) 
            if(findCompany.length == 0) { 
                companiesList.map( company => {
                    if(company.type == 1) {
                        if(company.child != '') {
                            const companyChildIDs = JSON.parse(company.child)
                            if(companyChildIDs.includes(mainCompaniesSelected[0])) {
                                const childs = JSON.parse(company.child_full_detail)
                                if(childs.length > 0) {
                                    findCompany = childs.filter( cmp => cmp.representative_id === mainCompaniesSelected[0])
                                    if(findCompany.length > 0) {
                                        name = `${company.original_name} <i class="fa fa-sm fa-angle-double-right"></i> ${findCompany[0].original_name}`
                                    }
                                }
                            }
                        }
                    }
                })
            } else if(findCompany.length > 0) {
                if(childID > 0) { 
                    const findGroup =  companiesList.filter( company => company.representative_id === childID)
                    if(findGroup.length > 0) {
                        name = `${findGroup[0].original_name} <i class="fa fa-sm fa-angle-double-right"></i> ${findCompany[0].original_name}`
                    } else {
                        name = findCompany[0].original_name
                    }
                } else {
                    name = findCompany[0].original_name
                }
            }
        } else {
            name = filterList != false ? filterList[0].original_name : ''
        }  
        return name
    }, [mainCompaniesSelected, companiesList])

    const ShowIcon = ({layoutName}) => {
        return (
            <React.Fragment>
                {
                    ['Owned', 'Invented', 'Acquired', 'Collaterlized', 'Maintenance Fee Due', 'Challenged (PTAB)', 'Divested', 'Abandoned', 'Members of Owned USA', 'Proliferate Inventors', 'Law Firms', 'Lenders'].includes(layoutName) 
                    ? 
                        <span className={classes.breadcrumbHeadingIcon}>
                            <i className="fa fa-sm fa-angle-double-right"></i> <AppsOutage/>  <span>{layoutName}</span>
                        </span>
                    :
                        ['Chain-of-Title', 'To Assign', 'To Record', 'To Divest', 'To Monetize', 'Names', 'To Collateralize', 'Deflated Collateral', 'Encumbrances', 'Maintainance', 'Recordings', 'Corrections'].includes(layoutName) 
                        ?
                            <span className={classes.breadcrumbHeadingIcon}>
                                <i className="fa fa-sm fa-angle-double-right"></i> <Speed/>  <span>{layoutName}</span>
                            </span>
                        :
                            ['Acquisitions', 'Divestitures', 'Licensing', 'Collateralization', 'Inventing'].includes(layoutName) 
                            ?
                                <span className={classes.breadcrumbHeadingIcon}>
                                    <i className="fa fa-sm fa-angle-double-right"></i> <ViewTimeline/>  <span>{layoutName}</span>
                                </span>
                            :
                            <span className={classes.breadcrumbHeadingIcon}>
                                <i className="fa fa-sm fa-angle-double-right"></i>  {layoutName == 'Transactions' ? <HandshakeOutlined /> : layoutName == 'Patent Assets' ? <ASSET_ICON_SPAN/>  : ['Settings > Companies', 'Settings > Users', 'Settings > Category'].includes(layoutName) ? <Settings/> : ''}  <span>{layoutName}</span>
                            </span>
                                
                } 
            </React.Fragment>
        )
    }
    
    return (
        <div className={classes.middleContainer}>
            {
                props.t == 1
                ?
                    <Fab 
                        style={{backgroundColor: isDarkTheme ? themeMode.dark.palette.secondary.main : themeMode.light.palette.secondary.main, color: '#fff'}}  
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
                    <React.Fragment> 
                        {
                            props.dashboardScreen === false && (
                                <span className={classes.title}>
                                    <span dangerouslySetInnerHTML={{__html: formattedCompanyname}}/>
                                </span>
                            )
                        }
                            <span style={{whiteSpace: 'nowrap'}}>
                                {
                                    props.display_sales_assets == true 
                                    ?
                                        props.breadcrumbs != '' && typeof props.breadcrumb !== 'undefined'
                                            ?
                                                props.breadcrumbs
                                            :
                                                'Our Assets for Sale'
                                    :
                                        
                                        props.timelineScreen === true
                                        ?
                                            <ShowIcon  layoutName={props.layoutName != '' ? props.layoutName : 'Transactions'} />
                                        :
                                            props.patentScreen === true
                                            ?
                                                <ShowIcon  layoutName={props.layoutName != '' ? props.layoutName : 'Assets'} />
                                            : 
                                                props.layoutName != 'Dashboard' && props.breadcrumbs != 'Dashboard'
                                                ?
                                                    <ShowIcon  layoutName={props.layoutName != '' ? props.layoutName : props.breadcrumbs} /> 
                                                :
                                                    ''
                                                    /* props.dashboardScreen !== true
                                                    ?
                                                        'Action' 
                                                    :
                                                        '' */
                                } 
                            </span> 
                    </React.Fragment>
            }            
            
            {
                googleAuthLogin && (
                <span ref={googleLoginRef}>
                  <Googlelogin/>
                </span>)
            }
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
        </div>
    );
}

export default ActionMenu