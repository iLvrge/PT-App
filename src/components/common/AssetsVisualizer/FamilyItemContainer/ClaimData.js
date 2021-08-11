import React, {useEffect, useState} from 'react'

import useStyles from './styles'
import Loader from "../../Loader"
import PatenTrackApi from '../../../../api/patenTrack2'

const ClaimData = ({ data, number }) => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [ claimParseData, setClaimParseData] = useState('')
    useEffect(() => {
        let parseData = data
        try{
            parseData =  JSON.parse(data)
        } catch(e) {
            parseData = data
        }
        console.log("ClaimData", parseData)
        if((Array.isArray(parseData) && parseData.length == 0) || parseData == '' || parseData == null) {
            getClaimData()
        } else {
            setClaimParseData(parseData)
        }        
    }, [data])

    useEffect(() => {
        getClaimData()
    }, [number])

    const getClaimData = async () => {
        setLoading(true)
        PatenTrackApi.cancelClaimsData()
        const getData = await PatenTrackApi.getClaimsData(number.replace('/', '').replace(/[, ]+/g, ''))
        setLoading(false)
        if( getData.data != null && getData.data != '' ) {
            setClaimParseData(getData.data)
        } else {
            setClaimParseData([])
        }
    }

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

    
    if(loading) return <Loader/> 

    return ( 
        <>
        {
            Array.isArray(claimParseData) 
            ?
            <ClaimTree children={claimParseData}/>
            :
            <div dangerouslySetInnerHTML={ { __html:claimParseData } } className={classes.filetree}></div>
        }
        </>
    )
}

export default ClaimData