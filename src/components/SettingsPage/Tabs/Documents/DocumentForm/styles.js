import makeStyles from '@material-ui/core/styles/makeStyles'

export default makeStyles((theme) => ({
  dropzoneArea: {
    minHeight: 170,
    flex: 1,
  },
  flex1: {
    flex: 1,
    marginRight: 20,
    '& .MuiTextField-root': {
      width: '100%'
    }
  }
}))