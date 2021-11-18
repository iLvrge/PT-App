import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden auto'           
    },
    btnEmail:{
        padding: '0 5px',
        border: 0,
        position: 'absolute',
        textTransform: 'inherit'
    },
    dialogButton: {
        flex: '1 1 100%',
        display: 'flex',
        margin: '0 10px',
        '& .MuiInputLabel-shrink': {
          fontSize: 16
        }
    },
}))