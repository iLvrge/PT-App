import makeStyles from '@mui/styles/makeStyles';
import { pink } from '@mui/material/colors';

export default makeStyles(theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiPaper-root': {
            backgroundImage: 'none'
        }
    },  
    fullscreenBtn: {
        position: 'absolute',
        top: 9,
        right: 0,
        zIndex: 99999
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: 28,
        flex: 1,
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        '& .full_heading':{
            '& .MuiTypography-root':{
                marginTop: 15
            }
        }
    },
    noBackground: {
        background: 'none'  
    },
    noFullScreen: {
        flex: 'none',
        margin: '50px auto'
    },
    right:{
        position: 'absolute', 
        right: 0,
        width: 20,
        height: 20,
        zIndex: 999999
    },  
    shareIcon: {  
        right: 30,
        top: 2
    },
    tooltip:{
        fontSize: '1rem'
    },
    activeColor: {
        color: pink[500]
    }
}))