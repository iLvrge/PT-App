import React from 'react'

import useStyles from './styles'

const ClaimData = ({ data }) => {
    const classes = useStyles()

    const ClaimTree = (props) => {
        return(
            <div className={classes.filetree}>
                <ul id={`claimsTree`} className={`filetree treeview`} width='100%'>
                {props.children.length > 0 && props.children.map( (child, index) => (
                    <li
                        key={`asset-type-${index}`}
                    >
                        <span id={`claim${index}`}>{ Object.keys(child).length > 0 && child.text != undefined ? child.text : child }</span>
                    </li>
                ))}
                </ul>
            </div>
        )
    }

    let parseData = data
    try{
        parseData =  JSON.parse(data)
    } catch(e) {
        parseData = data
    }

    return ( 
        <>
        {
            Array.isArray(parseData) 
            ?
            <ClaimTree children={parseData}/>
            :
            <div dangerouslySetInnerHTML={ { __html:parseData } } className={classes.filetree}></div>
        }
        </>
    )
}

export default ClaimData