import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex:1,
    overflow: 'hidden',
    '& .font12Rem':{
      fontSize: '1rem'
    }
  },
  list: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    background: '#303030',
  },
  toolbar: {
    /* background: '#222222', */
    display: 'flex',
    alignItems: 'center',
    /* justifyContent: 'space-between', */
    paddingLeft: 6, 
    paddingRight: 6, 
    
  },
  searchContainer: {
    marginRight: 15,
    width: 230
  },
  btnGroup:{
    padding: '0 5px',
    border: 0,
    textTransform: 'initial'
  },
}))
