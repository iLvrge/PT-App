import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
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
        backgroundColor: theme.palette.background.default
    },
    noBackground: {
        background: 'none'
    },
    right:{
        position: 'absolute', 
        right: 35,
        width: 20,
        height: 20,
        zIndex: 999999
    },
}))