import makeStyles from '@mui/styles/makeStyles';
import { pink } from '@mui/material/colors';
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
        minHeight: 60
    },
    flexColumn: {
        height: 'calc((100vh - 78px) / 3)',
        '& .gauge':{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            height: 'calc(((100vh - 78px) / 3)/1.57)',
            '& svg': {
                display: 'flex',
                height: '70%'
            }
        },
        [theme.breakpoints.down('md')]: {
            height: 'calc((100vh - 78px) / 4)',
            '& .gauge':{
                height: 'calc(((100vh - 78px) / 4)/1.7)', 
            }
        },
        '& .MuiCard-root': {
            height: '100%'
        },
        
    },
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden',
        '& .font12Rem':{
          fontSize: '1rem'
        },
        backgroundImage: 'none'
    },
    companyBar:{
        height: '100%',
    },
    border: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '0 10px 14px',
    },
    onFly: {
        position: 'absolute',
        right: 0,
        top: 5
    },
    card: {
        position: 'relative',
        border: 0,
        boxShadow: 'none',
        '& .MuiCardContent-root':{
            paddingBottom: 0
        },
        '& .MuiTypography-h6':{
            textTransform: 'capitalize'
        }
    },
    titleContainer:{
        display: 'flex',
        width: '100%',
        padding: '0 9px 0 16px',
        fontSize: '1rem',
        height: 47,
        minHeight: 47,
        textAlign: 'left',
        verticalAlign: 'middle',
        justifyContent: 'flex-start;',
        alignItems: 'center',
        backgroundImage: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '& span.title':{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    },    
    toolbar:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 'auto',
        '& .MuiIconButton-root':{
            borderRadius: 0,
            width: 30,
            height: 30,
            padding: 0,
            color: theme.palette.text.primary,
            backgroundColor: 'transparent',
            '&:hover':{
                color: pink[500],
                backgroundColor: 'transparent',
                fill: pink[500],
                stroke: pink[500],
            },
            '& svg':{
                width: '1em !important',
                height: '1em !important',
                fill: theme.palette.text.primary,
                stroke: theme.palette.text.primary,
                '&:hover':{
                    color: pink[500],
                    backgroundColor: 'transparent',
                    fill: pink[500],
                    stroke: pink[500],
                }
            }
        }
    },    
    tooltip:{
        fontSize: '1rem'
    },
    list: {
        height: 'calc(100% - 47px)',
        overflowY: 'auto'
    }
}));