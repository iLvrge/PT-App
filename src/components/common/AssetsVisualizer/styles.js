import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    minHeight: 30,
  },
  tab: {
    minHeight: 30,
  },
  singleAssetContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  right:{
    position: 'absolute',
    right: '35px',
    width: '20px',
    height: '20px',
    zIndex: 1
  },
  undoMinimize: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    background: 'rgb(18 18 18 / 0.5)',
    transform: 'translateY(20px)',
    transition: '.2s',
    borderRadius: '50% 50% 0 0',
    '&:hover': {
      background: 'rgb(18 18 18 / 1)',
        transform: 'translateY(0)'
    },
  },
  fullscreenChartsModal: {
    display: 'flex',
  },
  fullscreenCharts: {
      margin: 35,
      flex: 1,
      display: 'flex'
  },
  fullscreenBtn: {
      position: 'absolute',
      top: 0,
      right: 0,
  }
}))
