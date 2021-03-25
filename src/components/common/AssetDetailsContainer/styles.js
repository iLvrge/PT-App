import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        '& .Pane1':{
            height: 0
        }
    },
    showIcon: {
        /* padding: '10px', */
        fontSize: '1.1rem',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '13px',
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
    btnLeft: {
        left: '-10px',
        right: 'unset'
    },    
    itemsLeft: {
        justifyContent: 'flex-start'
    },
    notInteractive: {
        pointerEvents: 'none'
    },      
    isInteractive: {
        pointerEvents: 'auto'
    }
})) 