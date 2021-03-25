import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  dashboard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#121212',

    '& .MuiPaper-root': {
      backgroundColor: '#222222!important'
    },
    '& .MuiTableCell-root': {
      borderBottom: 'none',
    },
    '& .MuiTableCell-stickyHeader': {
      fontFamily: 'inherit',
      fontSize: 'inherit',
      color: '#bdbdbd',
      backgroundColor: '#222222',
    }
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
  container: {
    padding: '5px',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap !important',
    overflowX: 'hidden',
    overflowY: 'hidden',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  customIndex: {
    zIndex: 1001,
  },
  backColor: {},
}))
