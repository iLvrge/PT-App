import React from 'react'
import { 
    Button,
  } from '@material-ui/core'

import useStyles from './styles'

const AssetSwitchButton = (props) => {
    const classes = useStyles()
    return(
        <div className={`${classes.grow_buttons} ${classes.alignItemCenter}`}>
          {
            process.env.REACT_APP_ENVIROMENT_MODE === 'PRO' 
            ?
              <Button className={classes.calendly} onClick={props.click}>
                {props.category == 'due_dilligence' ? 'Broken Chain' : 'All Assets'}
              </Button> 
            :
            ''
          }          
        </div>
    )
}

export default AssetSwitchButton