import makeStyles from '@mui/styles/makeStyles'

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 500,
        height: 250,
        padding: 20,
        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: "8px"
        }
    },
    box: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        margin: '20px 0px'
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