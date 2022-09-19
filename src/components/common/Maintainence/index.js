import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Fab from '@mui/material/Fab';
import { MonetizationOn } from '@mui/icons-material';
import { setMaintainenceFileName } from '../../../actions/patentTrackActions2';
import FullScreen from '../FullScreen';
import LoadMaintainenceAssets from '../IllustrationCommentContainer/LoadMaintainenceAssets';
import useStyles from "./styles";



const Maintainance = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [ dashboardFullScreen, setDashboardFullScreen ] = useState( false )
    const selectedMaintainencePatents = useSelector(state => state.patenTrack2.selectedMaintainencePatents)

    const onChangeFileName = useCallback((event) => {
        dispatch(setMaintainenceFileName(event.target.value))
    }, [ dispatch ])

    const menuItems = [
        {
            id: 1,
            label: 'Maintainence Assets',
            component: LoadMaintainenceAssets,
            standalone: true,   
            fullScreen: dashboardFullScreen,
            handleFullScreen: setDashboardFullScreen,
            onChangeFileName: onChangeFileName,
            rows: selectedMaintainencePatents
        }
    ] 

    if(selectedMaintainencePatents.length === 0) return null
    return (
        <React.Fragment>
            <Fab size="small" aria-label='Pay Maintainence Due' color='primary' onClick={() => setDashboardFullScreen(!dashboardFullScreen)} className={classes.floatIcon}>
                <MonetizationOn/>
            </Fab>
            {
                dashboardFullScreen === true && (
                    <FullScreen 
                        componentItems={menuItems} 
                        showScreen={dashboardFullScreen} 
                        setScreen={setDashboardFullScreen} 
                    />
                )
            }
      </React.Fragment>
    )
}


export default Maintainance;