import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden auto',
        '& .MuiTableCell-root .MuiSelect-select.MuiSelect-select':{
            paddingRight: 0 
        },
        '& .MuiSelect-select:focus':{
         background: 'none'
        },
        '& svg.MuiSelect-icon':{
            fontSize: '1.7rem',
            top: 3,
            color: 'rgba(255,255,255,0.7)'
        },
        '& .MuiInput-underline':{
            paddingRight: 11 
        }, 
        '& .MuiInput-underline:hover:not(.Mui-disabled):before, .MuiInput-underline:before, .MuiInput-underline:after':{
            border: 0
        },
        '& .selectedIcon svg':{          
            position: 'absolute',
            left: 9,
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.7)',
            width: 19
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
    }
}))
