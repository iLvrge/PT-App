import makeStyles from '@mui/styles/makeStyles';
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@mui/material/colors';
export default makeStyles(theme => ({
    container: {
      height: '100%',
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
        marginBottom: 20,
        flexDirection: 'column',
        '& :last':{
          marginBottom: 0,
        }
    },
    flexColumnFullHeight: {
      height: '100% !important',
    },
}))