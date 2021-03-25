import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap !important',
        overflowX: 'hidden',
        overflowY: 'hidden',
    },
    dashboard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '0px',
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
    },
    splitPane: {
        position: 'relative !important',
        '& .Resizer': {
          background: `${theme.palette.divider}`,
          opacity: 1,
          height: 3,
          zIndex: 1,
          boxSizing: 'border-box',
          backgroundClip: 'padding-box',
          '&.horizontal': {
            height: 1,
            margin: '1px 0',
            cursor: 'row-resize',
          },
          '&.vertical':{ 
            width: '1px',
            height: '100%',
            margin: '0 1px',
            borderLeft: '0px solid rgba(0, 0, 0, 1)',
            borderRight: '0px solid rgba(0, 0, 0, 1)',
            cursor: 'col-resize'
          }
        },
        '& .Pane': {
          maxWidth: 'calc(100% - 5px)',
          '& .vertical': {
            maxWidth: '100%',
          }
        }
    },
    companyBar:{
      paddingLeft: '5px', 
      height: '100%',
    },
    showIcon: {
      /* padding: '10px', */
      fontSize: '1.7rem',
      '& .MuiIconButton-root':{
        padding: 0,
        '&:hover':{
          color: 'rgb(230, 0, 0)' 
        }
      }      
    }
}))
