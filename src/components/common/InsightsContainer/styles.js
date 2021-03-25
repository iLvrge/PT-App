import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& .vis-panel.vis-background.vis-horizontal .vis-grid': {
            borderColor: '#e5e5e51c',
        }
    },
    row: {
        width: '100%',
        flex: 1,
        display: 'flex', 
        justifyContent: 'space-between',
    },
    chartContainer: {
        flex: 1,
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    chartTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '48%',
        left: '48%',
        zIndex: 1,
    },
}))
