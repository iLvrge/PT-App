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
    Speed
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
import { TransactionIcon } from '../../utils/icons'

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
        console.log('Maintainence Fee File')
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

    const ShowIcon = ({layoutName}) => {
        return (
            <React.Fragment>
                {
                    layoutName == 'Owned' || layoutName == 'Invented' || layoutName == 'Acquired' || layoutName == 'Collaterlized' || layoutName == 'Maintenance Fee Due' || layoutName == 'Challenged (PTAB)' || layoutName == 'Divested' || layoutName == 'Abandoned' || layoutName == 'Members of Owned USA' || layoutName == 'Proliferate Inventors' || layoutName == 'Law Firms' || layoutName == 'Lenders'
                    ? 
                        <span className={classes.breadcrumbHeadingIcon}>
                            <AppsOutage/>  <span>{layoutName}</span>
                        </span>
                    :
                        layoutName == 'Chain-of-Title' || layoutName == 'To Assign' || layoutName == 'To Divest' || layoutName == 'To Monetize' || layoutName == 'Names' || layoutName == 'Addresses' || layoutName == 'Deflated Collateral' || layoutName == 'Encumbrances' || layoutName == 'Maintainance' || layoutName == 'Recordings' || layoutName == 'Corrections'
                        ?
                            <span className={classes.breadcrumbHeadingIcon}>
                                <Speed/>  <span>{layoutName}</span>
                            </span>
                        :
                            layoutName
                }
               
            </React.Fragment>
        )
    }
    
    return (
        <div>
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
                        variant="text"
                        /* aria-controls="app-patentrack-action-menu"
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        disableElevation
                        onClick={handleClick}
                        startIcon={open === false ? <KeyboardArrowDown /> : <KeyboardArrowUp/>} */
                        className={classes.btnActionMenu}
                    >
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
                                    props.dashboardScreen === true
                                    ?
                                        viewDashboard.kpi === true
                                        ?
                                            'KPI'
                                        :
                                            viewDashboard.gauge === true
                                            ?
                                                'Attention'
                                            :
                                                viewDashboard.timeline === true
                                                ?
                                                    'Activites'
                                                :
                                                    'Dashboard'
                                    :
                                        props.timelineScreen === true
                                        ?
                                            props.layoutName != '' ? <ShowIcon  layoutName={props.layoutName} /> : 'Transactions'
                                        :
                                            props.patentScreen === true
                                            ?
                                                props.layoutName != '' && props.layoutName != 'Due Diligence > Legal Ownership'
                                                ?
                                                    <ShowIcon  layoutName={props.layoutName} />
                                                :
                                                    'Assets'
                                            :
                                                props.selectedCategory !== 'due_dilligence'
                                                ? 
                                                     <ShowIcon  layoutName={props.layoutName} />
                                                : 
                                                    'Action' 
                            } 
                        </span>
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
                
                {/* <MenuItem onClick={onHandleMaintainencePatentAssets} className={`iconItem`} selected={props.patentScreen === true && !display_sales_assets}>
                    <ListItemIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={classes.assetIcon}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"/></svg>
                    </ListItemIcon>   
                    <ListItemText>Maintainence</ListItemText>
                </MenuItem> */}
                {
                    loadingUSPTO && (
                        <MenuItem className={`iconItem`} key={1}>
                            <ListItemIcon>
                                <CircularProgress size={24} className={classes.buttonProgress} />
                            </ListItemIcon>
                        </MenuItem>
                    )
                }
                <MenuItem className={classes.disableHover} key={2}>
                    <ListItemText><span className={clsx(parseInt(profile?.user?.organisation?.subscribtion) < 2 ? classes.disabled : '')}>Pro:</span> {parseInt(profile?.user?.organisation?.subscribtion) === 1 ? <Button variant="text">Upgrade</Button> : '' }</ListItemText>
                </MenuItem>
                {
                    parseInt(profile?.user?.organisation?.subscribtion) === 2 || parseInt(profile?.user?.organisation?.subscribtion) === 3
                    ?   
                        [                            
                            <AssetSwitchButton  key={3}
                                click={handleChangeLayout}
                                category={category}
                                salesAssets={display_sales_assets}  
                            /> ,
                            <MenuItem key={4} onClick={locateLostAssets} selected={category === 'locate_lost_assets' && !display_sales_assets}>                            
                                <ListItemIcon>
                                    <FindInPageIcon/>
                                </ListItemIcon>
                                <ListItemText>Locate Lost Assets</ListItemText>
                            </MenuItem>,
                            <MenuItem  key={5} onClick={createTemplate} className={`iconItem`}>
                                <ListItemIcon>
                                    <svg viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><path d="M19,11c0.17,0,0.33,0.01,0.49,0.02L15,3H9l5.68,9.84C15.77,11.71,17.3,11,19,11z"/><polygon points="8.15,4.52 2,15.5 5,21 11.33,10.03"/><path d="M13.2,15.5H9.9L6.73,21h7.81C13.58,19.94,13,18.54,13,17C13,16.48,13.07,15.98,13.2,15.5z"/><polygon points="20,16 20,13 18,13 18,16 15,16 15,18 18,18 18,21 19,21 20,21 20,18 23,18 23,16"/></g></g></svg>
                                </ListItemIcon>
                                <ListItemText>{driveTemplateMode === true ? 'Close ' : 'Create a '}Document</ListItemText>
                            </MenuItem>,
                            <MenuItem key={6}  onClick={onAttachmentOpenedFileAndEmail}  className={`iconItem`}>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><path d="M11 20H2.5A2.503 2.503 0 0 1 0 17.5v-13C0 3.122 1.122 2 2.5 2h19C22.878 2 24 3.122 24 4.5V18c0 .275-.225.5-.5.5s-.5-.225-.5-.5V4.5c0-.827-.673-1.5-1.5-1.5h-19C1.673 3 1 3.673 1 4.5v13c0 .827.673 1.5 1.5 1.5H11a.5.5 0 0 1 0 1z"/><path d="M12 14.03c-1.014 0-1.962-.425-2.67-1.194L3.122 6.048a.5.5 0 0 1 .739-.675l6.207 6.787c1.03 1.12 2.834 1.121 3.866-.001l6.195-6.777a.5.5 0 0 1 .739.675l-6.196 6.778c-.71.77-1.658 1.195-2.672 1.195z"/><path d="M3.492 17.215a.5.5 0 01-.337-.87l5.458-4.982a.499.499 0 11.675.738L3.83 17.084a.506.506 0 01-.338.131zM19.168 16a.495.495 0 01-.337-.131l-4.127-3.771a.5.5 0 11.675-.738l4.127 3.77a.5.5 0 01-.338.87z"/><path d="M20.542 22h-7.147A2.398 2.398 0 0 1 11 19.605v-.211a2.399 2.399 0 0 1 2.395-2.396h7.147A1.46 1.46 0 0 1 22 18.456c0 .887-.654 1.542-1.458 1.542H15a.5.5 0 0 1 0-1h5.542A.46.46 0 0 0 21 18.54c0-.336-.206-.542-.458-.542h-7.147c-.769 0-1.395.626-1.395 1.396v.211c0 .769.625 1.395 1.395 1.395h7.147A2.463 2.463 0 0 0 23 18.542C23 17.104 21.896 16 20.542 16H15c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h5.542A3.462 3.462 0 0 1 24 18.458C24 20.449 22.449 22 20.542 22z"/></svg>
                                </ListItemIcon>
                                <ListItemText>Email Open Document</ListItemText>
                            </MenuItem>,
                            <MenuItem  key={7}
                            onClick={() => {
                                handleClose()
                                props.setPatentAssets('Our Assets for Sale')
                                props.onClickSale(1)
                            }} className={`iconItem`}  selected={display_sales_assets}>
                                <ListItemIcon>
                                    <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/PatentSales2.svg" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Our Assets for Sale</ListItemText>
                            </MenuItem>   
                        ]
                    :
                        parseInt(profile?.user?.organisation?.subscribtion) == 1 
                        ?
                            [                            
                                <MenuItem key={8} className={`iconItem`} disabled>
                                    <ListItemIcon>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root customSVG" style={{width: 21, height: 21}} enableBackground="new 0 0 68 68" viewBox="0 0 68 68"><path d="M45.8 4.6L37.4 13c-3.9 3.9-4.7 10-2.1 14.7l-1.8 1.8c-.3.3-.4.7-.2 1.1s.5.6.9.6l2.5.1.1 2.5c0 .4.3.7.6.9.1 0 .2.1.4.1.3 0 .5-.1.7-.3l1.8-1.8c4.6 2.5 10.7 2 14.7-2.1l8.4-8.4c4.8-4.8 4.9-12.7 0-17.6C58.5-.2 50.7-.2 45.8 4.6zM39.4 30.8l-.8.8-.1-1.1c0-.5-.4-.9-.9-.9l-1.1-.1 9.3-9.3c.6-.6 1.6-.6 2.1 0 .6.6.6 1.5 0 2.1l-4.4 4.4L39.4 30.8zM49.3 18.7c-1.3-1.3-3.6-1.3-5 0l-3 3c0-1.2.5-2.3 1.4-3.2l8.4-8.4c1.9-1.9 4.9-1.9 6.8 0 1.9 1.9 1.9 4.9 0 6.8l-8.4 8.4c-.9.9-2 1.3-3.2 1.4l3-3C50.7 22.2 50.7 20 49.3 18.7zM61.9 20.8l-8.4 8.4c-3.3 3.3-8.1 3.8-11.9 2.1l2.8-2.8c2.2.5 4.7 0 6.4-1.8l8.4-8.4c2.6-2.6 2.6-7 0-9.6-2.7-2.7-6.9-2.7-9.6 0L41.4 17c-1.7 1.7-2.3 4.1-1.8 6.4l-2.8 2.8c-1.9-3.9-1.1-8.7 2-11.8l8.4-8.4C51.3 2 57.9 2 62 6.1 66 10.1 66 16.7 61.9 20.8zM30.6 55c3.9-3.9 4.7-10 2.1-14.7l1.8-1.8c.3-.3.4-.7.2-1.1-.1-.4-.5-.6-.9-.6l-2.5-.1-.1-2.5c0-.4-.3-.7-.6-.9-.4-.1-.8 0-1.1.2l-1.8 1.8c-1.8-1-3.9-1.5-6-1.5-3.3 0-6.4 1.3-8.8 3.6l-8.4 8.4c-4.9 4.9-4.9 12.7 0 17.6 4.9 4.9 12.7 4.8 17.6 0L30.6 55zM28.6 37.2L28.6 37.2l.8-.8.1 1.1c0 .5.4.9.9.9l1.1.1-9.3 9.3c-.6.6-1.6.6-2.1 0-.6-.6-.6-1.5 0-2.1l4.4-4.4 0 0L28.6 37.2zM18.7 49.3c1.4 1.4 3.6 1.4 5 0l3-3c0 1.2-.5 2.3-1.4 3.2L16.8 58C15 59.8 12 59.9 10 58c-1.9-1.9-1.9-4.9 0-6.8l8.4-8.4c.9-.9 2-1.3 3.2-1.4l-3 3C17.3 45.8 17.3 48 18.7 49.3zM6.1 62C2 57.9 2 51.3 6.1 47.2l8.4-8.4c2-2 4.6-3.1 7.4-3.1 1.6 0 3.1.3 4.5 1l-2.8 2.8c-.5-.1-1.1-.2-1.6-.2-1.8 0-3.5.7-4.8 2l-8.4 8.4c-2.6 2.6-2.7 6.9 0 9.6 2.7 2.7 7 2.6 9.6 0l8.4-8.4c1.7-1.7 2.4-4.1 1.8-6.4l2.8-2.8c1.9 3.9 1.1 8.7-2 11.8L20.8 62C16.8 66 10.2 66.1 6.1 62zM46.6 40.6c.5.1 1.1-.2 1.2-.7.1-.5-.2-1.1-.7-1.2l-4.4-1.1c-.5-.1-1.1.2-1.2.7-.1.5.2 1.1.7 1.2L46.6 40.6zM39.9 47.8c.5-.1.9-.7.7-1.2l-1.1-4.4c-.1-.5-.7-.9-1.2-.7-.5.1-.9.7-.7 1.2l1.1 4.4C38.8 47.6 39.4 47.9 39.9 47.8zM29.7 26.6c.5-.1.9-.7.7-1.2L29.3 21c-.1-.5-.7-.9-1.2-.7-.5.1-.9.7-.7 1.2l1.1 4.4C28.6 26.4 29.1 26.7 29.7 26.6zM25.4 30.4c.5.1 1.1-.2 1.2-.7.1-.5-.2-1.1-.7-1.2l-4.4-1.1c-.5-.1-1.1.2-1.2.7-.1.5.2 1.1.7 1.2L25.4 30.4z"/></svg> 
                                    </ListItemIcon>   
                                    <ListItemText>Broken Chain-of-Title</ListItemText>      
                                </MenuItem> ,
                                <MenuItem key={9} className={`iconItem`} disabled>
                                    <ListItemIcon>
                                        <FindInPageIcon/>
                                    </ListItemIcon> 
                                    <ListItemText>Locate Lost Assets</ListItemText>
                                </MenuItem>,
                                <MenuItem key={10} className={`iconItem`} disabled>
                                    <ListItemIcon>
                                        <svg viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><path d="M19,11c0.17,0,0.33,0.01,0.49,0.02L15,3H9l5.68,9.84C15.77,11.71,17.3,11,19,11z"/><polygon points="8.15,4.52 2,15.5 5,21 11.33,10.03"/><path d="M13.2,15.5H9.9L6.73,21h7.81C13.58,19.94,13,18.54,13,17C13,16.48,13.07,15.98,13.2,15.5z"/><polygon points="20,16 20,13 18,13 18,16 15,16 15,18 18,18 18,21 19,21 20,21 20,18 23,18 23,16"/></g></g></svg>
                                    </ListItemIcon>
                                    <ListItemText>{driveTemplateMode === true ? 'Close ' : 'Create a '}Document</ListItemText>
                                </MenuItem>,
                                <MenuItem key={11} className={`iconItem`} disabled>
                                    <ListItemIcon>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><path d="M11 20H2.5A2.503 2.503 0 0 1 0 17.5v-13C0 3.122 1.122 2 2.5 2h19C22.878 2 24 3.122 24 4.5V18c0 .275-.225.5-.5.5s-.5-.225-.5-.5V4.5c0-.827-.673-1.5-1.5-1.5h-19C1.673 3 1 3.673 1 4.5v13c0 .827.673 1.5 1.5 1.5H11a.5.5 0 0 1 0 1z"/><path d="M12 14.03c-1.014 0-1.962-.425-2.67-1.194L3.122 6.048a.5.5 0 0 1 .739-.675l6.207 6.787c1.03 1.12 2.834 1.121 3.866-.001l6.195-6.777a.5.5 0 0 1 .739.675l-6.196 6.778c-.71.77-1.658 1.195-2.672 1.195z"/><path d="M3.492 17.215a.5.5 0 01-.337-.87l5.458-4.982a.499.499 0 11.675.738L3.83 17.084a.506.506 0 01-.338.131zM19.168 16a.495.495 0 01-.337-.131l-4.127-3.771a.5.5 0 11.675-.738l4.127 3.77a.5.5 0 01-.338.87z"/><path d="M20.542 22h-7.147A2.398 2.398 0 0 1 11 19.605v-.211a2.399 2.399 0 0 1 2.395-2.396h7.147A1.46 1.46 0 0 1 22 18.456c0 .887-.654 1.542-1.458 1.542H15a.5.5 0 0 1 0-1h5.542A.46.46 0 0 0 21 18.54c0-.336-.206-.542-.458-.542h-7.147c-.769 0-1.395.626-1.395 1.396v.211c0 .769.625 1.395 1.395 1.395h7.147A2.463 2.463 0 0 0 23 18.542C23 17.104 21.896 16 20.542 16H15c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h5.542A3.462 3.462 0 0 1 24 18.458C24 20.449 22.449 22 20.542 22z"/></svg>
                                    </ListItemIcon>
                                    <ListItemText>Email Open Document</ListItemText>
                                </MenuItem>,
                                <MenuItem key={12} className={`iconItem`} disabled>
                                    <ListItemIcon>
                                        <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/PatentSales2.svg" variant="square" style={{width: 21, height: 21}}/>
                                    </ListItemIcon>
                                    <ListItemText>Our Assets for Sale</ListItemText>
                                </MenuItem>   
                            ]
                        :
                            ''
                }
                <Divider />
                <MenuItem key={13} className={classes.disableHover} >
                    <ListItemText><span className={clsx(parseInt(profile?.user?.organisation?.subscribtion) < 3 ? classes.disabled : '')}>Enterprise:</span> {parseInt(profile?.user?.organisation?.subscribtion) < 3 ? <Button variant="text">Upgrade</Button> : '' }</ListItemText>
                </MenuItem>
                {
                    parseInt(profile?.user?.organisation?.subscribtion) == 3 && link_assets_sheet_display === true && link_assets_selected.length > 0  && (
                        <MenuItem key={14} onClick={onHandleLinkAssetWithSheet}>
                            <ListItemText>Process Selections</ListItemText>
                        </MenuItem>
                    )
                }
                
                {
                    parseInt(profile?.user?.organisation?.subscribtion) === 3
                    ?

                        category == 'pay_maintainence_fee'
                        ?
                            maintainenceFrameMode === false 
                            ?
                                <MenuItem key={15} onClick={onHandleReviewMaintainenceFee}>
                                    <ListItemText>Process Selections</ListItemText>
                                </MenuItem>
                            :
                                [
                                    <MenuItem onClick={onMaintainenceFeeFile} key={`${category}_1`}>
                                        <ListItemText>Pay Maintenance Fees</ListItemText>
                                    </MenuItem>,
                                    <MenuItem  onClick={onHandleReviewMaintainenceFee} key={`${category}_2`}>
                                        <ListItemText>Cancel</ListItemText>
                                    </MenuItem>
                                ]
                        :
                            category == 'restore_ownership' || category == 'correct_details'
                            ?
                                [
                                    <MenuItem onClick={createTemplate} className={`iconItem`} key={`${category}_1`}>
                                        <ListItemIcon>
                                            <svg viewBox="0 0 24 24" className="MuiSvgIcon-root customSVG"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><path d="M19,11c0.17,0,0.33,0.01,0.49,0.02L15,3H9l5.68,9.84C15.77,11.71,17.3,11,19,11z"/><polygon points="8.15,4.52 2,15.5 5,21 11.33,10.03"/><path d="M13.2,15.5H9.9L6.73,21h7.81C13.58,19.94,13,18.54,13,17C13,16.48,13.07,15.98,13.2,15.5z"/><polygon points="20,16 20,13 18,13 18,16 15,16 15,18 18,18 18,21 19,21 20,21 20,18 23,18 23,16"/></g></g></svg>
                                        </ListItemIcon>
                                        <ListItemText>{driveTemplateMode === true ? 'Close ' : 'Create a '}Document</ListItemText>
                                    </MenuItem>,
                                    <MenuItem  onClick={onHandleSubmitToUSPTO} key={`${category}_2`}>
                                        <ListItemIcon>
                                            <img src={'/assets/images/logo-micro.png'} className={classes.uspto_logo}/>
                                        </ListItemIcon>
                                        <ListItemText>Submit to USPTO</ListItemText>
                                    </MenuItem>
                                ]
                            :
                            category == 'correct_address'
                            ?
                                addressQueuesDisplay === true   
                                ?
                                    [
                                        <MenuItem onClick={onHandleSubmitAddressUSPTO} key={`${category}_1`}>
                                            <ListItemIcon>
                                                <img src={'/assets/images/logo-micro.png'} className={classes.uspto_logo}/>
                                            </ListItemIcon>
                                            <ListItemText>Submit to USPTO</ListItemText>
                                        </MenuItem>,
                                        <MenuItem onClick={onHandleAddressCancel} key={`${category}_2`}>
                                            <ListItemText>Cancel</ListItemText>
                                        </MenuItem>
                                    ]
                                :
                                    [
                                        <MenuItem onClick={onCorrectAddress} key={`${category}_1`}>
                                            <ListItemText>Correct Addresses</ListItemText>
                                        </MenuItem>,
                                        <MenuItem onClick={onChangeAddress} key={`${category}_2`}>
                                            <ListItemText>Change Addresses</ListItemText>
                                        </MenuItem>
                                    ]
                            :
                            category == 'correct_names'
                            ?
                                [
                                    <MenuItem onClick={onHandleSubmitNamesUSPTO} key={`${category}_1`}>
                                        <ListItemIcon>
                                            <img src={'/assets/images/logo-micro.png'} className={classes.uspto_logo}/>
                                        </ListItemIcon>
                                        <ListItemText>Submit to USPTO</ListItemText>
                                    </MenuItem>,
                                    <MenuItem onClick={onChangeName} key={`${category}_2`}>
                                        <ListItemText>Change Name</ListItemText>
                                    </MenuItem>
                                ]
                            :
                                category == 'sell_payments'     
                                ?
                                    <MenuItem key={16} onClick={onSalesAssets}>
                                        <ListItemText>Select Assets and Click Here</ListItemText>
                                    </MenuItem>
                                :
                                    ''
                    :
                        ''
                }                
                {
                    parseInt(profile?.user?.organisation?.subscribtion) === 3
                    ?
                               
                        [   

                            <MenuItem key={17} className={`iconItem`}>
                                <ListItemIcon>
                                    <Avatar src="https://patentrack.com/wp-content/uploads/2022/01/MaintenanceFee.svg" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Pay Maintaince Fee</ListItemText>  
                            </MenuItem> ,    
                            <MenuItem key={18} className={`iconItem`}>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root customSVG" style={{width: 21, height: 21}} enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M72,22H47V8c0-0.55-0.45-1-1-1H34c-0.55,0-1,0.45-1,1v14H8c-0.55,0-1,0.45-1,1v49c0,0.55,0.45,1,1,1h64c0.55,0,1-0.45,1-1
                                    V23C73,22.45,72.55,22,72,22z M35,9h10v14v4H35v-4V9z M71,71H9V24h24v3h-1c-0.55,0-1,0.45-1,1s0.45,1,1,1h2h12h2c0.55,0,1-0.45,1-1
                                    s-0.45-1-1-1h-1v-3h24V71z"/><path d="M11 33v35c0 .55.45 1 1 1h56c.55 0 1-.45 1-1V33c0-.55-.45-1-1-1H12C11.45 32 11 32.45 11 33zM13 34h54v33H13V34zM40 17c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3S38.35 17 40 17zM40 13c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1S39.45 13 40 13z"/><path d="M32 38H16c-.55 0-1 .45-1 1v18c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V39C33 38.45 32.55 38 32 38zM17.08 56c.48-2.83 2.95-5 5.92-5h2c2.97 0 5.44 2.17 5.92 5H17.08zM25 49h-1-1c-2.39 0-4.53 1.06-6 2.73V40h14v11.73C29.53 50.06 27.39 49 25 49zM31 61H17c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1S31.55 61 31 61zM62 52H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 52 62 52zM62 47H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 47 62 47zM62 62H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 62 62 62zM62 57H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 57 62 57zM62 42H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 42 62 42zM62 37H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 37 62 37z"/><path d="M28,45c0-2.21-1.79-4-4-4s-4,1.79-4,4s1.79,4,4,4S28,47.21,28,45z M24,47c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2
                                    S25.1,47,24,47z"/></svg>
                                </ListItemIcon>
                                <ListItemText>Correct Names</ListItemText>
                            </MenuItem> ,                
                            <MenuItem key={19} className={`iconItem`}>
                                <ListItemIcon>
                                    <MailOutlineIcon/>
                                </ListItemIcon>
                                <ListItemText>Correct Addresses</ListItemText>
                            </MenuItem> ,                  
                            <MenuItem key={20} className={`iconItem`}>
                                <ListItemIcon>
                                    <LocationCityIcon/>
                                </ListItemIcon>
                                <ListItemText>Correct Correspondence</ListItemText>
                            </MenuItem>,
                            <MenuItem key={21} onClick={() => props.onClickSale(2)} className={`iconItem ${display_sales_assets === true ? 'active' : ''}`}>
                                <ListItemIcon>
                                    <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/store2.svg" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Patent Marketplace</ListItemText>
                            </MenuItem>,
                            <MenuItem key={22}>
                                <ListItemIcon>  
                                    <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/Bankers.svg" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Lenders Directory</ListItemText>
                            </MenuItem>,
                            <MenuItem key={23}>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root customSVG" style={{width: 21, height: 21}} viewBox="0 0 64 64"><g><path d="M37,30H27a5.006,5.006,0,0,1-5-5V14a1,1,0,0,1,1-1,3.85,3.85,0,0,0,4-4,1,1,0,0,1,2,0c0,.008.411,4,12,4a1,1,0,0,1,1,1V25A5.006,5.006,0,0,1,37,30ZM24,14.915V25a3,3,0,0,0,3,3H37a3,3,0,0,0,3-3V14.99c-6.783-.138-10.03-1.684-11.583-3.178A5.821,5.821,0,0,1,24,14.915Z"/><path d="M45,19H43V7a5.006,5.006,0,0,0-5-5H26a5.006,5.006,0,0,0-5,5V19H19V7a7.008,7.008,0,0,1,7-7H38a7.008,7.008,0,0,1,7,7Z"/><path d="M41 23V21a2 2 0 0 0 0-4V15a4 4 0 0 1 0 8zM23 23a4 4 0 0 1 0-8v2a2 2 0 0 0 0 4zM31 64H12a1 1 0 0 1-1-1V36a1 1 0 0 1 .876-.992L27 33.117V29h2v5a1 1 0 0 1-.876.992L13 36.883V62H31zM53 39H51V36.883L35.876 34.992A1 1 0 0 1 35 34V29h2v4.117l15.124 1.891A1 1 0 0 1 53 36zM62 64H34a1 1 0 0 1-1-1V43a1 1 0 0 1 1-1H62a1 1 0 0 1 1 1V63A1 1 0 0 1 62 64zM35 62H61V44H35z"/><path d="M56 43H54V40H44v3H42V39a1 1 0 0 1 1-1H55a1 1 0 0 1 1 1zM44 55H38a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 44 55zm-5-2h4V51H39zM58 55H52a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 58 55zm-5-2h4V51H53z"/><rect width="2" height="7" x="38" y="43"/><rect width="2" height="7" x="42" y="43"/><rect width="2" height="7" x="52" y="43"/><rect width="2" height="7" x="56" y="43"/><path d="M41 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 38 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 41 60zM55 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 52 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 55 60z"/><rect width="4" height="2" x="34" y="51"/><rect width="8" height="2" x="44" y="51"/><rect width="4" height="2" x="58" y="51"/><path d="M32,39a1,1,0,0,1-.707-.293l-4-4,1.414-1.414L32,36.586l3.293-3.293,1.414,1.414-4,4A1,1,0,0,1,32,39Z"/><path d="M34,41a1,1,0,0,1-.707-.293L32,39.414l-1.293,1.293a1,1,0,0,1-1.414,0l-4-4A1,1,0,0,1,25,36V34h2v1.586l3,3,1.293-1.293a1,1,0,0,1,1.414,0L34,38.586l3-3V34h2v2a1,1,0,0,1-.293.707l-4,4A1,1,0,0,1,34,41Z"/><rect width="2" height="17" x="17" y="46"/></g></svg>
                                </ListItemIcon>
                                <ListItemText>Lawyers Perfomance</ListItemText>
                            </MenuItem>,
                            <MenuItem key={24}>
                                <ListItemIcon>
                                    <Avatar src="https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Inventors Perfomance</ListItemText>
                            </MenuItem>
                        ]
                    :
                        [            
                            <MenuItem key={25} className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <Avatar src="https://patentrack.com/wp-content/uploads/2022/01/MaintenanceFee.svg" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Pay Maintaince Fee</ListItemText>
                            </MenuItem>     ,
                            <MenuItem key={26} className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root customSVG" style={{width: 21, height: 21}} enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M72,22H47V8c0-0.55-0.45-1-1-1H34c-0.55,0-1,0.45-1,1v14H8c-0.55,0-1,0.45-1,1v49c0,0.55,0.45,1,1,1h64c0.55,0,1-0.45,1-1
                                    V23C73,22.45,72.55,22,72,22z M35,9h10v14v4H35v-4V9z M71,71H9V24h24v3h-1c-0.55,0-1,0.45-1,1s0.45,1,1,1h2h12h2c0.55,0,1-0.45,1-1
                                    s-0.45-1-1-1h-1v-3h24V71z"/><path d="M11 33v35c0 .55.45 1 1 1h56c.55 0 1-.45 1-1V33c0-.55-.45-1-1-1H12C11.45 32 11 32.45 11 33zM13 34h54v33H13V34zM40 17c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3S38.35 17 40 17zM40 13c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1S39.45 13 40 13z"/><path d="M32 38H16c-.55 0-1 .45-1 1v18c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V39C33 38.45 32.55 38 32 38zM17.08 56c.48-2.83 2.95-5 5.92-5h2c2.97 0 5.44 2.17 5.92 5H17.08zM25 49h-1-1c-2.39 0-4.53 1.06-6 2.73V40h14v11.73C29.53 50.06 27.39 49 25 49zM31 61H17c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1S31.55 61 31 61zM62 52H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 52 62 52zM62 47H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 47 62 47zM62 62H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 62 62 62zM62 57H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 57 62 57zM62 42H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 42 62 42zM62 37H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 37 62 37z"/><path d="M28,45c0-2.21-1.79-4-4-4s-4,1.79-4,4s1.79,4,4,4S28,47.21,28,45z M24,47c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2
                                    S25.1,47,24,47z"/></svg>
                                </ListItemIcon>
                                <ListItemText>Correct Names</ListItemText>
                            </MenuItem> ,             
                            <MenuItem  key={27}className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <MailOutlineIcon/>
                                </ListItemIcon>
                                <ListItemText>Correct Addresses</ListItemText>
                            </MenuItem> ,                  
                            <MenuItem key={28} className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <LocationCityIcon/>
                                </ListItemIcon>
                                <ListItemText>Correct Correspondence</ListItemText>
                            </MenuItem>,
                            <MenuItem key={29} className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/store2.svg" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Patent Marketplace</ListItemText>
                            </MenuItem>,
                            <MenuItem key={30} className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <Avatar  src="https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/Bankers.svg" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Lenders Directory</ListItemText>
                            </MenuItem>,
                            <MenuItem key={31} className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root customSVG" style={{width: 21, height: 21}} viewBox="0 0 64 64"><g><path d="M37,30H27a5.006,5.006,0,0,1-5-5V14a1,1,0,0,1,1-1,3.85,3.85,0,0,0,4-4,1,1,0,0,1,2,0c0,.008.411,4,12,4a1,1,0,0,1,1,1V25A5.006,5.006,0,0,1,37,30ZM24,14.915V25a3,3,0,0,0,3,3H37a3,3,0,0,0,3-3V14.99c-6.783-.138-10.03-1.684-11.583-3.178A5.821,5.821,0,0,1,24,14.915Z"/><path d="M45,19H43V7a5.006,5.006,0,0,0-5-5H26a5.006,5.006,0,0,0-5,5V19H19V7a7.008,7.008,0,0,1,7-7H38a7.008,7.008,0,0,1,7,7Z"/><path d="M41 23V21a2 2 0 0 0 0-4V15a4 4 0 0 1 0 8zM23 23a4 4 0 0 1 0-8v2a2 2 0 0 0 0 4zM31 64H12a1 1 0 0 1-1-1V36a1 1 0 0 1 .876-.992L27 33.117V29h2v5a1 1 0 0 1-.876.992L13 36.883V62H31zM53 39H51V36.883L35.876 34.992A1 1 0 0 1 35 34V29h2v4.117l15.124 1.891A1 1 0 0 1 53 36zM62 64H34a1 1 0 0 1-1-1V43a1 1 0 0 1 1-1H62a1 1 0 0 1 1 1V63A1 1 0 0 1 62 64zM35 62H61V44H35z"/><path d="M56 43H54V40H44v3H42V39a1 1 0 0 1 1-1H55a1 1 0 0 1 1 1zM44 55H38a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 44 55zm-5-2h4V51H39zM58 55H52a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 58 55zm-5-2h4V51H53z"/><rect width="2" height="7" x="38" y="43"/><rect width="2" height="7" x="42" y="43"/><rect width="2" height="7" x="52" y="43"/><rect width="2" height="7" x="56" y="43"/><path d="M41 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 38 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 41 60zM55 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 52 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 55 60z"/><rect width="4" height="2" x="34" y="51"/><rect width="8" height="2" x="44" y="51"/><rect width="4" height="2" x="58" y="51"/><path d="M32,39a1,1,0,0,1-.707-.293l-4-4,1.414-1.414L32,36.586l3.293-3.293,1.414,1.414-4,4A1,1,0,0,1,32,39Z"/><path d="M34,41a1,1,0,0,1-.707-.293L32,39.414l-1.293,1.293a1,1,0,0,1-1.414,0l-4-4A1,1,0,0,1,25,36V34h2v1.586l3,3,1.293-1.293a1,1,0,0,1,1.414,0L34,38.586l3-3V34h2v2a1,1,0,0,1-.293.707l-4,4A1,1,0,0,1,34,41Z"/><rect width="2" height="17" x="17" y="46"/></g></svg>
                                </ListItemIcon>
                                <ListItemText>Lawyers Perfomance</ListItemText>
                            </MenuItem>,
                            <MenuItem key={32} className={`iconItem`} disabled>
                                <ListItemIcon>
                                    <Avatar src="https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png" variant="square" style={{width: 21, height: 21}}/>
                                </ListItemIcon>
                                <ListItemText>Inventors Perfomance</ListItemText>
                            </MenuItem>
                        ] 
                }
            </Menu>
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