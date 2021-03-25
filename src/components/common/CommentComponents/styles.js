import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  commentsComponents: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
  },
  container: {
    margin: 5,
    background: '#222222',
    flexGrow: 1,
    border: '1px solid #363636',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contextExpand: {
    padding: theme.spacing(4),
  },
  typography: {
    paddingBottom: theme.spacing(1),
    margin: 0,
    wordBreak: 'break-all',
  },
  typographyExpand: {
    paddingBottom: theme.spacing(1),
    margin: 0,
    lineHeight: 1.5,
    wordBreak: 'break-all',
  },
  textarea: {
    width: '100%',
    color: '#bdbdbd',
    border: 0,
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',

  },
  context: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    border: '1px solid #363636',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  open: {
    marginRight: '5px',
  },
}))
