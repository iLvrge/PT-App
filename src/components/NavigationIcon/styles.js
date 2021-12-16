import { makeStyles } from '@material-ui/core/styles'

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
            color: '#5a5a5a',
            '&:hover':{
                color: 'rgb(230, 0, 0)' ,
                '& svg':{
                    fill: 'rgb(230, 0, 0)',
                    stroke: 'rgb(230, 0, 0)',
                }
            },
            '& svg':{
                fill: '#5a5a5a',
                stroke: '#5a5a5a',
                /* width: '2rem',
                height: '2rem' */  
            },
            '& svg.noStroke':{
                stroke: 'none !important'
            },
            '&.active':{
                color: '#fff !important' ,
                '& svg':{ 
                    fill: '#fff !important',
                    stroke: '#fff !important',
                },
                '& svg.noStroke':{
                    stroke: 'none !important'
                },
                '&:hover':{
                    color: 'rgb(230, 0, 0) !important' ,
                    '& svg':{
                        fill: 'rgb(230, 0, 0) !important',
                        stroke: 'rgb(230, 0, 0)  !important',
                    },
                    '& svg.noStroke':{
                        stroke: 'none !important'
                    }
                }
            },
            '&.selection_indicator':{
                '& svg':{
                    fill: '#f48fb1 !important' ,
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
        fontSize: '1rem'
    },
    noStroke: {
        stroke: 'none !important'
    },
}))