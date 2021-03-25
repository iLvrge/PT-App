import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
    opacity: 0.8,
    background: '#303030',
    '&:hover': {
      opacity: 1,
      background: '#303030',
    }
  },
  forceStrech: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    zIndex: 100,
    top: '50%',
    left: '50%',
  },
}))
