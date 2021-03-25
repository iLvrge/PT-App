import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  transactionsContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
  },
  container: {
    margin: 5,
    background: '#222222',
    border: '1px solid #363636',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typography: {
    lineHeight: 'inherit',
    textAlign: 'center',
  },
  typographyExpand: {
    lineHeight: 2,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
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
    display: 'table',
    width: '100%',
    height: '100%',
  },
  contextExpand: {
    padding: '0.5rem',
    display: 'table',
    maxWidth: 500,
    margin: '0 auto',
    width: '100%',
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
  fixedSpanWidth60: {
    display: 'inline-block',
    width: '70%',
    textAlign: 'right',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'clip',
  },
  fixedSpanWidth40: {
    display: 'inline-block',
    width: '30%',
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  cellNumber: {
    width: '30%',
    maxWidth: '30%',
    '& h6': {
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  cellText: {
    width: '20%',
    maxWidth: '20%',
    '& h6': {
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
}))
