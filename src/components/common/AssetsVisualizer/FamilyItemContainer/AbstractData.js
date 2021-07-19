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
    useEffect(() => {
        if(data == null || data.toString().trim() == '') {
            const getAbstractData = async (applicationNumber) => {
                setLoading(true)
                const getData = await PatenTrackApi.getAbstractData(number)
                setLoading(false)
                if( getData.data != null && getData.data != '' ) {
                    setAbstractData(getData.data.abstracts)
                }
            }
            getAbstractData(selectedAsset[1])
        } else {
            setAbstractData(data)
        }
    },[ data ]) 

    if(loading) return <Loader/> 
    return (
        <Typography variant="body2">{abstractData}</Typography>
    )
}

export default AbstractData