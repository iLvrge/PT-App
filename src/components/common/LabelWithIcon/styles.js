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
    }
}))