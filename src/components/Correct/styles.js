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
      },
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
    background: '#303030',
    minHeight: 48,
    '& .MuiTypography-body1':{
      lineHeight: '48px',
      padding:'0 8px'
    }
  }
}))
