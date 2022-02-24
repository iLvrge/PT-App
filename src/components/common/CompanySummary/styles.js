import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
    root: {
        marginTop: '0px',
        padding: '0 28px'
    },
    relativeIcon:{
        '& svg':{
            width: 24,
            height: 24,
            position: 'relative',
            top: 6,
            left: -10,
            fill: '#fff'
        }        
    }
})) 