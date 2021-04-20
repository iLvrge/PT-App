import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles((theme) => ({
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
    }
  },
  tableRow: {
    cursor: 'pointer',
    borderBottom: '1px solid #5c5c5c',
    '&.ReactVirtualized__Table__headerRow': {
      backgroundColor: '#292929',
      '& .MuiSvgIcon-root':{
        fontSize: '1rem'
      },
      '& .MuiTableCell-head':{
        fontSize: '1rem'
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
    fontWeight: 900
  }
}))

export default styles
