import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  textEditor: {
    color: '#000',
    margin: 0
  },
  buttonGroup: {
    width: '100%',
    textAlign: 'right',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  review: {
    float: 'right !important',
    width: 'auto !important',
    height: 'auto !important',
    border:'1px solid #5a5a5a !important',
    marginLeft: 15,
    textTransform: 'initial',
    '&:hover':{
      border:'1px solid #e60000 !important'
    },
    '&:first':{
      marginLeft: 5
    }
  }, 
  buttonProgress: {
    position: 'absolute',
    bottom: '10px',
    right: '5vw',
    color: '#fff' 
  }
}))