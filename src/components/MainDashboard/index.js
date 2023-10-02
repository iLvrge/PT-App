import React, {  useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    useLocation
  } from "react-router-dom";
import SplitPane from 'react-split-pane'

 
import MainCompaniesSelector from '../common/MainCompaniesSelector' 
import IllustrationCommentContainer from '../common/IllustrationCommentContainer'


import { resizePane, resizePane2 } from '../../utils/splitpane'
import { updateResizerBar } from '../../utils/resizeBar' 
 

import {  
    setChannelID,  
    setMainCompanies,
    setMainCompaniesSelected,
    setAssetTypesSelect,
    setSelectAssignmentCustomers,
    setDashboardShareData 
} from '../../actions/patentTrackActions2'


import useStyles from './styles'
import clsx from 'clsx' 
import PatenTrackApi from '../../api/patenTrack2'
import { useReloadLayout } from '../../utils/useReloadLayout';  
import { setFirstBarSize } from '../../actions/uiActions';
import CustomerTable from '../common/CustomerTable';





const MainDashboard = ({
    type,
    openBar,
    companyBarSize, 
    setCompanyBarSize,  
    visualizerBarSize,
    setVisualizerBarSize, 
    setVisualizeOpenBar, 
    openOtherPartyBar,
    openInventorBar, 
    handleOtherPartyBarOpen, 
    openAssignmentBar,
    handleAssignmentBarOpen, 
    openCustomerBar,
    handleCustomersBarOpen,
    handleCommentBarOpen,
    handleInventorBarOpen,  
    commentBarSize,
    setCommentBarSize,
    openCommentBar,
    openIllustrationBar, 
    handleChartBarOpen, 
    setSize,   
    size, 
    setIllustrationRecord, 
    openChartBar,
    openAnalyticsBar, 
    setAnalyticsBar,
    setChartBar, 
    checkChartAnalytics,  
}) => {
    const classes = useStyles() 
    let location = useLocation();
    const dispatch = useDispatch() 
    const companyRef = useRef() 
    const [isLoaded, checkPageLoad] = useReloadLayout() 
    const [ gap, setGap ] = useState( { x: '14.1rem', y: '7.5rem'} )
    const [ isDragging, setIsDragging] = useState(false) 
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false) 
    const firstBarSize = useSelector(state => state.ui.firstBarSize) 
    const channel_id = useSelector( state => state.patenTrack2.channel_id )    
    const auth_token = useSelector(state => state.patenTrack2.auth_token) 
    const profile = useSelector(store => (store.patenTrack.profile))
     

    useEffect(() => {
        if(!isLoaded) { 
            checkPageLoad(0)
        }
    }, [])
    
    /* useEffect(() => {
        if(['DASHBOARD', 'KPI'].includes(process.env.REACT_APP_ENVIROMENT_MODE) && auth_token !== null) {
            let url = location.pathname
            if(url != '' && location != 'blank') {
                url = url.split('/').pop()
                if(url != '') {
                    console.log('typeof useDispatch1', typeof useDispatch)
                    const getDashboardData = async() => {
                        PatenTrackApi.cancelShareDashboardRequest()
                        const {data} = await PatenTrackApi.getShareDashboardList(url)
                        if(data != null && Object.keys(data).length > 0) {
                            let { selectedCompanies, tabs, customers, share_button } = data
                            if(typeof selectedCompanies != 'undefined' && selectedCompanies != '') {
                                try {
                                    if(typeof dispatch === "function") {
                                        dispatch(setDashboardShareData(data))
                                    }
                                    console.log('typeof selectedCompanies', typeof selectedCompanies)
                                } catch(e) {
                                    console.log("Error", e)
                                }
                            }
                        }
                    }
                    getDashboardData()
                }
            } 
        } 
    }, [auth_token, dispatch])  */

      
    useEffect(() => {
        updateResizerBar(companyRef, openBar)
    }, [ companyRef, openBar ])  
 
    return (
        <SplitPane
            className={classes.splitPane}
            split="vertical"
            size={firstBarSize}
            onChange={(size) => { 
                dispatch(setFirstBarSize(size > 900 ? 900 : size))
                setCompanyBarSize(size > 900 ? 900 : size)
            }}
            onDragFinished={(size) => resizePane('split1', size, setCompanyBarSize)}
            ref={companyRef}
        >
            <div 
                className={clsx(classes.companyBar, 'step-1')}
                id={`company_container`} >
                { 
                    openBar === true 
                    ?  
                        <MainCompaniesSelector 
                            selectAll={false} 
                            defaultSelect={''} 
                            addUrl={true} 
                            parentBarDrag={setVisualizerBarSize}
                            parentBar={setVisualizeOpenBar} 
                            checkChartAnalytics={checkChartAnalytics}                               
                        /> 

                    : 
                        (profile?.user && profile.user?.organisation && profile.user.organisation.organisation_type == 'Bank' && type != 9)
                        ?
                            <div id={`parties_container`}  style={{ height: '100%', width: '99%'}}>
                                <CustomerTable 
                                    standalone={true}
                                    parentBarDrag={setVisualizerBarSize}
                                    parentBar={setVisualizeOpenBar}
                                    type={type}
                                    customerType={0}
                                /> 
                            </div>
                        : 
                        ''
                }
            </div> 
            <div className={isDragging === true ? classes.notInteractive : classes.isInteractive} style={{ height: '100%'}} >
                <IllustrationCommentContainer 
                    cls={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPane1OverflowUnset, classes.paneHeightZero, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                    split={`horizontal`} 
                    minSize={50}
                    maxSize={-200}
                    defaultSize={commentBarSize}
                    fn={resizePane}
                    fnParams={setCommentBarSize}
                    commentBar={openCommentBar}
                    openCustomerBar={openCustomerBar}
                    illustrationBar={openIllustrationBar}
                    fnVarName={`split5`}
                    fn2={resizePane2}
                    fn2Params={setSize}
                    primary={'second'}
                    illustrationRecord={setIllustrationRecord}
                    channel_id={channel_id}
                    setChannel={setChannelID}
                    size={size}
                    gap={gap}
                    cube={false}
                    templateButton={false}
                    maintainenceButton={false}
                    visualizerBarSize={visualizerBarSize}
                    chartsBar={openChartBar}
                    analyticsBar={openAnalyticsBar}
                    chartsBarToggle={handleChartBarOpen}
                    checkChartAnalytics={checkChartAnalytics}
                    type={type}
                    assignmentBar={openAssignmentBar}
                    assignmentBarToggle={handleAssignmentBarOpen}
                    setAnalyticsBar={setAnalyticsBar}
                    setChartBar={setChartBar}
                    handleCommentBarOpen={handleCommentBarOpen}
                    handleCustomersBarOpen={handleCustomersBarOpen}
                    openInventorBar={openInventorBar}
                    handleInventorBarOpen={handleInventorBarOpen}  
                    openOtherPartyBar={openOtherPartyBar}
                    handleOtherPartyBarOpen={handleOtherPartyBarOpen}
                    parentBarDrag={setVisualizerBarSize}
                    parentBar={setVisualizeOpenBar}
                /> 
            </div> 
        </SplitPane>
    ) 
} 

export default MainDashboard;