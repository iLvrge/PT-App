import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
    minimized: {
        '& .Pane.Pane1': {
          height: '100% !important',
          maxHeight: 'unset !important',
        },
        '& .Pane.Pane2': {
          display: 'none !important',
        }
    },
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
                cursor: 'row-resize',
                /* borderTop: '1px solid rgba(255,255,255,0.12)',
                '&:hover':{
                    borderTopColor: '#f50057',
                    
                } */
            },
            /* '&.vertical':{
                borderRight: '1px solid rgba(255,255,255,0.12)',
                '&:hover':{
                    borderRightColor: '#f50057',
                    '& .Pane1':{
                        borderRightColor: '#f50057',
                    }
                }
            } */
        },
        '& .Pane': {
          maxHeight: '100%',
          
        },
        '& .Pane2': {
          height: '100%',
          overflow: 'auto',
        },
    },
    splitPane2: {
      '& .Pane': {
        maxHeight: '100%',
      }
    },
    splitPane3: {
      '& .Pane': {
        maxWidth: '100% !important',
      }
    },
    splitPane2OverflowHidden: {
      '& .Pane2': {
        overflow: 'unset !important', 
      }
    },
    splitPane2OverflowUnset: {
        '& .Pane2': {
            overflow: 'unset !important', 
        }
    },
    splitPaneMainOverflowUnset:{
        overflow: 'unset !important', 
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
    calHeight: {
      minHeight: 'calc(100% - 50px) !important'
    },
    onDrag: {
        '& .Pane': {
          pointerEvents: 'none',
        },
        '& .Pane2': {
          pointerEvents: 'none',
        },
    },
    content: {
        height: '100%',
    },
    controllersContainer: {
        width: '100%',
        zIndex: 111,
        fontSize: 9,
        backgroundColor: '#303030',
        transition: 'opacity 0.1s',
        padding: '9px',
        position: 'relative'
    },
    controllers: {
        display: 'flex',
        alignItems: 'center',
    },
    totalSelected: {
        position: 'absolute',
        right: '5px'
    },
    transactionList:{
        height: '100%',
        '& .MuiListItemAvatar-root': {
            minWidth: 0,
        },
        '& .MuiListItem-gutters': {
            paddingLeft: 0,
            paddingRight: 0,
        },
        '& .MuiList-root':{
            /*maxHeight: '85%',*/
        },
        '& .MuiListSubheader-root':{
          backgroundColor: '#303030'
        }
    },
    assetSummary: {
      maxWidth: 'calc(100% - 5px)',
      '& .MuiGrid-item':{
        padding:'0px 2px 4px 2px',
        '&:first-child':{
          paddingLeft: '0px',
        },
        '&:last-child':{
          paddingRight: '0px'
        }
      },
      '& div':{
        '& :first-child':{
          /* padding: '0px' */
        }
      },
      '& .MuiGrid-spacing-xs-1':{
        padding: 0,
        margin: 'inherit'
      }
    },
    companyBar:{
        height: '100%',
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
    },
    filterButtonActive:{
        color: '#fff !important' ,
        '& svg':{
          fill: '#fff !important' 
        },
        '&:hover':{
          color: 'rgb(230, 0, 0)' ,
          '& svg':{
            fill: 'rgb(230, 0, 0)',
          }
        }
    },
    fontChange: {
      fontSize: '1.2rem',
    },
    tooltip:{
      fontSize: '1rem'
    },
    commentContainer: {
        height: '100%', 
        width: '100%',
    },
    btn:{
        top: '-13px',
        right: 'calc(100% - 50%)'
    }, 
    btnLeft: {
        left: '-10px',
        right: 'unset'
    },
    itemsLeft: {
        justifyContent: 'flex-start'
    },
    filterToolbar: {
      width: '3.5rem',
      borderRight: 0,
    },
    flex:{
      width: '3.5rem',
      position: 'absolute'
    },
    bottom: {
      bottom: 0
    }
}))
