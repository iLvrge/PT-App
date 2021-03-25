import makeStyles from '@material-ui/core/styles/makeStyles'
import { fade } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  editedRow: {
    background: fade(theme.palette.common.white, 0.08),
  },
  childrenCell: {
    padding: '0 !important',
    background: '#121212',
  },
  box: {
    margin: '0 0 -1px 25px',
    boxShadow: '-1px 0px 2px 0 #292929',
  },
}))