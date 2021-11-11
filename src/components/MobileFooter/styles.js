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
            width: 48
        }
    }, 
    drawerContainer: {
        margin: '2rem 0 0 2rem',
    },
    swipeButtons: {
        display: 'flex',    
        '&  .MuiIconButton-label svg':{
            width: '2rem',
            height: '2rem',
            fill: '#fff',
            stroke: '#fff',
        },
        '& .MuiIconButton-root':{
            color: '#FFF',
            '& span.text':{
                marginLeft: 5
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