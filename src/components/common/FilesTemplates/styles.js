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
    } ,
    mobile: {
        flex: '1 1 50%'
    }   
}))