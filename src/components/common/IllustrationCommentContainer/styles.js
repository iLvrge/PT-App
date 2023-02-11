import makeStyles from '@mui/styles/makeStyles';
import { pink } from '@mui/material/colors';

export default makeStyles(theme => ({
    root:{
        width: '100%',
        height: '100%', 
        position: 'relative',
        '& .MuiInputLabel-root':{
            display: 'inline-flex',
            paddingLeft: 6,
            paddingTop: 10
        },
        '& .MuiFormControl-root':{
            width: '90%'
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: '#5c5c5c',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#5c5c5c',
        },
        '& .MuiInput-underline:hover': {
            borderBottomColor: '#5c5c5c',
        },
        '& .MuiInputBase-input':{
            height: 21
        },
        '& iframe': {
            border: 0
        }
    },    
    container: {
        width: '100%',
        height: '100%',
        '& .ReactVirtualized__Table__row': {
            cursor: 'default'
        }
    },
    table: {
        '& .ReactVirtualized__Table__row': {
            cursor: 'default'
        }
    },
    showIcon: {
        /* padding: '10px', */
        fontSize: '1.1rem',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '5px',
        '& .MuiIconButton-root':{
          padding: 0,
          '&:hover':{
            color: 'rgb(230, 0, 0)' 
          }
        }      
    },
    commentContainer: {
        /* height: '100%',  */
        width: '100%',
    },
    floatIcon: {
        position: 'absolute',
        right: 25,
        zIndex: 9999
    },
    btn:{
        top: '-13px',
        right: 'calc(100% - 50%)'
    },    
    itemsLeft: {
        justifyContent: 'flex-start'
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: '53px 35px',
        flex: 1,
        display: 'flex',
        position: 'relative'
    },
    fullscreenBtn: {
        position: 'absolute',
        top: 10,
        right: 5,
        zIndex: 1,
        padding: 0
    },
    singleAssetContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    right:{
        position: 'absolute',
        right: 5,
        top: 11,
        width: 20,
        height: 20,
        zIndex: 1,
        borderRadius: 0
    },
    templateFrame:{
        width: '100%',
        height: '100vh',
        border: 0
    },
    draggableContainer:{
        width: '100%',
        height: '100%',
        cursor: 'move' 
    },
    headerContainer: {
        position: 'absolute',
        zIndex: 1,
        right: 30,
        top: 0,
        color: '#E60000'
    },
    iframe: {
        width: '100%',
        marginTop: 47
    },
    buttonMenu: {
        borderRadius: 0,
        '& .MuiTypography-body2':{
            marginLeft: 5
        },        
    },
    active: {
        color: '#E60000'
    },
    frameButton: {
        color: pink[500]
    },
}))