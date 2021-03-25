import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTab-root':{
      minWidth: 'inherit',
    },
    '& .MuiTypography-root':{
      lineHeight: '25px'
    },
    '& embed':{
      height: '100%',
      width: '100%'
    },
    '& .MuiPaper-elevation1': {
      boxShadow: 'none'
    },
    '& .MuiTableCell-root': {
      padding: '0 10px',
      lineHeight: '25px',
      verticalAlign: 'top',
      borderBottom: '0px',
      '&:first-child': {
        paddingLeft: '0px'
      }
    },
    '& .MuiTabScrollButton-root':{
      width: '20px'
    }
  },
  dashboard: {
    position: 'absolute',
    top: '38px',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '10px',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    flexGrow: 1,
    overflow: 'auto'
  },
  tab: {
    minWidth: '25%',
    minHeight: 38,
  },
  tabs: {
    minHeight: 0,
    display: 'flex',
    '& .MuiTab-root': {
      fontSize: '1rem'
    }
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
    opacity: 0.8,
    background: '#303030',
    '&:hover': {
      opacity: 1,
      background: '#303030',
    }
  },
  forceStrech: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    zIndex: 100,
    top: '50%',
    left: '50%',
  },
  filetree:{
    '& ul': {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      '& li ul': {
        display: 'block !important',
        padding: 0,
        '& li': {
          padding: '20px 0 0 0 !important',
        }
      }
    },
    '& li': {
      margin: 0,
      padding: '20px 0 0 0',
      lineHeight: '25px',
      '&:first-child': {
        padding: 0
      }
    },
    '& .node': {
      //background: 'url(./assets/images/treeview-default-line.gif) 0 -176px no-repeat'
    },
    '& .node.last>.hitarea': {
      //backgroundPosition: '0 -111px'
    },
    '& .node.collapsed.last>.hitarea': {
      //backgroundPosition: '-32px -67px'
    },
    '& .leaf': {
      //background: 'url(./assets/images/treeview-default-line.gif) 0 0 no-repeat',
      '& .hitarea': {
        //background: 0
      }
    },
    '& .hitarea': {
      /* background: 'url(./assets/images/treeview-default.gif)-64px -25px no-repeat',
      height: '16px',
      width: '16px',
      marginLeft: '-16px',
      cursor: 'pointer' */
    },
    '& .collapsed': {
      '& .hitarea': {
        //backgroundPosition: '-80px -3px'
      }
    },
    '& #tree': {
      overflow:'auto',
      display: 'none'
    }
  },
  paperRoot: {
    height: 'calc(100% - 38px)'
  },
  borderBottom: {
    borderBottom: '1px solid #fff',
    marginBottom: '10px'
  }
}))
