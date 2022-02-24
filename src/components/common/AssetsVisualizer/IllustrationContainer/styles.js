import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
  root: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#424242',
  },
  forceStrech: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenChartsModal: {
    display: 'flex',
  },
  fullscreenCharts: {
    margin: 35,
    flex: 1,
    display: 'flex'
  },
}))
