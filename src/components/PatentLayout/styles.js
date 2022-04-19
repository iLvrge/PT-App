import makeStyles from '@mui/styles/makeStyles';
import { pink } from '@mui/material/colors';
export default makeStyles(theme => ({
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
    minimized: {
        '& .Pane.Pane1': {
          height: '100% !important',
          maxHeight: 'unset !important',
        },
        '& .Pane.Pane2': {
          display: 'none !important',
        }
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
            /* background: theme.palette.action.disabled, */
            '&:hover':{
              background: pink[500],
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
    splitPane2: {
      '& .Pane': {
        maxHeight: '100%',
      }
    },
    splitPane3: {
      '& .Pane': {
        maxWidth: '100% !important',
      }
    },
    splitPane2OverflowHidden: {
      '& .Pane2': {
        overflow: 'unset !important', 
      }
    },
    splitPane2OverflowUnset: {
        '& .Pane2': {
            overflow: 'unset !important', 
        }
    },
    splitPaneMainOverflowUnset:{
        overflow: 'unset !important', 
    },
    splitPane1OverflowUnset: {
        '& .Pane1': {
            overflow: 'unset !important', 
        }
    },
    paneHeightZero: {
      '& .Pane1':{
        height: 0
      }
    },
    calHeight: {
      minHeight: 'calc(100% - 50px) !important'
    },
    onDrag: {
        '& .Pane': {
          pointerEvents: 'none',
        },
        '& .Pane2': {
          pointerEvents: 'none',
        },
    },
    content: {
        height: '100%',
    },
    controllersContainer: {
        width: '100%',
        zIndex: 111,
        fontSize: 9,
        backgroundColor: theme.palette.action.hover,
        transition: 'opacity 0.1s',
        padding: '9px',
        position: 'relative'
    },
    controllers: {
        display: 'flex',
        alignItems: 'center',
    },
    totalSelected: {
        position: 'absolute',
        right: '5px'
    },
    transactionList:{
        height: '100%',
        '& .MuiListItemAvatar-root': {
            minWidth: 0,
        },
        '& .MuiListItem-gutters': {
            paddingLeft: 0,
            paddingRight: 0,
        },
        '& .MuiList-root':{
            /*maxHeight: '85%',*/
        },
        '& .MuiListSubheader-root':{
          backgroundColor: theme.palette.action.hover
        }
    },
    assetSummary: {
      maxWidth: 'calc(100% - 5px)',
      '& .MuiGrid-item':{
        padding:'0px 2px 4px 2px',
        '&:first-child':{
          paddingLeft: '0px',
        },
        '&:last-child':{
          paddingRight: '0px'
        }
      },
      '& div':{
        '& :first-child':{
          /* padding: '0px' */
        }
      },
      '& .MuiGrid-spacing-xs-1':{
        padding: 0,
        margin: 'inherit'
      }
    },
    companyBar:{
        height: '100%',
    },
    fontChange: {
      fontSize: '1.2rem',
    },
    tooltip:{
      fontSize: '1rem'
    },
    commentContainer: {
        height: '100%', 
        width: '100%',
    },
    btn:{
        top: '-13px',
        right: 'calc(100% - 50%)'
    }, 
    btnLeft: {
        left: '-10px',
        right: 'unset'
    },
    itemsLeft: { 
        justifyContent: 'flex-start'
    },
    notInteractive: {
      pointerEvents: 'none',
      '& iframe': {
        pointerEvents: 'none',
      }
    },      
    isInteractive: {
        pointerEvents: 'auto'
    }
}))
