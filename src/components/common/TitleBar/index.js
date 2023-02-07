import React, { useState } from 'react';
import { Box } from '@mui/system';

import useStyles from './styles'
import clsx from 'clsx';
import { IconButton, Typography } from '@mui/material';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const TitleBar = (props) => {
    const classes = useStyles();
    const [enabled, setEnabled] = useState(false)

    const onHandleHelpingText = () => {
        setEnabled(!enabled)
    }
    return(
        <Box className={classes.relative}>
            <span 
                className={
                    clsx(
                        classes.heading, 
                        {[classes.paddingLeft]: typeof props.enablePadding !== 'undefined' && props.enablePadding === true ? true : false}, 
                        {[classes.underline]: typeof props.underline !== 'undefined' && props.underline === true ? true : false},
                        {[classes.absolute]: typeof props.relative !== 'undefined' && props.relative === true ? true : false},
                    ) 
                }
            >
                <IconButton
                    onClick={onHandleHelpingText}
                    className={classes.btn}
                >
                    <HelpOutlineOutlinedIcon/>
                </IconButton>
                {
                    enabled === true
                    ?
                        props.typography === true
                        ?
                            <Typography
                                variant="body2" 
                                component="span"
                            >
                                {props.title}
                            </Typography>
                        :
                            props.title
                    :
                        ''
                }
                {
                    typeof props.button != 'undefined' && (
                        <span style={{display: 'block'}}>
                            <IconButton onClick={(event) => props.button.dashboardScreen === true ? props.button.click(event, true) :  props.button.click()} className={props.button.class} /* className={clsx(classes.settingBtn, {[classes.settingBtnTop]: typeof middle !== 'undefined' && middle === true ? true : false})} */ size="large">
                                <svg style={{width: '24px', fill: '#fff'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M5 11.86V29a1 1 0 0 0 2 0V11.86A4 4 0 0 0 7 4.14V3A1 1 0 0 0 5 3V4.14a4 4 0 0 0 0 7.72zM6 6A2 2 0 1 1 4 8 2 2 0 0 1 6 6zM27 12.14V3a1 1 0 0 0-2 0v9.14a4 4 0 0 0 0 7.72V29a1 1 0 0 0 2 0V19.86a4 4 0 0 0 0-7.72zM26 18a2 2 0 1 1 2-2A2 2 0 0 1 26 18zM16 30a1 1 0 0 0 1-1V23.86a4 4 0 0 0 0-7.72V3a1 1 0 0 0-2 0V16.14a4 4 0 0 0 0 7.72V29A1 1 0 0 0 16 30zM14 20a2 2 0 1 1 2 2A2 2 0 0 1 14 20z" /></svg> 
                            </IconButton>
                        </span>   
                    )
                }
            </span>
        </Box>
    )
}


export default TitleBar;