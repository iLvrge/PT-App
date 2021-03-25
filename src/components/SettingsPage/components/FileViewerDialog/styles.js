import makeStyles from '@material-ui/core/styles/makeStyles'

export default makeStyles(theme => ({
  paper: {
    '& .pg-viewer-wrapper': {
      color: theme.palette.common.black,
    }
  }
}))