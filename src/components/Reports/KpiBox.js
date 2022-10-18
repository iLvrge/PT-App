import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import useStyles from './styles'
import { IconButton, Button, Typography, Tooltip, Zoom, Paper, List, ListItem, ListItemText } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
import { numberWithCommas, capitalAllWords } from '../../utils/numbers';
import AddToolTip from './AddToolTip';


const KpiBox = (props) => {
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))
    const [addWrapper, setAddWrapper] = useState(true)


    const onHandleExample = () => {
        setAddWrapper(!addWrapper)
        props.handleClick(props.id)
    }

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
                                        <span className={clsx(classes.itemHeading, {[classes.wraper]: addWrapper})} title={item.name}>{item.name != undefined && item.name != null ? capitalAllWords(item.name.toLowerCase()) : ''}</span><span className={classes.itemText}>{numberWithCommas(item.number)}</span>
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
        <div className={clsx(classes.chartContainer, classes.widthResponsive, classes.fixKPI)}>
            <div className={classes.headingContainer}>
                <AddToolTip
                    tooltip={props.card.tooltip}
                    placement='bottom'
                    grid={props.grid}
                >
                    <span>
                        <Button 
                            size="small" 
                            variant="outlined" 
                            className={clsx(classes.actionButton)} 
                            onClick={() => props.handleList(props.id, props.card.type)}
                            disabled={
                                (parseInt(props.card?.number) == 0 && typeof props.card.list == 'undefined') || (props.card?.list && props.card.list.length == 0) ? true : false
                            }
                        >
                            {props.card.title}           
                        </Button> 
                    </span>
                </AddToolTip>  
            </div>  
            {
                props.card?.list
                ?
                    <ShowTable
                        data={props.card.list}
                    />
                :
                    [30, 31, 32, 33, 34, 36, 37, 17, 26].includes(props.card.type)
                    ?
                        <div className={classes.boxContainer}>
                            <Typography
                                variant="h5" 
                                component="div"
                                className={clsx(classes.kpiNumberSmall)}
                            >
                                Patents: {numberWithCommas(props.card?.number)}
                            </Typography>
                            <Typography
                                variant="h5"  
                                component="div"
                                className={classes.kpiNumberSmall}
                            >
                                Applications: {numberWithCommas(props.card.other_number)}
                            </Typography>
                        </div>
                    :
                        <Typography 
                            variant="h5" 
                            component="div"
                            className={classes.kpiNumber}
                        >
                            {
                            
                                props.card?.currency && props.card?.currency === true 
                                    ? 
                                        props.card?.number > 1000 
                                            ? 
                                                `$${numberWithCommas(parseInt(props.card.number))}`
                                            : 
                                                `$${numberWithCommas(props.card?.number)}` 
                                    : 
                                        numberWithCommas(props.card?.number)
                            } 
                        </Typography>
            }                    
        </div>
    ) 
}


export default KpiBox;