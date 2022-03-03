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
        height: 'calc((100vh - 78px) / 3)',
        '& .gauge':{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            height: 'calc(((100vh - 78px) / 3)/1.57)',
            '& svg': {
                display: 'flex',
                height: '70%'
            }
        },
        [theme.breakpoints.down('md')]: {
            height: 'calc((100vh - 78px) / 4)',
            '& .gauge':{
                height: 'calc(((100vh - 78px) / 4)/1.7)', 
            }
        },
        '& .MuiCard-root': {
            height: '100%'
        },
        
    },
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden',
        '& .font12Rem':{
          fontSize: '1rem'
        },
        backgroundImage: 'none'
    },
    companyBar:{
        height: '100%',
    },
    border: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '0 10px 14px',
    },
    onFly: {
        position: 'absolute',
        right: 0,
        top: 5
    },
    card: {
        position: 'relative',
        border: 0,
        boxShadow: 'none',
        '& .MuiCardContent-root':{
            paddingBottom: 0
        }
    }
}));