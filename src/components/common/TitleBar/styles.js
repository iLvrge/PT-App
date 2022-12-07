
import makeStyles from '@mui/styles/makeStyles';
export default makeStyles(theme => ({
    heading: {
        fontSize: '1.1rem',
        marginBottom: 5,
        display: 'block',        
    },
    paddingLeft: {
        paddingLeft: 16,
        paddingTop: 7
    },
    underline: {
        textDecoration: 'underline'
    },
    relative: {
        position: 'relative', 
        width: '100%'
    },
    absolute: {
        position: 'absolute',
        width: '100%',
        zIndex: 9999
    } 
}));  