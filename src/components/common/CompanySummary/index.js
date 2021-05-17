import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import PatenTrackApi from '../../../api/patenTrack2'
import { capitalize, numberWithCommas } from '../../../utils/numbers'

import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import useStyles from './styles'
import Typography from '@material-ui/core/Typography'


const ShowData = ({ data, number }) => {  
    return (
      <Typography variant="body1">      
        {number === true ? numberWithCommas(data) : capitalize(data.split('_').join(' ').trim())}
      </Typography>
    )
} 

const CompanySummary = () => {
    const classes = useStyles()
    const [companyData, setCompanyData] = useState({companies: 0, assets: 0, transactions: 0, parties: 0, inventors: 0, activites: 0, products: 0})

    useEffect(() => {
        const findSummary = async() => {
            const { data } = await PatenTrackApi.getCompanySummary()
            if( data != null ) {
                setCompanyData( data )
            }
        }
        findSummary()
    }, [])

    return(
        <TableContainer
            component='div'
            className={classes.root}
        >
            <Table>
                <TableBody>
                    {
                        Object.keys(companyData).map( key => (
                            <TableRow>
                                <TableCell>
                                    <ShowData data={key} />
                                </TableCell>
                                <TableCell>
                                    <ShowData data={companyData[key]} number={true}/>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}



export default CompanySummary
