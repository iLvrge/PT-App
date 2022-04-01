import React from 'react'

import useStyles from './styles'

const DisplayFile = (props) => {

    const classes = useStyles() 

    return (
        <iframe src={props.templateURL} className={classes.templateFrame}></iframe>
    )
}


export default DisplayFile;