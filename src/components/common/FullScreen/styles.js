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
    right:{
        position: 'absolute',
        right: '35px',
        width: '20px',
        height: '20px',
        zIndex: 1
    },
}))