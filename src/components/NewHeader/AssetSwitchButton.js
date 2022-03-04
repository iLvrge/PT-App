import React from 'react'

import LinkIcon from '@mui/icons-material/Link';
import useStyles from './styles'
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

const AssetSwitchButton = (props) => {
    
    return(
      <React.Fragment>
        {
          process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' && (
            <MenuItem onClick={props.click} className={`iconItem`}>
              <ListItemIcon>
                <LinkIcon/>
              </ListItemIcon>   
              <ListItemText>{props.category == 'due_dilligence' ? 'Broken Chain-of-Title' : 'All Assets'}</ListItemText>      
            </MenuItem>
          )
        }
      </React.Fragment>
    )
}

export default AssetSwitchButton