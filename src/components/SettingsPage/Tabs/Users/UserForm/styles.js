import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
  dropzoneArea: {
    minHeight: 170,
    flex: 1,
    '& .MuiDropzonePreviewList-image': {
      height: 'auto',
      maxHeight: 100, 
    }
  },
  flex1: {
    flex: 1,
    marginRight: 20,
    '& .MuiTextField-root': {
      width: '100%'
    }
  }
}))