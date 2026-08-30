import React from 'react'

import './styles.css'

const DisplayFile = (props) => {


    return (
        <iframe src={props.templateURL} className={'pt-template-frame'}></iframe>
    )
}


export default DisplayFile;