import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  updatedAssetContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
  },
  container: {
    margin: 5,
    border: '1px solid #363636',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    background: '#222222',
  },
  heading: {
    height: '35%',
    textAlign: 'center',
    margin: 0,
    wordBreak: 'break-word',
  },
  headingExpand: {
    paddingBottom: theme.spacing(2),
    textAlign: 'center',
    margin: 0,
  },
  context: {
    lineHeight: 1.2,
    fontWeight: 500,
    width: '100%',
    height: '100%',
    display: 'table',
  },
  contextExpand: {
    padding: '0.5rem',
    display: 'table',
    lineHeight: 1.2,
    width: '60%',
    fontWeight: 500,
    margin: '0 auto',
  },
  wrapper: {
    width: '100%',
    height: '100%',
  },
  wrapperExpand: {
    width: '100%',
    paddingTop: 50,
    alignSelf: 'flex-start',
  },
  fixedSpanWidth70: {
    display: 'inline-block',
    width: '70%',
    textAlign: 'right',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'clip',
  },
  fixedSpanWidth30: {
    display: 'inline-block',
    width: '30%',
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}))
