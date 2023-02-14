import makeStyles from '@mui/styles/makeStyles';
import { indigo } from '@mui/material/colors'
export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTabs-root':{
          borderBottom: `1px solid ${theme.palette.divider} !important`
        },
        '& .vis-time-axis .vis-text, .vis-item, .vis-y-axis':{
          color: theme.palette.text.primary,
        },
        '&  .vis-timeline':{
          border: 0
        },
        '&.vis-panel.vis-center':{
          border: `1px solid ${theme.palette.divider}`
        },
        '& .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top, .vis-panel.vis-bottom': {
          borderBottomColor: theme.palette.divider,
          borderTopColor: theme.palette.divider,
          borderLeftColor: theme.palette.divider,
          borderRightColor: theme.palette.divider,
        },
        '& .vis-panel.vis-background.vis-horizontal .vis-grid': {
            borderColor: '#e5e5e51c',
        },
        '& .MuiTab-root':{
            minWidth: 'inherit',
            maxWidth:  150
        },
        '& .MuiTab-wrapper':{
            whiteSpace: 'nowrap'
        }
    },
    tabs: {
        minHeight: 47,
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 47,  
        fontSize: '1.1rem'                          
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,        
        
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
