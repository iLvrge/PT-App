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
    const companies = useSelector( state => state.patenTrack2.mainCompaniesList.list) 
     
    const channel_id = useSelector( state => state.patenTrack2.channel_id )    
    const auth_token = useSelector(state => state.patenTrack2.auth_token) 
     

    useEffect(() => {
        if(!isLoaded) { 
            checkPageLoad(0)
        }
    }, [])

    

    useEffect(() => {
        if((process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') && auth_token !== null) {
            let url = location.pathname
            if(url != '' && location != 'blank') {
                url = url.split('/').pop()
                if(url != '') {
                    const getDashboardData = async() => {
                        PatenTrackApi.cancelShareDashboardRequest()
                        const {data} = await PatenTrackApi.getShareDashboardList(url)
                        if(data != null && Object.keys(data).length > 0) {
                            let { selectedCompanies, tabs, customers, share_button } = data
                            if(typeof selectedCompanies != 'undefined' && selectedCompanies != '') {
                                try{
                                    dispatch(setDashboardShareData(data))
                                    selectedCompanies = JSON.parse(selectedCompanies) 
                                    if(selectedCompanies.length > 0) {
                                        dispatch(setMainCompaniesSelected(selectedCompanies, []))
                                        (async () => {
                                            const promise = companies.map((row, index) => {
                                                if(!selectedCompanies.includes(row.representative_id)) {
                                                    companies[index].status = 0
                                                }
                                            })
                                            await Promise.all(promise)
                                            dispatch(setMainCompanies(companies, { append: false }))
                                        })()
                    
                                        if(typeof tabs != 'undefined' && tabs != '') {
                                            dispatch( setAssetTypesSelect([tabs]) )
                                        }
                                        if(typeof customers != 'undefined' && customers != '') {
                                            customers = JSON.parse(customers)
                                            if(customers.length > 0) {
                                                dispatch(setSelectAssignmentCustomers(customers) )
                                            }
                                        }
                                    }                    
                                } catch (e){
                                    console.log(e)
                                }
                            }
                        }
                    }
                    getDashboardData()
                }
            } 
        }
        /* return (() => {
        }) */
    }, [auth_token, dispatch]) 

      
    useEffect(() => {
        updateResizerBar(companyRef, openBar)
    }, [ companyRef, openBar ]) 

 
    return (
        <SplitPane
            className={classes.splitPane}
            split="vertical"
            size={companyBarSize}
            onChange={(size) => { 
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