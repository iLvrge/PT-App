import makeStyles from '@mui/styles/makeStyles';
import { pink } from '@mui/material/colors';
const styles = makeStyles((theme) => ({
  tableRootContainer:{
    display: 'flex',
    position: 'relative', 
    height: '100%', 
    width: '100%',
    '& .headingIcon':{
      width: '1.2rem',
      height: '1.2rem',
      padding: 0,
      marginRight: 5
    }
  },
  headDropdown: {
    left: 0,
    right: 0
  },
  td: {
    display: 'flex',
  },
  th: {
    display: 'flex',
    border: 'none',
    minWidth: '35px',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    '&.MuiTableCell-head':{
      minWidth: '35px',
      
    },
    '& .ReactVirtualized__Table__headerColumn':{
      position: 'relative',
      '& .DragHandle':{
        flex: '0 0 16px',
        zIndex: 2,
        cursor: 'col-resize',
        position: 'absolute',
        right: 10
      }
    }
  },
  tableRow: {
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover':{
      backgroundColor: theme.palette.action.hover
    },
    '&.ReactVirtualized__Table__headerRow': {
      /* backgroundColor: '#292929', */
      '& .MuiSvgIcon-root':{
        fontSize: '1rem',
        width: '1rem',
        height: '1rem'
      },      
      '& .MuiTableCell-head':{
        fontSize: '1.1rem',
        fontWeight: 400,
        /* width: '1rem',
        height: '1rem' */
        '& .headingIcon':{
          width: '1.35rem',
        },
        '& .slackIcon':{
          '& span.MuiIconButton-label':{  
            width: 32,
            height: 32,
            '& svg':{
              width: 32,
              height: 32
            }
          }
        },
      }
    },
    '&.noBorderLines':{
      border: 0
    },
    '& .MuiTableCell-root':{
      fontSize: '1rem !important'
    },
    '&.highlightRow':{
      '& .MuiTableCell-root.highlightColumn': {
        '& span': {
          color: pink[500]
        }
      }      
    },
    '&.highlightWithCol.Mui-selected':{
      backgroundColor: 'inherit !important',
      '& .MuiTableCell-root': {
        '& span': {
          color: pink[500]
        }  
      },
      '& .MuiTableCell-root.highlightColumn': {
        '& span': {
          color: pink[500]
        }  
      }
    },
    '& .ReactVirtualized__Table__rowColumn':{
      '& .MuiSvgIcon-root':{
        fontSize: '1rem',
        width: '1rem',
        height: '1rem'
      },
      '& svg.MuiSelect-icon': {
        top: 3,
        width: '1.5rem',
        height: '1.5rem'
      },
      '& .fa-chevron-down':{
        top: 7,
        position: 'absolute'
      }
    },
    '& .MuiTableRow-root.Mui-selected, .MuiTableRow-root.Mui-selected:hover':{
      /* backgroundColor: 'inherit', */
      '& .MuiTableCell-root':{
        /* color: '#e60000', */
        '& span':{
          /* color: '#e60000', */
        }
      }
    }
  },
  tableCell: { 
    flex: 1,
    /* whiteSpace: 'nowrap', */
    border: 'none',
    alignItems: 'center',
    padding: '0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    /* margin: '0 10px', */
    '& .MuiSvgIcon-root':{
      fontSize: '1rem'
    },
    '& fieldset':{
      border: 0
    }
  },
  
  disableColumn:{
    color: theme.palette.mode == 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'
  },
  textBold: {
    /*fontWeight: 900*/
    textDecoration: 'underline'
  },
  marginLeft:{
    marginLeft: 5
  },
  marginLeft10:{
    marginLeft: 10
  },
  smallImg:{
    width: '18.375px',
    height: '18.375px',
    marginRight: 5,    
  },
  imgIcon:{
    width: '18.375px',
    height: '18.375px',
    marginRight: 5,
  },
  flexImageContainer:{
    display: 'flex',
    alignItems: 'center',
  },
  flexImage: {
    display: 'flex',
    width: 21,
    height: 21,
    alignItems: 'center',
  },
  flexData: {
    display: 'flex',
    alignItems: 'center',
  },
  flex:{
    display: 'flex'
  },
  headingIcon: {
    width: 24,
    height: 24,
    fill: '#fff'
  },
  tooltip: {
    fontSize: '1rem',
    '& .MuiTypography-root': {
      fontSize: 18
    }
  },
}))

export default styles
