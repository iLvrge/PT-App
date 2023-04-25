import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap !important',
        overflowX: 'hidden',
        overflowY: 'hidden',
        padding: '5px' ,
        '& .MuiIconButton-root':{
            /* '& svg':{
                width: '1.5rem',
                height: '1.5rem'
            } */
        } ,
        '& .MuiPaper-root':{
            /* backgroundImage: 'none' */
        }
    },
    dashboard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        /* border: `1px solid ${theme.palette.divider}`  */
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
    mobileDashboardWrapper: {
        flexGrow: 'inherit',
        maxHeight: '-webkit-fill-available',
        '& .timeline .vis-panel.vis-top':{
            display: 'none'
        }
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
    filterToolbar: {
        width: '57px',   
        borderRight: 0,
    },
    flex:{
        width: '57px',
        position: 'absolute'
    },
    mobileFlex: {
        width: '5.5rem',
        position: 'absolute'
    },
    bottom: {
        bottom: 10
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
    dialogRoot: {
        '& .MuiDialogContent-root':{
            padding: '10px !important',
            '& .MuiDialogContentText-root':{
                margin: '0px !important'
            }
        }
    },
    infoMessage:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%' 
    }
}))
