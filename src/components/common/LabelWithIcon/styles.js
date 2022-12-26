import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({ 
    label: {
        position: 'relative',
        '& svg': { 
            width: 16,
            height: 16, 
            marginRight: 5
        },
        '& .noStroke':{
            fill: '#fff',
            stroke: '#fff'
        }
    },
    imgContainer: {
        width: 20,
        height: 20,
        position: 'relative',
        display: 'inline-block',
        '& svg':{
            position: 'absolute',
            top: 4,
            left: 0
        }
    },  
    img: {
        width: 20,
        position: 'absolute',
        left: -3,
        top: 4
    }
}))