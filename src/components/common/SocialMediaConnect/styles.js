import makeStyles from '@mui/styles/makeStyles'

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        width: 500,
        height: 300,
        padding: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: "8px"
        }
    },
    tooltip:{
        fontSize: '1rem'
    },
    button: {
        borderRadius: '0px'
    }
}))