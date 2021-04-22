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
        Link
    } from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView';
import { 
        ExpandMore as ExpandMoreIcon, 
        ChevronRight as ChevronRightIcon,
        Folder as FolderIcon,
        Close as CloseIcon
    } from '@material-ui/icons';
import TreeItem from '@material-ui/lab/TreeItem'
import SplitPane from 'react-split-pane'
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
    const [repoFolder, setRepoFolder] = useState(null)
    const [ repoDriveFiles, setRepoDriveFiles ] = useState({files: []})
    
    
    useEffect(() => {
        dispatch(setBreadCrumbs('Settings > Repository'))
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken && googleToken != '' ) {
            const token = JSON.parse(googleToken)      
            const { access_token } = token  
            if(access_token) {
                setGoogleToken(token)                
                dispatch( getGoogleTemplates(token) )
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

    const handleToggle = (event, nodeIds) => {
        event.preventDefault();
        setExpanded(nodeIds)
    }
    
    const onKeyPressed = (e) => {
        //console.log(e.key)
    }

    const handleSelect = (event, nodeIds) => {
        event.preventDefault();
        if(isNaN(nodeIds)) {
            setSelected(nodeIds)
        }
    }    

    const openDriveFolder = useCallback((event, id, name) => {
        //get the list folders and files from selected folder
        event.preventDefault();
        if(id) {
            let items = [...breadcrumbItems]
            if(items.length == 0) {
                items.push({id: 'undefined', name: 'Drive'})
            }
            items.push({id, name})
            setBreadCrumbItems( items )
            dispatch(getGoogleTemplates(googleToken, id))
        }
    }, [dispatch, breadcrumbItems, googleToken, google_profile]) 

    const openRepoFolder = (containerID) => {
        window.open(`https://drive.google.com/drive/u/0/folders/${containerID}`, 'Drive')
    }

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

    const onDrop = useCallback((data, event) =>{
        console.log(data, event, event.target.innerText)
        if( data.hasOwnProperty('file') ) {
            const layoutName = event.target.innerText
            const dataValue = data.file.toString().split('@;')
            if( dataValue.length == 2 && dataValue[0] != '' && dataValue[1] != '' ) {
                let formData = new FormData();
                formData.append('container_id', dataValue[0])
                formData.append('container_name', dataValue[1])
                formData.append('layout_name', layoutName)
                formData.append('user_account', google_profile.email)
                PatenTrackApi
                .addContainerToLayout(formData)
                .then(res => {
                    if( res.data != null ) {
                        let oldFiles = [...layoutDriveFiles]
                        const promise = oldFiles.map((item, index) => {
                            if( item.layout_name == layoutName ) {
                                oldFiles[index] = res.data
                            }
                        })
                        Promise.all(promise)
                        setLayoutDriveFiles(oldFiles)
                    }
                })
            }
        } else if( data.hasOwnProperty('folder') ) {
            const dataValue = data.folder.toString().split('@;')
            if( dataValue.length == 2 && dataValue[0] != '' && dataValue[1] != '' ) {
                let formData = new FormData();
                formData.append('container_id', dataValue[0])
                formData.append('container_name', dataValue[1])
                formData.append('user_account', google_profile.email)
                PatenTrackApi
                .addRepoFolder(formData) 
                .then(res => {
                    if(res.data != null) {
                        setRepoFolder(res.data)
                    }
                })
            }
        }
        
    }, [ dispatch, layoutDriveFiles, google_profile ])

    const onDragEnter = (event) =>{
        const target = event.target;
        target.classList.add(classes.dropItem);
    }

    const onDragLeave = (event) => {
        const target = event.target;
        if( target.classList.contains(classes.dropItem) ) {
            target.classList.remove(classes.dropItem)
        }
    }

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

    const ShowName = ({ item }) => {
        return(
            item.container_name 
            ? 
                <span className={classes.relative}><CloseIcon onClick={() => deleteTemplate(item.layout_id, item.container_id)}/><span className={classes.repo_name}>{item.container_name}</span></span>
            :
                item.layout_name
        )
    }

    const getTreeItemsFromData = treeItems => {
        return treeItems.map( treeItemData => {
            let children = undefined
            if (treeItemData.templates && treeItemData.templates.length > 0) {
                children = getTreeItemsFromData(treeItemData.templates)
            }
            
            const key = treeItemData.container_id ? treeItemData.container_id : treeItemData.layout_id
        
            return (
                <Droppable
                types={['file']} 
                onDrop={onDrop}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                key={key}
                >
                    <TreeItem  
                        key={key}
                        nodeId={`${key}`}
                        label={<ShowName item={treeItemData}/>}
                        children={children}
                    />
                </Droppable>                     
            )
        })
    }

    const DataTreeView = ({ treeItems }) => {
        return (
          <TreeView  
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            onKeyDown={onKeyPressed}
           >
            {getTreeItemsFromData(treeItems)}
          </TreeView>
        )
    }

    const renderLayoutData = (data) => {
		/* if(props.isLoading)
		  return <Loader/> */
		return (		  
			<DataTreeView treeItems={data} />
		)
    }

    /* const ListItemLink = (props) =>{
        return <ListItem button component="a" {...props} />;
    } */

    const ListItemButton = (props) =>{
        return <ListItem button  {...props} />;
    }

    const DriveFileItem = ({ items }) => {
        return items.map( item => {
            return (
                <Draggable type={item.mimeType == 'application/vnd.google-apps.folder' ? 'folder' : 'file'} data={`${item.id}@;${item.name}`} key={item.id}>
                    <Item item={item}/>
                </Draggable>
            )
        })
    }

    const Item = ({item}) => {
        return (
            <ListItem key={item.id}>
                <Avatar src={item.iconLink} className={classes.small}/>
                {
                    item.mimeType == 'application/vnd.google-apps.folder'
                    ?
                        <ListItemButton onClick={(e) => openDriveFolder(e, item.id, item.name)}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>  
                    :
                        <ListItemButton onClick={(e) => setSelected(item.id)}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>  
                }                      
            </ListItem>
        )
    }

    const renderDriveFiles = (data) => { 
        return (
            <List dense={true}>
                <DriveFileItem items={data} />
            </List>
        )
    }  

    const RepoDriveFileItem = ({ items }) => {
        return items.map( item => {
            return (                
                <Item key={item.id} item={item}/>
            )
        })
    }
    
    const renderRepoDriveFiles = (data) => { 
        return (
            <List dense={true}>
                <RepoDriveFileItem items={data} />
            </List>
        )
    }

    const BreadCrumbs = () => {
        return (
            <Breadcrumbs maxItems={2} aria-label="breadcrumb">
               {
                   breadcrumbItems.length > 0 && breadcrumbItems.map( crumb => (
                        <Link key={crumb.id} color="inherit" href="#" onClick={(e) => handleBreadcrumbClick(e, crumb)}>
                            {crumb.name}
                        </Link>
                   ))
               }
            </Breadcrumbs>
        )
    }
  
    return (
        <SplitPane
            className={classes.splitPane}
            split="vertical"
            size={200}
        >
            <div className={classes.flexColumn}> 
                <div className={classes.heading}>
                    <Typography variant="body1" component="h2">
                        Layouts
                    </Typography>
                </div>
                <div className={classes.drive}  style={{height: '80vh'}}>
                    {
                        layoutDriveFiles.length > 0 && renderLayoutData(layoutDriveFiles)
                    }
                </div>
                <div className={classes.drive}  style={{height: '40vh'}}>
                    <Droppable
                    types={['folder']} 
                    onDrop={onDrop}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    >                   
                        <Typography variant="body1" component="h2">
                            <div className={classes.relative}>
                                {
                                    repoFolder != null 
                                    ?   
                                        <><Avatar src={`https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document`} className={classes.small} /><span className={classes.repo_name}>{repoFolder.container_name}</span></>                                    
                                    :
                                        <span className={classes.repo_name}>Drop your repository folder here.</span>
                                } 
                            </div>
                        </Typography>                                       
                    </Droppable>
                </div>
            </div>
            <SplitPane
            className={classes.splitPane}
            split="vertical"
            size={300}	
            >
                <div className={classes.flexColumn}>
                    <div className={classes.heading}>
                        <Typography variant="body1" component="h2">
                            Templates <BreadCrumbs/>
                        </Typography>
                    </div>
                    <div className={classes.drive}>
                        {
                            driveFiles.length > 0 && renderDriveFiles(driveFiles) 
                        }    
                    </div>   
                </div>         
                <SplitPane
                    className={classes.splitPane}
                    split="vertical"	
                    size={300}
                >
                    <div className={classes.flexColumn}>
                        <div className={classes.heading}>
                            <Typography variant="body1" component="h2">
                                Documents
                            </Typography>
                        </div>
                        <div className={classes.drive}>
                            {
                                repoDriveFiles.files.length > 0 && renderRepoDriveFiles(repoDriveFiles.files) 
                            }
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
