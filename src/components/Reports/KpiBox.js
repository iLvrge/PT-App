import React, {useState} from 'react'
import { 
    useSelector 
} from 'react-redux'
import useStyles from './styles'
import { IconButton, Button, Typography, Tooltip, Zoom } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import clsx from 'clsx'
import { numberWithCommas } from '../../utils/numbers';


const KpiBox = (props) => {
    const classes = useStyles();
    const profile = useSelector(store => (store.patenTrack.profile))

    const getRandomArbitrary = () => {
        const min = 1000, max = 50000
        return parseInt(Math.random() * (max - min) + min);
    }

    return (
        <div className={classes.chartContainer}>
            <Button 
                size="small" 
                variant="outlined" 
                className={clsx(classes.actionButton)} 
                onClick={() => props.handleList(props.id, props.card.type)}
                disabled={
                    parseInt(profile?.user?.organisation?.subscribtion) === 1 ? 
                        true  
                    :
                        parseInt(profile?.user?.organisation?.subscribtion) === 2 ? 
                            (props.type < 3 ) ?
                                parseInt(props.card?.number) == 0 ? true : false
                            :
                                true
                        :
                            parseInt(profile?.user?.organisation?.subscribtion) === 3 ? 
                                parseInt(props.card?.number) == 0 ? true : false                                
                            :
                                true
                }
            >
                {   parseInt(profile?.user?.organisation?.subscribtion) > 2 ? 
                        'Let\'s Fix it!' 
                        : 
                        parseInt(profile?.user?.organisation?.subscribtion) === 2 && (props.type < 3 ) ?
                            'Let\'s Fix it!'
                        :
                            'Upgrade and Fix it!' 
                }
            </Button> 
            <IconButton 
                size="small" 
                onClick={() => props.handleClick(props.id)} 
                className={clsx(classes.exampleButton, props.active === props.id ? classes.active : '')}
                disabled={props.card?.number != '0' ? false : true}
            >
                <AutoAwesomeIcon />
            </IconButton>
            <Typography 
                variant="h3" 
                component="div" gutterBottom
            >
                {numberWithCommas(getRandomArbitrary())}
            </Typography>
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