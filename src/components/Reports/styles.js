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
        minHeight: 60,              
        '& .MuiGrid-grid-sm-12': {
            '& span.small':{
                maxWidth: 68
            }
        },
    },  
    containerTop: {
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    child: {
        display: 'flex',
        height: '100%',
        /* width: '50%', */
        margin: 0,
    },
    flexColumn: {
        height: 'calc((100vh - 105px) / 3)',
        alignContent: 'start',
        paddingLeft:3,
        paddingTop: 3,
        '& .gauge':{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignContent: 'start',
            height: /* 'calc((100vh - 190px) / 3)', */90,
            flexBasis: '190px !important',
            maxWidth: '190px !important',
            minWidth: '190px !important',
            '& svg': {
                display: 'flex',
                /* height: '70%' */
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
    },
    companyBar:{
        height: '100%',
    },
    border: {  
        /* borderTop: `1px solid ${theme.palette.divider}`, */
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '7px 10px 5px',      
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'fit-content',
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
            marginBottom: 0,
        },
        '& .MuiTypography-h6':{
            textTransform: 'initial'
        },
        '& .MuiCardActions-root, .MuiCardContent-root':{
            backgroundColor: theme.palette.background.paper,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            padding: '5px 8px',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
        }
    },  
    titleContainer:{
        display: 'flex',
        width: '100%',
        paddingLeft: 16,
        paddingRight: 5,
        fontSize: '1.1rem',
        height: 47,
        minHeight: 47,
        textAlign: 'left',
        verticalAlign: 'middle',
        justifyContent: 'flex-start;',
        alignItems: 'center',
        /* backgroundImage: 'none', */
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
    mobileTooltip: {
        flex: '1 1 100%',
        fontSize: '20px !important'
    },
    active: {
        color: pink[500]
    },
    list: {
        height: 'calc(100% - 47px)',
        overflowY: 'auto',
        '& .MuiGrid-grid-md-3': {  
            '&:nth-child(1)':{
                paddingLeft:0,
            },
            '&:nth-child(5)':{
                paddingLeft:0,
            },
            '&:nth-child(9)':{
                paddingLeft:0,  
            },
        },
        '& .MuiGrid-grid-md-4': {  
            '&:nth-child(1)':{
                paddingLeft:0,
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
        '& .MuiGrid-grid-sm-6': {
            '&:nth-child(1)':{
                paddingLeft:0,
            }, 
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
        '& .MuiGrid-grid-sm-12': {
            paddingLeft:0,
        },
    },
    chartContainer: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 190,
        maxWidth: 190,
        height: 165,
        alignItems: 'center'
    },
    exampleButton: {
        position: 'absolute',
        top: 5,
        /* left: 'calc(50% - 45px)' */
        right: 0
    },
    actionButton: {
        position: 'absolute',
        left: 0,
        top: 5,
        textTransform: 'initial',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'  
    },
    shareIcon:{
        '& svg':{
            width: '1rem !important',
            height: '1rem !important'
        }
    },
    actionIcon: {
        /* '& svg':{
            width: '1rem !important',
            height: '1rem !important'
        } */
        '& svg' : {
            fill: 'currentcolor'
        }
    },
    fontStandalone: {        
       '& svg':{
            fontSize: '1.5rem !important',
            /* width: '1.5rem !important', 
            height: '1.5rem !important' */
        } 
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },   
    active: {
        color: pink[500]
    }
}));