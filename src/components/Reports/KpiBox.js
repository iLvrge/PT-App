import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import useStyles from './styles'
import { IconButton, Button, Typography, Tooltip, Zoom, Table, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
import { numberWithCommas } from '../../utils/numbers';


const KpiBox = (props) => {
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))

    const ShowTable = (props) => {
        if(props.data.length === 0) return ''
        return (
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                    {
                        props.data.map( item => (
                            <TableRow>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{numberWithCommas(item.number)}</TableCell>
                            </TableRow>
                        ))
                    }
                </Table>
            </TableContainer>
        )
    }

    return (
        <div className={classes.chartContainer}>
            <Button 
                size="small" 
                variant="outlined" 
                className={clsx(classes.actionButton)} 
                onClick={() => props.handleList(props.id, props.card.type)}
                disabled={
                    parseInt(props.card?.number) == 0 || (props.card?.list && props.card.list.length == 0) ? true : false
                }
            >
                See List                
            </Button> 
            <IconButton 
                size="small" 
                onClick={() => props.handleClick(props.id)} 
                className={clsx(classes.exampleButton, props.active === props.id ? classes.active : '')}
                disabled={props.card?.number != '0' ? false : true}
            >
                <AutoAwesomeIcon />
            </IconButton>
            {
                props.card?.list
                ?
                    <ShowTable
                        data={props.card.list}
                    />
                :
                    <Typography 
                        variant="h2" 
                        component="div" gutterBottom
                    >
                        {numberWithCommas(props.card?.number)}
                    </Typography>
            }           
            <Tooltip 
                title="Tooltip" 
                placement="right"
                enterDelay={0}
                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                className={clsx(classes.tooltip/* , {[classes.mobileTooltip]: typeof isMobile !== 'undefined' && isMobile === true} */)}  
            >
                <div>
                    <Typography variant="h6" component="div" align="center" className={classes.border}>
                        {props.card.title}
                    </Typography>
                </div>
            </Tooltip>              
        </div>
    ) 
}


export default KpiBox;