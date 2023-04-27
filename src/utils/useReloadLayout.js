import React, { useState } from 'react';

import {  useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setAllAssetTypes, setAssetTypesSelect, setBreadCrumbsAndCategory } from "../actions/patentTrackActions2";
import { controlList } from "./controlList";
import { setDashboardScreen, setTimelineScreen } from '../actions/uiActions';


export function useReloadLayout() {
    const location = useLocation(),  dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    const checkPageLoad = (type) => {
        const {pathname} = location;
        let replaceWord = type === 1 ? '/patent_assets' : '/assignments'; 
        let loadLayoutName = pathname.replace(replaceWord, '')
        if(process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' && loadLayoutName != '') {
            if(location.pathname.split('/').length == 4) {
                const code = loadLayoutName.split('/').pop()
                loadLayoutName = loadLayoutName.replace(code, '') 
            }
        }
        if(loadLayoutName.indexOf('/') !== -1) {
            loadLayoutName = loadLayoutName.replace(/\//g, '')
        }  
        if(loadLayoutName != '') {
            setIsLoaded(true) 
            let findIndex = controlList.findIndex( item => item.type == 'menu' && item.mainHeading.toLowerCase() == loadLayoutName) 
            if(loadLayoutName.indexOf('pay_maintainence_fee') !== -1) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.mainHeading.toLowerCase() == 'maintenance fee due') 
            }
            
            if(findIndex !== -1){
                if(['due_dilligence', 'acquisition_transactions', 'divestitures_transactions', 'licensing_transactions', 'collateralization_transactions', 'litigation_transactions'].includes(controlList[findIndex].mainHeading)) {
                    let activityIDs = []
                    switch(controlList[findIndex].mainHeading) {
                        case 'acquisition_transactions':
                            activityIDs = [1, 6] 
                            break
                        case 'divestitures_transactions':
                            activityIDs = [2, 7] 
                            break
                        case 'licensing_transactions':
                            activityIDs = [3, 4] 
                            break
                        case 'collateralization_transactions':
                            activityIDs = [5, 12] 
                            break
                        case 'inventing_transactions':
                            activityIDs = [10] 
                            break
                        case 'litigation_transactions':
                            activityIDs = [9] 
                            break
                        default:
                            activityIDs = [] 
                            break
                    }
                    dispatch( setAllAssetTypes(activityIDs.length > 0 ? false : true) )
                    dispatch( setAssetTypesSelect(activityIDs) )
                }
                dispatch(setBreadCrumbsAndCategory(controlList[findIndex])) 
                if(type !== 1) {
                    dispatch(setDashboardScreen(false))
                    dispatch(setTimelineScreen(true))
                }
            }
        }
    } 
    return [isLoaded, checkPageLoad];
}