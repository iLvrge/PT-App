import React, {useEffect, useState} from 'react'
import CustomListItem from "./CustomListItem";
import useStyle from './styles';

const DriveFilesFolders = (props) => {

    const classes = useStyle();
    
    if(props.data.length == 0) return null
    return (
        <ul className={classes.list}>
            {
                props.data?.files && props.data.files.length > 0 && props.data.files.map((item, index) => (
                    <CustomListItem
                        key     = {index}
                        parent  = {props.parent}
                        selectedFolders={props.selectedFolders}
                        addRemoveSelectedFolder={props.addRemoveSelectedFolder}
                        onSelectFile={props.onSelectFile}
                        {...item}
                    />
                ))  
            }            
        </ul>
    )
}


export default DriveFilesFolders;