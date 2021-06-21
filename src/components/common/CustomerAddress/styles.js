import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden auto',
    },    
    table: {
        '& .disable_header':{
            '& .ReactVirtualized__Table__headerRow': {
                visibility: 'hidden'
            }
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
        }
    },
    tableRow: {
        cursor: 'pointer',
        borderBottom: '1px solid #5c5c5c',
        '&.ReactVirtualized__Table__headerRow': {
          backgroundColor: '#292929',
          '& .MuiSvgIcon-root':{
            fontSize: '1rem'
          }
        },
    },
    tableCell: {
        flex: 1,
        whiteSpace: 'nowrap',
        border: 'none',
        alignItems: 'center',
        padding: '0',
        overflow: 'hidden',
        /* margin: '0 10px', */
        '& .MuiSvgIcon-root':{
            fontSize: '1rem'
        }
    },
    btn:{
        position: 'absolute',
        right: 10, 
        bottom: 10
    }
}))
