import React from 'react'
import { useSelector } from 'react-redux'
import { IconButton, Tooltip, Typography, Zoom } from '@mui/material'

import {
    Person as PersonIcon, 
    People as PeopleIcon, 
    InsertDriveFile as InsertDriveFileIcon, 
    Business as BusinessIcon, 
    Gavel as GavelIcon, 
    Contacts as ContactsIcon,
    Description as DescriptionIcon,
    Settings as SettingsIcon,
    Home as HomeIcon,
    Add as AddIcon,
    CropSquare as CropSquareIcon,
    AccountTreeOutlined as AccountTreeOutlinedIcon 
} from '@mui/icons-material' 

import useStyles from './styles'
import clsx from 'clsx'
import { getAuthConnectToken } from '../../utils/tokenStorage'
import { ANALYTICS, CHART, DISCUSSION, TV } from '../../utils/icons'

{/* <IconButton onClick={click} className={(( bar === true ) || (bar === false && data.length > 0 && (selected.length > 0 || selectAll === true))) ? cl.filterButtonActive : ''}></IconButton> */}
const NavigationIcon = ({click, tooltip, bar, t, disabled, highlight, margin, showLabel, label, isMobile}) => {
    const classes = useStyles() 
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)

    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectedAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)

    const assetTypeCompaniesSelected = useSelector(state => state.patenTrack2.assetTypeCompanies.selected)
    const assetTypeCompaniesSelectedAll = useSelector(state => state.patenTrack2.assetTypeCompanies.selectAll)

    const assetsTransactionsSelected = useSelector(state => state.patenTrack2.assetTypeAssignments.selected)
    const assetsTransactionsSelectedAll = useSelector(state => state.patenTrack2.assetTypeAssignments.selectAll)
    const selectedTransaction = useSelector(state => state.patenTrack2.selectedAssetsTransactions)

    const assetTypeAssignmentAssetsSelected = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selected)
    const assetTypeAssignmentAssetsSelectedAll = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.selectAll)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)

    const template_document_url = useSelector(state => state.patenTrack2.template_document_url)
    const driveTemplateFrameMode = useSelector(state => state.ui.driveTemplateFrameMode)
    const new_drive_template_file = useSelector(state => state.patenTrack2.new_drive_template_file)

    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const dashboardScreen = useSelector(state => state.ui.dashboardScreen)

    const dashboardICONS = [0, 1, 7, 45]
    const removeFilterICONS = selectedCategory == 'top_law_firms' || selectedCategory == 'top_lenders' ? [2, 11] : selectedCategory == 'proliferate_inventors' ? [2, 3, 4, 5, 10] : ['late_recording', 'acquisition_transactions', 'divestitures_transactions', 'licensing_transactions', 'collateralization_transactions', 'inventing_transactions', 'litigation_transactions'].includes(selectedCategory)  ? [2, 3, 11] : [2, 3, 4, 11]


    const TeamBarIcon = () => {
        return (
            <DISCUSSION/>
        )
    }


    const LawfirmIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g><path d="M37,30H27a5.006,5.006,0,0,1-5-5V14a1,1,0,0,1,1-1,3.85,3.85,0,0,0,4-4,1,1,0,0,1,2,0c0,.008.411,4,12,4a1,1,0,0,1,1,1V25A5.006,5.006,0,0,1,37,30ZM24,14.915V25a3,3,0,0,0,3,3H37a3,3,0,0,0,3-3V14.99c-6.783-.138-10.03-1.684-11.583-3.178A5.821,5.821,0,0,1,24,14.915Z"/><path d="M45,19H43V7a5.006,5.006,0,0,0-5-5H26a5.006,5.006,0,0,0-5,5V19H19V7a7.008,7.008,0,0,1,7-7H38a7.008,7.008,0,0,1,7,7Z"/><path d="M41 23V21a2 2 0 0 0 0-4V15a4 4 0 0 1 0 8zM23 23a4 4 0 0 1 0-8v2a2 2 0 0 0 0 4zM31 64H12a1 1 0 0 1-1-1V36a1 1 0 0 1 .876-.992L27 33.117V29h2v5a1 1 0 0 1-.876.992L13 36.883V62H31zM53 39H51V36.883L35.876 34.992A1 1 0 0 1 35 34V29h2v4.117l15.124 1.891A1 1 0 0 1 53 36zM62 64H34a1 1 0 0 1-1-1V43a1 1 0 0 1 1-1H62a1 1 0 0 1 1 1V63A1 1 0 0 1 62 64zM35 62H61V44H35z"/><path d="M56 43H54V40H44v3H42V39a1 1 0 0 1 1-1H55a1 1 0 0 1 1 1zM44 55H38a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 44 55zm-5-2h4V51H39zM58 55H52a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 58 55zm-5-2h4V51H53z"/><rect width="2" height="7" x="38" y="43"/><rect width="2" height="7" x="42" y="43"/><rect width="2" height="7" x="52" y="43"/><rect width="2" height="7" x="56" y="43"/><path d="M41 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 38 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 41 60zM55 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 52 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 55 60z"/><rect width="4" height="2" x="34" y="51"/><rect width="8" height="2" x="44" y="51"/><rect width="4" height="2" x="58" y="51"/><path d="M32,39a1,1,0,0,1-.707-.293l-4-4,1.414-1.414L32,36.586l3.293-3.293,1.414,1.414-4,4A1,1,0,0,1,32,39Z"/><path d="M34,41a1,1,0,0,1-.707-.293L32,39.414l-1.293,1.293a1,1,0,0,1-1.414,0l-4-4A1,1,0,0,1,25,36V34h2v1.586l3,3,1.293-1.293a1,1,0,0,1,1.414,0L34,38.586l3-3V34h2v2a1,1,0,0,1-.293.707l-4,4A1,1,0,0,1,34,41Z"/><rect width="2" height="17" x="17" y="46"/></g></svg>
        )
    }
    
    
    if((selectedCategory  != 'due_dilligence' /* && selectedCategory  != 'proliferate_inventors' && selectedCategory != 'top_lenders' */ && removeFilterICONS.includes(t)) || ( dashboardScreen === true  && !dashboardICONS.includes(t))) return null
        
    return (
        <div className={clsx(classes.showIcon, {[classes.marginBottom25]: typeof margin !== 'undefined' && margin === true && typeof isMobile !== 'undefined' && isMobile === false, [classes.mobile]: typeof isMobile !== 'undefined' && isMobile === true})}> 
            <Tooltip   
                title={
                    <Typography 
                        color="inherit" 
                        variant='body2'
                    >
                        {tooltip}
                    </Typography>
                } 
                placement='right' 
                enterDelay={500}
                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                classes={{ 
                    tooltip: clsx(classes.tooltip, {[classes.mobileTooltip]: typeof isMobile !== 'undefined' && isMobile === true})
                }}
            >
                <span> 
                    <IconButton
                        {...(disabled == undefined && { onClick: click })}
                        className = {
                            /* process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'
                                ?
                                    t != 5 && bar === true 
                                        ? 'active'
                                :
                                    ''
                                
                            : */
                            bar === true   ? 'active' 
                            :  
                            t === 1 &&  highlight == undefined && (selectedCompanies.length > 0 || selectedCompaniesAll === true) ? 'selection_indicator'
                            :
                            t === 2 && (assetTypesSelected.length > 0 && assetTypesSelectedAll === false) ? 'selection_indicator'
                            :
                            t === 3 && ((assetTypeCompaniesSelected.length > 0 || assetTypeCompaniesSelectedAll === true) && (assetTypesSelected.length > 0 && !assetTypesSelected.includes(10))) ? 'selection_indicator'
                            :
                            t === 11 && ((assetTypeCompaniesSelected.length > 0 || assetTypeCompaniesSelectedAll === true) && (assetTypesSelected.length > 0 && assetTypesSelected.includes(10))) ? 'selection_indicator'
                            :
                            t === 4 && (selectedTransaction.length > 0 || assetsTransactionsSelected.length > 0 || assetsTransactionsSelectedAll === true) ? 'selection_indicator'
                            :
                            t === 5 && (selectedAssetsPatents.length > 0 || assetTypeAssignmentAssetsSelected.length > 0 || assetTypeAssignmentAssetsSelectedAll === true) ? 'selection_indicator'
                            :
                            t === 10 && (driveTemplateFrameMode === true && ( template_document_url != null || new_drive_template_file != null )) ? 'selection_indicator'
                            :
                            ''
                        }
                        {...(disabled && {disabled: true})}
                        size="large">
                        {
                            t === 0 
                            ?
                                <SettingsIcon className={`noStroke`}/>
                            :
                            t === 1 || t === 36
                            ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={`noStroke`}><path d="M46.4 7.8L34.9 6.1V1c0-.6-.4-1-1-1H1.8c-.6 0-1 .4-1 1v46c0 .6.4 1 1 1h44.5c.6 0 1-.4 1-1V8.8c-.1-.5-.4-.9-.9-1zM19.9 46h-4.1v-6h4.1v6zm13 0h-11v-7c0-.6-.4-1-1-1h-6.1c-.6 0-1 .4-1 1v7h-11V2h30.1v44zm2 0V8.1l10.4 1.6v4.9h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7v6.2h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7V31h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7v6.2h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7V46H34.9z"/><path d="M21.5 9h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 16.8h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 24.6h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 32.4h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM25.2 41.9c0 .6.4 1 1 1h2.7c.6 0 1-.4 1-1s-.4-1-1-1h-2.7c-.6 0-1 .5-1 1zM6.8 42.9h2.7c.6 0 1-.4 1-1s-.4-1-1-1H6.8c-.6 0-1 .4-1 1s.5 1 1 1zM8.2 9h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 16.8h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 24.6h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 32.4h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1z"/></svg>
                            :
                            t === 2
                            ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`noStroke`}><path d="M0 0h24v24H0z" fill="none"/><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>
                            :
                            t === 3
                            ?
                                selectedCategory === 'top_law_firms'
                                ?
                                    <LawfirmIcon/>
                                : 
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`noStroke`}><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>
                            :
                            t === 4
                            ?
                                <svg id="icons" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={`noStroke`}><path d="M52,7H12a6,6,0,0,0-6,6V51a6,6,0,0,0,6,6H52a6,6,0,0,0,6-6V13A6,6,0,0,0,52,7Zm2,44a2,2,0,0,1-2,2H12a2,2,0,0,1-2-2V13a2,2,0,0,1,2-2H52a2,2,0,0,1,2,2Z"/><path d="M45,29a2,2,0,0,0,0-4H22.83l2.58-2.59a2,2,0,0,0-2.82-2.82l-6,6a2,2,0,0,0-.44,2.18A2,2,0,0,0,18,29Z"/><path d="M47,36H20a2,2,0,0,0,0,4H42.17l-2.58,2.59a2,2,0,1,0,2.82,2.82l6-6a2,2,0,0,0,.44-2.18A2,2,0,0,0,47,36Z"/></svg>
                            :
                            t === 5
                            ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`noStroke`}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"/></svg>
                            :
                            t === 6 
                            ?
                                <TV/>
                            :
                            t === 7
                            ?
                                getAuthConnectToken() === 2 
                                ?
                                    <svg fill="#fff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="21px" height="21px"><path d="M26 21H12c-.552 0-1 .448-1 1s.448 1 1 1h6v19c0 .552.447 1 1 1s1-.448 1-1V23h6c.552 0 1-.448 1-1S26.552 21 26 21zM55.5 27c3.033 0 5.5-2.467 5.5-5.5S58.533 16 55.5 16 50 18.467 50 21.5 52.467 27 55.5 27zM55.5 18c1.93 0 3.5 1.57 3.5 3.5S57.43 25 55.5 25 52 23.43 52 21.5 53.57 18 55.5 18z"/><path d="M46 27h-8c0 0 0 0 0 0v-4.261C38.951 23.526 40.171 24 41.5 24c3.033 0 5.5-2.467 5.5-5.5S44.533 13 41.5 13c-1.329 0-2.549.474-3.5 1.261V6.384c0-.889-.391-1.727-1.071-2.298-.682-.572-1.57-.812-2.45-.657L5.305 8.578C3.39 8.916 2 10.572 2 12.517l0 38.966c0 1.945 1.39 3.602 3.305 3.939l29.174 5.148c.175.031.35.046.523.046.699 0 1.381-.245 1.927-.703.68-.57 1.071-1.408 1.071-2.297v-8.16C38.901 49.803 39.896 50 41 50c4.573 0 6.559-3.112 6.97-4.757C47.99 45.163 48 45.082 48 45V29C48 27.897 47.103 27 46 27zM41.5 15c1.93 0 3.5 1.57 3.5 3.5S43.43 22 41.5 22 38 20.43 38 18.5 39.57 15 41.5 15zM35.643 58.382c-.133.112-.422.29-.816.219L5.652 53.453C4.695 53.284 4 52.456 4 51.483V12.517c0-.973.695-1.801 1.652-1.97l29.174-5.148c.394-.069.683.106.816.219C35.775 5.731 36 5.978 36 6.384l0 51.232C36 58.022 35.776 58.27 35.643 58.382zM46 44.855C45.82 45.396 44.756 48 41 48c-1.167 0-2.174-.245-3-.73V29h8V44.855zM60 29h-8c-1.103 0-2 .897-2 2v14c0 .39.226.744.58.907C51.401 46.288 53.542 47 55 47c4.573 0 6.559-3.112 6.97-4.757C61.99 42.163 62 42.082 62 42V31C62 29.897 61.103 29 60 29zM60 41.855C59.82 42.396 58.756 45 55 45c-.837 0-2.146-.364-3-.674V31h8V41.855z"/></svg>
                                :
                                    getAuthConnectToken() === 1
                                    ?
                                        <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="slack" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="svg-inline--fa fa-slack fa-w-14 fa-2x"><path fill="currentColor" d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z" ></path></svg>   
                                    :
                                        <TeamBarIcon/>                    
                            :
                            t === 8
                            ?
                                <CHART/>
                            :
                            t === 9
                            ?
                                <ANALYTICS/>
                            :
                            t === 10
                            ? 
                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 30 30"  version="1.1" viewBox="0 0 30 30" ><g><path d="M28.595,7.562l-5.438-6.309l-1.078-1.25H9.228c-1.727,0-3.124,1.397-3.124,3.124v3.971H8.04l-0.001-3.21   c0.004-0.971,0.784-1.756,1.752-1.756l10.994-0.01v5.208c0.001,1.939,1.567,3.51,3.507,3.51h3.807L27.91,25.86   c-0.004,0.967-0.784,1.747-1.752,1.754L9.652,27.606c-0.883,0-1.594-0.866-1.6-1.935V24.4H6.114v1.896   c0,1.907,1.277,3.455,2.845,3.455l17.763-0.005c1.726,0,3.124-1.404,3.124-3.126V9.016L28.595,7.562" fill="#292929"/><path d="M20.145,25.368H0V6.129h20.145V25.368 M1.934,23.432h16.274V8.065H1.934" /><path d="M10.314,9.069   c0.305,0.141,0.242,0.328,0.148,1.201c-0.097,0.905-0.414,2.554-1.032,4.173c-0.616,1.622-1.529,3.21-2.325,4.39   c-0.797,1.178-1.478,1.943-1.998,2.386c-0.519,0.441-0.882,0.559-1.115,0.599c-0.233,0.04-0.339,0-0.405-0.117   c-0.063-0.118-0.084-0.315-0.031-0.551c0.053-0.234,0.181-0.51,0.542-0.863c0.36-0.354,0.956-0.785,1.785-1.188   c0.829-0.402,1.891-0.775,2.762-1.031s1.551-0.393,2.146-0.5c0.595-0.108,1.104-0.187,1.604-0.226c0.5-0.04,0.988-0.04,1.467,0   c0.478,0.039,0.945,0.117,1.348,0.216c0.406,0.097,0.745,0.217,1.042,0.402c0.299,0.187,0.552,0.441,0.681,0.726   c0.127,0.286,0.127,0.6,0.021,0.825c-0.105,0.227-0.318,0.364-0.563,0.441c-0.246,0.08-0.522,0.099-0.851,0   c-0.33-0.098-0.712-0.314-1.115-0.599c-0.404-0.284-0.829-0.638-1.381-1.187c-0.553-0.551-1.232-1.298-1.807-2.023   c-0.573-0.727-1.041-1.434-1.358-2.033c-0.319-0.599-0.489-1.09-0.627-1.582c-0.138-0.491-0.244-0.98-0.287-1.422   c-0.043-0.443-0.021-0.837,0.021-1.149c0.042-0.315,0.106-0.55,0.213-0.708c0.106-0.157,0.256-0.235,0.362-0.275   s0.169-0.04,0.234-0.049c0.063-0.009,0.126-0.029,0.222,0c0.094,0.03,0.216,0.104,0.34,0.18" fill="none"  strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.75"/></g></svg>
                            :
                            t === 11
                            ?
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24"  viewBox="0 0 24 24" className={`noStroke`}><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M13,8.57c-0.79,0-1.43,0.64-1.43,1.43s0.64,1.43,1.43,1.43s1.43-0.64,1.43-1.43S13.79,8.57,13,8.57z"/><path d="M13,3C9.25,3,6.2,5.94,6.02,9.64L4.1,12.2C3.85,12.53,4.09,13,4.5,13H6v3c0,1.1,0.9,2,2,2h1v3h7v-4.68 c2.36-1.12,4-3.53,4-6.32C20,6.13,16.87,3,13,3z M16,10c0,0.13-0.01,0.26-0.02,0.39l0.83,0.66c0.08,0.06,0.1,0.16,0.05,0.25 l-0.8,1.39c-0.05,0.09-0.16,0.12-0.24,0.09l-0.99-0.4c-0.21,0.16-0.43,0.29-0.67,0.39L14,13.83c-0.01,0.1-0.1,0.17-0.2,0.17h-1.6 c-0.1,0-0.18-0.07-0.2-0.17l-0.15-1.06c-0.25-0.1-0.47-0.23-0.68-0.39l-0.99,0.4c-0.09,0.03-0.2,0-0.25-0.09l-0.8-1.39 c-0.05-0.08-0.03-0.19,0.05-0.25l0.84-0.66C10.01,10.26,10,10.13,10,10c0-0.13,0.02-0.27,0.04-0.39L9.19,8.95 c-0.08-0.06-0.1-0.16-0.05-0.26l0.8-1.38c0.05-0.09,0.15-0.12,0.24-0.09l1,0.4c0.2-0.15,0.43-0.29,0.67-0.39l0.15-1.06 C12.02,6.07,12.1,6,12.2,6h1.6c0.1,0,0.18,0.07,0.2,0.17l0.15,1.06c0.24,0.1,0.46,0.23,0.67,0.39l1-0.4c0.09-0.03,0.2,0,0.24,0.09 l0.8,1.38c0.05,0.09,0.03,0.2-0.05,0.26l-0.85,0.66C15.99,9.73,16,9.86,16,10z"/></g></g></svg>
                            :
                            t === 12
                            ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`noStroke`}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                            :
                            t === 31 
                            ?
                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="slack" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="MuiSvgIcon-root"><path fill="currentColor" d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z"></path></svg>
                            :
                            t === 32
                            ?
                                <svg enableBackground="new 0 0 24 24"  version="1.1" viewBox="0 0 24 24" className={`noStroke`} xmlns="http://www.w3.org/2000/svg" ><g><path d="M23,4V2.1C23,1.5,22.5,1,21.9,1H9.8L9,0H1.1C0.5,0,0,0.5,0,1.1v21.8C0,23.5,0.5,24,1.1,24h21.8c0.6,0,1.1-0.5,1.1-1.1V5.1   C24,4.5,23.6,4.1,23,4z M22,22H2V2h6l3,4h11V22z M22,4H12l-1.5-2H22V4z"/><path d="M11,9v1.1c-0.4,0.1-0.7,0.2-1,0.4L9.2,9.8l-1.4,1.4L8.6,12c-0.2,0.3-0.3,0.7-0.4,1H7v2h1.1c0.1,0.4,0.2,0.7,0.4,1l-0.8,0.8   l1.4,1.4l0.8-0.8c0.3,0.2,0.7,0.3,1,0.4V19h2v-1.1c0.4-0.1,0.7-0.2,1-0.4l0.8,0.8l1.4-1.4L15.4,16c0.2-0.3,0.3-0.7,0.4-1H17v-2   h-1.1c-0.1-0.4-0.2-0.7-0.4-1l0.8-0.8l-1.4-1.4L14,10.6c-0.3-0.2-0.7-0.3-1-0.4V9H11z M14,14c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2   S14,12.9,14,14z"/></g></svg>
                            :
                            t === 41
                            ?
                                <svg enableBackground="new 0 0 24 24" class="noStroke" version="1.1" viewBox="0 0 24 24" className={`noStroke`}  xmlns="http://www.w3.org/2000/svg" ><g><path d="M20.9,0H3.1C2.5,0,2,0.5,2,1.1v21.8C2,23.5,2.5,24,3.1,24h17.8c0.6,0,1.1-0.5,1.1-1.1V1.1C22,0.5,21.5,0,20.9,0z M20,22H4   V9h16V22z M20,7H4V6h16V7z M20,5H4V4h16V5z M20,3H4V2h16V3z"/><rect height="1" width="10" x="7" y="12"/><rect height="1" width="10" x="7" y="14"/><rect height="1" width="10" x="7" y="16"/><rect height="1" width="10" x="7" y="18"/></g></svg>
                            :
                            t === 42
                            ?
                                <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg" class="noStroke"><g><path d="M23,4V2.1C23,1.5,22.5,1,21.9,1H9.8L9,0H1.1C0.5,0,0,0.5,0,1.1v21.8C0,23.5,0.5,24,1.1,24h21.8c0.6,0,1.1-0.5,1.1-1.1V5.1   C24,4.5,23.6,4.1,23,4z M22,22H2V2h6l3,4h11V22z M22,4H12l-1.5-2H22V4z"/><polygon points="8,19 10,19 8,17  "/><rect height="2.8" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 32.0919 14.7071)" width="8.5" x="8.8" y="12.6"/></g></svg>
                            :
                            t === 33
                            ?
                                <TeamBarIcon/>
                            : 
                            t === 34
                            ?
                                <PeopleIcon />
                            :
                            t === 35
                            ?
                                <InsertDriveFileIcon />
                            :
                            t === 37
                            ?
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M72,22H47V8c0-0.55-0.45-1-1-1H34c-0.55,0-1,0.45-1,1v14H8c-0.55,0-1,0.45-1,1v49c0,0.55,0.45,1,1,1h64c0.55,0,1-0.45,1-1
                                V23C73,22.45,72.55,22,72,22z M35,9h10v14v4H35v-4V9z M71,71H9V24h24v3h-1c-0.55,0-1,0.45-1,1s0.45,1,1,1h2h12h2c0.55,0,1-0.45,1-1
                                s-0.45-1-1-1h-1v-3h24V71z"/><path d="M11 33v35c0 .55.45 1 1 1h56c.55 0 1-.45 1-1V33c0-.55-.45-1-1-1H12C11.45 32 11 32.45 11 33zM13 34h54v33H13V34zM40 17c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3S38.35 17 40 17zM40 13c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1S39.45 13 40 13z"/><path d="M32 38H16c-.55 0-1 .45-1 1v18c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V39C33 38.45 32.55 38 32 38zM17.08 56c.48-2.83 2.95-5 5.92-5h2c2.97 0 5.44 2.17 5.92 5H17.08zM25 49h-1-1c-2.39 0-4.53 1.06-6 2.73V40h14v11.73C29.53 50.06 27.39 49 25 49zM31 61H17c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1S31.55 61 31 61zM62 52H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 52 62 52zM62 47H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 47 62 47zM62 62H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 62 62 62zM62 57H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 57 62 57zM62 42H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 42 62 42zM62 37H38c-.55 0-1 .45-1 1s.45 1 1 1h24c.55 0 1-.45 1-1S62.55 37 62 37z"/><path d="M28,45c0-2.21-1.79-4-4-4s-4,1.79-4,4s1.79,4,4,4S28,47.21,28,45z M24,47c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2
                                S25.1,47,24,47z"/></svg>
                            :
                            t === 38 || t === 39
                            ?
                                <LawfirmIcon/>
                            :
                            t === 40
                            ?
                                <HomeIcon />
                            :
                                t === 45
                                ?
                                    <AddIcon />
                                :
                                    t === 46
                                    ?
                                        <AccountTreeOutlinedIcon />
                                    :
                                    ''
                        }
                        { 
                            showLabel === true && (
                                <span className='text'>{label}</span> 
                            ) 
                        }
                    </IconButton>
                </span>
            </Tooltip>
        </div>
    );
}

export default NavigationIcon