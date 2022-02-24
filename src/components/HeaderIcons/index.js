import React, 
        { useCallback, 
        } from 'react'
import { 
    Box,
    IconButton,
    Badge
} from '@mui/material'
import { useDispatch, 
    useSelector 
} from 'react-redux'
import { 
    NotificationsNone as NotificationsIcon,
    PermContactCalendar as PermContactCalendarIcon
  } from '@mui/icons-material'

 
import useStyles from './styles'
import clsx from 'clsx'

import { 
    setSelectedAssetsPatents, 
    setAssetsIllustration, 
    setClipboardAssetsDisplay,  
    setChannelID,
    setAssetTypeAssignmentAllAssets,
} from '../../actions/patentTrackActions2'

import {  
    setAssetFamily,
    setConnectionBoxView,
    setPDFView,
    setFamilyItemDisplay,
   } from '../../actions/patenTrackActions'
  
  import { 
    setDriveTemplateFrameMode,
    toggleFamilyMode,
    toggleFamilyItemMode,
    toggleUsptoMode,
    toggleLifeSpanMode,
  } from '../../actions/uiActions'

const HeaderIcons = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    
    const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)
    const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)


    const handleClipboard = useCallback(() => {
        if( clipboard_assets.length > 0 ) {
            dispatch(setClipboardAssetsDisplay( !display_clipboard ))
    
            if( !display_clipboard === false ) {
                dispatch(setAssetsIllustration(null))
                dispatch(setSelectedAssetsPatents([]))
                if(process.env.REACT_APP_ENVIROMENT_MODE === 'PRO') {
                    dispatch(setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }))
                }
                dispatch(setAssetFamily([]))
                dispatch(setFamilyItemDisplay({}))
                dispatch(setChannelID(''))
                dispatch(setConnectionBoxView(false))
                dispatch(setPDFView(false))
                dispatch(toggleUsptoMode(false))
                dispatch(toggleLifeSpanMode(false))
                dispatch(toggleFamilyMode(false))
                dispatch(toggleFamilyItemMode(false))
                dispatch(setDriveTemplateFrameMode(false))
            }
        }
    }, [ dispatch, clipboard_assets, display_clipboard ])
    
    return (
        <Box
            display='flex'
        >
            {
                props.icons.map( icon => (
                    <IconButton
                        className={clsx(classes.buttonIcon, { [classes.clipIconIsActive]: icon.name === 'clipboard' && display_clipboard === true }, { [classes.clipIconActive]: icon.name === 'clipboard' && clipboard_assets.length > 0 })}
                        {...(icon.name === 'clipboard' && { onClick: handleClipboard })}
                        size="large">
                        {
                            icon.name === 'notification'
                            ?                        
                                
                                    <Badge 
                                        badgeContent={0} 
                                        color="secondary"
                                    > 
                                        <NotificationsIcon/>
                                    </Badge>         
                                
                            :
                                icon.name === 'calendar'
                                ?
                                    <PermContactCalendarIcon/>                                    
                                :
                                icon.name === 'clipboard' && (
                                    <Badge badgeContent={clipboard_assets.length} color="secondary">    
                                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M40,5c-3.3085938,0-6,2.6914062-6,6v3h-5c-0.4199219,0-0.7949219,0.262207-0.9394531,0.6567383l-0.880188,2.4077148	h-9.0836792C16.9404297,17.0644531,16,18.0048828,16,19.1611328v53.7421875C16,74.0595703,16.9404297,75,18.0966797,75h43.8066406
                                        C63.0595703,75,64,74.0595703,64,72.9033203V19.1611328c0-1.15625-0.9404297-2.0966797-2.0966797-2.0966797H52.755188
                                        L51.875,14.6567383C51.7304688,14.262207,51.3554688,14,50.9355469,14H46v-3C46,7.6914062,43.3085938,5,40,5z M53.1289062,22
                                        c0.3261719,0,0.6328125-0.1591797,0.8193359-0.4267578c0.1875-0.2680664,0.2324219-0.6098633,0.1201172-0.9165039
                                        l-0.5820923-1.5922852h8.4170532C61.9541016,19.0644531,62,19.1103516,62,19.1611328v53.7421875
                                        C62,72.9541016,61.9541016,73,61.9033203,73H18.0966797C18.0458984,73,18,72.9541016,18,72.9033203V19.1611328
                                        c0-0.0507812,0.0458984-0.0966797,0.0966797-0.0966797h8.3526001l-0.5820923,1.5922852
                                        c-0.1123047,0.3066406-0.0673828,0.6484375,0.1201172,0.9165039C26.1738281,21.8408203,26.4804688,22,26.8066406,22H53.1289062z
                                        M50.2363281,16l1.4619141,4H28.2373047l1.4619141-4H35c0.5527344,0,1-0.4477539,1-1v-4c0-2.2055664,1.7939453-4,4-4
                                        s4,1.7944336,4,4v4c0,0.5522461,0.4472656,1,1,1H50.2363281z"  className="color000 svgShape"></path><path d="M23,38h8V28h-8V38z M25,30h4v6h-4V30z"  className="color000 svgShape"></path><rect width="23" height="2" x="34" y="32"  className="color000 svgShape"></rect><rect width="17" height="2" x="23" y="44"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="54"  className="color000 svgShape"></rect><rect width="34" height="2" x="23" y="64"  className="color000 svgShape"></rect><rect width="2" height="4" x="38.968" y="9"  className="color000 svgShape"></rect></svg>
                                    </Badge>
                                )                                    
                        }
                    </IconButton> 
                ))
            }
        </Box>
    );

}


export default HeaderIcons