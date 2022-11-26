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
            minWidth: 110,
            maxWidth:  200
        },
        '& .MuiTab-wrapper':{
            whiteSpace: 'nowrap'
        },
    },
    tabs: {
        minHeight: 47,
        width: '94%'
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 47,  
        fontSize: '1.1rem', 
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow:'ellipsis'
    },
    label: {
        position: 'relative',
        '& svg': {
            position: 'absolute',
            width: 16,
            height: 16,
            top: 3,
            marginLeft: 5
        }
    }
}))