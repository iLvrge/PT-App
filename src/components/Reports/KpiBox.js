import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import useStyles from './styles'
import { IconButton, Button, Typography, Tooltip, Zoom, Paper, List, ListItem, ListItemText } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
import { numberWithCommas } from '../../utils/numbers';
import AddToolTip from './AddToolTip';


const KpiBox = (props) => {
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))

    const ShowTable = (props) => {
        if(props.data.length === 0) return ''
        return (
            <Paper className={classes.tableContainer}>
                <List>
                    {
                        props.data.map( (item, index) => (
                            <ListItem key={index}>
                                <ListItemText className={classes.itemContainer} disableTypography={true}>
                                    <Typography
                                        variant="body2" 
                                        component="div"
                                    >
                                        <span className={classes.itemHeading}>{item.name}:</span><span className={classes.itemText}>{numberWithCommas(item.number)}</span>
                                    </Typography>                                    
                                </ListItemText>
                            </ListItem>
                        ))
                    }
                </List>
            </Paper>
        )
    }

    return (
        <div className={clsx(classes.chartContainer, classes.widthResponsive)}>
            <Button 
                size="small" 
                variant="outlined" 
                className={clsx(classes.actionButton)} 
                onClick={() => props.handleList(props.id, props.card.type)}
                disabled={
                    (parseInt(props.card?.number) == 0 && typeof props.card.list == 'undefined') || (props.card?.list && props.card.list.length == 0) ? true : false
                }
            >
                View List                
            </Button> 
            <AddToolTip
                tooltip='See Example'
                placement='bottom'
            >
                <span>
                    <IconButton 
                        size="small" 
                        onClick={() => props.handleClick(props.id)} 
                        className={clsx(classes.exampleButton, props.active === props.id ? classes.active : '')}
                        disabled={props.card?.number != '0' ? false : true}
                    >
                        <AutoAwesomeIcon />
                    </IconButton>    
                </span>
            </AddToolTip>
            {
                props.card?.list
                ?
                    <ShowTable
                        data={props.card.list}
                    />
                :
                    <Typography 
                        variant="h2" 
                        component="div"
                    >
                        {
                            props.card?.currency && props.card?.currency === true 
                                ? 
                                    props.card?.number > 1000 
                                        ? 
                                            `$${numberWithCommas(parseInt(props.card.number / 1000))}`
                                        : 
                                            numberWithCommas(props.card?.number) 
                                : 
                                    numberWithCommas(props.card?.number)
                        }
                    </Typography>
            }           
            
            <div>
                <AddToolTip
                    tooltip={props.card.tooltip}
                    placement='bottom'
                    grid={props.grid}
                >
                    <Typography variant="h6" component="div" align="center" className={classes.border}>
                        {props.card.title}
                    </Typography>
                </AddToolTip>  
            </div>        
        </div>
    ) 
}


export default KpiBox;