import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1, 
        boxShadow: 'none'
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '86%',
        fontSize: '0.875rem',  
        padding: 10,
        '& div[id*="googlechart-control-"]':{
            position: 'absolute',
            top: 200,
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
        zIndex: 999,
        ' & svg':{
          fill: theme.palette.text.disabled,
          stroke: theme.palette.text.disabled,
          '&:hover':{
            color: '#E60000',
            fill: '#E60000',
            stroke: '#E60000'
          }
        }
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