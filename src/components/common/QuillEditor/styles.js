import makeStyles from '@mui/styles/makeStyles';
import { toggleThemeMode } from '../../../actions/uiActions';
import { pink } from '@mui/material/colors';
export default makeStyles(theme => ({
  root: {
    '& .ql-container, .ql-toolbar, #toolbar': {
      background: 'none !important'
    },
    '& .ql-container.ql-snow, .ql-toolbar.ql-snow, #toolbar':{     
      border: `0px !important`,
    },
    '&.ql-snow .ql-picker, .ql-toolbar, .ql-container, #toolbar, .ql-picker-label, .ql-picker-label svg, .ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button, .ql-snow.ql-toolbar button svg, .ql-snow .ql-toolbar button svg, .ql-snow .ql-stroke, .ql-picker-label, #toolbar button, #toolbar button svg ':{
      color: theme.palette.action.active,
      stroke: theme.palette.action.active,
      fill: theme.palette.action.disabledBackground,
    },
    '&.ql-snow .ql-stroke, .ql-snow button.ql-bold , .ql-snow button.ql-italic , .ql-snow button.ql-atButton , .ql-snow button.ql-atButton svg, .ql-snow button.ql-attachButton , .ql-snow button.ql-attachButton svg, .ql-snow button.ql-saveButton , .ql-snow button.ql-saveButton svg, .ql-snow button.ql-sendattachButton svg, #toolbar button svg': {
      stroke: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabledBackground,
      fill: theme.palette.action.disabledBackground,
      pointerEvents: 'none'  
    },
    '& .focus .ql-snow .ql-stroke, .focus .ql-snow button.ql-atButton svg, .focus .ql-snow .ql-attachButton svg, .focus .ql-snow .ql-saveButton svg,  .attach .ql-snow .ql-sendattachButton svg, .focus #toolbar svg': {
      color: theme.palette.action.active,
      fill: theme.palette.action.active,
      pointerEvents: 'all'
    },
    '& .focus .ql-snow .ql-stroke, .attach .ql-snow .ql-stroke':{
      stroke: theme.palette.action.active
    },
    '& .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, #toolbar button:hover, #toolbar button:focus': {
      color: theme.palette.action.active
    },
    '& .ql-snow .ql-picker-options .ql-picker-item, .ql-snow.ql-toolbar .ql-picker-item:hover,.ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected':{
      color: theme.palette.background.default
    },
    '& .focus .ql-snow.ql-toolbar button:hover, .focus .ql-snow.ql-toolbar button svg:focus, .focus .ql-snow.ql-toolbar button svg:hover, .focus .ql-snow.ql-toolbar button.ql-bold:hover svg.MuiSvgIcon-root .ql-stroke, .focus .ql-snow.ql-toolbar button.ql-bold:focus svg.MuiSvgIcon-root .ql-stroke, .focus .ql-snow.ql-toolbar button.ql-italic:hover svg.MuiSvgIcon-root .ql-stroke, .focus .ql-snow.ql-toolbar button.ql-italic:focus svg.MuiSvgIcon-root .ql-stroke':{
      color: pink[500],
      stroke: pink[500]
    },
    '& .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected, .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover,  .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active': {
      color: pink[500]
    },
    '& .ql-editor.ql-blank::before':{
      fontStyle: 'initial',
      color:  theme.palette.action.disabled
    }
  },
  textEditor: {
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `${theme.palette.action.active} 0px 0px 7px 0px`,
    borderRadius: 8,
    margin: 0,
    overflow: 'hidden',
    '& .ql-attachDriveButton':{
    }    
  },
  buttonGroup: {
    width: '100%',
    textAlign: 'right',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  seperator: {
    display: 'flex',
    width: 1,
    height: 20,
    borderLeft: `1px solid ${theme.palette.divider}`,
    marginRight: 6
  },
  secondaryGroup: {
    display: 'flex',
    padding: '0 5px',
    flexGrow: 1
  },
  review: {
    border:`1px solid ${theme.palette.divider} !important`,
    borderRadius: 4,
    textTransform: 'initial',
    width: 'auto !important',
    padding: '3px 5px !important',
    '&:hover':{
      border:`1px solid ${pink['500']} !important`,
      color: `${pink['500']} !important`
    },
    '&:first-child':{
      /* marginLeft: 20,
      borderLeft: '1px solid #545454' */
    },
    '& .MuiButton-label': {
      whiteSpace: 'nowrap'
    }
  }, 
  active: {
    border:`1px solid ${pink['500']} !important`,
    '& .MuiButton-label': {
      color: pink['500']
    }    
  },
  buttonProgress: {
    position: 'absolute',
    bottom: '10px',
    right: '5vw',
    color: theme.palette.text.primary,
  },
  formContainer:{
    display: 'flex',
    flexDirection: 'column',
    flex:1,
    overflow: 'hidden auto',
    width: '50vw',
    margin: '50px auto',
    height: '60vh',
    border: `1px solid ${theme.palette.divider}` 
  },
  formWrapper: {
    position: 'relative',
    flexGrow: 1,
    flexDirection: 'column',
    display: 'flex',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
    padding: 10
  },  
  form: {
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  btn:{
    display: 'flex',
    height: 30,
    margin: 10
  },
  share: {
    '& svg':{
      width: 20,
      height: 20
    }
    
  },
  icon:{
    
  }
}))