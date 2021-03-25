import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

import { Grid, IconButton } from '@material-ui/core'
import SplitPane from 'react-split-pane'
import useStyles from './styles'

import ArrowButton from '../../components/common/ArrowButton'
import NewHeader from '../../components/NewHeader'
import Loader from '../../components/common/Loader'

import CompaniesSelector from '../../components/common/CompaniesSelector'
import AssetsController from '../../components/common/AssetsController'
/* import AssetsControllerTable from '../../components/common/AssetsControllerTable' */
import { resizePane } from '../../utils/splitpane' 

const MainLayout = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [toggleButtonType , setToggleButtonType] = useState(true)
    const [openBar, setOpenBar] = useState(true)
    const [companyButtonVisible, setCompanyButtonVisible] = useState(false)
    const [companyBarSize, setCompanyBarSize] = useState(200)

    const [toggleCustomerButtonType , setToggleCustomerButtonType] = useState(true)
    const [openCustomerBar, setCustomerOpenBar] = useState(true)
    const [customerButtonVisible, setCustomerButtonVisible] = useState(false)
    const [customerBarSize, setCustomerBarSize] = useState(200)
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

    const handleCompanyBarOpen = (event) => {
        setToggleButtonType( !toggleButtonType )
        setOpenBar( !openBar )
        if(!openBar === false) {
            setCompanyBarSize(25)
        } else {
            setCompanyBarSize(200)
        }
    }

    const handleCompanyButton = (event, flag) => {
        event.preventDefault()
        setCompanyButtonVisible( flag )
    }

    const handleCustomersBarOpen = (event) => {
        setToggleCustomerButtonType( !toggleCustomerButtonType )
        setCustomerOpenBar( !openCustomerBar )
        if(!openCustomerBar === false) {
            setCustomerBarSize(25)
        } else {
            setCustomerBarSize(200)
        }
    }

    const handleCustomerButton = (event, flag) => {
        event.preventDefault()
        setCustomerButtonVisible( flag )
    }
    
    return (
        <div className={classes.root}>
            <NewHeader />
            {/* Content */}
            {isLoadingDataInitialized ? (
                <Loader />
            ) : (
                
                <SplitPane
                    className={classes.splitPane}
                    split="vertical"
                    size={companyBarSize}
                    onDragFinished={(size) => resizePane('split1', size, setCompanyBarSize)}
                    >
                        <div 
                            className={classes.companyBar}
                            onMouseOver={(event) => handleCompanyButton(event, true)}
                            onMouseLeave={(event) => handleCompanyButton(event, false)}
                        >
                            
                            { openBar === true 
                                ? 
                                    <>
                                        <ArrowButton handleClick={handleCompanyBarOpen} buttonType={toggleButtonType} buttonVisible={companyButtonVisible}/>
                                        <CompaniesSelector /> 
                                    </>
                                : 
                                <div className={classes.showIcon}>
                                    <IconButton onClick={handleCompanyBarOpen}><i className={`fad fa-building`}></i></IconButton>
                                </div>
                            }
                        </div>
                        <SplitPane
                            className={classes.splitPane}
                            split="vertical"
                            size={customerBarSize}
                            onDragFinished={(size) => resizePane('split2', size, setCustomerBarSize)}
                        >
                            <div style={{ height: '100%'}}
                                onMouseOver={(event) => handleCustomerButton(event, true)}
                                onMouseLeave={(event) => handleCustomerButton(event, false)}
                            >
                                
                                { 
                                    openCustomerBar === true 
                                    ? 
                                        <>
                                            <ArrowButton handleClick={handleCustomersBarOpen} buttonType={toggleCustomerButtonType} buttonVisible={customerButtonVisible}/>
                                            <AssetsController />
                                            {/* <AssetsControllerTable /> */} 
                                        </>
                                    : 
                                    <div className={classes.showIcon}>
                                        <IconButton onClick={handleCustomersBarOpen}><i className={`fad fa-handshake-alt`}></i></IconButton>
                                    </div>
                                }
                            </div>
                            <Grid container className={classes.dashboardWarapper} style={{ height: '100%', paddingLeft: '5px'}}>
                                <Grid container className={classes.dashboard}> 
                                    {props.children}
                                </Grid>
                            </Grid>
                        </SplitPane>
                </SplitPane>
            )}
        </div>
    );
}

export default MainLayout;