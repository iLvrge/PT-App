import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTab-root':{
            minWidth: 'inherit',
            maxWidth: '100px'
        },
        '& .vis-panel.vis-background.vis-horizontal .vis-grid': {
            borderColor: '#e5e5e51c',
        },
        '& .MuiTableCell-root .MuiSelect-select.MuiSelect-select':{
            paddingRight: 0 
        },
        '& .MuiListItem-root':{
            '& svg.clipboard':{
                width: 24,
                height: 24
            }
        },
        '& .MuiSelect-select:focus':{
            background: 'none'
        },
        '& svg.MuiSelect-icon':{
            fontSize: '1.7rem',
            top: 3,
            color: 'rgba(255,255,255,0.7)'
        },
        '& .MuiInput-underline':{
            paddingRight: 11 
        }, 
        '& .MuiInput-underline:hover:not(.Mui-disabled):before, .MuiInput-underline:before, .MuiInput-underline:after':{
            border: 0 
        },
        '& .selectedIcon ':{     
            '& svg': {
                position: 'absolute',
                left: 9,
                fontSize: '1.3rem',
                color: 'rgba(255,255,255,0.7)'
            } ,
            '& svg.clipboard':{
                width: 17,
                height: 17
            }   
        }
    },
    tabs: {
        minHeight: 35,
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 35,
    },
    clipboard: {
        fill: '#fff',
        width: 24,
        height: 24
    },
    tabs: {
        minHeight: 35,
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 35,
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        background: '#222222 !important',
        border: '1px solid #5c5c5c !important'
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    fullscreenBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: 35,
        flex: 1,
        display: 'flex'
    },
    modal: {
        '& .react-draggable':{
            width: 800,
            height: '50vh',
        },
        '& .MuiDialog-paperWidthSm':{
            maxWidth: 'inherit',
        },
        '& .MuiDialogContent-root':{
            padding: 0,
            overflowX: 'hidden'
        },
        '& .MuiDialogTitle-root':{
            //padding: 0,
        }
    },
    sliderContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        cursor: 'pointer',
        zIndex: 999
    },
    filterContent: {
        padding: '10px 40px !important'
    }
}))
