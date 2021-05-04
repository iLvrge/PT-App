import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
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
        height: '100%', 
        width: '100%',
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
        margin: 35,
        flex: 1,
        display: 'flex'
    },
    fullscreenBtn: {
        position: 'absolute',
        top: '6px',
        right: '6px',
        zIndex: 1
    },
    singleAssetContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    right:{
        position: 'absolute',
        right: '35px',
        width: '20px',
        height: '20px',
        zIndex: 1
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
    }
}))