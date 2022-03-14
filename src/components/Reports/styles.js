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
        height: 'calc((100vh - 90px) / 3)',
        alignContent: 'start',
        paddingLeft:3,
        paddingTop: 3,
        '&:nth-child(1)':{
            paddingLeft:0,
        },
        '&:nth-child(5)':{
            paddingLeft:0,
        },
        '&:nth-child(9)':{
            paddingLeft:0,
        },
        '& .gauge':{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignContent: 'start',
            height: 'calc(((100vh - 40px) / 3)/1.5)', 
            '& svg': {
                display: 'flex',
                height: '70%'
            }
        }, 
        [theme.breakpoints.down('md')]: {
            height: 'calc((100vh - 90px) / 4)',
            '& .gauge':{
                height: 'calc(((100vh - 40px) / 4)/1.6)', 
            },
            '&:nth-child(4)':{
                paddingLeft:0,
            },
            '&:nth-child(7)':{
                paddingLeft:0,
            },
            '&:nth-child(10)':{
                paddingLeft:0,
            },
        },
        [theme.breakpoints.down('sm')]: {
            '&:nth-child(3)':{
                paddingLeft:0,
            },
            '&:nth-child(5)':{
                paddingLeft:0,
            },
            '&:nth-child(7)':{
                paddingLeft:0,
            },
            '&:nth-child(9)':{
                paddingLeft:0,
            },
            '&:nth-child(11)':{
                paddingLeft:0,
            },
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
    card: {        
        position: 'relative',
        border: 0,
        boxShadow: 'none',
        background: 'none',
        '& .tooltip':{
            position: 'absolute',
            right: 0,
            top: 5,
            display: 'none',    
            borderRadius: 'inherit',       
            '&.MuiIconButton-root svg':{
                width: '1.2rem',
                height: '1.2rem',
            } 
        },
        '&:hover':{
            '& .tooltip':{
                display: 'block'
            }
        },
        '& .MuiCardContent-root':{
            position: 'relative',
            paddingBottom: 0,
            marginBottom: 1,
        },
        '& .MuiTypography-h6':{
            textTransform: 'capitalize'
        },
        '& .MuiCardActions-root, .MuiCardContent-root':{
            backgroundColor: theme.palette.background.paper,
            padding: '5px 8px'
        }
    },
    titleContainer:{
        display: 'flex',
        width: '100%',
        paddingLeft: 16,
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
            textOverflow: 'ellipsis',
            '& span':{
                textTransform:'uppercase',
                marginLeft: 24
            }
        }
    },    
    toolbar:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 'auto',
        /* '& .MuiIconButton-root':{
            '& svg':{
                width: '1em !important',
                height: '1em !important',
            }
        } */
    },    
    tooltip:{
        fontSize: '1rem'
    },
    active: {
        color: pink[500]
    },
    list: {
        height: 'calc(100% - 47px)',
        overflowY: 'auto'
    },
    exampleButton: {
        position: 'absolute',
        top: 0,
        /* left: 'calc(50% - 45px)' */
        right: 0
    },
    actionButton: {
        position: 'absolute',
        bottom: 0,
        left: 'calc(50% - 45px)'
    },
    shareIcon:{
        '& svg':{
            width: '1rem',
            height: '1rem'
        }
    }
}));