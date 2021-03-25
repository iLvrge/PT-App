import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    showIcon: {
        /* padding: '10px', */
        fontSize: '1.1rem',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
        paddingBottom: '17px',
        '& .MuiIconButton-root':{
            padding: 0,
            color: '#5a5a5a',
            '&:hover':{
                color: 'rgb(230, 0, 0)' ,
                '& svg':{
                fill: 'rgb(230, 0, 0)',
                }
            },
            '& svg':{
                fill: '#5a5a5a',
                width: '2rem',
                height: '2rem'
            },
            '&.active':{
                color: '#fff !important' ,
                '& svg':{
                fill: '#fff !important' 
                },
                '&:hover':{
                    color: 'rgb(230, 0, 0) !important' ,
                    '& svg':{
                        fill: 'rgb(230, 0, 0) !important',
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
    tooltip:{
        fontSize: '1rem'
    },
}))