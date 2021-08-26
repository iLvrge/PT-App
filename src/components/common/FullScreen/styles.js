import { makeStyles } from '@material-ui/core/styles'

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
        display: 'flex'
    },
    right:{
        position: 'absolute',
        right: '35px',
        width: '20px',
        height: '20px',
        zIndex: 1
    },
}))