import React from 'react';
  
import {  
    Battery60 as Battery60Icon, 
    NoteAddOutlined as NoteAddOutlinedIcon,
    HandshakeOutlined as HandshakeOutlinedIcon,
    Badge as BadgeIcon,
    FileOpen as FileOpenIcon,
    Language as LanguageIcon, 
    StackedBarChartOutlined as StackedBarChartOutlinedIcon,
    LeaderboardOutlined as LeaderboardOutlinedIcon,
    ShoppingCartOutlined as ShoppingCartOutlinedIcon,
    PsychologyOutlined as PsychologyOutlinedIcon
 } from '@mui/icons-material'       
import { FaLightbulb } from "react-icons/fa";
import useStyles from './styles' 


const LabelWithIcon = ({label, showLabel}) => {
    const classes = useStyles() 
    return (  
            label == 'Filling' || label == 'Fillings'
            ? 
                <NoteAddOutlinedIcon className={classes.svgIcon}/> 
                :
                label == 'Assignments' 
                ? 
                    <svg id="icons" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={`MuiSvgIcon-root MuiSvgIcon-fontSizeMedium ${classes.svgImg}`}><path d="M52,7H12a6,6,0,0,0-6,6V51a6,6,0,0,0,6,6H52a6,6,0,0,0,6-6V13A6,6,0,0,0,52,7Zm2,44a2,2,0,0,1-2,2H12a2,2,0,0,1-2-2V13a2,2,0,0,1,2-2H52a2,2,0,0,1,2,2Z"/><path d="M45,29a2,2,0,0,0,0-4H22.83l2.58-2.59a2,2,0,0,0-2.82-2.82l-6,6a2,2,0,0,0-.44,2.18A2,2,0,0,0,18,29Z"/><path d="M47,36H20a2,2,0,0,0,0,4H42.17l-2.58,2.59a2,2,0,1,0,2.82,2.82l6-6a2,2,0,0,0,.44-2.18A2,2,0,0,0,47,36Z"/></svg> 
                :
                    label == 'Innovations' || label == 'Innovation'? 
                        <FaLightbulb className={classes.svgImg}/> 
                    :
                        label == 'Names' ? 
                            <BadgeIcon className={classes.svgIcon}/> 
                        :
                            label == 'Lifespan'
                            ? 
                                <Battery60Icon className={classes.svgIcon}/> 
                            :
                                label == 'Cited by'
                                ? 
                                    <FileOpenIcon className={classes.svgIcon}/>
                                :
                                    label == 'Salable'
                                    ? 
                                        <img src={`https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/sell.png`} className={classes.img} /> 
                                    :
                                        label ==  'Licensable'
                                        ?
                                            <img src={`https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/licenseout.png`} className={classes.img} />
                                        :
                                            label ==  'Jurisdictions'
                                            ? 
                                                <LanguageIcon className={classes.svgIcon}/> 
                                            : 
                                                label == 'Invented'
                                                ? 
                                                    <PsychologyOutlinedIcon className={classes.svgIcon}/>
                                                :
                                                    label ==  'Acquired'
                                                    ? 
                                                        <ShoppingCartOutlinedIcon className={classes.svgIcon}/>
                                                    :
                                                        label == 'Divested'
                                                        ?
                                                            <img src={`https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/sales.svg`} className={classes.img} />
                                                        :
                                                            label == 'Years'
                                                            ?
                                                                <StackedBarChartOutlinedIcon className={classes.svgIcon}/> 
                                                            :
                                                                label == 'Ages'
                                                                ?
                                                                    <LeaderboardOutlinedIcon className={classes.svgIcon}/> 
                                                                :
                                                                    ''
    )
}

export default LabelWithIcon;