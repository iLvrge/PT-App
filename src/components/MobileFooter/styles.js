import { makeStyles } from '@material-ui/core/styles'


export default makeStyles(theme => ({
    root: {
        '& svg.MuiSvgIcon-root': {
            width: '2rem',
            height: '2rem'
        },
        '& .MuiBottomNavigationAction-root.MuiBottomNavigationAction-iconOnly':{
            paddingTop: 0,
            paddingBottom: 0
        },
        '& .MuiBottomNavigation-root':{
            height: 45
        },
        '& .MuiFab-root':{
            width: 48, 
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
        margin: '1rem 0 0 1.5rem',
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