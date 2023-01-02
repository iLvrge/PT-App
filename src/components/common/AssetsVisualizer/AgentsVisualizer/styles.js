import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1, 
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontSize: 16,  
        '& div[id*="reactgooglegraph-"]':{
            position: 'absolute',
            top: 92,
            zIndex: 9999
        }
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    fullscreenBtn: {
        position: 'absolute',
        top: 5,
        right: 0,
        zIndex: 999
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: 35,
        flex: 1,
        display: 'flex'
    },
    fullScreenContainer:{
        position: 'absolute',
        top: 10,
        right: 10,
        cursor: 'pointer',
        zIndex: 999
    },
}))