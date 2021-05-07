import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden auto',
        '& .MuiTableCell-root .MuiSelect-select.MuiSelect-select':{
          paddingRight: 15 
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before, .MuiInput-underline:before, .MuiInput-underline:after':{
          border: 0
        }
    },
    topBar: {
        padding: 10,
    },
    title: {
        fontSize: 20,
    },
    listInfinityLoader: {
      width: '100%',
      marginTop: '5px',
      marginBottom: '5px',
      textAlign: 'center'
    }, 
    list: {
      overflowY: 'auto',
      flex: 1,
      /* marginTop: 40, */
      '& .MuiListItemAvatar-root': {
        minWidth: 0,
      },
      '& .MuiListItem-gutters': {
        paddingLeft: 5,
        paddingRight: 5,
      },
      '& .MuiListSubheader-gutters': {
        padding: '0 8px 0 2px' 
      },
      '& .MuiListSubheader-root': {
        backgroundColor: '#303030',
        fontSize: '1.1rem',
        height: '48px',
        overflow: 'hidden'
      },
      '& .MuiSvgIcon-root':{
        fontSize: '1.1rem'
      }
    },
    listHeight:{
      maxHeight: '300px',
      overflowY: 'auto'
    },
    listItem: {
      '&:focus':{
        outline:'none'
      },
      '&:active':{
        outline:'none'
      }
    },
    boxItem: {
      minWidth: 15
    },
    checkbox: {
      padding: 5,
      '&.MuiIconButton-edgeEnd': {
        marginRight: 0,
      },
    },
    patentIndex: {
      backgroundColor: 'transparent',
      color: 'initial'
    },
    listItemTextContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    expandIcon: {
      '& svg': {
        width: 10,
        height: 10,
      }
    },
    assetTitle: {
      /* whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis', */
      marginRight: 5,
      width: 'calc(100% - 50px)'
    },
    assetTitleTotalCount: {
      minWidth: 20,
      position: 'absolute',
      right: '3px'
    },
    controllersContainer: {
      position: 'absolute',
      width: '100%',
      zIndex: 111,
      fontSize: 9,
      backgroundColor: '#303030',
      transition: 'opacity 0.1s',
      padding: '5px 0 9px',
    },
    controllers: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '2px'
    },
    selectAllBtn: {
      margin: '3px 7px 3px 5px',
      padding: 0,
    },
    totalSelected: {
      position: 'absolute',
      right: '5px'
    },
    listInfinityLoader: {
      width: '100%',
      marginTop: '5px',
      marginBottom: '5px',
      textAlign: 'center'
    },
    headingText: {
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
        backgroundColor: '#303030',
        fontSize: '1.1rem',
        height: '48px',
        overflow: 'hidden'
      }
    },
    showIcon: {
      /* padding: '10px', */
      fontSize: '1.7rem',
      '& .MuiIconButton-root':{
        padding: 0,
        '&:hover':{
          color: 'rgb(230, 0, 0)' 
        }
      }      
    },
    td: {
        display: 'flex',
      },
      th: {
        display: 'flex',
        border: 'none',
        minWidth: '35px',
      },
      flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        '&.MuiTableCell-head':{
          minWidth: '35px',
        }
      },
      tableRow: {
        cursor: 'pointer',
        borderBottom: '1px solid #5c5c5c',
        '&.ReactVirtualized__Table__headerRow': {
          backgroundColor: '#292929',
          '& .MuiSvgIcon-root':{
            fontSize: '1rem'
          }
        },
      },
      tableCell: {
        flex: 1,
        whiteSpace: 'nowrap',
        border: 'none',
        alignItems: 'center',
        padding: '0',
        overflow: 'hidden',
        /* margin: '0 10px', */
        '& .MuiSvgIcon-root':{
          fontSize: '1rem'
        }
      }
}))
