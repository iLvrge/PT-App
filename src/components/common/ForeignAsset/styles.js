import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
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
    modal: {
        top: '42px !important',
        '& .MuiBackdrop-root':{
            top: '42px !important',
        },
        '&:focus-visible': {
            outline: '0 !important'
        }
    },
    importContainer: {
        display: 'flex',
        width: 600,
        height: 500,
        padding: 20,
        margin: '50px auto'
    },
    rows: {
        marginTop: 20
    },
    textarea: {
        width: '100%',
    },
    txtField: {
        width: 100
    },
    button: {
        border:'1px solid #5a5a5a !important',
        marginLeft: 15,
        textTransform: 'initial',
        padding: '3px 5px',
        '&:hover':{
            border:'1px solid #e60000 !important',
            color: '#e60000 !important'
        },
        '&:first':{
            marginLeft: 5
        },
    }
}))