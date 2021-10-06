import React, {useState, useEffect, useCallback, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { 
        Typography,
        Breadcrumbs,
        Link,
        Select,
        MenuItem,
    } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import SplitPane from 'react-split-pane'
import VirtualizedTable from '../../../common/VirtualizedTable'
import useStyles from './styles'
import Googlelogin from '../../../common/Googlelogin'
import { setBreadCrumbs, getLayoutWithTemplates, getGoogleTemplates, getGoogleProfile, setLayoutWithTemplatelist } from  '../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../api/patenTrack2';

import { getTokenStorage } from '../../../../utils/tokenStorage'

const Utilities = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const googleLoginRef = useRef(null)
    const [ selected, setSelected ] = useState(null)
    const [ layoutDriveFiles, setLayoutDriveFiles] = useState([])
    const [ driveFiles, setDriveFiles] = useState([])
    const templateDriveFiles = useSelector(state => state.patenTrack2.template_drive_files)
    const drive_files = useSelector(state => state.patenTrack2.drive_files)
    const google_profile = useSelector(state => state.patenTrack2.google_profile)
    const [ googleToken, setGoogleToken ] = useState('')
    const [ clicked, setClicked] = useState( false )
    const clickedRef = useRef()
        
    const [ breadcrumbItems, setBreadCrumbItems ] = useState([{id: 'undefined', name: 'My Drive'}])
    const [ repoBreadcrumbItems, setRepoBreadcrumbItems ] = useState([{id: 'undefined', name: 'My Drive'}])
    const repoFolderBreadcrumbsRef = useRef()
        
    const [ repoFolder, setRepoFolder] = useState('')
    
    const [ templates_folder_lock, setTemplatesFolderLock] = useState(0)
    const [ repo_folder_lock, setRepoFolderLock] = useState(0)
    const [ folderId, setFolderId]  = useState('')
    const [ repoDriveFiles, setRepoDriveFiles ] = useState({files: []})
    const [ driveFolders, setDriveFolders ] = useState({files: []})
    const [ width, setWidth ] = useState( 200 )
    const [ rowHeight, setRowHeight ] = useState(40)
	const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ selectedAll, setSelectedAll ] = useState(false)
    const [ isDrag, setIsDrag ] = useState(false)

    const [ selectedDriveItems, setSelectedDriveItems ] = useState( [] )
    const [ selectDriveRow, setSelectedDriveRow ] = useState( [] )
    const [ selectRepositoryDriveRow, setSelectedRepositoryDriveRow ] = useState( [] )
    

    const COLUMNS = [
        {
            width: 29,
            minWidth: 29,
            label: '',
            dataKey: 'layout_id',
            role: 'radio',
            disableSort: true
        },
        {
            width: 171,  
            minWidth: 171,
            label: 'Layouts',
            dataKey: 'layout_name',
        }
    ]

    const DRIVE_COLUMNS = [
        {
            width: 29,
            minWidth: 29,
            label: '',
            dataKey: 'id',
            role: 'checkbox',
            disableSort: true,
            showOnCondition: 'application/vnd.google-apps.folder' 
        },
        {
            width: 191,
            minWidth: 191,
            flexGrow: 1,
            label: 'Template Name',
            dataKey: 'name',
            imageURL: 'iconLink',
            role: 'image'
        }
    ] 

    const REPOSITORY_COLUMNS = [
        {
            width: 200,
            minWidth: 200,
            flexGrow: 1,
            label: 'Utility Files Folder:',
            dataKey: 'name',
            imageURL: 'iconLink',
            role: 'image',
            paddingLeft: 10
        }
    ] 

    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [headerDriveColumns, setHeaderDriveColumns] = useState(DRIVE_COLUMNS)
    const [headerRepositoryColumns, setHeaderRepositoryColumns] = useState(REPOSITORY_COLUMNS)

    const TIMER_OPEN = 2000
    
    useEffect(() => {
        dispatch(setBreadCrumbs('Settings > Templates and Documents Repository'))
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken && googleToken != '' && googleToken!= null) {
            const token = JSON.parse(googleToken)      
            const { access_token } = token  
            if(access_token) {
                setGoogleToken(token) 
                if(google_profile == null) {
                    dispatch(getGoogleProfile(token))
                }
            } else { 
                // Not login
                setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
            }
        } else {
            // Not login
            setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
        }
    }, [])

    useEffect(() => {
        if(google_profile != null && google_profile.hasOwnProperty('email')) {
            dispatch( getLayoutWithTemplates(googleToken, google_profile.email) )            
        }
        if(googleToken == '') {
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            if(googleToken && googleToken != '' && googleToken!= null) {
                const token = JSON.parse(googleToken)  
                const { access_token } = token  
                if(access_token) {
                    setGoogleToken(token)     
                    if(google_profile != null && google_profile.hasOwnProperty('email')) {
                        getRepoFolder(google_profile.email, token) 
                    }
                }
            } else {
                setTimeout(openGoogleWindow, TIMER_OPEN) //open google login popup
            }
        } else {
            if(google_profile != null && google_profile.hasOwnProperty('email')) {
                getRepoFolder(google_profile.email, googleToken) 
            }
        }
    }, [dispatch, google_profile, googleToken])

    useEffect(() => {
        if(googleToken != '') {            
            dispatch( getGoogleTemplates(googleToken) ) 
            //getRepoDriveFiles()  
        }
    }, [ googleToken ])


    useEffect(() => {
        setLayoutDriveFiles(templateDriveFiles)
    }, [ templateDriveFiles ])

    useEffect(() => {
        setDriveFiles(drive_files.files)
    }, [drive_files])

    useEffect(() => {
        clickedRef.current = clicked
    }, [clicked])

    useEffect(() => {
        repoFolderBreadcrumbsRef.current = repoBreadcrumbItems
    }, [repoBreadcrumbItems])

    useEffect(() => {
        return () => confirmUtilityFolder()
    }, [])

    const confirmUtilityFolder = () => {
        /* console.log('confirmUtilityFolder', clickedRef.current, repoFolderBreadcrumbsRef.current) */
        if(clickedRef.current === true) {
            if(window.confirm('Would you like to allocate selected folder to Utility Files Folder?')) {
                addRepositoryFolder(repoFolderBreadcrumbsRef.current)
            }
        }        
    } 
    
    const getRepoFolder = useCallback(async(userAccount, token) => {
        PatenTrackApi.cancelGetRepoFolder()
        const {data} = await PatenTrackApi.getRepoFolder(userAccount)

        if(data != null) {
            setRepoFolder(data)
            if(data.utilities_container_id !== '' && data.utilities_container_id !== null) {
                setRepoBreadcrumbItems(JSON.parse(data.utilities_breadcrumb))
                getRepoDriveFiles(data.utilities_container_id)
                setRepoFolderLock(1)
            } else {
                setRepoFolderLock(0)
                getRepoDriveFiles()
            }
        } else {
            getRepoDriveFiles()
        }
    }, [ dispatch, drive_files, googleToken ])

    const getRepoDriveFiles = async(containerID) => {
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        const token = JSON.parse(googleToken)   
        const {data} = await PatenTrackApi.getGoogleTemplates(token, containerID)
        if(data != null && data.list != null ) {
            setRepoDriveFiles(data.list)
        }
    }   

    const openDriveFolder = useCallback((event, id, name, t, callBack) => {
        //get the list folders and files from selected folder        
        event.preventDefault();
        if(id) {
            let items = t == 1 ? [...breadcrumbItems] : [...repoBreadcrumbItems]
            if(items.length == 0) {
                items.push({id: 'undefined', name: 'My Drive'})
            }
            const findIndex = items.findIndex( row => row.id === id)
            if(findIndex === -1) {
                items.push({id, name})
                if( t === 1 ) {
                    setBreadCrumbItems( items )
                    dispatch(getGoogleTemplates(googleToken, id))
                } else {
                    setRepoBreadcrumbItems( items )
                    getRepoDriveFiles(id)
                    if(typeof callBack == 'function') {
                        callBack(id, name, items)
                    }
                }
            } 
        }
    }, [dispatch, breadcrumbItems, repoBreadcrumbItems, googleToken, google_profile])

    const handleBreadcrumbClick = useCallback((event, item, type, clicked) => {
        event.preventDefault()
        if(clicked === false) {
            let oldItems = type == 1 ? [...breadcrumbItems] : [...repoBreadcrumbItems]
            if( item.id == 'undefined' ) {
                oldItems = [{id: 'undefined', name: 'My Drive'}]
            } else {
                const findIndex = oldItems.findIndex( row => row.id === item.id)
                if(findIndex !== -1 ) {
                    oldItems = oldItems.splice( 0, findIndex + 1)
                }
            }   
            if( type === 1 ) {
                setBreadCrumbItems( oldItems )
            } else {
                setRepoBreadcrumbItems( oldItems )
            }       
            if( type === 1 ) {
                dispatch(getGoogleTemplates(googleToken, item.id))
            } else {
                getRepoDriveFiles(item.id)
            }
        } else {
            alert("Please unlock first.")
        }
        
    }, [ dispatch, googleToken, breadcrumbItems, repoBreadcrumbItems ])

    const BreadCrumbs = ({type, click }) => {
        return (
            <Breadcrumbs aria-label="breadcrumb">
               {
                    type == 1 && breadcrumbItems != null && breadcrumbItems.length > 0 && breadcrumbItems.map( crumb => (
                        <Link key={crumb.id} color="inherit" href="#" onClick={(e) => handleBreadcrumbClick(e, crumb, type, click)}>
                            {crumb.name}
                        </Link>
                    ))
               }
               {
                    type == 2 && repoBreadcrumbItems != null && repoBreadcrumbItems.length > 0  && repoBreadcrumbItems.map( crumb => (
                        <Link key={crumb.id} color="inherit" href="#" onClick={(e) => handleBreadcrumbClick(e, crumb, type, click)}>
                            {crumb.name}
                        </Link>
                    ))
               }
            </Breadcrumbs>
        )
    }

    const onHandleDoubleClick = (event) => {
        
    }

    const handleClickRow = useCallback(async (event, row) => {
        event.preventDefault()
        const { checked } = event.target
        if (checked !== undefined) {
            setSelectItems([row.layout_id])
            const { data } = await PatenTrackApi.getLayoutTemplatesByID(row.layout_id, google_profile.email)
            const items = [];
            if(data != null && data.list.length > 0) {               
                const promises = data.list.map( item => items.push(item.utilities_container_id))
                await Promise.all(promises)
                setSelectedDriveItems(items)
            } else {
                setSelectedDriveItems(items)
            }
        }
    }, [ dispatch, selectItems, google_profile ])

    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        setSelectedAll( false )
    }, [ dispatch, layoutDriveFiles, selectedAll ]) 

    const handleClickRepositoryDriveRow = useCallback(async (event, row) => {
        event.preventDefault()
        if(row.mimeType == 'application/vnd.google-apps.folder') {
            openDriveFolder(event, row.id, row.name, 2)
            setClicked( prevItem => prevItem === false ? true : prevItem )           
        } else {
            
            let webViewLink = row.webViewLink
            if(webViewLink.indexOf('drive.google.com') !== -1) {
                webViewLink = `https://docs.google.com/file/d/${row.id}/preview`
            }
            setSelected(webViewLink)
            
            setSelectedRepositoryDriveRow([row.id])
            setSelectedDriveRow([])
        }
    }, [ google_profile, googleToken, repoBreadcrumbItems ])

    const addRepositoryFolder = useCallback(async(breadCrumbs) => {
        let formData = new FormData();
        formData.append('utilities_container_id', breadCrumbs[breadCrumbs.length - 1].id)
        formData.append('utilities_name', breadCrumbs[breadCrumbs.length - 1].name)
        formData.append('user_account', google_profile.email)
        formData.append('utilities_breadcrumb', JSON.stringify(breadCrumbs))
        PatenTrackApi
        .addRepoFolder(formData) 
        .then(res => {
            if(res.data != null) {
                setRepoFolderLock(1)
                setRepoFolder(res.data)
                setRepoBreadcrumbItems(JSON.parse(res.data.utilities_breadcrumb))
            }
        })        
    }, [ google_profile, googleToken,  ])

    const openGoogleWindow = useCallback(() => {
        if(googleLoginRef.current != null) {
            googleLoginRef.current.querySelector('button').click()
        } 
    }, [ googleLoginRef ])

    const unLockUtilitiesFolder = useCallback((event, t) => {
        event.preventDefault()
        if( t == 1) {
            /**
             * Send request to server to lock template folder
             */
            if(repoBreadcrumbItems.length > 1 ) {                
                addRepositoryFolder()
            }  else {
                alert('Please select template folder')
            }          
        } else {
            setRepoFolderLock( t )
        }
    }, [ repoBreadcrumbItems ])
  
    return (
        <SplitPane
            className={classes.splitPane}
            split="vertical"	
            size={300}
            onDragStarted={() => {
                setIsDrag(!isDrag)
            }}
            onDragFinished={(size) => {
                setIsDrag(!isDrag)
            }}
            pane2Style={{
                pointerEvents: isDrag === true ? 'none' : 'auto',
            }}
        >
            <div className={classes.flexColumn}>
                <div className={classes.heading}>
                    <Typography variant="body1" component="h2" className={classes.noWrap}>
                        {/* <span className={classes.relativeLockedIcon}>
                        {
                        repoFolder != '' && Object.keys(repoFolder).length > 0 && repoFolder.hasOwnProperty('utilities_container_id') && repo_folder_lock === 1
                        ?
                        <LockIcon onClick={(event) => unLockUtilitiesFolder(event, 0)}/>
                        :
                        <LockOpenIcon onClick={(event) => unLockUtilitiesFolder(event, 1)}/>
                        }
                        </span> */} Utility Files Folder: <BreadCrumbs  type={2} click={true} /* click={repoFolder != '' && Object.keys(repoFolder).length > 0 && repoFolder.hasOwnProperty('utilities_container_id') && repo_folder_lock === 1 ? true : false} *//>
                    </Typography>
                </div>
                <div className={classes.drive}> 
                    <VirtualizedTable
                        classes={classes}
                        selected={selectItems}
                        selectedKey={'id'}
                        rowSelected={selectRepositoryDriveRow}
                        rows={repoDriveFiles.files}
                        rowHeight={rowHeight}
                        headerHeight={rowHeight}
                        columns={headerRepositoryColumns}
                        onDoubleClick={onHandleDoubleClick}
                        onSelect={handleClickRepositoryDriveRow}
                        onSelectAll={handleSelectAll}
                        defaultSelectAll={selectedAll}
                        disableHeader={true}
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
                </div> 
            </div>
            <div>
                {
                    selected != null 
                    ?
                    <iframe src={`${selected}`} className={classes.frame}></iframe>
                    :
                    ''
                }
                <span ref={googleLoginRef}>
                    <Googlelogin/>
                </span>
            </div>                    
        </SplitPane>
    ) 
}

export default Utilities