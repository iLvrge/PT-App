import { makeStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core'

export default makeStyles((theme) => ({
  dialogContent: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    display: 'flex',
    '& .MuiFormControl-root': {
      width: 'calc(50% - 20px)',
      margin: '10px',
    },
    '& .MuiDialogContent-root':{
      padding: '8px 24px !important'
    },
  },
  dialogActions: {
    margin: 20,
    boxShadow: 'none'
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: fade(theme.palette.common.black, 0.5),
  },
  paper: {
    minWidth: 320,
    maxWidth: 700,
    '& .address_form':{
      '& label':{
        display: 'inline'
      },
      '& .MuiSelect-select':{
        minWidth: '100px'        
      },
      '& .MuiInputBase-root': {
        marginLeft: '20px'
      }
    },
    '& .MuiDialogContent-root':{
      overflowY: 'hidden'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}))