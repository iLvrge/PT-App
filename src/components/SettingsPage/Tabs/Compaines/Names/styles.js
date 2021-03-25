import { fade, makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  tableRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: fade(theme.palette.common.white, 0.05),
  },
}))
