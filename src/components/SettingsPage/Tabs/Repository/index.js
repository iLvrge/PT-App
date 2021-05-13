import React, {useState, useEffect, useCallback, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { 
        Typography,
        Breadcrumbs,
        Link,
        Select,
        MenuItem,
    } from '@material-ui/core'
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
    const [ repoBreadcrumbItems, setRepoBreadcrumbItems ] = useState([])
    const [ repoFolder, setRepoFolder] = useState('')
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
            disableSort: true
        },
        {
            minWidth: 191,
            label: 'Template Name',
            dataKey: 'name',
            imageURL: 'iconLink',
            role: 'image'
        }
    ]

    const REPOSITORY_COLUMNS = [
        {
            minWidth: 200,
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

    /*useEffect(() => {
        if(layoutDriveFiles.length > 0) {
            const selectedTemplates = []
            layoutDriveFiles.map( layout => {
                if(layout.templates.length > 0) {
                    layout.templates.map( template => {
                        selectedTemplates.push( template.container_id )
                    })
                }
            })
            setSelectedDriveItems(selectedTemplates)
        }
    }, [ layoutDriveFiles ])*/
   
    useEffect(() => {
        dispatch(setBreadCrumbs('Settings > Templates and Documents Repository'))
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken && googleToken != '' ) {
            const token = JSON.parse(googleToken)      
            const { access_token } = token  
            if(access_token) {
                setGoogleToken(token)                
                dispatch( getGoogleTemplates(token) )
                const getDriveFolders = async () => {
                    const { data } = await PatenTrackApi.getGoogleTemplates(token, undefined, true) //get only folders
                    if(data != null && data.list != null && data.list.hasOwnProperty('files')) {
                        setDriveFolders(data.list)
                    }
                }
                getDriveFolders()

                if(google_profile != null && google_profile.hasOwnProperty('email')) {
                    dispatch( getLayoutWithTemplates(token, google_profile.email) )
                    getRepoFolder(google_profile.email)
                } else {
                    dispatch(getGoogleProfile(token))
                    getRepoDriveFiles()
                }
                
            } else { 
                // Not login
                setTimeout(openGoogleWindow,5000) //google login popup
            }
        } else {
            // Not login
            setTimeout(openGoogleWindow, 5000) //google login popup
        }
    }, [])

    useEffect(() => {
        setLayoutDriveFiles(templateDriveFiles)
    }, [ templateDriveFiles ])

    useEffect(() => {
        setDriveFiles(drive_files.files)        
    }, [drive_files])

    useEffect(() => {
        if(google_profile != null && google_profile.hasOwnProperty('email')) {
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            const token = JSON.parse(googleToken)      
            dispatch( getLayoutWithTemplates(token, google_profile.email) )
			dispatch( getGoogleTemplates(token) )
            getRepoFolder(google_profile.email)
        }
    }, [ dispatch, google_profile ])
    
    const getRepoFolder = useCallback(async(userAccount) => {
        console.log('getRepoFolder', drive_files)
        const {data} = await PatenTrackApi.getRepoFolder(userAccount)

        if(data != null) {
            setRepoFolder(data)
            setRepoBreadcrumbItems(JSON.parse(data.breadcrumb))
            getRepoDriveFiles(data.container_id)


        } else {
            getRepoDriveFiles()
        }
    }, [ drive_files ])

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
                dispatch(getGoogleTemplates(googleToken, id))
            } else {
                setRepoBreadcrumbItems( items )
                getRepoDriveFiles(id)
                callBack(id, name, items)
            }  
        }
    }, [dispatch, breadcrumbItems, repoBreadcrumbItems, googleToken, google_profile])

    const handleBreadcrumbClick = useCallback((event, item, type) => {
        event.preventDefault()
        let oldItems = type == 1 ? [...breadcrumbItems] : [...repoBreadcrumbItems]
        if( item.id == 'undefined' ) {
            oldItems = []
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
    }, [ dispatch, googleToken, breadcrumbItems, repoBreadcrumbItems ])

    const BreadCrumbs = ({type }) => {
        return (
            <Breadcrumbs maxItems={2} aria-label="breadcrumb">
               {
                    type == 1 && breadcrumbItems.length > 0 && breadcrumbItems.map( crumb => (
                        <Link key={crumb.id} color="inherit" href="#" onClick={(e) => handleBreadcrumbClick(e, crumb, type)}>
                            {crumb.name}
                        </Link>
                    ))
               }
               {
                    type == 2 && repoBreadcrumbItems.length > 0  && repoBreadcrumbItems.map( crumb => (
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
            if(data != null && data.list.length > 0) {
                const items = [];
                const promises = data.list.map( item => items.push(item.container_id))
                await Promise.all(promises)
                setSelectedDriveItems(items)
            }
        }
    }, [ dispatch, selectItems, google_profile ])

    const handleSelectAll = (event, row) => {
        event.preventDefault()
        setSelectedAll( false )
    }


    const handleClickRepositoryDriveRow = useCallback(async (event, row) => {
        event.preventDefault()
        if(row.mimeType == 'application/vnd.google-apps.folder') {
            openDriveFolder(event, row.id, row.name, 2, addRepositoryFolder)            
        } else {
            setSelected(row.id)
            setSelectedRepositoryDriveRow([row.id])
            setSelectedDriveRow([])
        }
    }, [ google_profile, googleToken, repoBreadcrumbItems ])

    const addRepositoryFolder = useCallback(async(id, name, repoBreadcrumbItems) => {
        if(id != 'undefined') {
            let formData = new FormData();
            formData.append('container_id', id)
            formData.append('container_name', name)
            formData.append('user_account', google_profile.email)
            formData.append('breadcrumb', JSON.stringify(repoBreadcrumbItems))
            PatenTrackApi
            .addRepoFolder(formData) 
            .then(res => {
                if(res.data != null) {
                    setRepoFolder(res.data)
                    setRepoBreadcrumbItems(JSON.parse(res.data.breadcrumb))
                }
            })
        }
        
    }, [ google_profile, googleToken ])

    const handleClickDriveRow = useCallback(async (event, row) => {
        event.preventDefault()
        if(row.mimeType == 'application/vnd.google-apps.folder') {
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
                    setSelected(row.id)
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
                            Templates:  <BreadCrumbs type={1}/>
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
                                Documents: <BreadCrumbs  type={2}/>
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
                            <iframe src={`https://docs.google.com/document/d/${selected}/edit`} className={classes.frame}></iframe>
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
