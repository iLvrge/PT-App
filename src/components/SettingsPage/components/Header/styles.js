import makeStyles from '@material-ui/core/styles/makeStyles'
import { darken } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  root: {
    background: '#222222',
  },
  highlight: {
    color: theme.palette.text.primary,
    backgroundColor: darken(theme.palette.secondary.dark, 0.3),
  },
  title: {
    flex: '1 1 100%',
  },
}))