import { pink } from '@mui/material/colors';
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
            fill: '#6d6d6d',
            stroke: '#6d6d6d',
          '&:hover':{
            color: theme.palette.secondary.main,
            fill: theme.palette.secondary.main,
            stroke: theme.palette.secondary.main
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
    boxMessage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: theme.palette.secondary.main,
        fontSize: '1.1rem'
    }
}))