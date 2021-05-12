import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap !important',
    overflowX: 'hidden',
    overflowY: 'hidden',
    padding: 5
  },
  settings: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabPanel: {
    flex: 1,
    overflow: 'hidden',
  },
  subTabs: {
    display: 'flex',
    flexDirection: 'column',
    background: '#222222'
  },
  hideIndicator: {
    display: 'none',
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  listItemText: {
    margin: '4px 20px',
  },
  dashboard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '1px solid #363636' 
  },
  dashboardWarapper: {
    position: 'relative',
    flexGrow: 1,
    flexDirection: 'column',
    display: 'flex',
    height: 'calc(100vh - 47px)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 1, 
  }, 
  filterToolbar: {
    width: '3.5rem',
    borderRight: 0,
  },
  flex:{
    width: '3.5rem',
    position: 'absolute'
  },
  navigationHome:{
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10
  }
}))
