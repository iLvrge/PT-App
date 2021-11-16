import React, { useEffect, useState, useCallback } from "react"

import { useDispatch, useSelector } from 'react-redux'

import { 
    useHistory,
  } from 'react-router-dom'  

import { Grid} from '@material-ui/core'

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'

import clsx from 'clsx'
import useStyles from './styles'

import NewHeader from '../../components/NewHeader'
import Loader from '../../components/common/Loader'

import MobileScreen from '../../components/MobileScreen'

import NavigationIcon from '../../components/NavigationIcon'
import MobileHeader from '../../components/MobileHeader'
import MobileFooter from '../../components/MobileFooter'

import { loginRedirect } from  '../../utils/tokenStorage'
import { editorBar } from  '../../utils/splitpane'
import { 
    setBreadCrumbs,
    setAssetTypesAssignmentsLoading,
    setAssetTypeAssignments,
    setSearchRfIDs,
    setAssetTypeInventor,
    setAssetTypeCompanies,
    setAllAssetTypes,
    setAssetTypesSelect
} from '../../actions/patentTrackActions2' 

import { 
    setConnectionBoxView,
    setPDFView,
} from '../../actions/patenTrackActions'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode, toggleLifeSpanMode } from '../../actions/uiActions'

import PatenTrackApi from '../../api/patenTrack2' 

const GlobalLayout = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const [ openBar, setOpenBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? false : true)
    const [ openTypeBar, setTypeOpenBar ] = useState(false)
    const [ openOtherPartyBar, setOtherPartyOpenBar ] = useState(false)
    const [ openInventorBar, setInventorOpenBar ] = useState(false)
    const [ openAssignmentBar, setAssignmentOpenBar ] = useState(false) 
    const [ openCustomerBar, setCustomerOpenBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? true : false)
    const [ openIllustrationBar, setIllustrationBar ] = useState(true)
    const [ openCommentBar, setCommentBar ] = useState(isMobile ? false : true)
    const [ openChartBar, setChartBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? isMobile ? false : true : false)
    const [ openAnalyticsBar, setAnalyticsBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? isMobile ? false : true : false)
    const [ openVisualizerBar, setVisualizeOpenBar ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? isMobile ? false : true : false)

    const [ toggleButtonType, setToggleButtonType ] = useState(true)
    const [ toggleTypeButtonType, setToggleTypeButtonType ] = useState(true)
    const [ toggleOtherPartyButtonType, setToggleOtherPartyButtonType ] = useState(true)
    const [ toggleAssignmentButtonType, setToggleAssignmentButtonType ] = useState(true)
    const [ toggleCustomerButtonType, setToggleCustomerButtonType ] = useState(true)  
    const DEFAULT_SCREEN_SIZE = {
        companyBar: 210,
        typeBar: 0,
        otherPartyBar: 0,
        assignmentBar: 0,
        customerBar: 210,
        driveTemplateBar: 200,
        assetFileBar: 0,
        commentBar: '30%',
        illustrationBar: '50%',
        visualizeBar: '0%',
        bar100: '100%',
        bar50: '50%'
    }
    
    const [ companyBarSize, setCompanyBarSize ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? 0 : 210) 
    const [ typeBarSize, setTypeBarSize ] = useState(0) 
    const [ otherPartyBarSize, setOtherPartyBarSize ] = useState(0)
    const [ partyBarSize, setPartyBarSize ] = useState('50%')
    const [ driveBarSize, setDriveBarSize ] = useState('50%')
    const [ assignmentBarSize, setAssignmentBarSize ] = useState(0)  
    const [ addressBarSize, setAddressBarSize ] = useState(450)
    const [ customerBarSize, setCustomerBarSize ] = useState(180)
    const [ commentBarSize , setCommentBarSize ] = useState('30%')
    const [ illustrationBarSize , setIllustrationBarSize ] = useState('50%')
    const [ visualizerBarSize , setVisualizerBarSize ] = useState(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? '30%' : '0%')

    const [ assetTableFocus, setAssetTableFocus ] = useState( false )
    const [ companyButtonVisible, setCompanyButtonVisible ] = useState(false)
    const [ typeButtonVisible, setTypeButtonVisible ] = useState(false)
    const [ otherPartyButtonVisible, setOtherPartyButtonVisible ] = useState(false)
    const [ assignmentButtonVisible, setAssignmentButtonVisible ] = useState(false)
    const [ customerButtonVisible, setCustomerButtonVisible ] = useState(false)

    const [ assetFilesBarSize, setAssetFilesBarSize ] = useState(0)
    const [ assetFilesBar, setAssetFilesBar ] = useState(false)
    const [ openGoogleDriveBar, setGoogleDriveBar] = useState(false)
    const [ toggleAssetFileButtonType, setToggleAssetFileButtonType ] = useState(true)

    const [ driveTemplateBarSize, setDriveTemplateBarSize ] = useState(200)

    const [ isDrag, setIsDrag ] = useState(false)
    const [ size, setSize] = useState(0)
    const [ illustrationRecord, setIllustrationRecord ] = useState()
    const authenticated = useSelector(store => store.auth.authenticated)
    
    const search_string = useSelector(state => state.patenTrack2.search_string)
    const driveTemplateFrameMode = useSelector(state => state.ui.driveTemplateFrameMode)
    const driveTemplateMode = useSelector(state => state.ui.driveTemplateMode)

    const usptoMode = useSelector(state => state.ui.usptoMode)
    const familyMode = useSelector(state => state.ui.familyMode)
    const familyItemMode = useSelector(state => state.ui.familyItemMode)
    const lifeSpanMode = useSelector(state => state.ui.lifeSpanMode)
    const pdfView = useSelector(state => state.patenTrack.pdfView)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)

    useEffect(() => {
        editorBar() // run to find editor width
        window.addEventListener("resize", editorBar) // add on resize window 
        return () => window.removeEventListener("resize", editorBar)
    }, [])

    useEffect(() => {
        if( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
            dispatch(toggleLifeSpanMode(true))
        }
    }, [])


    useEffect(() => {
        /* if(props.type !== 9) {
            window.addEventListener('keydown', handleKeyEvent)
            return () => window.removeEventListener("keydown", handleKeyEvent)
        } */
        window.addEventListener('keydown', handleKeyEvent)
        return () => window.removeEventListener("keydown", handleKeyEvent)
    }, [])

    useEffect(() => {
        if( openIllustrationBar === false && openCommentBar === false && openChartBar === false && openAnalyticsBar === false ) {
            
            if( openGoogleDriveBar === true || assetFilesBar === true ) {
                setAssetFilesBarSize('100%')
                if(openCustomerBar === true && customerBarSize === '100%') {
                    setCustomerBarSize(180)
                }
                if(openAssignmentBar === true && assignmentBarSize === '100%') {
                    setAssignmentBarSize(120)
                }
                if ((openOtherPartyBar === true || openInventorBar === true) && otherPartyBarSize === '100%') {
                    setOtherPartyBarSize(120)
                }
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openCustomerBar === true) {
                setCustomerBarSize('100%')
                if(openAssignmentBar === true && assignmentBarSize === '100%') {
                    setAssignmentBarSize(120)
                }
                if ((openOtherPartyBar === true || openInventorBar === true) && otherPartyBarSize === '100%') {
                    setOtherPartyBarSize(120)
                }
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openAssignmentBar === true) {
                setAssignmentBarSize('100%')
                if ((openOtherPartyBar === true || openInventorBar === true) && otherPartyBarSize === '100%') {
                    setOtherPartyBarSize(120)
                }
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openOtherPartyBar === true || openInventorBar === true) {
                setOtherPartyBarSize('100%')
                if ( openTypeBar === true && typeBarSize === '100%' ) {
                    setTypeBarSize(120)
                }
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if (openTypeBar === true ) {
                setTypeBarSize('100%')
                if (openBar === true && companyBarSize === '100%') {
                    setCompanyBarSize(210)
                }
            } else if(selectedCategory == 'correct_names' || selectedCategory == 'correct_address') {
                setAddressBarSize('100%')
            } else if (openBar === true ) {
                setCompanyBarSize('100%')                
            }
        }  else {
            if(assetFilesBarSize === '100%' && (openGoogleDriveBar === true || assetFilesBar === true)){
                setAssetFilesBarSize(200)
            } else if(customerBarSize === '100%') {
                setCustomerBarSize(180)
            } else if(assignmentBarSize === '100%') {
                setAssignmentBarSize(120)
            } else if(otherPartyBarSize === '100%') {
                setOtherPartyBarSize(120)
            } else if(typeBarSize === '100%') {
                setTypeBarSize(120)
            } else if(addressBarSize === '100%' && (selectedCategory == 'correct_names' || selectedCategory == 'correct_address')) {
                setAddressBarSize(450)
            } else if(companyBarSize === '100%') {
                setCompanyBarSize(210)
            }
        }
    }, [ openIllustrationBar, openCommentBar, openChartBar, openAnalyticsBar, openGoogleDriveBar, assetFilesBar, openCustomerBar, openAssignmentBar, openOtherPartyBar, openInventorBar, openTypeBar, openBar  ])
    
    // When we are in search route disable company, activites, parties icons

    useEffect(() => {
        /* dispatch(setBreadCrumbs( props.type == 0 ? 'Maintenance > Pay Maintenance Fee' : props.type == 2 ? 'Search' : 'Due Dilligence > Review')) */
        if( props.type === 2 ) { 
            setOpenBar( false ) //company
            setTypeOpenBar( false ) //activites
            setOtherPartyOpenBar( false ) // parties
            setCustomerOpenBar( true ) //assets
            setAssignmentOpenBar( true ) //transactions
            setVisualizerBarSize('30%')

            setChartBar(true)
            setAnalyticsBar(true)
            setCompanyBarSize(0) // company bar size
            setCustomerBarSize(180)
            setAssignmentBarSize(120)


            dispatch(setConnectionBoxView( false ))
            dispatch(setPDFView( false ))
            dispatch(toggleUsptoMode( false ))
            dispatch(toggleFamilyMode( true ))
            dispatch(toggleFamilyItemMode( true ))
            dispatch(setBreadCrumbs( 'Search' ))
        }
    }, [ dispatch, props.type ])

    

// get search data from server
    useEffect(() => {
        const searchData = async () => {            
            if( search_string && search_string != '' ) {
                dispatch( setAssetTypesAssignmentsLoading( true ) )
                const { data } = await PatenTrackApi.getSearch(search_string)
                dispatch( setAssetTypesAssignmentsLoading( false ) )
                if( data && data != null ) {
                    dispatch(setAssetTypeAssignments( data, true ))      
                    dispatch(setSearchRfIDs( data.txn_ids ))  
                }
            }
        }        
        searchData()
    }, [ search_string ])



    useEffect(() => {
        let barSize = '50%';
        if(openChartBar === false && openAnalyticsBar === true) {
            barSize = '100%'
        } else if((openChartBar === true && openAnalyticsBar === false) || ( openChartBar === false && openAnalyticsBar === false )) {
            barSize = 0         
        }
        setIllustrationBarSize(barSize) 
    }, [ openChartBar, openAnalyticsBar ])

    useEffect(() => {
        setDriveTemplateBarSize( driveTemplateMode === true ? 200 : 0)
        editorBar()
    }, [ driveTemplateMode ])

    const handleKeyEvent = (event) => {
        //event.preventDefault()
        if(event.key === 'ArrowDown' || event.key === 'ArrowUp' ) {
            let tableContainer = document.getElementById('assets_type_assignment_all_assets'), findActiveRow = null
            if(tableContainer !== null) {
                findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                if(findActiveRow === null) {
                    tableContainer = document.getElementById('assets_assignments')
                    if(tableContainer !== null) {
                        findActiveRow = tableContainer.querySelector('.ReactVirtualized__Table__row.Mui-selected')
                    }
                }
            }

            if(findActiveRow !== null) {
                const classList = findActiveRow.className.split(/\s+/);
                const findClass = classList.filter( c => c.indexOf('rowIndex_') !== -1 ? c : '')
                if(findClass.length > 0) {
                    let index = findClass[0].toString().replace('rowIndex_', '')
                    if(index !== '' && !isNaN(index)){
                        index = Number(index) 
                        if (event.key === 'ArrowUp' ) {
                            index = index - 1 
                        } else if(event.key === 'ArrowDown') {
                            index = index + 1 
                        }
                    }
                    if(index >= 0) {
                        const findNextRow =  tableContainer.querySelector(`.rowIndex_${index}`)
                        if(findNextRow !== null) {
                            findNextRow.click()  
                        }
                    }
                }
            }
        }
    }

    const handleCompanyBarOpen = (event) => {
        if(props.type === 9) {
            history.push('/')
        }
        setToggleButtonType( !toggleButtonType )
        setOpenBar( !openBar )
        if(!openBar === false) {
            setCompanyBarSize(0)  
        } else {
            setCompanyBarSize(210)
            if(isMobile){ 
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )

            }
        }
        editorBar()
    }

    const handleTypeBarOpen = (event) => { 
        setToggleTypeButtonType( !toggleTypeButtonType )
        setTypeOpenBar( !openTypeBar )
        if(!openTypeBar === false) {
            setTypeBarSize(0)
        } else {
            setTypeBarSize(120)
            if(isMobile){
                setOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const handleOtherPartyBarOpen = (event) => {
        setToggleOtherPartyButtonType( !toggleOtherPartyButtonType )
        setOtherPartyOpenBar( !openOtherPartyBar )
        if(!openOtherPartyBar === false && openInventorBar === false) {
            setOtherPartyBarSize(0)
        } else {
            setOtherPartyBarSize(120)
            if(openInventorBar === false) {
                setPartyBarSize('100%')
            } else if(!openOtherPartyBar === false){
                setPartyBarSize('0%')
            } else {
                setPartyBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const updateAssetTypeSelected = async(activityID) => {
        const form = new FormData();
        form.append('activity_id', activityID)

        const { status } = await PatenTrackApi.updateAssetTypeSelected(form)
    }

    const handleInventorBarOpen = (event) => {
        setToggleOtherPartyButtonType( !toggleOtherPartyButtonType )
        setInventorOpenBar( !openInventorBar )
        if(!openInventorBar === false && openOtherPartyBar === false) {
            setOtherPartyBarSize(0)
            dispatch( setAssetTypeInventor({list: [], total_records: 0}))
        } else {
            setOtherPartyBarSize(120)
            if(openOtherPartyBar === false) {
                setPartyBarSize('0%')
            } else if(!openInventorBar === false){
                setPartyBarSize('100%')
            } else {
                setPartyBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setAssignmentOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
            dispatch( setAssetTypeInventor({list: [], total_records: 0}))
            dispatch( setAssetTypeAssignments({ list: [], total_records: 0 }) )
            dispatch( setAssetTypeCompanies({ list: [], total_records: 0 }) )
            dispatch( setAllAssetTypes( false ) )
            dispatch( setAssetTypesSelect([10]) )  
            updateAssetTypeSelected( 10 )  
        }
        editorBar()
    }

    const handleAssignmentBarOpen = (event) => {
        setToggleAssignmentButtonType( !toggleAssignmentButtonType )
        setAssignmentOpenBar( !openAssignmentBar )
        if(!openAssignmentBar === false) {
            setAssignmentBarSize(0)
        } else {
            setAssignmentBarSize(120) 
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setCustomerOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const handleCustomersBarOpen = (event) => {
        setToggleCustomerButtonType( !toggleCustomerButtonType )
        setCustomerOpenBar( !openCustomerBar )
        if(!openCustomerBar === false) {
            setCustomerBarSize(0)
            /* dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))
            dispatch(setMaintainenceAssetsList({list: [], total_records: 0}, false)) */
        } else {
            setCustomerBarSize(180)
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                setAssetFilesBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }

    const handleAssetFileBarOpen = (event) => {
        setToggleAssetFileButtonType( !toggleAssetFileButtonType )
        setAssetFilesBar( !assetFilesBar )
        if(!assetFilesBar === false && openGoogleDriveBar === false) {
            setAssetFilesBarSize(0)
        } else {
            setAssetFilesBarSize(200)
            if(openGoogleDriveBar === false) {
                setDriveBarSize('100%')
            } else if(!assetFilesBar === false){
                setDriveBarSize('0%')
            } else {
                setDriveBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                //setCustomerOpenBar( false )
                setGoogleDriveBar( false )                
            }
        }
        editorBar()
    }   
 
    const handleGoogleDriveBarOpen = (event) => {
        setToggleAssetFileButtonType( !toggleAssetFileButtonType )
        setGoogleDriveBar( !openGoogleDriveBar )
        if(!openGoogleDriveBar === false && assetFilesBar === false) {
            setAssetFilesBarSize(0)
        } else {
            setAssetFilesBarSize(200)
            if(assetFilesBar === false) {
                setDriveBarSize('0%')
            } else if(!openGoogleDriveBar === false){
                setDriveBarSize('100%')
            } else {
                setDriveBarSize('50%')
            }
            if(isMobile){
                setOpenBar( false )
                setTypeOpenBar( false )
                setOtherPartyOpenBar( false )
                setInventorOpenBar( false )
                setAssignmentOpenBar( false )
                //setCustomerOpenBar( false )
                setAssetFilesBar( false )                
            }
        }
        editorBar()
    }

    const changeVisualBar = (chart, analytics, comment, illustration) => {
        let barOpen = true, barSize = '30%'        
        if(chart === false && analytics === false && (comment === true || illustration === true)){
            barSize = '0%'
            barOpen = false
        } else if (comment === false && illustration === false && ( chart === true ||  analytics === true )) {
            barSize = '100%'
        }
        if(barSize === '30%' && ((comment === true || illustration === true) || (chart === true || analytics === true)) ){
            if( visualizerBarSize !== '0%' &&  visualizerBarSize !== '30%' &&  visualizerBarSize !== '100%' ) {
                barSize = visualizerBarSize
            }
        }
        
        if(chart === true && barOpen === true && barSize == '30%') {
            checkPDFHeight()
        }    
        editorBar()
        setVisualizeOpenBar(barOpen)  
        setVisualizerBarSize(barSize)
    } 

    const handleIllustrationBarOpen = () => {
        let bar = openIllustrationBar, barSize = '30%'
        setIllustrationBar( !bar )
        if(!bar === false && openCommentBar === true) {
            barSize = '100%'

        } else if((!bar === false && openCommentBar === false) || (!bar === true && openCommentBar === false)) {
            barSize = 0  
            
        }
        if(!bar === true) {
            if(isMobile) {
                setCommentBar(false)
                setChartBar(false)
                setAnalyticsBar(false)
            }            
        }
        setCommentBarSize(barSize)
        changeVisualBar(openChartBar, openAnalyticsBar, openCommentBar, !bar)
    }

    const handleCommentBarOpen = () => {
        let bar = openCommentBar, barSize = '30%'
        setCommentBar( !bar )
        if((!bar === false && openIllustrationBar === false) || (!bar === false && openIllustrationBar === true)) {
            barSize = 0    

        } else if(!bar === true && openIllustrationBar === false) {
            barSize = '100%'

        }
        if(!bar === true) {
            if(isMobile) {
                setIllustrationBar(false)
                setChartBar(false)
                setAnalyticsBar(false)
            }            
        }
        setCommentBarSize(barSize)
        changeVisualBar(openChartBar, openAnalyticsBar, !bar, openIllustrationBar)
    }

    const handleChartBarOpen = () => { 
        let bar = openChartBar, barSize = '50%'
        setChartBar( !bar )
        if(!bar === false && openAnalyticsBar === true) {
            barSize = '100%'
        } else if((!bar === true && openAnalyticsBar === false) || ( !bar === false && openAnalyticsBar === false )) {
            barSize = 0      
        }
        if(!bar === true) {
            if(isMobile) {
                setIllustrationBar(false)
                setCommentBar(false)
                setAnalyticsBar(false)
            }            
        }
        setIllustrationBarSize(barSize)  
        if(usptoMode === false && lifeSpanMode === false && familyItemMode === false && pdfView === false && !bar === true) {
            dispatch( toggleLifeSpanMode( true ) )
        }
        changeVisualBar(!bar, openAnalyticsBar, openCommentBar, openIllustrationBar)
    }

    const handleAnalyticsBarOpen = () => {
        let bar = openAnalyticsBar, barSize = '50%'
        setAnalyticsBar( !bar )
        if((!bar === false && openChartBar === false) || (openChartBar === true && !bar === false)) {
            barSize = 0 

        } else if((!bar === false && openChartBar === true) || (!bar === true && openChartBar === false ) ) {
            barSize = '100%'

        }   
        if(!bar === true) {
            if(isMobile) {
                setIllustrationBar(false)
                setCommentBar(false)
                setChartBar(false)
            }            
        }
        if(usptoMode === false && lifeSpanMode === false && familyMode === false && pdfView === false && !bar === true) {
            dispatch( toggleLifeSpanMode( true ) )
        }    

        setIllustrationBarSize(barSize)
        changeVisualBar(openChartBar, !bar, openCommentBar, openIllustrationBar)
    }

    const checkPDFHeight = () => {
        /* setTimeout(() => {
            const parentElement = document.getElementById('pdfViewer')
            if(parentElement != null) {
                const iframeElement = parentElement.querySelector(`iframe`)
                if(iframeElement != null) {
                    const height = parentElement.parentNode.clientHeight
                    iframeElement.style.height = height - 43 + 'px'
                    parentElement.style.height = '100%'
                }
            }
        }, 1000)  */        
    } 

    const openAnalyticsAndCharBar = () => {
        setChartBar( true )
        setAnalyticsBar( true )
        setIllustrationBarSize( '50%' )
        changeVisualBar(true, true, openCommentBar, openIllustrationBar)
    }

    const closeAnalyticsAndCharBar = () => {  
        setChartBar( false )
        setAnalyticsBar( false )
        setIllustrationBarSize( '50%' )
        changeVisualBar(false, false, openCommentBar, openIllustrationBar)
    }

    const handleCompanyButton = (event, flag) => {
        event.preventDefault()
        setCompanyButtonVisible( flag )
    }

    const handleTypeButton = (event, flag) => {
        event.preventDefault()
        setTypeButtonVisible( flag )
    }

    const handleOtherPartyButton = (event, flag) => {
        event.preventDefault()
        setOtherPartyButtonVisible( flag )
    }

    const handleAssignmentButton = (event, flag) => {
        event.preventDefault()
        setAssignmentButtonVisible( flag )
    }

    const handleCustomerButton = (event, flag) => {
        event.preventDefault()
        setCustomerButtonVisible( flag )
    }

    const checkChartAnalytics = (pdfFile, connectionBoxData, usptoMode) => {
        if( pdfFile != null && Object.keys(pdfFile).length > 0 ) {
            setChartBar( true )
            setVisualizeOpenBar( true )
            setVisualizerBarSize(prevItem =>{
                if(prevItem == '0%') {
                    return  '30%'
                } else {
                    return prevItem
                }
            })
        }

        if( connectionBoxData != null && Object.keys(connectionBoxData).length > 0 ) {  
            setVisualizeOpenBar( true )
            setVisualizerBarSize(prevItem =>{
                if(prevItem == '0%') {
                    return  '30%'
                } else {
                    return prevItem
                }
            })

            setAnalyticsBar( true )
            setChartBar( true ) 
            setIllustrationBarSize('50%')

        }

        if( typeof usptoMode != undefined && usptoMode === true ) {
            setVisualizeOpenBar( true )
            setVisualizerBarSize(prevItem =>{
                if(prevItem == '0%') {
                    return  '30%'
                } else {
                    return prevItem
                }
            })
            setAnalyticsBar( true ) 
            if(openChartBar === false) {
                setIllustrationBarSize('100%')
            } else {
                setIllustrationBarSize('50%')
            }
        }
    }

    const handleOpenSettings = useCallback(() => {
        history.push('/settings/templates')
    }, [ history ])

    const handleAlertPop = () => {
        alert('Message....')
    }    

    const topToolBar = [
        {
            tooltip: 'Settings',
            bar: false,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleOpenSettings,
            t: 0,
            label: 'Settings',
            margin: true,
        },
        {
            tooltip: 'Filter by Companies',
            bar: props.type === 9 ? false : openBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleCompanyBarOpen,
            t: 1,
            label: 'Companies',
            ...(props.type === 9 && {highlight: false})
        },
        {
            tooltip: 'Filter by Activities',
            bar: openTypeBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleTypeBarOpen,
            t: 2,
            label: 'Filter by Activities',
            ...(props.type === 9 && {disabled: true})
        },
        {
            tooltip: 'Filter by Parties',
            bar: openOtherPartyBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleOtherPartyBarOpen,
            t: 3,
            label: 'Select Parties',
            ...(props.type === 9 && {disabled: true})
        },
        {
            tooltip: 'Filter by Employees', 
            bar: openInventorBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleInventorBarOpen,
            t: 11,
            margin: true,
            label: 'Employees',
            ...(props.type === 9 && {disabled: true})
        },
        {
            tooltip: 'Filter by Transactions',
            bar: openAssignmentBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleAssignmentBarOpen,
            t: 4,
            label: 'Transactions',
            ...(props.type === 9 && {disabled: true})
        },
        {
            tooltip: 'Assets',
            bar: openCustomerBar,
            click: handleCustomersBarOpen,
            t: 5,
            margin: true,
            label: 'Assets' 
        },
        {
            tooltip: 'Recorded Documents',
            bar: assetFilesBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleAssetFileBarOpen,
            t: 10,
            label: 'Recorded Documents',
            ...(props.type === 9 && {disabled: true})
        },
        {
            tooltip: 'Initiated Documents',
            bar: openGoogleDriveBar,
            click: process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? handleAlertPop : handleGoogleDriveBarOpen,
            t: 12,
            label: 'Initiated Documents',
            ...(props.type === 9 && {disabled: true})
        },
    ]

    const bottomToolBar = [
        {
            tooltip: 'Illustration',
            bar: openIllustrationBar,
            click: handleIllustrationBarOpen,
            t: 6,
            label: 'Illustration'
        },
        {
            tooltip: 'Team Discussion',
            bar: openCommentBar,
            click: handleCommentBarOpen,
            t: 7,
            label: 'Team Discussion'
        },
        {
            tooltip: 'Charts',
            bar: openChartBar,
            click: handleChartBarOpen,
            t: 8,
            label: 'Charts'
        },
        {
            tooltip: 'Analytics',
            bar: openAnalyticsBar,
            click: handleAnalyticsBarOpen,
            t: 9,
            label: 'Analytics'
        }
    ]

    const mobileWrapper = [{
        component: MobileScreen,
        type: props.type,
        isMobile: isMobile,
        companyBarSize,
        setCompanyBarSize,
        handleCompanyButton,
        handleCompanyBarOpen,
        toggleButtonType,
        companyButtonVisible,
        visualizerBarSize,
        setVisualizerBarSize,
        setVisualizeOpenBar,
        openBar,
        openTypeBar,
        typeBarSize,
        setTypeBarSize,
        handleTypeButton,
        handleTypeBarOpen,
        toggleTypeButtonType,
        typeButtonVisible,
        openOtherPartyBar,
        openInventorBar,
        openGoogleDriveBar,
        otherPartyBarSize,
        setOtherPartyBarSize,
        handleOtherPartyButton,
        handleOtherPartyBarOpen,
        partyBarSize,
        driveBarSize,
        toggleOtherPartyButtonType,
        otherPartyButtonVisible,
        assignmentBarSize,
        setAssignmentBarSize,
        addressBarSize,
        setAddressBarSize,
        handleAssignmentButton,
        openAssignmentBar,
        handleAssignmentBarOpen,
        toggleAssignmentButtonType,
        assignmentButtonVisible,
        customerBarSize,
        setCustomerBarSize,
        handleCustomerButton,
        openCustomerBar,
        handleCustomersBarOpen,
        toggleCustomerButtonType,
        customerButtonVisible,
        commentBarSize,
        setCommentBarSize,
        openCommentBar,
        openIllustrationBar,
        handleChartBarOpen,
        handleAnalyticsBarOpen,
        setIsDrag,
        isDrag,
        setSize,
        size,
        illustrationRecord,
        setIllustrationRecord,
        illustrationBarSize,
        setIllustrationBarSize,
        openChartBar,
        openAnalyticsBar,
        openVisualizerBar,
        setAnalyticsBar,
        setChartBar,
        openAnalyticsAndCharBar,
        closeAnalyticsAndCharBar,
        checkChartAnalytics,
        setAssetFilesBarSize,
        assetFilesBarSize,
        assetFilesBar,
        driveTemplateBarSize,
        driveTemplateFrameMode,
        driveTemplateMode
    }]

    useEffect(()=>{
        if(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO') {
            loginRedirect(authenticated)
        }        
        // Fetch data for logged in user using token
    },[authenticated]);
    
    const childrenWithProps = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
                type: props.type,
                companyBarSize,
                setCompanyBarSize,
                handleCompanyButton,
                handleCompanyBarOpen,
                toggleButtonType,
                companyButtonVisible,
                visualizerBarSize,
                setVisualizerBarSize,
                setVisualizeOpenBar,
                openBar,
                openTypeBar,
                typeBarSize,
                setTypeBarSize,
                handleTypeButton,
                handleTypeBarOpen,
                toggleTypeButtonType,
                typeButtonVisible,
                openOtherPartyBar,
                openInventorBar,
                openGoogleDriveBar,
                otherPartyBarSize,
                setOtherPartyBarSize,
                handleOtherPartyButton,
                handleOtherPartyBarOpen,
                partyBarSize,
                driveBarSize,
                toggleOtherPartyButtonType,
                otherPartyButtonVisible,
                assignmentBarSize,
                setAssignmentBarSize,
                addressBarSize,
                setAddressBarSize,
                handleAssignmentButton,
                openAssignmentBar,
                handleAssignmentBarOpen,
                toggleAssignmentButtonType,
                assignmentButtonVisible,
                customerBarSize,
                setCustomerBarSize,
                handleCustomerButton,
                openCustomerBar,
                handleCustomersBarOpen,
                toggleCustomerButtonType,
                customerButtonVisible,
                commentBarSize,
                setCommentBarSize,
                openCommentBar,
                openIllustrationBar,
                handleChartBarOpen,
                handleAnalyticsBarOpen,
                setIsDrag,
                isDrag,
                setSize,
                size,
                illustrationRecord,
                setIllustrationRecord,
                illustrationBarSize,
                setIllustrationBarSize,
                openChartBar,
                openAnalyticsBar,
                openVisualizerBar,
                setAnalyticsBar,
                setChartBar,
                openAnalyticsAndCharBar,
                closeAnalyticsAndCharBar,
                checkChartAnalytics,
                setAssetFilesBarSize,
                assetFilesBarSize,
                assetFilesBar,
                driveTemplateBarSize,
                driveTemplateFrameMode,
                driveTemplateMode
            }) 
        }
        return child
    })
 
    return (
        <div className={classes.root} id='main'>
            {
                isMobile
                ?
                    <MobileHeader/>
                :
                    <NewHeader />
            }
            <Grid container className={classes.dashboardWarapper}>
                <Grid container className={clsx(classes.dashboard, {[classes.mobileDashboardWrapper]: isMobile})}>       
                    {
                        isMobile 
                        ?
                            mobileWrapper.map(
                                ({component: Component, ...props }, index) => (
                                    <Component key={index} {...props} />
                                )
                            ) 
                        :
                            <>
                                <div className={clsx(classes.filterToolbar)}> 
                                    <div className={clsx(classes.flex)}>                            
                                        {
                                            topToolBar.map( (item, index) => (
                                                <NavigationIcon key={index} {...item} />
                                            ))
                                        }
                                    </div>
                                    <div className={clsx(classes.flex, classes.bottom)}>
                                        {
                                            bottomToolBar.map( (item, index) => (
                                                <NavigationIcon key={index} {...item}/>
                                            ))
                                        }
                                    </div>
                                </div>
                                {
                                    childrenWithProps
                                }
                            </>
                    } 
                </Grid>
            </Grid>
            {
                isMobile && (
                    <MobileFooter
                        bottomToolBar={bottomToolBar}
                        topToolBar={topToolBar}   
                    />
                )
            }
        </div>
    )
}
export default GlobalLayout;