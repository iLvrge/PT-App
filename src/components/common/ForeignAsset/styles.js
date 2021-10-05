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
        width: '100%',
        boxShadow: 'none'
    },
    rows: {
        marginTop: 8,
        display: 'flex'
    },
    columns: {
        display: 'flex',
    },
    col1: {
        width: '25%'
    },
    col2: {
        width: '75%'
    },
    textarea: {
        width: '100%',
    },
    txtField: {
        width: 100,
        marginLeft: 10
    },
    button: {
        border:'1px solid #5a5a5a !important',
        marginLeft: 15,
        textTransform: 'initial',
        padding: '3px 5px',
        minWidth: 'auto',
        '& .MuiButton-label':{
            whiteSpace: 'nowrap'
        },
        '&:hover':{
            border:'1px solid #e60000 !important',
            color: '#e60000 !important'
        },
        '&:first':{
            marginLeft: 5
        },
    },
    headerButton: {
        textTransform: 'initial'
    },
    items: {
        display: 'flex',
        maxHeight: '100%',
        overflow: 'auto',
        overflowX: 'hidden',
        justifyContent: 'start',
        flexWrap: 'wrap',
        boxShadow: 'none'
    },
    item: {
        position: 'relative',
        display: 'flex',
        flexBasis: '100px',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        background: '#292929',
        border: '1px solid #5c5c5c',
        padding: '0 3px',
        margin: '0 5px 5px',
        "&:hover": {
            background: '#303030',
            '& .closeBtn': {
                display: 'block'
            }
        },
        '&.active':{
            '& .input_item': {
                display: ''
            },
        },
        '& .closeBtn': {
            position: 'absolute',
            minWidth: 15,
            height: 'auto',
            right: 0,
            top: 0,
            display: 'none',
            background: 'none',
            padding: 0,
            lineHeight: 1,
            '& svg':{
                width: 15,
                height: 15
            }
        },
        '& .input_item': {
            display: 'none'
        },
        '& .MuiButton-root:hover':{
            color: '#5c5c5c'
        },
        '& input':{
            width: 100
        }
        
    },
    item_error: {
        color: '#E60000'
    },
    close: { 
        position: 'absolute', 
        right: 10, 
        top: 7, 
        zIndex: 999,
        cursor: 'pointer'
    },
    btnClear:{
        position: 'absolute',
        right: 35,
        bottom: 0,
        width: 120
    }
}))