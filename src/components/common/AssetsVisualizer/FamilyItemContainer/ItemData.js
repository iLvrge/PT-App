import React, { useEffect,  useState, useCallback } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'


const ItemData = ({ data }) => {

    const [ itemData, setItemData ] = useState({})

    useEffect(() => {
        if(Object.keys(data).length === 0) return setItemData({})

        const getItemDataFunction = () => { 
            setItemData(data)
        }
        getItemDataFunction()
    },[ data ])

    return (
        <Paper>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Inventor:</TableCell>
                        <TableCell>{itemData.inventors}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Applicant:</TableCell>
                        <TableCell>{itemData.applicants}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Assignee:</TableCell>
                        <TableCell>{itemData.assignee}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Priority:</TableCell>
                        <TableCell>{itemData.priority_date}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Filed:</TableCell>
                        <TableCell>{itemData.inventors}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Issued:</TableCell>
                        <TableCell>{itemData.inventors}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    )
}

export default ItemData