import makeStyles from '@mui/styles/makeStyles';


export default makeStyles(theme => ({
    root: {
        display: 'flex',
        height: 45,
        /* width: 'initial',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0, */
        zIndex: 999,
        '& svg.MuiSvgIcon-root': {
            width: '2rem',
            height: '2rem'
        },
        '& .MuiBottomNavigationAction-root.MuiBottomNavigationAction-iconOnly':{
            paddingTop: 0,
            paddingBottom: 0,
            minWidth: 'auto'
        },
        '& .MuiBottomNavigation-root':{
            height: '100%',
            width: '100%'
        },
        '& .MuiFab-root':{
            width: 45,
            minWidth: 45,
            height: 45,
            borderRadius: '50%', 
            zIndex: 999
        }
    }, 
    alignRight: {
        '& .MuiBox-root':{
            width: '100%',
            flex: '1 1 100%',
            alignItems: 'center',
            textAlign: 'left',
            justifyContent: 'flex-start',
        } 
    },
    drawerContainer: { 
        margin: '1rem 1.5rem',
    },
    swipeButtons: {
        display: 'flex',    
        fontSize: 20,
        '&  .MuiIconButton-label svg':{
            width: '2rem',
            height: '2rem',
            fill: '#fff',
            stroke: '#fff',
        },
        '& .MuiIconButton-root':{
            padding: 12,
            fontSize: '1.1em',
            color: '#FFF',
            borderRadius: 'unset',
            width: '100%',
            minWidth: '100%',
            justifyContent: 'flex-start',
            '& span.text':{
                marginLeft: 20
            }
        },
        '& .MuiIconButton-root.active':{
            color: '#E60000 !important'
        },
        '& .MuiIconButton-root.active svg':{
            fill: '#E60000 !important',
            stroke: '#E60000 !important',
        },
    },
    floatingContainer: {
        position: 'relative'
    }
}))