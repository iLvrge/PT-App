import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,        
        height: '100%',
        '& canvas': {
            width: '100%',
            height: '100%'
        }
    },
}))