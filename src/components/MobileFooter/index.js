import React, {useState} from 'react'
import { 
        BottomNavigation,
        BottomNavigationAction,
        Box,
        SwipeableDrawer,
        Paper
    } from '@mui/material'

import DashboardIcon from '@mui/icons-material/Dashboard'
import ClassIcon from '@mui/icons-material/Class'
import DescriptionIcon from '@mui/icons-material/Description'

import ActionMenu from '../NewHeader/ActionMenu'
import NavigationIcon from '../NavigationIcon'
import clsx from 'clsx'

const MobileFooter = (props) => {
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
            label:"",
            value:"filter",
            icon: <svg  viewBox="0 0 24 24" class="MuiSvgIcon-root"><g><path d="M0,0h24 M24,24H0" fill="none"/><path d="M7,6h10l-5.01,6.3L7,6z M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6 c0,0,3.72-4.8,5.74-7.39C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"/><path d="M0,0h24v24H0V0z" fill="none"/></g></svg>
        },
        {
            label:"",
            value:"dashboard",
            icon:<DashboardIcon />
        }
    ]

    const rightButtons = [
        {
            label:"",
            value:"transaction_assets",
            icon:<ClassIcon />
        },
        {
            label:"",
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
        <Box className={"z-[999] flex h-[45px] [&_svg.MuiSvgIcon-root]:h-8 [&_svg.MuiSvgIcon-root]:w-8 [&_.MuiBottomNavigationAction-root.MuiBottomNavigationAction-iconOnly]:min-w-[auto] [&_.MuiBottomNavigationAction-root.MuiBottomNavigationAction-iconOnly]:py-0 [&_.MuiBottomNavigation-root]:h-full [&_.MuiBottomNavigation-root]:w-full [&_.MuiFab-root]:z-[999] [&_.MuiFab-root]:h-[45px] [&_.MuiFab-root]:w-[45px] [&_.MuiFab-root]:min-w-[45px] [&_.MuiFab-root]:rounded-full"}>
            <BottomNavigation value={value} onChange={handleChange}>
                {
                    leftButtons.map( (button, index) => (
                        <BottomNavigationAction
                            key={index}
                            label={button.label}
                            value={button.value}
                            icon={button.icon}
                            showLabel={false}
                        />
                    ))
                }    
                <BottomNavigationAction style={{visibility: 'hidden'}}/>    
                <ActionMenu t={1}/>
                {
                    rightButtons.map( (button, index) => (
                        <BottomNavigationAction
                            key={index}
                            label={button.label}
                            value={button.value}
                            icon={button.icon}
                            showLabel={false}
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
                            <Box
                                className={clsx("mx-6 my-4", {["[&_.MuiBox-root]:w-full [&_.MuiBox-root]:flex-[1_1_100%] [&_.MuiBox-root]:items-center [&_.MuiBox-root]:justify-start [&_.MuiBox-root]:text-left"]: drawer.anchor === 'top'})}
                            >
                                {
                                    drawer.name === 'dashboard'
                                    ?                                
                                        props.bottomToolBar.map( (item, index) => (
                                            <Box
                                                className={"flex text-xl [&_.MuiIconButton-label_svg]:h-8 [&_.MuiIconButton-label_svg]:w-8 [&_.MuiIconButton-label_svg]:fill-white [&_.MuiIconButton-label_svg]:stroke-white [&_.MuiIconButton-root]:w-full [&_.MuiIconButton-root]:min-w-full [&_.MuiIconButton-root]:justify-start [&_.MuiIconButton-root]:rounded-none [&_.MuiIconButton-root]:p-3 [&_.MuiIconButton-root]:text-[1.1em] [&_.MuiIconButton-root]:text-white [&_.MuiIconButton-root_span.text]:ml-5 [&_.MuiIconButton-root.active]:!text-secondary [&_.MuiIconButton-root.active_svg]:!fill-secondary [&_.MuiIconButton-root.active_svg]:!stroke-secondary"}
                                                key={index} 
                                            >
                                                <NavigationIcon {...item} showLabel={true} isMobile={true}/>
                                            </Box>
                                            
                                        ))
                                    :
                                        drawer.name === "filter"
                                        ?
                                            props.topToolBar.map((item, index) => (
                                                item.t === 1 || item.t === 2 || item.t === 3 || item.t === 11
                                                ? (
                                                    <Box
                                                        className={"flex text-xl [&_.MuiIconButton-label_svg]:h-8 [&_.MuiIconButton-label_svg]:w-8 [&_.MuiIconButton-label_svg]:fill-white [&_.MuiIconButton-label_svg]:stroke-white [&_.MuiIconButton-root]:w-full [&_.MuiIconButton-root]:min-w-full [&_.MuiIconButton-root]:justify-start [&_.MuiIconButton-root]:rounded-none [&_.MuiIconButton-root]:p-3 [&_.MuiIconButton-root]:text-[1.1em] [&_.MuiIconButton-root]:text-white [&_.MuiIconButton-root_span.text]:ml-5 [&_.MuiIconButton-root.active]:!text-secondary [&_.MuiIconButton-root.active_svg]:!fill-secondary [&_.MuiIconButton-root.active_svg]:!stroke-secondary"}
                                                        key={index} 
                                                    >
                                                        <NavigationIcon {...item} showLabel={true} isMobile={true}/>
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
                                                            className={"flex text-xl [&_.MuiIconButton-label_svg]:h-8 [&_.MuiIconButton-label_svg]:w-8 [&_.MuiIconButton-label_svg]:fill-white [&_.MuiIconButton-label_svg]:stroke-white [&_.MuiIconButton-root]:w-full [&_.MuiIconButton-root]:min-w-full [&_.MuiIconButton-root]:justify-start [&_.MuiIconButton-root]:rounded-none [&_.MuiIconButton-root]:p-3 [&_.MuiIconButton-root]:text-[1.1em] [&_.MuiIconButton-root]:text-white [&_.MuiIconButton-root_span.text]:ml-5 [&_.MuiIconButton-root.active]:!text-secondary [&_.MuiIconButton-root.active_svg]:!fill-secondary [&_.MuiIconButton-root.active_svg]:!stroke-secondary"}
                                                            key={index} 
                                                        >
                                                            <NavigationIcon {...item} showLabel={true} isMobile={true}/>
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
                                                                className={"flex text-xl [&_.MuiIconButton-label_svg]:h-8 [&_.MuiIconButton-label_svg]:w-8 [&_.MuiIconButton-label_svg]:fill-white [&_.MuiIconButton-label_svg]:stroke-white [&_.MuiIconButton-root]:w-full [&_.MuiIconButton-root]:min-w-full [&_.MuiIconButton-root]:justify-start [&_.MuiIconButton-root]:rounded-none [&_.MuiIconButton-root]:p-3 [&_.MuiIconButton-root]:text-[1.1em] [&_.MuiIconButton-root]:text-white [&_.MuiIconButton-root_span.text]:ml-5 [&_.MuiIconButton-root.active]:!text-secondary [&_.MuiIconButton-root.active_svg]:!fill-secondary [&_.MuiIconButton-root.active_svg]:!stroke-secondary"}
                                                                key={index} 
                                                            >
                                                                <NavigationIcon {...item} showLabel={true} isMobile={true}/>
                                                            </Box>
                                                        )  
                                                        : null
                                                    ))
                                                :
                                                    ''
                                }
                            </Box>
                        </SwipeableDrawer>
                    </React.Fragment>
                ))
            }
        </Box>
    )
}


export default MobileFooter