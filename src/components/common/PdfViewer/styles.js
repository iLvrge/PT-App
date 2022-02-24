import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
  pdfContainer: {
    position: 'relative',
    zIndex: 9999,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiTabScrollButton-root':{
      width: '20px'
    },
    '& .MuiTab-root':{
      minWidth: 'inherit',
    },
    '& iframe': {
      border: 0
    }
  },
  pdfWrapper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(82, 86, 89)',
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  container: {
    flexGrow: 1,
    height: '100%',
    border: '1px solid #363636',
    position: 'relative',
    overflow: 'hidden',
  },
  outsource: {
    width: '100%',
    border: '0px',
  },
  fullView: {
    width: '100% !important',
  },
  close: {
    position: 'absolute',
    zIndex: 11,
    right: 0,
    top: 16,
    cursor: 'pointer',
  }, 
  tabs: {
    backgroundColor: 'rgb(50, 54, 57)',
    '& .MuiTab-root':{
      minWidth: '90px'
    },
    minHeight: 0,
    display: 'flex',
    '& .MuiTab-root': {
      fontSize: '1rem'
    }
  },
  tab: {
    minHeight: 38,
  },
  fullscreenBtn: {
    position: 'absolute',
    top: 16,
    right: 0,
    zIndex: 1
  }
}))
