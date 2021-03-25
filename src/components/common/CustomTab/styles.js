import { makeStyles } from '@material-ui/core/styles'
export default makeStyles(theme => ({
  customTabContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: 'none',
    alignItems: 'center',
    padding: '2px 0',
    background: '#222222',
  },
  button: {
    cursor: 'pointer',
  },
}))
