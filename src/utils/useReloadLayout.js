import React, { useState } from 'react';

import {  useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setBreadCrumbsAndCategory } from "../actions/patentTrackActions2";
import { controlList } from "./controlList";
import { setDashboardScreen, setTimelineScreen } from '../actions/uiActions';


export function useReloadLayout() {
    const location = useLocation(),  dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    const checkPageLoad = (type) => {
        const {pathname} = location;
        let replaceWord = type === 1 ? '/patent_assets' : '/assignments';
        console.log("checkPageLoad", type)
        let loadLayoutName = pathname.replace(replaceWord, '')
        if(loadLayoutName.indexOf('/') !== -1) {
            loadLayoutName = loadLayoutName.replace('/', '')
        } 
        if(loadLayoutName != '') {
            setIsLoaded(true)
            console.log('loadLayoutName', loadLayoutName)
            let findIndex = controlList.findIndex( item => item.type == 'menu' && item.mainHeading.toLowerCase() == loadLayoutName) 
            if(loadLayoutName.indexOf('pay_maintainence_fee') !== -1) {
                findIndex = controlList.findIndex( item => item.type == 'menu' && item.mainHeading.toLowerCase() == 'maintenance fee due') 
            }
            if(findIndex !== -1){
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