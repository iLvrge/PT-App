import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  nestedTree: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    zIndex: 2000,
  },
  container: {
    position: 'absolute',
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  context: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    border: '1px solid #363636',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#222222',
  },
  heading: {
    lineHeight: 'normal',
    fontWeight: 700, 
    alignSelf: 'center',
  },
  headingExpand: {
    lineHeight: 'normal',
    fontWeight: 700, 
    alignSelf: 'center',
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  typography: {
    lineHeight: 2,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    '& .active-node-wrapper': {
      color: '#E60000',
      backgroundColor: 'inherit',
    },
    '& .node-wrapper': {
      '& .MuiSvgIcon-root': {
        position: 'relative',
        top: '5px',
      },
    },
    '& .active-not-leaf-node-wrapper': {
      '& .MuiSvgIcon-root': {
        position: 'relative',
        top: '5px',
      },
    },
    width: '100%',
    height: '100%',
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
    lineHeight: 1.5 
  },
  customPadding: {
    paddingTop: '7px',
    paddingBottom: '5px',
    cursor: 'pointer',
  },
}))
