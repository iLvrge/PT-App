import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
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
        '& .MuiDialogContent-root':{
            overflowY: 'hidden'
        }
    }
}))