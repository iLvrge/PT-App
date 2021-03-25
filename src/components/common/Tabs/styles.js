import { makeStyles } from '@material-ui/core/styles'
export default makeStyles(theme => ({
  tabsWrapper: {
    width: '100%',
  },
  tabs: {
    paddingLeft: 8,
    paddingRight: 8,
    minHeight: 'initial',
    position: 'relative',
  },
  tabItem: {
    minWidth: 'initial',
    lineHeight: '1.5rem',
    minHeight: 'initial',
    marginLeft: 2.5,
    marginRight: 2.5,
    padding: '1px 0.75rem',
    border: '1px solid #363636',
    borderTopWidth: 0,
  },
  customTabContainer: {
    display: 'flex',
    justifyContent: 'left',
    border: '1px solid #363636',
    borderTop: 'none',
    alignItems: 'center',
    padding: '2px 0',
    margin: '-1px 10px 0',
    background: '#222222',
  },
}))
