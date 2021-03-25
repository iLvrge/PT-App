import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    margin: 5,
    border: '1px solid #363636',
    display: 'flex',
    position: 'relative',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
    overflow: 'auto',
    background: '#222222',
  },
  validateContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  value: {
    color: '#e60000',
  },
  title: {
    lineHeight: 1.5,
    padding: `${theme.spacing(1)}px 0`,
    textAlign: 'center',
    wordBreak: 'break-word',
  },
  titleExpand: {
    lineHeight: 1.5,
    padding: `${theme.spacing(2)}px 0`,
    textAlign: 'center',
  },
  body: {
    display: 'table',
    width: '100%',
  },
  bodyExpand: {
    display: 'table',
    flexWrap: 'wrap',
    width: '60%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
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
  listItem: {
    display: 'table-row',
  },
  gridItem: {},
  fixedSpanWidth60: {
    width: '60%',
    display: 'inline-block',
    textAlign: 'right',
  },
  fixedSpanWidth40: {
    width: '40%',
    display: 'inline-block',
    textAlign: 'left',
  },
}))
