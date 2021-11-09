import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles((theme) => ({
  tableRootContainer:{
    display: 'flex',
    position: 'relative', 
    height: '100%', 
    width: '100%',
    '& .headingIcon':{
      width: '1.2rem',
      height: '1.2rem',
      padding: 0
    }
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
    borderBottom: '1px solid #5c5c5c',
    '&.ReactVirtualized__Table__headerRow': {
      backgroundColor: '#292929',
      '& .MuiSvgIcon-root':{
        fontSize: '1rem',
        width: '1rem',
        height: '1rem'
      },
      '& .MuiTableCell-head':{
        fontSize: '1.1rem',
        width: '1rem',
        height: '1rem'
      }
    },
    '&.noBorderLines':{
      border: 0
    },
    '&.highlightRow.Mui-selected':{
      backgroundColor: '#121212 !important',
      '&:hover':{
        backgroundColor: '#252525 !important'
      }
    },
    '& .ReactVirtualized__Table__rowColumn':{
      '& .MuiSvgIcon-root':{
        fontSize: '1rem',
        width: '1rem',
        height: '1rem'
      },
      '& svg.MuiSelect-icon': {
        top: 8
      }
    },
    '& .MuiTableRow-root.Mui-selected, .MuiTableRow-root.Mui-selected:hover':{
      backgroundColor: 'inherit',
      '& .MuiTableCell-root':{
        color: '#e60000'
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
    /* margin: '0 10px', */
    '& .MuiSvgIcon-root':{
      fontSize: '1rem'
    }
  },
  
  disableColumn:{
    color: 'rgba(255, 255, 255, 0.3)'
  },
  textBold: {
    /*fontWeight: 900*/
    textDecoration: 'underline'
  },
  marginLeft:{
    marginLeft: 5
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
  }
}))

export default styles
