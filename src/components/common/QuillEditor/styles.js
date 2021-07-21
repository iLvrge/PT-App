import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  textEditor: {
    color: '#000',
    margin: 0,
    '& .ql-attachDriveButton':{
    }
  },
  buttonGroup: {
    width: '100%',
    textAlign: 'right',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  seperator: {
    display: 'flex',
    width: 1,
    height: 20,
    borderLeft: '1px solid #494949',
    marginRight: 6
  },
  secondaryGroup: {
    display: 'flex',
    padding: '0 15px'
  },
  review: {
    width: 'auto !important',
    minWidth: '130px !important',
    height: 'auto !important',
    padding: '3px 5px',
    border:'1px solid #5a5a5a !important',
    textTransform: 'initial',
    '&:hover':{
      border:'1px solid #e60000 !important',
      color: '#e60000 !important'
    },
    '&:first-child':{
      /* marginLeft: 20,
      borderLeft: '1px solid #545454' */
    }
  }, 
  active: {
    border:'1px solid #e60000 !important',
    '& .MuiButton-label': {
      color: '#e60000'
    }    
  },
  buttonProgress: {
    position: 'absolute',
    bottom: '10px',
    right: '5vw',
    color: '#fff' 
  },
  formContainer:{
    display: 'flex',
    flexDirection: 'column',
    flex:1,
    overflow: 'hidden auto',
    width: '50vw',
    margin: '50px auto',
    height: '60vh',
    border: '1px solid #363636' 
  },
  formWrapper: {
    position: 'relative',
    flexGrow: 1,
    flexDirection: 'column',
    display: 'flex',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
    padding: 10
  },  
  form: {
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  btn:{
    display: 'flex',
    height: 30,
    margin: 10
  },
  share: {
    marginLeft: 12
  },
  icon:{
    
  }
}))