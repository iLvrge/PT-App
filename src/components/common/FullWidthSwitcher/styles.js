import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  switcher: {
    color: '#bdbdbd',
    width: 18,
    height: 18,
    border: '1px solid #bdbdbd',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(25%,-25%)',
    zIndex: 1200009,
    cursor: 'pointer',
  },
}))
