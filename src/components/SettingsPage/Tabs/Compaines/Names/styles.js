import { alpha } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
  tableRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    
  },
  dialogButton: {
    flex: '1 1 100%',
    display: 'inline',
    margin: '0 10px 0 50px',
    '& .MuiInputLabel-shrink': {
      fontSize: 16
    }
  },
  btnGroup:{
    padding: '0 5px',
    border: 0,
    position: 'absolute',
    textTransform: 'initial'
  },
  dialog: {
    '& .MuiDialogContent-root':{
      padding: '8px 24px !important'
    },
    '& .MuiDialogActions-root':{
      padding: 8
    }

  }
}))
