import React from 'react';
import { Box } from '@mui/system';

import useStyles from './styles'
import clsx from 'clsx';
import { Typography } from '@mui/material';

const TitleBar = (props) => {
    const classes = useStyles();
    return(
        <Box className={
            clsx(
                {[classes.relative]: typeof props.relative !== 'undefined' && props.relative === false ? false : true}
            ) 
        }>
            <span 
                className={
                    clsx(
                        classes.heading, 
                        {[classes.paddingLeft]: typeof props.enablePadding !== 'undefined' && props.enablePadding === false ? false : true}, 
                        {[classes.underline]: typeof props.underline !== 'undefined' && props.underline === false ? false : true},
                        {[classes.absolute]: typeof props.relative !== 'undefined' && props.relative === false ? false : true},
                    ) 
                }
            >
                {
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
                }
            </span>
        </Box>
    )
}


export default TitleBar;