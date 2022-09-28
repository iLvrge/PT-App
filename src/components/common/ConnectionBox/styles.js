import { yellow } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
  root: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTableCell-root':{
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  },
  pdfContainer: {
    flexGrow: 1,
    position: 'relative',
    width: '100%',
    zIndex: 9999,
  },
  pdfWrapper: {
    position: 'relative',
    top: '4px',
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flexGrow: 1,
    height: '100%',
    position: 'relative',
    overflow: 'auto',
  },
  outsource: {
    width: '100%',
    border: '0px',
  },
  fullView: {
    width: '100% !important',
  },
  close: {
    position: 'absolute',
    right: '0',
    zIndex: 11,
    top: '-3px',
    fontSize: '20px',
    cursor: 'pointer',
  },
  rootContainer:{
    '& td':{
      verticalAlign: 'top'
    }
  },
  fixedWidth:{
    width:220
  },
  red: {
    color: '#e60000'
  },
  table:{
    tableLayout: 'fixed'
  },
  tablebg:{
    
  },
  cellHeading:{
    whiteSpace: 'nowrap',
    /* padding: '19px 19px 17px 19px',  */
    padding: '13px 19px', 
    '& .MuiTypography-body2':{
      fontSize: '1rem',
      overflow: 'hidden'
    }    
  },
  blue:{
    color: '#228DE8',
    fontWeight: 'bold' 
  },
  marginHeading: {
    '& .MuiTypography-body2':{
      marginBottom: 5,
      '&:last-child':{
        marginBottom: 0
      }
    }
  },
  marginBottom: {
    marginBottom: 5,
  },
  highlight: {
    color: yellow[500]
  }
}))
