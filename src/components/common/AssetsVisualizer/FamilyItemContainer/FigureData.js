import React, {useEffect, useState} from 'react'

import useStyles from './styles'
import Loader from "../../Loader"
import PatenTrackApi from '../../../../api/patenTrack2'


const FigureData = ( { data, number } ) => {

    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [ figures, setFigures ] = useState([])

    useEffect(() => {
        let parseData = data
        try{
            parseData =  JSON.parse(data)
        } catch(e) {
            parseData = data
        }
        console.log("FigureData", parseData)
        if((Array.isArray(parseData) && parseData.length == 0) || parseData == '' || parseData == null) {
            const getSpecificationData = async () => {
                setLoading(true)
                const getData = await PatenTrackApi.getFamilyData(number.replace('/', '').replace(/[, ]+/g, ''))
                setLoading(false)
                if( getData.data != null && getData.data != '' ) {
                    setFigures(getData.data)
                }
            }
            getSpecificationData()
        } else {
            setFigures(parseData)
        }        
    }, [data])

    if(loading) return <Loader/> 

    return (
        <>
        {
            Array.isArray(figures) && figures.length > 0 && figures.map( figure => (
                <img src={figure}  className={classes.figures}/>
            ))
        }
        </>
    )
}

export default FigureData