import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      flex:1
    },
    topBar: {
      padding: 10,
    },
    title: {
      fontSize: 20,
    },
    list: {
      overflowY: 'auto',
      flex: 1,
      '& .MuiListItemAvatar-root': {
          minWidth: 0,
      },
      '& .MuiListItem-gutters': {
          paddingLeft: 5,
          paddingRight: 5,
      },
      '& .MuiListItemIcon-root': {
        minWidth: '23px'
      },
      '& .MuiListSubheader-gutters': {
        padding: '0 8px 0 2px' 
      },
      '& .MuiListSubheader-root': {
        backgroundColor: '#303030',
        fontSize: '1rem',
        height: '48px',
        overflow: 'hidden'
      },
      '& .MuiSvgIcon-root':{
        fontSize: '1.1rem'
      }
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
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginRight: 5,
    },
    assetTitleTotalCount: {
        minWidth: 20,
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
      margin: '0px 7px 4px 0px',
      padding: 0,
    },
    totalSelected: {
      position: 'absolute',
      right: '10px'
    },
    listInfinityLoader: {
      width: '100%',
      marginTop: '5px',
      marginBottom: '5px',
      textAlign: 'center'
    },
    headingText: {
    }
}))
