import { pink } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
  },
  splitPane: {
    position: 'relative !important',

    '& .Resizer': {
      background: `none`,
      opacity: 1,
      height: '100%',
      width: 3,
      zIndex: 3,
      cursor: 'col-resize',
      boxSizing: 'border-box',
      backgroundClip: 'padding-box',
      '&:hover': {
        background: pink[500],
      },
      '&.vertical': {
        /* width: 11,
        margin: '0 -5px',
        borderLeft: '5px solid rgba(255, 255, 255, 0)',
        borderRight: '5px solid rgba(255, 255, 255, 0)',
        cursor: 'col-resize', */
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