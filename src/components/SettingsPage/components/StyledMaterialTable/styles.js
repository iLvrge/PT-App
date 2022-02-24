import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(() => ({
  materialTableContainer: {
    '& .MuiToolbar-root': {
      minHeight: 0,
      background: '#303030',
    },
    '& .MuiPaper-elevation2': {
      boxShadow: 'none',
    }
  },
  helpButton:{
    position: 'absolute',
    width: 20,
    height: 20,
    right: 45,
    zIndex: 1,
    top: 13,
    cursor: 'pointer'
  } 
}))