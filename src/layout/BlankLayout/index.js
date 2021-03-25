import React, {useEffect} from "react";

import { useDispatch, useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import useStyles from './styles'

import NewHeader from '../../components/NewHeader'
import Loader from '../../components/common/Loader'

const BlankLayout = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const authenticated = useSelector(store => store.auth.authenticated)

    const isLoadingDataInitialized = false
    useEffect(()=>{
        if (!authenticated) { 
          // User is not logged in. Redirect back to login
          /* this.props.history.push(routes.login);
          message.warning("Please login first"); */
          return;
        }
        // Fetch data for logged in user using token
    },[authenticated]);

    
    return (
        <div className={classes.root}>
            <NewHeader />
            {/* Content */}
            {isLoadingDataInitialized ? (
                <Loader />
            ) : (
                <Grid container className={classes.dashboardWarapper}>
                    <Grid container className={classes.dashboard}> 
                        <>
                        {props.children}
                        </>
                    </Grid>
                </Grid>
            )}
        </div>
    );

}

export default BlankLayout;