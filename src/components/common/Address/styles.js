import { makeStyles } from '@material-ui/styles'

export default makeStyles(theme => ({
    userItemsContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
    zIndex: 1000
  },
  container: {
    color: 'white',
    display: 'flex',
    flexGrow: 1,
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 0,
    '& .MuiCollapse-container': {
      position: 'absolute',
      zIndex: 9,
      color: '#000000',
      right: '0px'
    }
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    '& .MuiPaper-root': {
      backgroundColor: 'inherit'
    },
    '& .MuiTableCell-head': {
      backgroundColor: 'inherit'
    },
    '& .MuiToolbar-gutters': {
      padding: '0px'
    },
    '& .MuiToolbar-regular': {
      '& .MuiSvgIcon-root': {
      }
    }
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  btn:{
    cursor: 'pointer'
  }
}))