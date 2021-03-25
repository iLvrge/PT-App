import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiSvgIcon-root':{
      fontSize: '1rem'
    }
  },
  toolbar: {
    display: 'flex',
    justifyContent:'space-between',
    minHeight: 38,
  },
  toolbarActions: {
    display:'flex',
    alignItems: 'center',
  },
  tabs: {
    minHeight: 0,
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center',
    }
  },
  tab: {
    minWidth: '25%',
    minHeight: 38,
  },
  tableContainer: {
    height: '100%',
    overflowX: 'initial',
    '& .MuiTableCell-head':{
      minWidth: '35px'
    }
  },
  tableContent: {
    overflow: 'auto',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  tableToolbar: {
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
    background: '#303030',
  },
  tabLabel: {
    marginRight: 5,
  },
  openFile: {
    textDecoration: 'none',
  },
  headingText: {
    lineHeight: 2.6
  }
}))
