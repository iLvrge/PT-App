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
  } from '@mui/material'

import CustomerLogo from '../CustomerLogo'
import HeaderIcons from '../HeaderIcons'

import SearchBar from '../SearchBar'

const MobileHeader = () => {
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

    
    return(
        <AppBar 
            className={"static z-[1206] mb-[5px] w-[initial] overflow-hidden border border-[#363636] bg-[#222222] px-2.5 transition-[margin] duration-[195ms] ease-[cubic-bezier(0.4,0,0.6,1)]"} 
            color='transparent' 
            position='relative'
        >
            <Toolbar 
                className={"relative min-h-10 p-0"}
            >
                <span 
                    className={"flex w-[170px]"} 
                >
                    <img 
                        src={siteLogo} 
                        className={"mr-[15px] h-6"} 
                        alt={''} 
                        />
                </span>
                <span  className={"flex items-center justify-start overflow-hidden"}>
                    <CustomerLogo />  
                </span> 
            </Toolbar>
        </AppBar>
    )
}


export default MobileHeader