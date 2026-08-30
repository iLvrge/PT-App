import React from 'react';
  
import Battery60Icon from '@mui/icons-material/Battery60'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import BadgeIcon from '@mui/icons-material/Badge'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import LanguageIcon from '@mui/icons-material/Language'
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined'
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { FaLightbulb } from "react-icons/fa";


const LabelWithIcon = ({label, showLabel, otherName}) => {
    return (  
            label == 'Filling' || label == 'Fillings'
            ? 
                <NoteAddOutlinedIcon className="mr-2"/> 
                :
                label == 'Assignments' 
                ? 
                    <svg id="icons" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mr-2 inline-block h-[1em] w-[1em] shrink-0 fill-current text-2xl"><path d="M52,7H12a6,6,0,0,0-6,6V51a6,6,0,0,0,6,6H52a6,6,0,0,0,6-6V13A6,6,0,0,0,52,7Zm2,44a2,2,0,0,1-2,2H12a2,2,0,0,1-2-2V13a2,2,0,0,1,2-2H52a2,2,0,0,1,2,2Z"/><path d="M45,29a2,2,0,0,0,0-4H22.83l2.58-2.59a2,2,0,0,0-2.82-2.82l-6,6a2,2,0,0,0-.44,2.18A2,2,0,0,0,18,29Z"/><path d="M47,36H20a2,2,0,0,0,0,4H42.17l-2.58,2.59a2,2,0,1,0,2.82,2.82l6-6a2,2,0,0,0,.44-2.18A2,2,0,0,0,47,36Z"/></svg> 
                :
                    label == 'Innovations' || label == 'Innovation'  || label == 'Owned' || (typeof otherName != 'undefined' && (label == 'Invented' || label == 'Acquired' || label == 'Maintenance Fee Due' || label == 'Abandoned' || label == 'Title' || label == 'To Divest'))? 
                        <TipsAndUpdatesOutlinedIcon className="mr-2"/> 
                    :
                        label == 'Names' ? 
                            <BadgeIcon className="mr-2"/> 
                        :
                            label == 'Lifespan'
                            ? 
                                <Battery60Icon className="mr-2"/> 
                            :
                                label == 'Cited by'
                                ? 
                                    <FileOpenIcon className="mr-2"/>
                                :
                                    label == 'Salable'
                                    ? 
                                        <StorefrontOutlinedIcon className="mr-2"/>
                                    :
                                        label ==  'Licensable'
                                        ?
                                            <GppGoodOutlinedIcon className="mr-2"/>
                                        :
                                            label ==  'Jurisdictions'
                                            ? 
                                                <LanguageIcon className="mr-2"/> 
                                            : 
                                                label == 'Invented'
                                                ? 
                                                    <PsychologyOutlinedIcon className="mr-2"/>
                                                :
                                                    label ==  'Acquired'
                                                    ? 
                                                        <ShoppingCartOutlinedIcon className="mr-2"/>
                                                    :
                                                        label == 'Divested'
                                                        ?
                                                            <img src={`https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/sales.svg`} className="mr-2 w-[1.5em]" />
                                                        :
                                                            label == 'Years'
                                                            ?
                                                                <StackedBarChartOutlinedIcon className="mr-2"/> 
                                                            :
                                                                label == 'Ages'
                                                                ?
                                                                    <LeaderboardOutlinedIcon className="mr-2"/> 
                                                                :
                                                                    ''
    )
}

export default LabelWithIcon;