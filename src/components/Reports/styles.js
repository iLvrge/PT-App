import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    container: {
        height: '100%',
        margin: 0,
        color: '#fff',
        border: 0,
        display: 'flex',
        position: 'relative',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 60
    },
    flexColumn: {
        height: 225,
        '& .MuiCard-root': {
            height: '100%'
        }
    },
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden',
        '& .font12Rem':{
          fontSize: '1rem'
        }
    },
    companyBar:{
        height: '100%',
    },
}));