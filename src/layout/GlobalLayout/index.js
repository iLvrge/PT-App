import React, { useEffect, useState, useCallback } from "react"

import { useDispatch, useSelector } from 'react-redux'

import { 
    useHistory,
  } from 'react-router-dom'

import { Grid } from '@material-ui/core'

import useStyles from './styles'

import NewHeader from '../../components/NewHeader'
import Loader from '../../components/common/Loader'

import NavigationIcon from '../../components/NavigationIcon'

import { loginRedirect } from  '../../utils/tokenStorage'
import { editorBar } from  '../../utils/splitpane'
import { 
    setBreadCrumbs,
    setAssetTypesAssignmentsLoading,
    setAssetTypeAssignments,
    setSearchRfIDs
} from '../../actions/patentTrackActions2'

import { 
    setConnectionBoxView,
    setPDFView,
} from '../../actions/patenTrackActions'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode } from '../../actions/uiActions'

import PatenTrackApi from '../../api/patenTrack2' 

const GlobalLayout = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const [ openBar, setOpenBar ] = useState(true)
    const [ openTypeBar, setTypeOpenBar ] = useState(false)
    const [ openOtherPartyBar, setOtherPartyOpenBar ] = useState(false)
    const [ openInventorBar, setInventorOpenBar ] = useState(false)
    const [ openAssignmentBar, setAssignmentOpenBar ] = useState(false)
    const [ openCustomerBar, setCustomerOpenBar ] = useState(true)
    const [ openIllustrationBar, setIllustrationBar ] = useState(true)
    const [ openCommentBar, setCommentBar ] = useState(true)
    const [ openChartBar, setChartBar ] = useState(false)
    const [ openAnalyticsBar, setAnalyticsBar ] = useState(false)
    const [ openVisualizerBar, setVisualizeOpenBar ] = useState(false)

    const [ toggleButtonType, setToggleButtonType ] = useState(true)
    const [ toggleTypeButtonType, setToggleTypeButtonType ] = useState(true)
    const [ toggleOtherPartyButtonType, setToggleOtherPartyButtonType ] = useState(true)
    const [ toggleAssignmentButtonType, setToggleAssignmentButtonType ] = useState(true)
    const [ toggleCustomerButtonType, setToggleCustomerButtonType ] = useState(true)
    const DEFAULT_SCREEN_SIZE = {
        companyBar: 200,
        typeBar: 0,
        otherPartyBar: 0,
        assignmentBar: 0,
        customerBar: 160,
        driveTemplateBar: 200,
        assetFileBar: 0,
        commentBar: '30%',
        illustrationBar: '50%',
        visualizeBar: '0%',
        bar100: '100%',
        bar50: '50%'
    }

    const [ companyBarSize, setCompanyBarSize ] = useState(200) 
    const [ typeBarSize, setTypeBarSize ] = useState(0) 
    const [ otherPartyBarSize, setOtherPartyBarSize ] = useState(0)
    const [ partyBarSize, setPartyBarSize ] = useState('50%')
    const [ assignmentBarSize, setAssignmentBarSize ] = useState(0)  
    const [ customerBarSize, setCustomerBarSize ] = useState(160)
    const [ commentBarSize , setCommentBarSize ] = useState('30%')
    const [ illustrationBarSize , setIllustrationBarSize ] = useState('50%')
    const [ visualizerBarSize , setVisualizerBarSize ] = useState('0%')

    const [ companyButtonVisible, setCompanyButtonVisible ] = useState(false)
    const [ typeButtonVisible, setTypeButtonVisible ] = useState(false)
    const [ otherPartyButtonVisible, setOtherPartyButtonVisible ] = useState(false)
    const [ assignmentButtonVisible, setAssignmentButtonVisible ] = useState(false)
    const [ customerButtonVisible, setCustomerButtonVisible ] = useState(false)

    const [ assetFilesBarSize, setAssetFilesBarSize ] = useState(0)
    const [ assetFilesBar, setAssetFilesBar ] = useState(false)
    const [ toggleAssetFileButtonType, setToggleAssetFileButtonType ] = useState(true)

    const [ driveTemplateBarSize, setDriveTemplateBarSize ] = useState(200)

    const [ isDrag, setIsDrag ] = useState(false)
    const [ size, setSize] = useState(0)
    const [ illustrationRecord, setIllustrationRecord ] = useState()
    const authenticated = useSelector(store => store.auth.authenticated)
    
    const search_string = useSelector(state => state.patenTrack2.search_string)
    const driveTemplateFrameMode = useSelector(state => state.ui.driveTemplateFrameMode)
    const driveTemplateMode = useSelector(state => state.ui.driveTemplateMode)

    useEffect(() => {
        editorBar() // run to find editor width
        window.addEventListener("resize", editorBar) // add on resize window 
        return () => window.removeEventListener("resize", editorBar)
    }, [])
    
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
            setCustomerBarSize(160)
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


    const handleCompanyBarOpen = (event) => {
        setToggleButtonType( !toggleButtonType )
        setOpenBar( !openBar )
        if(!openBar === false) {
            setCompanyBarSize(0)
        } else {
            setCompanyBarSize(200)

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
        }
        editorBar()
    }

    const handleInventorBarOpen = (event) => {
        setToggleOtherPartyButtonType( !toggleOtherPartyButtonType )
        setInventorOpenBar( !openInventorBar )
        if(!openInventorBar === false && openOtherPartyBar === false) {
            setOtherPartyBarSize(0)
        } else {
            setOtherPartyBarSize(120)
            if(openOtherPartyBar === false) {
                setPartyBarSize('0%')
            } else if(!openInventorBar === false){
                setPartyBarSize('100%')
            } else {
                setPartyBarSize('50%')
            }
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

        }
        editorBar()
    }

    const handleCustomersBarOpen = (event) => {
        setToggleCustomerButtonType( !toggleCustomerButtonType )
        setCustomerOpenBar( !openCustomerBar )
        if(!openCustomerBar === false) {
            setCustomerBarSize(0)
        } else {
            setCustomerBarSize(160)

        }
        editorBar()
    }

    const handleAssetFileBarOpen = (event) => {
        setToggleAssetFileButtonType( !toggleAssetFileButtonType )
        setAssetFilesBar( !assetFilesBar )
        if(!assetFilesBar === false) {
            setAssetFilesBarSize(0)
        } else {
            setAssetFilesBarSize(200)

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
        
        setIllustrationBarSize(barSize)       
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
            setVisualizerBarSize('30%')

        }

        if( connectionBoxData != null && Object.keys(connectionBoxData).length > 0 ) {  
            setVisualizeOpenBar( true )
            setVisualizerBarSize('30%')

            setAnalyticsBar( true )
            setChartBar( true ) 
            setIllustrationBarSize('50%')

        }

        if( typeof usptoMode != undefined && usptoMode === true ) {
            setVisualizeOpenBar( true )
            setVisualizerBarSize('30%')

            setAnalyticsBar( true ) 
            if(openChartBar === false) {
                setIllustrationBarSize('100%')

            } else {
                setIllustrationBarSize('50%')

            }
        }
    }

    const handleOpenSettings = useCallback(() => {
        history.push('/settings/repository')
    }, [ history ])

    const topToolBar = [
        {
            tooltip: 'Settings',
            bar: false,
            click: handleOpenSettings,
            t: 0
        },
        {
            tooltip: 'Companies',
            bar: openBar,
            click: handleCompanyBarOpen,
            t: 1
        },
        {
            tooltip: 'Activities',
            bar: openTypeBar,
            click: handleTypeBarOpen,
            t: 2
        },
        {
            tooltip: 'Parties',
            bar: openOtherPartyBar,
            click: handleOtherPartyBarOpen,
            t: 3
        },
        {
            tooltip: 'Inventors',
            bar: openInventorBar,
            click: handleInventorBarOpen,
            t: 11
        },
        {
            tooltip: 'Assignments',
            bar: openAssignmentBar,
            click: handleAssignmentBarOpen,
            t: 4
        },
        {
            tooltip: 'Assets',
            bar: openCustomerBar,
            click: handleCustomersBarOpen,
            t: 5
        },
        {
            tooltip: 'Documents',
            bar: assetFilesBar,
            click: handleAssetFileBarOpen,
            t: 10
        }
    ]

    const bottomToolBar = [
        {
            tooltip: 'Illustration',
            bar: openIllustrationBar,
            click: handleIllustrationBarOpen,
            t: 6
        },
        {
            tooltip: 'Slack bar',
            bar: openCommentBar,
            click: handleCommentBarOpen,
            t: 7
        },
        {
            tooltip: 'Charts',
            bar: openChartBar,
            click: handleChartBarOpen,
            t: 8
        },
        {
            tooltip: 'Analytics',
            bar: openAnalyticsBar,
            click: handleAnalyticsBarOpen,
            t: 9
        }
    ]

    useEffect(()=>{
        loginRedirect(authenticated)
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
                otherPartyBarSize,
                setOtherPartyBarSize,
                handleOtherPartyButton,
                handleOtherPartyBarOpen,
                partyBarSize,
                toggleOtherPartyButtonType,
                otherPartyButtonVisible,
                assignmentBarSize,
                setAssignmentBarSize,
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
        <div className={classes.root}>
            <NewHeader />
            <Grid container className={classes.dashboardWarapper}>
                <Grid container className={classes.dashboard}>
                    <div className={classes.filterToolbar}> 
                        <div className={classes.flex}>                            
                            {
                                topToolBar.map( (item, index) => (
                                    <NavigationIcon key={index} {...item}/>
                                ))
                            }
                        </div>
                        <div className={`${classes.flex} ${classes.bottom}`}>
                            {
                                bottomToolBar.map( (item, index) => (
                                    <NavigationIcon key={index} {...item}/>
                                ))
                            }
                        </div>
                    </div>
                    {childrenWithProps}
                </Grid>
            </Grid>
        </div>
    )
}

export default GlobalLayout