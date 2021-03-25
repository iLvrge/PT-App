import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap !important',
        overflowX: 'hidden',
        overflowY: 'hidden',
        padding: '5px'
    },
    dashboard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '1px solid #363636' 
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
        height: '100%',
        justifyContent: 'space-between',
    }
}))
