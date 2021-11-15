import React, 
        { useCallback, 
          useEffect, 
          useState,
        } from 'react'
import { useDispatch, 
          useSelector 
        } from 'react-redux'
import { 
    AppBar, 
    Toolbar, 
  } from '@material-ui/core'

import CustomerLogo from '../CustomerLogo'
import HeaderIcons from '../HeaderIcons'

import useStyles from './styles'
import SearchBar from '../SearchBar'

const MobileHeader = () => {
    const classes = useStyles()
    const profile = useSelector(store => (store.patenTrack.profile))
    const siteLogo = useSelector(state => (state.patenTrack.siteLogo.site_logo ? state.patenTrack.siteLogo.site_logo.logo_big : 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/logo/patentrack_new_logo.png'))
    
    const iconsList = [
        {
            name: 'notification'
        },
        /* {
            name: 'clipboard'
        },
        {
            name: 'calendar'
        } */
    ]

    useEffect(() => {
        const confirmFullScreen = window.confirm('Open app in full screen mode')

        if(confirmFullScreen) {
            document.documentElement.webkitRequestFullScreen();
        }
    }, [])
    
    return(
        <AppBar 
            className={classes.root} 
            color='transparent' 
            position='relative'
        >
            <Toolbar 
                className={classes.toolbar}
            >
                <span 
                    className={classes.logoContainer} 
                >
                    <img 
                        src={siteLogo} 
                        className={classes.siteLogo} 
                        alt={''} 
                        />
                </span>
                <div 
                    className={classes.rightPanel}
                > 
                    {/* <SearchBar/>    */}    
                    <HeaderIcons 
                        icons={iconsList}
                    />  
                    <CustomerLogo />  
                </div>
            </Toolbar>
        </AppBar>
    )
}


export default MobileHeader