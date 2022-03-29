import React, {useEffect, useState} from 'react'
import DriveFilesFolders from "./DriveFilesFolders";
import useStyle from './styles';
import clsx from 'clsx';
import { Typography, Grid } from '@mui/material';
import { 
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    InsertDriveFile as InsertDriveFileIcon,
} from '@mui/icons-material'

import PatenTrackApi from '../../../api/patenTrack2'
import { getTokenStorage} from '../../../utils/tokenStorage'



const CustomListItem = (props) => {
    console.log("CustomListItem", props)
    const classes = useStyle();
    const [ data, setData] = useState({})

    const isSelected = (ID) => {    
        return props.selectedFolders.includes(ID) ? true : false;
    };
    const openDriveFolder = async(event, fileID) => {
        event.preventDefault()  
        if(!props.selectedFolders.includes(fileID)) {
            props.addRemoveSelectedFolder(fileID)
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            if(googleToken != '' && googleToken != null) {
                const tokenParse = JSON.parse(googleToken)
                const { access_token } = tokenParse
                if( access_token ) {
                    const { data } = await PatenTrackApi.getGoogleTemplates(tokenParse, fileID)
                    setData(data.list)
                }
            }
        } else {
            props.addRemoveSelectedFolder(fileID)
        }
    }

    const onHandleSelectFile = () => {

    }
    
    return (
        <li
            className={clsx(classes.listItem, {[classes.active]: isSelected(props.id) ? true : false })}
        >
            {
                props.mimeType == 'application/vnd.google-apps.folder'
                    ?
                        <div key={props.id} className={classes.item} onClick={(event) => openDriveFolder(event, props.id, props.name)}>
                            <Typography variant="body1" component="h2">
                                {
                                    isSelected(props.id) ? <FolderOpenIcon/> : <FolderIcon />
                                }<span>{props.name}</span>
                            </Typography>
                        </div>
                    :
                        <div key={props.id} className={classes.item} onClick={(event) => props.onSelectFile(event, props.id)}>
                            <Typography variant="body1" component="h2">
                                <InsertDriveFileIcon /><span>{props.name}</span>
                            </Typography>
                        </div>
            }
            {
                isSelected(props.id) && data?.files && data?.files.length > 0
                    ?
                        <Grid item className={classes.child}>
                            <DriveFilesFolders
                                data={data} 
                                parent={[...props.parent, props.id]}
                                selectedFolders={props.selectedFolders}
                                addRemoveSelectedFolder={props.addRemoveSelectedFolder}
                                onSelectFile={props.onSelectFile}
                            />
                        </Grid>
                        
                    :
                        ''
            }
        </li>
    )
}


export default CustomListItem;