import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  userItemsContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
    zIndex: 1000,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 0,
    '& .MuiCollapse-container': {
      position: 'absolute',
      zIndex: 9,
      color: '#000',
      right: '0px',
    },
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    '& .MuiToolbar-gutters': {
      padding: '0px',
    },
    '& .MuiToolbar-regular': {
      '& .MuiSvgIcon-root': {
      },
    },
  },
  table: {
    color: '#bdbdbd',
  },
  lookupEditCell: {
    padding: theme.spacing(1),
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
  selectMenu: {
    position: 'absolute !important',
  },
  deleteIcon: {
  },
}))
