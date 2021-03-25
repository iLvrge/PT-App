import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  pdfContainer: {
    flexGrow: 1,
    position: 'relative',
    width: '100%',
    zIndex: 9999,
  },
  pdfWrapper: {
    position: 'relative',
    top: '4px',
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flexGrow: 1,
    height: '100%',
    position: 'relative',
    overflow: 'auto',
  },
  outsource: {
    width: '100%',
    border: '0px',
  },
  fullView: {
    width: '100% !important',
  },
  close: {
    position: 'absolute',
    right: '0',
    zIndex: 11,
    top: '-3px',
    fontSize: '20px',
    cursor: 'pointer',
  },
}))
