import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden auto',
        '& .disable_header':{
            '& .ReactVirtualized__Table__headerRow': {
                /* visibility: 'hidden' */
                display: 'none'
            }
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
