import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import './styles.css'
import { Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material'; 
import clsx from 'clsx'
import { numberWithCommas, capitalAllWords } from '../../utils/numbers';
import AddToolTip from './AddToolTip';
import BreakdownDisplay from './BreakdownDisplay';


const KpiBox = (props) => {
    const profile = useSelector(store => (store.patenTrack.profile))
    const [addWrapper, setAddWrapper] = useState(true)


    const onHandleExample = () => {
        setAddWrapper(!addWrapper)
        props.handleClick(props.id)
    }

    const ShowTable = (props) => {
        if(props.data.length === 0) return ''
        return (
            <Paper className={'pt-table-container'}>
                <List>
                    {
                        props.data.map( (item, index) => (
                            <ListItem key={index}>
                                <ListItemText className={'pt-item-container'} disableTypography={true}>
                                    <Typography
                                        variant="body2" 
                                        component="div"
                                    >
                                        <span className={clsx('pt-item-heading', {[undefined]: addWrapper})} title={item.name}>{item.name != undefined && item.name != null ? capitalAllWords(item.name.toLowerCase()) : ''}</span><span className={'pt-item-text'}>{numberWithCommas(item.number)}</span>
                                    </Typography>                                    
                                </ListItemText>
                            </ListItem>
                        ))
                    }
                </List>
            </Paper>
        )
    } 

    const ButtonWithTooltip = () => {
        const onClick = () => {
            props.handleList(props.id, props.card.type)
        }

        const disableButton = ((parseInt(props.card?.number) == 0 || props.card?.number == null) && parseInt(props.card?.other_number) == 0 && typeof props.card.list == 'undefined') || (props.card?.list && props.card.list.length == 0) ? true : false
        const adjustedButtonProps = {
            disabled: disableButton,
            component: disableButton ? "span" : undefined,
            onClick: disableButton ? undefined : onClick 
        };

        const other = {
            size: "small",
            variant: "outlined"
        }

        const tooltipMessage = parseInt(profile?.user?.organisation?.subscribtion) == 1 ? 'Available in Pro and Enterprise accounts only.' : props.card.tooltip
        const {grid} = props
        return (
            <AddToolTip
                tooltip={tooltipMessage}
                placement='bottom'
                grid={grid}
            > 
                <Button 
                    className={clsx('pt-action-button', 'dashboard_buttons')} 
                    {...adjustedButtonProps}  {...other} 
                >
                    {props.card.title}           
                </Button>  
            </AddToolTip>  
        )
    }

    return (
        <div className={clsx('pt-chart-container', 'pt-width-responsive', 'pt-fix-k-p-i')}>
            <div className={'pt-kpi-heading-container'}>
                <ButtonWithTooltip />
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
                        <div className={'pt-kpi-box-container'}>
                            <Typography
                                variant="h5" 
                                component="div"
                                className={clsx('pt-kpi-number-small')}
                            >
                                Patents: {numberWithCommas(props.card?.number)}
                            </Typography>
                            <Typography
                                variant="h5"  
                                component="div"
                                className={'pt-kpi-number-small'}
                            >
                                Applications: {numberWithCommas(props.card.other_number)}
                            </Typography>
                            {[30, 33, 36].includes(props.card.type) && props.card.other && (
                                <BreakdownDisplay data={props.card.other} />
                            )}
                        </div>
                    :
                        props.card.type == 35
                        ?
                            <div className={'pt-kpi-box-container'}>
                                <Typography
                                    variant="h5" 
                                    component="div"
                                    className={clsx('pt-kpi-number-small')}
                                >
                                    Patents: {numberWithCommas(props.card?.total)}
                                </Typography>
                                <Typography
                                    variant="h5"  
                                    component="div"
                                    className={'pt-kpi-number-small'}
                                >
                                    {
                                        props.card?.number > 1000 
                                        ? 
                                            `$${numberWithCommas(parseInt(props.card.number))}`
                                        : 
                                            `$${numberWithCommas(props.card?.number)}` 
                                    }
                                </Typography>
                            </div>  
                        :
                            <Typography 
                                variant="h5" 
                                component="div"
                                className={'pt-kpi-number'}
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