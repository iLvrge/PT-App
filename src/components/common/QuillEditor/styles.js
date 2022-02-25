import makeStyles from '@mui/styles/makeStyles';
import { toggleThemeMode } from '../../../actions/uiActions';
import { pink } from '@mui/material/colors';
export default makeStyles(theme => ({
  root: {
    '& .ql-container': {
      background: theme.palette.action.hover
    },
    '& .ql-toolbar':{
      background: theme.palette.action.disabledBackground
    }
  },
  textEditor: {
    color: theme.palette.text.primary,
    margin: 0,
    overflow: 'hidden',
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
    borderLeft: `1px solid ${theme.palette.divider}`,
    marginRight: 6
  },
  secondaryGroup: {
    display: 'flex',
    padding: '0 5px',
    flexGrow: 1
  },
  review: {
    border:`1px solid ${theme.palette.divider} !important`,
    borderRadius: 4,
    textTransform: 'initial',
    width: 'auto !important',
    padding: '3px 5px !important',
    '&:hover':{
      border:`1px solid ${pink['500']} !important`,
      color: `${pink['500']} !important`
    },
    '&:first-child':{
      /* marginLeft: 20,
      borderLeft: '1px solid #545454' */
    },
    '& .MuiButton-label': {
      whiteSpace: 'nowrap'
    }
  }, 
  active: {
    border:`1px solid ${pink['500']} !important`,
    '& .MuiButton-label': {
      color: pink['500']
    }    
  },
  buttonProgress: {
    position: 'absolute',
    bottom: '10px',
    right: '5vw',
    color: theme.palette.text.primary,
  },
  formContainer:{
    display: 'flex',
    flexDirection: 'column',
    flex:1,
    overflow: 'hidden auto',
    width: '50vw',
    margin: '50px auto',
    height: '60vh',
    border: `1px solid ${theme.palette.divider}` 
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
    '& svg':{
      width: 20,
      height: 20
    }
    
  },
  icon:{
    
  }
}))