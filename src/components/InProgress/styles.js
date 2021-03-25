import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    },
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
          background: `${theme.palette.divider}`,
          opacity: 1,
          height: 3,
          zIndex: 1,
          boxSizing: 'border-box',
          backgroundClip: 'padding-box',
          '&.horizontal': {
            height: 3,
            margin: '5px 0',
            cursor: 'row-resize',
          },
        },
        '& .Pane': {
          maxHeight: 'calc(100% - 100px)',
        },
        '& .Pane2': {
          height: '100%',
          overflow: 'auto',
        }
    },
    splitPane2: {
      '& .Pane': {
        maxHeight: '100%',
      }
    },
    splitPane2OverflowHidden: {
      '& .Pane2': {
        overflow: 'unset !important', 
      },
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
    toolbar: {
        display: 'flex',
        justifyContent:'space-between',
        minHeight: 48,
        background: '#303030'
    },
    tabs: {
        minHeight: 0,
        display: 'flex',
        justifyContent: 'flex-start',
        flex: 1,
        '& .MuiTabs-flexContainer': {
          justifyContent: 'flex-start',
        },
        '& .MuiTab-root':{
          fontSize :'1rem'
        }
      },
    tab: {
        minWidth: 'auto',
        minHeight: 48,
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
    }
}))
