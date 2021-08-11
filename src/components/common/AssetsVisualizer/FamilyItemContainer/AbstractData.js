import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import useStyles from './styles'

import Loader from "../../Loader"
import PatenTrackApi from '../../../../api/patenTrack2'

const AbstractData = ({ data, number }) => {
    const classes = useStyles()
    const [ abstractData, setAbstractData ] = useState('')
    const [loading, setLoading] = useState(false)
    const selectedAsset = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const familyDataRetrieved = useSelector( state => state.patenTrack.familyDataRetrieved  )


    useEffect(() => {
        console.log("AbstractData", data, familyDataRetrieved)
        if(familyDataRetrieved === true) {
            if(data == null || data.toString().trim() == '') {                
                getAbstractData()
            } else {
                setAbstractData(data)
            }
        }        
    }, [data, familyDataRetrieved]) 

    useEffect(() => {
        getAbstractData()
    }, [number])

    const getAbstractData = async () => {
        setLoading(true)
        PatenTrackApi.cancelAbstractData()
        const getData = await PatenTrackApi.getAbstractData(number.replace('/', '').replace(/[, ]+/g, ''))
        setLoading(false)
        if( getData.data != null && getData.data != '' ) {
            setAbstractData(typeof getData.data.abstracts !== 'undefined' ? getData.data.abstracts : getData.data)
        } else {
            setAbstractData('')
        }
    }

    if(loading) return <Loader/> 
    return (
        <Typography variant="body2">{abstractData}</Typography>
    )
}

export default AbstractData