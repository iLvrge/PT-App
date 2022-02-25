import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        /* backgroundColor: '#25272B', */
        overflow: 'hidden auto',
        '& .MuiTableCell-root .MuiSelect-select.MuiSelect-select':{
            paddingRight: 0 
        },
        '& .ReactVirtualized__Table__rowColumn':{
            '& .MuiSvgIcon-root':{
                fontSize: 20,
                width: '1em',
                height: '1em' ,
                position: 'absolute',
                top: 5
            },
            '& .MuiTableCell-root span':{
                padding: 6
            }
        },
        '& .MuiSelect-select:focus':{
         background: 'none'
        },
        '& svg.MuiSelect-icon':{
            fontSize: '1.7rem',
            top: 3,
            /* color: 'rgba(255,255,255,0.7)', */
            opacity: 0
        },
        '& .MuiInput-underline':{
            /* paddingRight: 11  */
        }, 
        '& .MuiInput-underline:hover:not(.Mui-disabled):before, .MuiInput-underline:before, .MuiInput-underline:after':{
            border: 0
        },
        '& .selectedIcon svg':{          
            position: 'absolute',
            fontSize: '1.3rem',
            /* color: '#fff', */
            width: '1.3rem',
            left: 2,
            top: '17px  !important'
        }
    },
    mobile: {
        flex: '1 1 50%'
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
        /* borderBottom: '1px solid #5c5c5c', */
        '&.ReactVirtualized__Table__headerRow': {
          /* backgroundColor: '#292929', */
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
