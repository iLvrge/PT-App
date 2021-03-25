import React, { useCallback } from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import useStyles from './styles'

const AsbtractData = ({ data }) => {
	const classes = useStyles()
    
    return (
        <Typography variant="body2">{data}</Typography>
    )
}

export default AsbtractData