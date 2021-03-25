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
    padding: '0 5px',
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
  customIndex: {
    zIndex: 1001,
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
}))
