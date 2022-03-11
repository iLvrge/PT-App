import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiPaper-root': {
            backgroundImage: 'none'
        }
    },  
    fullscreenBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: 35,
        flex: 1,
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        position: 'relative'
    },
    noBackground: {
        background: 'none'  
    },
    noFullScreen: {
        flex: 'none',
        margin: '50px auto'
    },
    right:{
        position: 'absolute', 
        right: 0,
        width: 20,
        height: 20,
        zIndex: 999999
    },  
    shareIcon: {  
        right: 30,
        top: 2
    },
    tooltip:{
        fontSize: '1rem'
    },
}))