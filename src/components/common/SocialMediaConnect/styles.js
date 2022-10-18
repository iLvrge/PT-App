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
        borderRadius: 100,
        textTransform: 'initial',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '17px 28px',
        width: 205,
        '&:hover':{
            borderColor: 'rgba(255, 255, 255, 0.08)'
        }
    },
    icon: {
        marginRight: 5
    }
}))