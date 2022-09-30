import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTabs-root':{
          borderBottom: `1px solid ${theme.palette.divider} !important`
        },
        '& .MuiTab-root':{
            minWidth: 'inherit',
            maxWidth:  160
        },
        '& .MuiTab-wrapper':{
            whiteSpace: 'nowrap'
        },
        '& canvas': {
            width: '100%',
            height: '80%'
        }
    },
    tabs: {
        minHeight: 47,
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 47,  
        fontSize: '1.1rem'                          
    }
}))