import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    menu: {
        position: 'absolute',
        right: 40,
        zIndex: 9,
        minWidth: 100,
        '& .MuiInput-underline:hover:not(.Mui-disabled):before, .MuiInput-underline:before, .MuiInput-underline:after':{
            borderBottom: 0
        },
        '& .MuiSelect-select': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
        },
        '& .MuiSelect-select.MuiSelect-select':{
            paddingLeft: 5
        }
    },
    formControl: {
    },
})) 