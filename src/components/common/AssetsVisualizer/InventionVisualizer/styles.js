import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .vis-panel.vis-background.vis-horizontal .vis-grid': {
            borderColor: '#e5e5e51c',
        }
    },
    tabs: {
        minHeight: 35,
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 35,
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
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
}))
