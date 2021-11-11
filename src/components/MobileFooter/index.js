import React from 'react'
import { 
        BottomNavigation,
        BottomNavigationAction,
        Fab 
    } from '@material-ui/core'

import { 
    CheckCircleOutline as CheckCircleOutlineIcon,
    Dashboard as DashboardIcon,
    Class as ClassIcon,
    Description as DescriptionIcon,
} from '@material-ui/icons'

import useStyles from './styles'

const MobileFooter = () => {

    const [value, setValue] = React.useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
            <BottomNavigationAction
                label="Filter"
                value="Filter"
                icon={<svg  viewBox="0 0 24 24" class='MuiSvgIcon-root'><g><path d="M0,0h24 M24,24H0" fill="none"/><path d="M7,6h10l-5.01,6.3L7,6z M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6 c0,0,3.72-4.8,5.74-7.39C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"/><path d="M0,0h24v24H0V0z" fill="none"/></g></svg>}
            />
            <BottomNavigationAction
                label="Dashboard"
                value="Dashboard"
                icon={<DashboardIcon />}
            />
            <Fab 
                style={{backgroundColor: '#e60000', color: '#fff'}}  
            aria-label="Action">
                <CheckCircleOutlineIcon />
            </Fab>
            <BottomNavigationAction
                label="Transaction / Assets"
                value="Transaction / Assets"
                icon={<ClassIcon />}
            />
            <BottomNavigationAction 
                label="Documents" 
                value="Documents" 
                icon={<DescriptionIcon />} 
            />
        </BottomNavigation>
    )
}


export default MobileFooter