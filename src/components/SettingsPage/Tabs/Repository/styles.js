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
        overflow: 'auto',
        '& .MuiTreeItem-label':{
            height: 40,
            display: 'flex',
            alignItems: 'center'
        }
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
    },
    splitPane: {
        position: 'relative !important',
        '& .Resizer': {
            background: `none`,
            opacity: 1,
            height: '100%',
            width: '3px',
            zIndex: 1,
            boxSizing: 'border-box',
            cursor: 'col-resize',
            backgroundClip: 'padding-box',
            background:'#000',
            '&:hover':{
                background:'#f50057',
            },
            '&.horizontal': {
                height: '3px',
                width: '100%',
                cursor: 'row-resize'
            }
        },
        '& .Pane': {
          maxHeight: '100%',
          
        },
        '& .Pane2': {
          height: '100%',
          overflow: 'auto',
        },
    },
    heading: {
        height: 40,
        backgroundColor: '#292929',
        overflow: 'hidden',
        borderBottom: '1px solid #5c5c5c',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 25
    }
}))