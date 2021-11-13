import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    splitPane: {
        position: 'relative !important',
        '& .Resizer': {
            background: `none`,
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
    splitPane2OverflowHidden: {
        '& .Pane2': {
          overflow: 'unset !important', 
        }
    },
    splitPane1OverflowUnset: {
        '& .Pane1': {
            overflow: 'unset !important', 
        }
    },
    paneHeightZero: {
        '& .Pane1':{
          height: 0
        }
    },
    companyBar:{
        height: '100%',
        width: '100%',  
        display: 'flex'
    },
    mobileTable: {
        '& .ReactVirtualized__Table .ReactVirtualized__Table__headerColumn, .ReactVirtualized__Table .ReactVirtualized__Table__rowColumn':{
            fontSize: '20px',
            '& .MuiTableCell-root':{
                fontSize: '0.875em'
            }
        },
        '& .vis-timeline': {
            fontSize: 20,
            '& .vis-item': {
                fontSize: '0.875em !important'
            }
        },
        '& .timeline .vis-item .vis-item-content': {
            width: 125
        },
        '& .ReactVirtualized__Table  .slackIcon,  .ReactVirtualized__Table  .slackIcon svg': {
            width: '32px !important',
            height: '32px !important',
        },
        '& iframe':{
            width: '100%'
        }
    } 

}))