import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import useStyles from './styles'

const AssignmentData = ({ data }) => {
    const [ assignmentData, setAssignmentData ] = useState([])
    const classes = useStyles()
    
    useEffect(() => {
        if(data.length === 0) {
            setAssignmentData([])
            return
        } 

        const getAssignmentDataFunction = () => {
            setAssignmentData(data)
        }

        getAssignmentDataFunction()
    },[ data ])


    const AssignmentRow = ({ key, index, row }) => {
        return (
            <>
            <TableRow>
                <TableCell>Exec. Date:</TableCell>
                <TableCell>{moment(row.assignee_date).format('L')}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Assignor:</TableCell>
                <TableCell>{row.assignor}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Assignee:</TableCell>
                <TableCell>{row.assignee}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Conveyance:</TableCell>
                <TableCell>{row.rights}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Recorded:</TableCell>
                <TableCell>{moment(row.recorded).format('L')}</TableCell>
            </TableRow>
            </>
        )
    }

    return (
        <>
            {
                assignmentData != null && assignmentData.length > 0 
                ?
                <>
                {assignmentData.map((assignment, index) => (
                    <Table className={classes.borderBottom}>
                        <TableBody>
                            <AssignmentRow
                                key={index}
                                index={index}
                                row={assignment}
                            />
                            
                        </TableBody>
                    </Table>
                ))}
                </>
                : 
                ''
            }
        </>
    )
}

export default AssignmentData