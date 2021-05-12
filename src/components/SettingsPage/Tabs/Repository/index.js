import React, {useState, useEffect, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Draggable, Droppable } from 'react-drag-and-drop'
import { 
        Grid, 
        List, 
        ListItem, 
        ListItemText,
        ListItemAvatar, 
        Avatar,
        Typography,
        Breadcrumbs,
        Link,
        Select,
        MenuItem,
        Checkbox
    } from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import { 
    ExpandMore as ExpandMoreIcon, 
    ChevronRight as ChevronRightIcon,
    Folder as FolderIcon,
    Close as CloseIcon
} from '@material-ui/icons'
import SplitPane from 'react-split-pane'
import VirtualizedTable from '../../../common/VirtualizedTable'
import useStyles from './styles'

import { setBreadCrumbs, getLayoutWithTemplates, getGoogleTemplates, getGoogleProfile, setLayoutWithTemplatelist } from  '../../../../actions/patentTrackActions2'

import PatenTrackApi from '../../../../api/patenTrack2';

import { getTokenStorage } from '../../../../utils/tokenStorage'

const Repository = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [ expanded, setExpanded ] = useState([])
    const [ selected, setSelected ] = useState(null)
    const [ layoutDriveFiles, setLayoutDriveFiles] = useState([])
    const [ driveFiles, setDriveFiles] = useState([])
    const templateDriveFiles = useSelector(state => state.patenTrack2.template_drive_files)
    const drive_files = useSelector(state => state.patenTrack2.drive_files)
    const google_profile = useSelector(state => state.patenTrack2.google_profile)
    const [ googleToken, setGoogleToken ] = useState('')
    const [ breadcrumbItems, setBreadCrumbItems ] = useState([])
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
    

    const COLUMNS = [
        {
            width: 29,
            minWidth: 29,
            label: '',
            dataKey: 'layout_id',
            role: 'checkbox',
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
            width: 191,
            minWidth: 191,
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
    }, [ layoutDriveFiles ])
   
    useEffect(() => {
        dispatch(setBreadCrumbs('Settings > Templates and Documents Repository'))
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken && googleToken != '' ) {
            const token = JSON.parse(googleToken)      
            const { access_token } = token  
            if(access_token) {
                setGoogleToken(token)                
                /* dispatch( getGoogleTemplates(token) ) */
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
                }
                
            } else { 
                // Not login
                alert('Please first login with google account.')
            }
        } else {
            // Not login
            alert('Please first login with google account.')
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
            getRepoFolder(google_profile.email)
        }
    }, [ dispatch, google_profile ])
    
    const getRepoFolder = async(userAccount) => {
        const {data} = await PatenTrackApi.getRepoFolder(userAccount)

        if(data != null) {
            setRepoFolder(data)
            getRepoDriveFiles(data.container_id)
        }
    }

    const getRepoDriveFiles = async(containerID) => {
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        const token = JSON.parse(googleToken)   
        const {data} = await PatenTrackApi.getGoogleTemplates(token, containerID)
        if(data != null && data.list != null ) {
            setRepoDriveFiles(data.list)
        }
    }   

    const openDriveFolder = useCallback((event, id, name) => {
        //get the list folders and files from selected folder        
        event.preventDefault();
        if(id) {
            let items = [...breadcrumbItems]
            items.push({id, name})
            setBreadCrumbItems( items )
            dispatch(getGoogleTemplates(googleToken, id))
        }
    }, [dispatch, breadcrumbItems, googleToken, google_profile])

    const handleBreadcrumbClick = useCallback((event, item) => {
        let oldItems = [...breadcrumbItems]
        if( item.id == 'undefined' ) {
            oldItems = []
        } else {
            const findIndex = oldItems.findIndex( row => row.id === item.id)
            if(findIndex !== -1 ) {
                oldItems = oldItems.splice( 0, findIndex + 1)
            }
        }        
        setBreadCrumbItems(oldItems)
        dispatch(getGoogleTemplates(googleToken, item.id))
    }, [ dispatch, googleToken, breadcrumbItems ])
    
    const deleteTemplate = async (layoutID, containerID) => {
        const {data} = await PatenTrackApi.deleteTemplateFromLayout(layoutID, containerID, google_profile.email)
        if(data != null) {
            let oldFiles = [...layoutDriveFiles]
            const promise = oldFiles.map((item, index) => {
                if( item.layout_id == layoutID ) {
                    oldFiles[index] = data
                }
            })
            Promise.all(promise)
            setLayoutDriveFiles(oldFiles)
        }
    }

    const BreadCrumbs = ({type }) => {
        return (
            <Breadcrumbs maxItems={2} aria-label="breadcrumb">
               {
                    type == 1 && breadcrumbItems.length > 0 && breadcrumbItems.map( crumb => (
                        <Link key={crumb.id} color="inherit" href="#" onClick={(e) => handleBreadcrumbClick(e, crumb)}>
                            {crumb.name}
                        </Link>
                    ))
               }
               {
                    type == 2 && repoFolder != '' && Object.keys(repoFolder).length > 0 && (
                        <Link key={repoFolder.container_id} color="inherit" href="#">
                            {repoFolder.container_name}
                        </Link>
                    )
               }
            </Breadcrumbs>
        )
    }

    const handleChange = (event, type) => {
        if(type == 1) {
            setFolderId(event.target.value);
            openDriveFolder(event, event.target.value, event.currentTarget.innerText)
        } else {
            let formData = new FormData();
            formData.append('container_id', event.target.value)
            formData.append('container_name', event.currentTarget.innerText)
            formData.append('user_account', google_profile.email)
            PatenTrackApi
            .addRepoFolder(formData) 
            .then(res => {
                if(res.data != null) {
                    setRepoFolder(res.data)
                    getRepoDriveFiles(res.data.container_id)
                }
            })
        }
    }

    const  DropDownFolderList = ({list, type}) => {
        return (
            <Select
                labelId="drive-folder"
                id="driveFolder"
                value={type == 1 ? folderId : repoFolder != '' ? repoFolder.container_id : ''}
                name={"folder_name"}
                onChange={(event) => handleChange(event, type)}
            >
                {
                    list.files.length > 0 && list.files.map( (folder, index) => (
                        <MenuItem key={index} value={folder.id} name={folder.name}>{folder.name}</MenuItem>
                    ))
                }
            </Select>
        )
    }

    const handleClickRow = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        console.log("handleClickRow", checked)
        if (checked !== undefined) {
            let oldLayoutItems = [...selectItems]
            if( !oldLayoutItems.includes(row.layout_id) ) {
                oldLayoutItems.push(row.layout_id)
            } else {
                const findIndex = oldLayoutItems.findIndex( item => item.layout_id == row.layout_id)
                if( findIndex !== -1) {
                    oldLayoutItems.splice(findIndex, 1)
                }
            }
            setSelectItems(oldLayoutItems)
        } else {
        }
    }, [ dispatch, selectItems ])

    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        console.log("handleSelectAll", checked, selectedAll)
        if(layoutDriveFiles.length > 0) {
            if( selectedAll === true ) {
                setSelectedAll( false )
                setSelectItems( [] )
            } else {
                const allItems = []
                layoutDriveFiles.map( file => {
                    allItems.push(file.layout_id)
                })
                setSelectItems(allItems)
                setSelectedAll( true )
            }
        }
    }, [ dispatch, layoutDriveFiles, selectedAll ]) 

    const handleClickDriveRow = useCallback(async (event, row) => {
        event.preventDefault()
        if(row.mimeType == 'application/vnd.google-apps.folder') {
            openDriveFolder(event, row.id, row.name)
        } else {
            if(selectItems.length > 0) {
                const { checked } = event.target;
                if (checked !== undefined) {
                    let oldDriveItems = [...selectedDriveItems], insert = false

                    if( !oldDriveItems.includes(row.id) ) {
                        oldDriveItems.push(row.id)
                        insert = true
                    } else {
                        const findIndex = oldDriveItems.findIndex( item => item.id == row.id)
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
                } else {
                    const element = event.target.closest(
                        "div.ReactVirtualized__Table__rowColumn"
                    );
                    const index = element.getAttribute("aria-colindex");
                    if (index == 2) {
                        setSelected(row.id)
                        setSelectedDriveRow([row.id])
                    }
                }
            } else {
                alert('Please select layout first.')
            }
        }        
    }, [ dispatch, selectedDriveItems, breadcrumbItems, googleToken, google_profile, selectItems ])
  
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
                            Templates Folder:  <DropDownFolderList list={driveFolders} type={1} /> <BreadCrumbs type={1}/>
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
                                Documents Folder: <DropDownFolderList list={driveFolders} type={2} /> <BreadCrumbs  type={2}/>
                            </Typography>
                        </div>
                        <div className={classes.drive}>
                            <VirtualizedTable
                                classes={classes}
                                selected={selectItems}
                                selectedKey={'id'}
                                rowSelected={selectedRow}
                                rows={repoDriveFiles.files}
                                rowHeight={rowHeight}
                                headerHeight={rowHeight}
                                columns={headerRepositoryColumns}
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
                    <div>
                        {
                            selected != null 
                            ?
                            <iframe src={`https://docs.google.com/file/d/${selected}/preview`} className={classes.frame}></iframe>
                            :
                            ''
                        }
                    </div>
                </SplitPane>
            </SplitPane>
        </SplitPane>
    ) 
}

export default Repository
