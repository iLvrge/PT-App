import React, {useState} from 'react'
import { 
        BottomNavigation,
        BottomNavigationAction,
        Box,
        SwipeableDrawer
    } from '@material-ui/core'

import { 
    Dashboard as DashboardIcon,
    Class as ClassIcon,
    Description as DescriptionIcon,
} from '@material-ui/icons'

import ActionMenu from '../NewHeader/ActionMenu'
import NavigationIcon from '../NavigationIcon'

import useStyles from './styles'

const MobileFooter = (props) => {
    const classes = useStyles() 
    const [value, setValue] = useState(null);

    const [state, setState] = useState({
        filter: false,
        dashboard: false,
        transaction_assets: false,
        documents: false,
    });

    const handleChange = (event, newValue) => {   
        setValue(newValue);
        toggleDrawer(event, newValue, true) 
    };

    const toggleDrawer = (event, anchor, open) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
        setState({ ...state, [anchor]: open });
        if(open === false) {
            setValue(null);
        }
    };

    const leftButtons = [ 
        {
            label:"Filter",
            value:"filter",
            icon: <svg  viewBox="0 0 24 24" class="MuiSvgIcon-root"><g><path d="M0,0h24 M24,24H0" fill="none"/><path d="M7,6h10l-5.01,6.3L7,6z M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6 c0,0,3.72-4.8,5.74-7.39C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"/><path d="M0,0h24v24H0V0z" fill="none"/></g></svg>
        },
        {
            label:"Dashboard",
            value:"dashboard",
            icon:<DashboardIcon />
        }
    ]

    const rightButtons = [
        {
            label:"Transaction / Assets",
            value:"transaction_assets",
            icon:<ClassIcon />
        },
        {
            label:"Documents",
            value:"documents",
            icon:<DescriptionIcon />
        }
    ]

    const drawerList = [
        {
            name: 'filter',
            anchor: 'bottom',
        },
        {
            name: 'dashboard',
            anchor: 'top'
        },
        {
            name: 'transaction_assets',
            anchor: 'bottom'
        },
        {
            name: 'documents',
            anchor: 'bottom'
        }
    ]

    return(
        <Box>
            <BottomNavigation value={value} onChange={handleChange}>
                {
                    leftButtons.map( (button, index) => (
                        <BottomNavigationAction
                            key={index}
                            label={button.label}
                            value={button.value}
                            icon={button.icon}
                        />
                    ))
                }        
                <ActionMenu t={1}/>
                {
                    rightButtons.map( (button, index) => (
                        <BottomNavigationAction
                            key={index}
                            label={button.label}
                            value={button.value}
                            icon={button.icon}
                        />
                    ))
                }  
            </BottomNavigation>
            {
                drawerList.map( (drawer, index) => (
                    <React.Fragment key={index}>
                        <SwipeableDrawer
                            anchor={drawer.anchor}
                            open={state[drawer.name]}
                            onClose={(event) => toggleDrawer(event, drawer.name, false)}
                            onOpen={(event) => toggleDrawer(event, drawer.name, true)}
                        >                            
                            {
                                drawer.name === 'dashboard'
                                ?                                
                                    props.bottomToolBar.map( (item, index) => (
                                        <Box
                                            className={classes.swipeButtons}
                                            key={index} 
                                        >
                                            <NavigationIcon {...item}/>
                                        </Box>
                                        
                                    ))
                                :
                                    drawer.name === "filter"
                                    ?
                                        props.topToolBar.map((item, index) => (
                                            item.t === 1 || item.t === 2 || item.t === 3 || item.t === 11
                                            ? (
                                                <Box
                                                    className={classes.swipeButtons}
                                                    key={index} 
                                                >
                                                    <NavigationIcon {...item}/>
                                                </Box>
                                            )
                                            : null
                                        ))                                       
                                    :
                                        drawer.name === "transaction_assets"
                                        ?
                                            props.topToolBar.map( (item, index) => (
                                                item.t === 4 || item.t === 5 
                                                ? (
                                                    <Box
                                                        className={classes.swipeButtons}
                                                        key={index} 
                                                    >
                                                        <NavigationIcon {...item}/>
                                                    </Box>
                                                ) 
                                                : null                                           
                                            ))
                                        :
                                            drawer.name === "documents"
                                            ?
                                                props.topToolBar.map( (item, index) =>  (
                                                    item.t === 10 || item.t === 12 
                                                    ?  (
                                                        <Box
                                                            className={classes.swipeButtons}
                                                            key={index} 
                                                        >
                                                            <NavigationIcon {...item}/>
                                                        </Box>
                                                    )  
                                                    : null                                          
                                                ))
                                            :
                                                ''
                            }
                        </SwipeableDrawer>
                    </React.Fragment>
                ))
            }
        </Box>
    )
}


export default MobileFooter