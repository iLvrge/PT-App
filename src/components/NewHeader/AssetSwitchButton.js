import React from 'react'

import LinkIcon from '@material-ui/icons/Link';
import useStyles from './styles'
import { MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';

const AssetSwitchButton = (props) => {
    
    return(
      <React.Fragment>
        {
          process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && (
            <MenuItem onClick={props.click} className={`iconItem`}>
              <ListItemIcon>
                <LinkIcon/>
              </ListItemIcon>   
              <ListItemText>{props.category == 'due_dilligence' ? 'Broken Chain' : 'All Assets'}</ListItemText>      
            </MenuItem>
          )
        }
      </React.Fragment>
    )
}

export default AssetSwitchButton