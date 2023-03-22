import { alpha } from '@mui/material/styles';


import makeStyles from '@mui/styles/makeStyles';


export default makeStyles(theme => ({
    root: {
        zIndex: theme.zIndex.drawer + 6,
        transition: theme.transitions.create([ 'margin' ], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        position: 'initial',
        background: '#222222',
        width: 'initial',
        border: '1px solid #363636',
        marginBottom: '5px',
        //padding: `0px ${HEADER_PADDING}px`,
        overflow: 'hidden',
        padding: '0 10px'
    },
    toolbar: {
        padding: 0,
        minHeight: 40,
        position: 'relative', 
    },
    logoContainer: {
        width: 230,
        display: 'flex' 
    },    
    siteLogo: {
        /* width: LOGO_WIDTH,
        maxWidth: 'calc(100% - 30px)', */
        height: '1.5rem',
        marginRight: 15    
    },  
    companyLogoCon: {
        display: 'flex',
        alignItems: 'center',
        /* width: '14rem',  */
        justifyContent: 'flex-start', 
        /* cursor: 'pointer', */
        overflow: 'hidden',
        '@media (max-width: 70em)': {
        //paddingLeft: 15
        },
    },
    rightPanel: {
        marginLeft: 'auto',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        '& .MuiBadge-anchorOriginTopRightRectangular': {
            transform: 'scale(1) translate(27%, 0%)',
            padding: '0 3px',
            minWidth: 15,
            height: 15
        },
        '& .MuiBadge-anchorOriginTopRightRectangular.MuiBadge-invisible': {
            transform: 'scale(0) translate(50%, -50%)'
        },     
        '& .MuiBox-root':{
            marginLeft: 5
        }   
    },
    
}))