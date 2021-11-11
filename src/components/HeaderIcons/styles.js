import { fade, makeStyles } from '@material-ui/core/styles'


export default makeStyles(theme => ({

    buttonIcon: {
        width: 30,
        height: 30,
        borderRadius: 0 ,
        padding: 0,
        /* margin: '0 4px', */
        '& svg':{
            /* width: '2rem',
            height: '2rem', */
            fill: '#5a5a5a',
            stroke: '#5a5a5a'
        },
        '&:hover':{
            '& svg':{
                fill: 'rgb(230, 0, 0)',
                stroke: 'rgb(230, 0, 0)',
            }
        }
    },
    clipIconActive: {
        '& svg':{
            fill: '#f48fb1',
            stroke: '#f48fb1' 
        },
    },
    clipIconIsActive: {
        '& svg':{
            fill: '#FFF',
            stroke: '#FFF' 
        },
        '&:hover':{
            '& svg':{
                fill: '#FFF',
                stroke: '#FFF' 
            }
        }  
    },
}))