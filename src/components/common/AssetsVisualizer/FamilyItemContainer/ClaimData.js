import React, {useEffect, useState, useRef, useCallback} from 'react'
import {Typography} from '@material-ui/core'
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
        if((Array.isArray(parseData) && parseData.length == 0) || parseData == '' || parseData == null) {
            getClaimData()
        } else {
            setClaimParseData(parseData)
        }        
    }, [data])

    useEffect(() => {
        getClaimData()
    }, [number])

    /* useEffect( () => {
        if(Array.isArray(claimParseData)) {
            if(treeRef !== null && treeRef.current !== null) {  
                updateDOMElement() 
            }
        }
    }, [ claimParseData, treeRef ]) */


    const treeRef = useCallback(node => {
        if (node !== null) {
            let findClaimContainer = node.querySelectorAll('div[num]')
            if(findClaimContainer.length == 0) {
                findClaimContainer = node.querySelectorAll('div[id*="CLM-"]')
            }
            if(findClaimContainer.length > 0) {
                findClaimContainer.forEach( claim => {
                    const classList = claim.classList
                    classList
                        .add('claim-text')
                    classList
                        .add('patent-text')            
                    const findText = claim.querySelectorAll('div')
                    if(findText.length > 0) {
                        findText.forEach( (text, index)  => {
                            if(index > 0) {
                                const childContainer = text.classList
                                childContainer
                                    .add('claim-text')
                                childContainer
                                    .add('patent-text')     
                            }
                        })
                    }
                })
            }

            let findSpans = node.querySelectorAll('span[idref]'), tap = false
            if(findSpans.length == 0) {
                findSpans = node.querySelectorAll('dependent-claim-reference')
                tap = true
            }
            if(findSpans.length > 0) {
                findSpans.forEach( child => {
                    if(tap === true) {
                        child.classList.add('margin-l-r')
                    }
                    let elementParent = child.closest('div[num]')
                    if(elementParent === null) {
                        elementParent = child.closest('div[id*="CLM-"]')
                    }
                    if(elementParent !== null)  {
                        const classList =  elementParent.classList
                        classList
                            .add('claim-text')
                        classList
                            .add('patent-text-1')      
                    }                
                }) 
            }
        }
    }, []);

   
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
            <div className={classes.filetree} ref={treeRef}>
                <ul id={`claimsTree`} className={`filetree treeview`} width='100%'>
                {props.children.length > 0 && props.children.map( (child, index) => (
                    <li
                        key={`asset-type-${index}`}
                    >
                        <span id={`claim${index}`}>
                            <Typography variant='body2'
                                style={{ whiteSpace: "pre-line" }}
                                dangerouslySetInnerHTML={{__html: Object.keys(child).length > 0 && child.text != undefined ? child.text : child}}
                            ></Typography>
                        </span>
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