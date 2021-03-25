import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    margin: '0 10px 10px 0px',
    padding: '0 1rem',
    border: '1px solid #363636',
    display: 'flex',
    position: 'relative',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    zIndex: 1002,
  },
  context: {
    width: '100%',
    margin: '0 auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  input: {
  },
  form: {
    '& .MuiInputLabel-root': {
      color: '#ffffff !important',
      fontWeight: 'inherit',
      /* fontFamily: 'inherit' */
    },
    '& .MuiFormControl-root': {
      width: '90%',
    },
  },
  spanAbsolute: {
    position: 'absolute',
    right: '100px',
    top: '22px',
    color: '#E60000',
  },
  iconAbsolute: {
    position: 'absolute',
    top: '22px',
    cursor: 'pointer',
    right: '8px',
  },
  right: {
    right: '45px',
  },
  list: {
    height: '100%',
    padding: '0.375rem !important',
    margin: 0,
  },
  listItem: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: '#d6d6d6',
    padding: '0.375rem 0 0 0.375rem !important',
    margin: 0,
    fontStyle: 'normal',
    lineHeight: 1.5,
    '& svg': {
      position: 'relative',
      top: '4px',
    },
    '& ul': {
      '& li': {
        marginBottom: '10px',
      },
    },
  },
  selected_company: {
    color: '#E60000',
    fontWeight: 'bold',
  },
  selected_sub_company: {
    color: '#70A800',
    fontWeight: 'bold',
  },
  children: {
    listStyle: 'none',
    paddingLeft: '25px',
    marginTop: '7px',
  },
  delete: {
    color: '#E60000',
    cursor: 'pointer',
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    marginTop: '4px',
  },
}))
