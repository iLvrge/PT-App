import makeStyles from '@mui/styles/makeStyles';

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
        },
        '& .MuiInputBase-multiline':{
            padding: 0,
            fontSize: '0.875rem'  
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
        marginTop: 25,
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
    typography: {
        marginTop: 10
    },
    txtField: {
        width: 100,
        marginLeft: 10,
        '& input':{
            padding: '6px 0 0',
            fontSize: '0.875rem'
        }
    },
    button: {
        /* border:'1px solid #5a5a5a !important', */
        marginLeft: 10,
        textTransform: 'initial',
        padding: '3px 5px',
        minWidth: 'auto',
        height: 27,
        '& .MuiButton-label':{
            whiteSpace: 'nowrap'
        },
        '&:hover':{
            /* border:'1px solid #e60000 !important', */
            color: '#e60000 !important'
        },
        '&:first':{
            marginLeft: 5
        },
    },
    headerButton: {
        textTransform: 'initial',
    },
    btnHeader: {
        position: 'absolute',
        top: 13,
        left: 35,
        padding: 0
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
        margin: '0 10px 5px 0',
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
        padding: '0 8px',
        textTransform: 'initial',
        marginRight: 20,
        '&:last':{
            margin: 0
        }
    },
    footer: {
        display: 'flex',
        flex: '1 1 auto',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 30,
        paddingRight: 50,
        '& .MuiTypography-root':{
            marginLeft: 10
        }
    }
}))