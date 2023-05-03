import makeStyles from '@mui/styles/makeStyles';
import { pink } from '@mui/material/colors';
export default makeStyles(theme => ({
    showIcon: {
        fontSize: '1.1rem',
        display: 'flex',
        justifyContent: 'center',
        /* paddingTop: 7, */
       /*  paddingBottom: 17, */
        '& .MuiIconButton-root':{
            padding: '11px 8px',
            borderRadius: 0,
            color: theme.palette.text.disabled,
            '&:hover':{
                color: pink['A400'] ,
                '& svg':{
                    fill: pink['A400'],
                    stroke: pink['A400'],
                }
            },
            '& svg':{
                fill: theme.palette.text.disabled,
                stroke: theme.palette.text.disabled,
                width: '1em',
                height: '1em',
                fontSize: '1.5rem'
            },
            '& svg.noStroke':{
                stroke: 'none !important'
            },
            '&.active':{
                color: `${pink['500']} !important` ,
                '& svg':{ 
                    fill: `${pink['500']} !important` ,
                    stroke: `${pink['500']} !important` ,
                },
                '& svg.noStroke':{
                    stroke: 'none !important'
                },
                '&:hover':{
                    color: pink['A400'] ,
                    '& svg':{
                        fill: pink['A400'],
                        stroke: pink['A400'],
                    },
                    '& svg.noStroke':{
                        stroke: 'none !important'
                    }
                }
            },
            '&.selection_indicator':{
                '& svg':{
                    fill: pink['100'] ,
                }
            }
        }
    },    
    mobile: {
        justifyContent: 'left',
        flex: '1 1 100%'
    },
    mobileTooltip: {
        flex: '1 1 100%',
        fontSize: '20px !important'
    },
    marginBottom25: {
        marginBottom: 25
    },
    tooltip:{
        fontSize: '1rem',
        '& .MuiTypography-root': {
            fontSize: 18
        }
    },
    noStroke: {
        stroke: 'none !important'
    },
}))