import React, {useEffect, useState} from 'react'
import DriveFilesFolders from "./DriveFilesFolders";
import useStyle from './styles';
import clsx from 'clsx';
import { Typography, Grid, SvgIcon } from '@mui/material';
import { 
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    InsertDriveFile as InsertDriveFileIcon,
} from '@mui/icons-material'

import PatenTrackApi from '../../../api/patenTrack2'
import { getTokenStorage} from '../../../utils/tokenStorage'



const CustomListItem = (props) => {
    const classes = useStyle();
    const [ data, setData] = useState({})

    const isSelected = (ID) => {    
        return props.selectedFolders.includes(ID) ? true : false;
    };
    const openDriveFolder = async(event, fileID) => {
        event.preventDefault()  
        if(!props.selectedFolders.includes(fileID)) {
            const reset = props.parent.length > 0 ? props.selectedFolders.includes(props.parent[0]) ? false : true : true
            props.addRemoveSelectedFolder(fileID, reset)
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

    const MinusSquare = (props) => {
        return (
          <SvgIcon fontSize="inherit" {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
          </SvgIcon>
        );
      }
      
    const PlusSquare = (props) => {
        return (
          <SvgIcon fontSize="inherit"  {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
          </SvgIcon>
        );
    }
      
    const CloseSquare = (props) => {
        return (
          <SvgIcon
            className={clsx(classes.icon, classes.close)}
            fontSize="inherit"
            {...props}
          >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
          </SvgIcon>
        );
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
                                    isSelected(props.id) ? <MinusSquare/> : <PlusSquare />
                                }<span>{props.name}</span>
                            </Typography>
                        </div>
                    :
                        <div key={props.id} className={classes.item} onClick={(event) => props.onSelectFile(event, {...props})}>
                            <Typography variant="body1" component="h2">
                                <img src={props.iconLink}/><span>{props.name}</span>
                            </Typography>
                        </div>
            }
            {
                isSelected(props.id) && data?.files && data?.files.length > 0
                    ?
                        <Grid item className={classes.child}>
                            <DriveFilesFolders
                                data={data} 
                                parent={props.parent.length === 0 ? [...props.parent, props.id] : [...props.parent]}
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