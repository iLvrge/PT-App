import { darken } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    
  },
  highlight: {
    color: theme.palette.text.primary,
    backgroundColor: darken(theme.palette.secondary.dark, 0.3),
  },
  title: {
    flex: '1 1 100%',
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