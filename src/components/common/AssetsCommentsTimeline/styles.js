import makeStyles from '@mui/styles/makeStyles';
import autoprefixer from 'autoprefixer'
import { pink } from '@mui/material/colors';
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
    width: '36px !important', 
    height: '36px !important',
  },
  loader: {},
  content: {
    display: 'flex',
    flexDirection: 'column-reverse',
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
  fullscreenBtn: {
    position: 'absolute',
    top: 5,
    right: 0,
    zIndex: 999
  },  
  commentEditor: {
    /* paddingLeft: 40, */
    /* padding: '0',
    margin: '0 auto',
    width: '95% !important' */
    zIndex: 99999,
    position: 'sticky',
    bottom: 3,
    width: '95% !important',
    pointerEvents: 'none',
    '& .focus .ql-snow .ql-stroke, .focus .ql-snow button.ql-atButton svg, .focus .ql-snow .ql-attachButton svg, .focus .ql-snow .ql-saveButton svg,  .attach .ql-snow .ql-sendattachButton svg': {
      color: theme.palette.action.active,
      pointerEvents: 'all'
    },
    '& .focus .ql-snow .ql-stroke, .attach .ql-snow .ql-stroke':{
      stroke: theme.palette.action.active
    },
	'& .focus .ql-snow.ql-toolbar button:hover, .focus .ql-snow.ql-toolbar button svg:focus, .focus .ql-snow.ql-toolbar button svg:hover, .focus .ql-snow.ql-toolbar button.ql-bold:hover svg.MuiSvgIcon-root .ql-stroke, .focus .ql-snow.ql-toolbar button.ql-bold:focus svg.MuiSvgIcon-root .ql-stroke, .focus .ql-snow.ql-toolbar button.ql-italic:hover svg.MuiSvgIcon-root .ql-stroke, .focus .ql-snow.ql-toolbar button.ql-italic:focus svg.MuiSvgIcon-root .ql-stroke':{
      color: pink[500],
      stroke: pink[500]
    },
  },
  commentEditorActive:{
    pointerEvents: 'all',
  },
  commentEditorStandalone:{
    bottom: 44,
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
    margin: '0 !important',
    padding: '0 !important',
    '& a':{
      color: '#fff'
    },
    '& span':{
      cursor: 'inherit !important'
    },
    '& .message_link':{
      color: theme.palette.text.primary
    },
    '& .active_link':{
      color: pink[500]
    }
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
  fileLink: { 
    cursor: 'pointer',
    textDecoration: 'underline',
    '&:hover':{
      color: '#e60000' 
    },
    '& img':{
      marginRight: 5,
      position: 'relative',
      top: 5,
      width: 24
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
    /* height: 'calc(100% -  180px)', *//*'32.5%', */
    margin: '5px auto !Important',
    display: 'flex',
    '& div':{
      width: '100%'
    },
    /* flex: '1 100%', */
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
    top: 0,
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
  googleButton: {
    position: 'absolute',
    top: '-9999px'
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
  },
  closeButton: {
    position: 'absolute',
    right: 0 
  },
  items: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 300,
    overflow: 'auto',
  },
  heading: {    
    marginBottom: 15
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '10px',
    overflow: 'hidden',
    height: '40px',
    position: 'relative',
    cursor: 'pointer',
    '&:hover':{
      background: '#2d2d2d'
    },
    '& span': {
      position: 'absolute',
      left: 35,
      /* top: 7, */
      display: 'inline-block',
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  },
  driveModal: {
    width: 800,
    height: '90vh',
    margin: '50px auto',
    padding: 20,
    overflow: 'hidden',
    '&:focus':{
      outline: 'none'
    }
  },
  containerList: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden auto'
  },
  message_time: {
    fontSize: '0.65rem',
    marginLeft: 5
  } ,
  btn:{
    position: 'absolute',
    right: 10, 
    bottom: 10
  },
  tooltip:{
      fontSize: '1rem'
  },
  icon: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  list: {
    padding: '0.375rem !important',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  listItem: {
    cursor: 'pointer',
    display: 'flex',
    color: theme.palette.text.primary,
    position: 'relative',
    flexDirection: 'column',
  },
  child: {
    display: 'flex',
    marginLeft: 20
  },
  active: {
    color: pink[500]
  }
}))
