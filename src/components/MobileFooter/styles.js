import { makeStyles } from '@material-ui/core/styles'


export default makeStyles(theme => ({
    swipeButtons: {
        display: 'flex',
        '& svg': {
            width: '1.5rem',
            height: '1.5rem'
        }
    }
}))