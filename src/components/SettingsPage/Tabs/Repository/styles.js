import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    dashboard: {
        position: 'absolute',
        top: 43,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#121212',
        padding: '0 5px'
    },
    dashboardWarapper: {
        position: 'relative',
        flexGrow: 1,
        flexDirection: 'column',
        display: 'flex',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 1,
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    drive: {
        display: 'flex', 
        height: '100vh',
        overflow: 'auto'
    },
    dropItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)'
    },
    frame: {
        width: '100%',
        height: '100vh'
    },
    dropFolder: {
        height: '30px',
        color: 'rgba(255, 255, 255, 0.3)',
        border: '1px solid #363636',
        background: '#222222',
        padding: '5px 10px 10px 10px',
        marginBottom: '5px',
        textAlign: 'center'
    },
    dropFolder1: {
        height: '30px',
        color: 'rgba(255, 255, 255, 0.3)',
        border: '1px solid #363636',
        background: '#222222',
        marginBottom: '5px',
        textAlign: 'center'
    } 
}))