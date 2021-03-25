import { makeStyles } from '@material-ui/core/styles'
import autoprefixer from 'autoprefixer'

export default makeStyles(theme => ({
  root: {
    height: 'auto',
    minHeight: '100%',
    width: '100%',
    /* overflowY: 'auto', */
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiButton-textSizeSmall': {
      padding: 0,
      minWidth: 'auto',
      marginRight: '10px'
    }
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  loader: {},
  content: {
    display: 'flex',
    flexDirection: 'column',
    /* justifyContent: 'center', */
    justifyContent: 'flex-start',
    alignItems: 'center',
    /* overflow: 'auto', */
    width: '100%',
    flex: 1,
    '& > div': {
      width: '100%',
      /* paddingRight: 40, */
    },
  },
  commentEditor: {
    /* paddingLeft: 40, */
    padding: '0',
    margin: '0 auto',
    width: '95% !important'
  },
  addCommentBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  timeline: {    
    fontSize: 'inherit !important',
    fontWeight: 'inherit !important',
    height: 'auto',
    width: '100% !important',
    margin: '0 !important'
  },
  minimizeButton: {
    position: 'absolute',
    zIndex: 1,
    fontSize: 12,
    top: 5,
    left: 0,
    color: '#fff',
    cursor: 'pointer',
    width: '2rem',
    transition: 'color linear 250ms 0s',
    '&:hover': {
      color: '#d5d5d5'
    }
  },
  arrowButton:{
    position: 'absolute',
    right: '-14px',
    top: '35px',
    zIndex: 2,     
    '& .MuiFab-sizeSmall':{
      width:'21px',
      height:'22px',
      minHeight: 'auto'
    }
  },
  disable: {
    display: 'none'
  },
  commentTimelineSection: {
    width: '95% !important',
    overflow: 'hidden auto',
    height: '32.5%',
    margin: '5px auto !Important',
    display: 'flex',
    '& div':{
      width: '100%'
    },
    flex: '1 100%',
  },
  emptyEntity: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '5px',
    paddingRight: '30px',
    position: 'absolute',
    zIndex: 1, 
    '& button': {
      height: '42px',
      borderRadius: '5px !important',
      textTransform: 'initial',
      '& div': {
        padding: '0px !important',
        '& svg': {
          paddingLeft: '7px',
          width: '25px'
        }
      }
    }
  },
  driveContainer: {
    top: 0,
    flex: 1,
    height: '100%',
    display: 'flex',
    outline: 0,
    zIndex: 1200,
    position: 'fixed',
    overflowY: 'auto',
    flexDirection: 'column',
    flexGrow: 1,
    left: '300px',
    width: 'calc(100% - 300px)',
    background: '#424242',
    marginTop: '43px'
  },
  drawerPaper: {
    width: '300px',
    marginTop: '43px'
  },
  showFile: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    width: '300px',
    flexShrink: 0,
  },
  signout: { 
    '& svg':{
      fontSize: '1.5rem',
      marginRight: '5px'
    }    
  }
}))
