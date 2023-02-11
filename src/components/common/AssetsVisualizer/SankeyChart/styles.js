import makeStyles from '@mui/styles/makeStyles';
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@mui/material/colors';
export default makeStyles(theme => ({
    mainContainer: {
      height: '100%',
      flex: 1,
      width: '100%',
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      boxShadow: 'none'
    },
    container: {
      height: '100%',
      flex: 1,
      width: '100%',
      margin: 0,
      color: '#fff',
      border: 0,
      display: 'flex',
      position: 'relative',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: 'unset !important',
      minHeight: 60,              
      '& .MuiGrid-grid-sm-12': {
          '& span.small':{
            /* maxWidth: 37, */
            display: 'none'
          }
      }
    }, 
    columnDirection: {
      width: '100%',
      flexDirection: 'column'
    },
    containerTop: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        '& .google-visualization-tooltip': {
            color: '#000'
        }
    },
    child: {
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        '& :last':{
          marginBottom: 0,
        },
        overflow: 'auto'
    },
    flexColumnFullHeight: {
      height: '100% !important',
    },
    tab: {
      minWidth: '25%',
      minHeight: 47,
      fontSize: '1.1rem', 
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow:'ellipsis'
    }, 
    tabs: {
      minHeight: 47,
      display: 'flex',
      width: '94%'
      /* '& .MuiTab-root': {
        fontSize: '1.1rem'
      } */
    },
    padding16: {
      padding: 16
    }
}))