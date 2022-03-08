import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    /* dashboard: {
        position: 'absolute',
        top: 43,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#121212',
        padding: '0 5px'
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
    }, */
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    drive: {
        display: 'flex', 
        height: '100vh',
        overflow: 'auto',
        '& .MuiTableCell-root':{
            whiteSpace: 'nowrap'
        },
        '& .MuiAvatar-root':{
            width: theme.spacing(2),
            height: theme.spacing(2),
        }, 
        '& .MuiList-root':{
            width: '100%',
        },
        '& .MuiTreeItem-label':{
            height: 40,
            display: 'flex',
            alignItems: 'center'
        },
        '& .Droppable': {
            width: '100%',
            '& .MuiTypography-root':{
                paddingLeft: 5
            }
        },
        '& .MuiTreeView-root':{
            width: '100%',
            '& .MuiTreeItem-root':{
                borderBottom: `1px solid ${theme.palette.divider}`
            }
        },
        '& li.MuiListItem-root':{
            borderBottom: `1px solid ${theme.palette.divider}`,
            paddingTop: 0,
            paddingBottom: 0,
            height: 40
        }
    },
    dropItem: {
        backgroundColor: theme.palette.background.paper
    },
    frame: {
        width: '100%',
        height: '100vh'
    },
    dropFolder: {
        height: '30px',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        padding: '5px 10px 10px 10px',
        marginBottom: '5px',
        textAlign: 'center'
    },
    dropFolder1: {
        height: '30px',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        marginBottom: '5px',
        textAlign: 'center'
    },
    splitPane: {
        position: 'relative !important',
        '& .Resizer': {
            opacity: 1,
            height: '100%',
            width: '3px',
            zIndex: 1,
            boxSizing: 'border-box',
            cursor: 'col-resize',
            backgroundClip: 'padding-box',
            background:'#000',
            '&:hover':{
                background:'#f50057',
            },
            '&.horizontal': {
                height: '3px',
                width: '100%',
                cursor: 'row-resize'
            }
        },
        '& .Pane': {
          maxHeight: '100%',
          
        },
        '& .Pane2': {
          height: '100%',
          overflow: 'auto',
        },
    },
    heading: {
        height: 40,
        overflow: 'hidden',
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 25,
        '& .MuiBreadcrumbs-root':{
            display: 'inline-block',
            marginLeft: 30,
            /*overflow: 'hidden',*/
            width: '100vw'
        }
    },
    small: {
        width: theme.spacing(2),
        height: theme.spacing(2),
    },
    repo_name: {
        position: 'absolute',
        top: '-1px',
        left: 25
    },
    relative: {
        position: 'relative'
    },
    relativeLockedIcon: {
        position: 'relative',
        top: 5,
        cursor: 'pointer'
    },
    noWrap: {
        whiteSpace: 'nowrap'
    }
}))