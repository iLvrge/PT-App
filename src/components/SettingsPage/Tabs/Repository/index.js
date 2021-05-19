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

const Repository = () => {
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
    const [ breadcrumbItems, setBreadCrumbItems ] = useState([{id: 'undefined', name: 'My Drive'}])
    const [ repoBreadcrumbItems, setRepoBreadcrumbItems ] = useState([{id: 'undefined', name: 'My Drive'}])
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
            label: 'Template Name',
            dataKey: 'name',
            imageURL: 'iconLink',
            role: 'image',
            paddingLeft: 10
        }
    ] 

    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [headerDriveColumns, setHeaderDriveColumns] = useState(DRIVE_COLUMNS)
    const [headerRepositoryColumns, setHeaderRepositoryColumns] = useState(REPOSITORY_COLUMNS)
    
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
                setTimeout(openGoogleWindow,5000) //open google login popup
            }
        } else {
            // Not login
            setTimeout(openGoogleWindow, 5000) //open google login popup
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
                setTimeout(openGoogleWindow, 5000) //open google login popup
            }
        } else {
            if(google_profile != null && google_profile.hasOwnProperty('email')) {
                getRepoFolder(google_profile.email, googleToken) 
            }
        }
    }, [dispatch, google_profile, googleToken])

    useEffect(() => {
        if(googleToken != '') {
            console.log('useEffect=>getGoogleTemplates', googleToken)
            
            dispatch( getGoogleTemplates(googleToken) ) 
            getRepoDriveFiles()  
        }
    }, [ googleToken ])


    useEffect(() => {
        setLayoutDriveFiles(templateDriveFiles)
    }, [ templateDriveFiles ])

    useEffect(() => {
        setDriveFiles(drive_files.files)
    }, [drive_files])
    
    const getRepoFolder = useCallback(async(userAccount, token) => {
        const {data} = await PatenTrackApi.getRepoFolder(userAccount)

        if(data != null) {
            setRepoFolder(data)
            if(data.container_id != '') {
                setRepoBreadcrumbItems(JSON.parse(data.breadcrumb))
                getRepoDriveFiles(data.container_id)
                setRepoFolderLock(1)
            }

            if(data.template_container_id != '' && (token != undefined || googleToken != undefined)) {
                /**Set breancrumbs for template */
                setBreadCrumbItems(JSON.parse(data.template_breadcrumb))
                console.log('getRepoFolder=>getGoogleTemplates', token != undefined ? token : googleToken)
                dispatch(getGoogleTemplates(token != undefined ? token : googleToken, data.template_container_id))
                setTemplatesFolderLock(1)
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
            items.push({id, name})
            if( t === 1 ) {
                setBreadCrumbItems( items )
                console.log('openDriveFolder', googleToken)
                dispatch(getGoogleTemplates(googleToken, id))
            } else {
                setRepoBreadcrumbItems( items )
                getRepoDriveFiles(id)
                if(typeof callBack == 'function') {
                    callBack(id, name, items)
                }
            }  
        }
    }, [dispatch, breadcrumbItems, repoBreadcrumbItems, googleToken, google_profile])

    const handleBreadcrumbClick = useCallback((event, item, type) => {
        event.preventDefault()
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
            console.log('handleBreadcrumbClick=>getGoogleTemplates', googleToken)
            dispatch(getGoogleTemplates(googleToken, item.id))
        } else {
            getRepoDriveFiles(item.id)
        }
    }, [ dispatch, googleToken, breadcrumbItems, repoBreadcrumbItems ])

    const BreadCrumbs = ({type }) => {
        return (
            <Breadcrumbs maxItems={2} aria-label="breadcrumb">
               {
                    type == 1 && breadcrumbItems != null && breadcrumbItems.length > 0 && breadcrumbItems.map( crumb => (
                        <Link key={crumb.id} color="inherit" href="#" onClick={(e) => handleBreadcrumbClick(e, crumb, type)}>
                            {crumb.name}
                        </Link>
                    ))
               }
               {
                    type == 2 && repoBreadcrumbItems != null && repoBreadcrumbItems.length > 0  && repoBreadcrumbItems.map( crumb => (
                        <Link key={crumb.id} color="inherit" href="#" onClick={(e) => handleBreadcrumbClick(e, crumb, type)}>
                            {crumb.name}
                        </Link>
                    ))
               }
            </Breadcrumbs>
        )
    }

    const handleClickRow = useCallback(async (event, row) => {
        event.preventDefault()
        const { checked } = event.target
        if (checked !== undefined) {
            setSelectItems([row.layout_id])
            const { data } = await PatenTrackApi.getLayoutTemplatesByID(row.layout_id, google_profile.email)
            const items = [];
            if(data != null && data.list.length > 0) {               
                const promises = data.list.map( item => items.push(item.container_id))
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
            console.log('handleClickRepositoryDriveRow=>openDriveFolder', googleToken)
            openDriveFolder(event, row.id, row.name, 2)            
        } else {
            if(row.mimeType != 'application/pdf') {
                setSelected(row.webViewLink)
            } else {
                setSelected(`https://docs.google.com/file/d/${row.id}/preview`)
            }
            
            setSelectedRepositoryDriveRow([row.id])
            setSelectedDriveRow([])
        }
    }, [ google_profile, googleToken, repoBreadcrumbItems ])

    const addRepositoryFolder = useCallback(async() => {
        let formData = new FormData();
        formData.append('container_id', repoBreadcrumbItems[repoBreadcrumbItems.length - 1].id)
        formData.append('container_name', repoBreadcrumbItems[repoBreadcrumbItems.length - 1].name)
        formData.append('user_account', google_profile.email)
        formData.append('breadcrumb', JSON.stringify(repoBreadcrumbItems))
        PatenTrackApi
        .addRepoFolder(formData) 
        .then(res => {
            if(res.data != null) {
                setRepoFolderLock(1)
                setRepoFolder(res.data)
                setRepoBreadcrumbItems(JSON.parse(res.data.breadcrumb))



            }
        })        
    }, [ google_profile, googleToken, repoBreadcrumbItems ])

    const addTemplateFolder = useCallback(async() => {
        let formData = new FormData();
        formData.append('template_container_id', breadcrumbItems[breadcrumbItems.length - 1].id)
        formData.append('template_container_name', breadcrumbItems[breadcrumbItems.length - 1].name)
        formData.append('user_account', google_profile.email)
        formData.append('template_breadcrumb', JSON.stringify(breadcrumbItems))
        PatenTrackApi
        .addTemplateFolder(formData) 
        .then(res => {
            if(res.data != null) {
                setTemplatesFolderLock(1)
                setRepoFolder(res.data)
                setBreadCrumbItems(JSON.parse(res.data.breadcrumb))
            }
        })       
    }, [ google_profile, googleToken, breadcrumbItems ])

    const handleClickDriveRow = useCallback(async (event, row) => {
        event.preventDefault()
        if(row.mimeType == 'application/vnd.google-apps.folder') {
            console.log('handleClickDriveRow=>openDriveFolder', googleToken)
            openDriveFolder(event, row.id, row.name, 1)
        } else {
            const { checked } = event.target;
            if (checked !== undefined) {
                if(selectItems.length > 0) {
                    let oldDriveItems = [...selectedDriveItems], insert = false

                    if( !oldDriveItems.includes(row.id) ) {
                        oldDriveItems.push(row.id)
                        insert = true
                    } else {
                        const findIndex = oldDriveItems.findIndex( item => item == row.id)
                        if( findIndex !== -1) {
                            oldDriveItems.splice(findIndex, 1)
                        }
                    }
                    setSelectedDriveItems(oldDriveItems)                    
                    let formResponse;
                    if(insert === true) {
                        let formData = new FormData();
                        formData.append('container_id', row.id)
                        formData.append('container_name', row.name)
                        formData.append('user_account', google_profile.email)
                        formData.append('layout_id', JSON.stringify(selectItems))
                        formResponse = await PatenTrackApi.addContainerToLayout(formData)
                    } else {
                        formResponse = await PatenTrackApi.deleteTemplateFromLayout(JSON.stringify(selectItems), row.id, google_profile.email)
                    }
    
                    if(formResponse) {
                        console.log("formResponse", formResponse)
                    } 
                }  else {
                    alert('Please select layout first.')
                }                      
            } else {
                const element = event.target.closest(
                    "div.ReactVirtualized__Table__rowColumn"
                );
                const index = element.getAttribute("aria-colindex");
                if (index == 2) {
                    setSelected(row.webViewLink)
                    setSelectedDriveRow([row.id])
                    setSelectedRepositoryDriveRow([])
                }
            }
        }        
    }, [ dispatch, selectedDriveItems, breadcrumbItems, googleToken, google_profile, selectItems ])

    const openGoogleWindow = useCallback(() => {
        if(googleLoginRef.current != null) {
            googleLoginRef.current.querySelector('button').click()
        } 
    }, [ googleLoginRef ])

    const unLockTemplateFolder = useCallback((event, t) => {
        event.preventDefault()
        if( t == 1) {
            /**
             * Send request to server to lock template folder
             */
            if(breadcrumbItems.length > 1 ) {
                addTemplateFolder()
            }  else {
                alert('Please select template folder')
            }          
        } else {
            setTemplatesFolderLock( t )
        }
    }, [ breadcrumbItems ])

    const unLockRepoFolder = useCallback((event, t) => {
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
            size={200}
        >
            <div className={classes.flexColumn}> 
                <div className={classes.drive}  style={{height: '100vh'}}>
                    <VirtualizedTable
                        classes={classes}
                        selected={selectItems}
                        selectedKey={'layout_id'}
                        rowSelected={selectedRow}
                        rows={layoutDriveFiles}
                        rowHeight={rowHeight}
                        headerHeight={rowHeight}
                        columns={headerColumns}
                        onSelect={handleClickRow}
                        onSelectAll={handleSelectAll}
                        defaultSelectAll={selectedAll}
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
            <SplitPane
            className={classes.splitPane}
            split="vertical"
            size={300}	
            >
                <div className={classes.flexColumn}>
                    <div className={classes.heading}>
                        <Typography variant="body1" component="h2" className={classes.noWrap}>
                            <span className={classes.relativeLockedIcon}>
                            {
                               repoFolder != '' && Object.keys(repoFolder).length > 0 && repoFolder.hasOwnProperty('template_container_id') && templates_folder_lock === 1
                               ?
                               <LockIcon onClick={(event) => unLockTemplateFolder(event, 0)}/>
                               :
                               <LockOpenIcon onClick={(event) => unLockTemplateFolder(event, 1)}/>
                            }
                            </span> Templates:  <BreadCrumbs type={1}/>
                        </Typography>
                    </div>
                    <div className={classes.drive}>
                        <VirtualizedTable 
                            classes={classes}
                            selected={selectedDriveItems}
                            selectedKey={'id'}
                            rowSelected={selectDriveRow}
                            rows={driveFiles}
                            rowHeight={rowHeight}
                            headerHeight={rowHeight}
                            columns={headerDriveColumns}
                            onSelect={handleClickDriveRow}
                            onSelectAll={handleSelectAll}
                            defaultSelectAll={selectedAll}
                            disableRowKey={'mimeType'}
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
                <SplitPane
                    className={classes.splitPane}
                    split="vertical"	
                    size={300}
                >
                    <div className={classes.flexColumn}>
                        <div className={classes.heading}>
                            <Typography variant="body1" component="h2" className={classes.noWrap}>
                                <span className={classes.relativeLockedIcon}>
                                {
                                repoFolder != '' && Object.keys(repoFolder).length > 0 && repoFolder.hasOwnProperty('container_id') && repo_folder_lock === 1
                                ?
                                <LockIcon onClick={(event) => unLockRepoFolder(event, 0)}/>
                                :
                                <LockOpenIcon onClick={(event) => unLockRepoFolder(event, 1)}/>
                                }
                                </span> Documents: <BreadCrumbs  type={2}/>
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
            </SplitPane>
        </SplitPane>
    ) 
}

export default Repository