import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap !important',
        overflowX: 'hidden',
        overflowY: 'hidden',
        padding: '5px'        
    },
    dashboard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '1px solid #363636' 
    },
    dashboardWarapper: {
        position: 'relative',
        flexGrow: 1,
        flexDirection: 'column',
        display: 'flex',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 1,
    }, 
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
    filterToolbar: {
        width: '3.5rem',
        borderRight: 0,
    },
    flex:{
        width: '3.5rem',
        position: 'absolute'
    },
    mobileFlex: {
        width: '5.5rem',
        position: 'absolute'
    },
    bottom: {
        bottom: 0
    },
    view: {
        display: 'flex',
        flex: '1 1 0%',
        position: 'relative'
    },
    mobileToolbar: {
        width: '5.5rem',
        borderRight: 0,
    },
    showIcon: {
        /* padding: '10px', */
        fontSize: '1.1rem',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
        paddingBottom: '30px',
        '& .MuiIconButton-root':{
            padding: 0,
            color: '#5a5a5a',
            '&:hover':{
                color: 'rgb(230, 0, 0)' ,
                '& svg':{
                  fill: 'rgb(230, 0, 0)',
                }
            },
            '& svg':{
                fill: '#5a5a5a',
                width: '2rem',
                height: '2rem'
            },
            '&.active':{
                color: '#fff !important' ,
                '& svg':{
                  fill: '#fff !important' 
                },
                '&:hover':{
                  color: 'rgb(230, 0, 0) !important' ,
                  '& svg':{
                    fill: 'rgb(230, 0, 0) !important',
                  }
                }
            }
        }
    }
}))
