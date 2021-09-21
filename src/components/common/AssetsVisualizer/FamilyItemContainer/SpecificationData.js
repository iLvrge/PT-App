import React, {useEffect, useState} from 'react'
import {Typography} from '@material-ui/core'
import useStyles from './styles'
import Loader from "../../Loader"
import PatenTrackApi from '../../../../api/patenTrack2'

const SpecificationData = ({ data, number }) => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [ specificationParseData, setSpecificationParseData ] = useState([])
    useEffect(() => {
        let parseData = data
        try{
            parseData =  JSON.parse(data)
        } catch(e) {
            parseData = data
        }
        console.log("SpecificationData", parseData)
        if((Array.isArray(parseData) && parseData.length == 0) || parseData == '' || parseData == null) {            
            getSpecificationData()
        } else {
            setSpecificationParseData(parseData)
        }        
    }, [data])

    useEffect(() => {
        getSpecificationData()
    }, [number])

    const getSpecificationData = async () => {
        setLoading(true)
        PatenTrackApi.cancelSpecificationData()
        const getData = await PatenTrackApi.getSpecificationData(number.replace('/', '').replace(/[, ]+/g, ''))
        setLoading(false)
        if( getData.data != null && getData.data != '' ) {
            setSpecificationParseData(getData.data)
        } else {
            setSpecificationParseData([])
        }
    }

    const SpecificationTree = (props) => {
        return(
            <div className={classes.filetree}>
                <ul id={`specifications`} className={`filetree treeview`} width='100%'>
                {props.children.length > 0 && props.children.map( (child, index) => (
                    <li
                        key={`asset-type-${index}`}
                    >   
                        <span id={`specification_${index}`}>
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
            Array.isArray(specificationParseData) 
            ?
            <SpecificationTree children={specificationParseData}/>
            :
            ''
        }
        </>
    )
}

export default SpecificationData