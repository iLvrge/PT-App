import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
  tableRoot: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'transparent',
    '& .MuiDialogContent-root':{
      overflowY: 'hidden'
    }
  },
}))