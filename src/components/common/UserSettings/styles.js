import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflowX: 'hidden',
    overflowY: 'hidden',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
  },
  dashboard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  settingContainer: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    height: 'auto',
    justifyContent: 'center',
    width: '100%',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  context: {
    border: '1px solid #363636',
    width: '100%',
    margin: '0 auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '& .MuiToolbar-root': {
      minHeight: 'auto',
    },
  },
}))
