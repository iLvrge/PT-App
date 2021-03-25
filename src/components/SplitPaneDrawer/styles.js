import makeStyles from '@material-ui/core/styles/makeStyles'

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
  },
  splitPane: {
    position: 'relative !important',

    '& .Resizer': {
      background: `${theme.palette.divider}`,
      opacity: 1,
      width: 11,
      zIndex: 3,
      boxSizing: 'border-box',
      backgroundClip: 'padding-box',
      '&:hover': {
        background: `${theme.palette.background.default}`,
      },
      '&.vertical': {
        width: 11,
        margin: '0 -5px',
        borderLeft: '5px solid rgba(255, 255, 255, 0)',
        borderRight: '5px solid rgba(255, 255, 255, 0)',
        cursor: 'col-resize',
      },
    },

    '& .Pane1': {
      transition: 'width .3s',
    },
  },
  onDrag: {
    '& .Pane1': {
      transition: 'none !important',
    },
  },
  hidePane1: {
    '& .Pane1': {
      width: '0 !important',
    },
    '& .Resizer': {
      display: 'none !important',
    },
  },
}))