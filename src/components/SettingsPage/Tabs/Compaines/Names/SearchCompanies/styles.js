import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  list: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    background: '#303030',
  },
  toolbar: {
    background: '#222222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 6, 
    paddingRight: 6, 
  },
  searchContainer: {
    marginRight: 15
  },
}))
