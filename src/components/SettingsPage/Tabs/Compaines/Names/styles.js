import { fade, makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  tableRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: fade(theme.palette.common.white, 0.05),
  },
  dialogButton: {
    flex: '1 1 100%',
    display: 'flex',
    margin: '0 10px',
    '& .MuiInputLabel-shrink': {
      fontSize: 16
    }
  },
  btnGroup:{
    padding: '0 5px',
    border: 0,
    position: 'absolute',
    textTransform: 'inherit'
  }
}))
