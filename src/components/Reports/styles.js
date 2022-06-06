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
        minHeight: 60,              
        '& .MuiGrid-grid-sm-12': {
            '& span.small':{
                maxWidth: 37
            }
        },
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
        flexDirection: 'column'
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
    heading: {
        fontSize: '1.1rem'
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
    timelineContainer: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        height: 180,
        alignItems: 'center',
        '& .vis-time-axis .vis-text, .vis-item, .vis-y-axis':{
            color: theme.palette.text.primary,
        },
        '& .vis-timeline':{
            border: 0
        },
        '&.vis-panel.vis-center':{
            border: `1px solid ${theme.palette.divider}`
        },
        '& .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top, .vis-panel.vis-bottom': {
            borderBottomColor: theme.palette.divider,
            borderTopColor: theme.palette.divider,
            borderLeftColor: theme.palette.divider,
            borderRightColor: theme.palette.divider,
        },
        '& .vis-panel.vis-bottom':{
            visibility: 'hidden'
        },
        '&.vis-panel .vis-shadow':{
            /*height: 0*/
        },
        '& .vis-time-axis .vis-text':{
            padding: '1px 3px'
        },
        '& .vis-item.vis-range':{
            backgroundColor: '#FFAA00 !important'
        }
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
            fill: 'currentcolor',
            width: '1.5rem !important', 
            height: '1.5rem !important'
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
    },
    maxChildHeight: {
        maxHeight: '50%'
    },
    tableContainer: {
        height: '65%',
        width: '100%',
        overflow: 'auto',
        boxShadow: 'none',
        marginTop:15,
        '& .MuiListItem-root':{
            padding: '2px 16px'
        },
        '& .MuiList-root':{
            padding: 0
        }
    },
    itemContainer: {
        position: 'relative',
        '& .MuiTypography-root': {
            lineHeight: 1
        }
    },
    itemHeading: {
        display: 'inline-block',
        maxWidth: '70%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis', 
        marginRight: 5  
    },
    itemText:{
        position: 'absolute',
        top: 0
    },
    timelineProcessingIndicator: {
        position: 'absolute',
        top: 10, 
        right: 10,
    },
    timeline: {
        height: '100%',
        width: '100%',
        // '& .vis-center .vis-content': {
        //   transform: 'translateY(0px) !important',
        //   height: '100% !important',
        // },
        // '& .vis-center .vis-itemset': {
        //   height: '329px !important',
        //   overflowY: 'auto',
        //   overflowX: 'hidden',
        // },
        '& .custom_tooltip':{
          position:'absolute',  
          width:'150px',
          /* height:'150px', */
          background: theme.palette.background.paper,
          border:`1px solid ${theme.palette.action.disabled}`,
          color: theme.palette.text.primary,
          padding: '5px 10px' ,
          '& h4':{
            margin: '5px 0 0 0' 
          },
          overflow: 'hidden'
        },
        '& .vis-group':{
          '&.group-others':{
            backgroundColor: '#491B1B'
          },
          '&.group-financing':{
            backgroundColor: '#1b1200'
          },
          '&.group-ownership':{
            backgroundColor: '#100000'
          },
          '&.group-licensing':{
            backgroundColor: '#171700'
          },
          '&.group-employees':{
            backgroundColor: '#424141'
          }
        },
        '& .vis-label':{
          '&.group-others':{
            backgroundColor: '#491B1B'
          },
          '&.group-financing':{
            backgroundColor: '#1b1200'
          },
          '&.group-ownership':{
            backgroundColor: '#100000'
          },
          '&.group-licensing':{
            backgroundColor: '#171700'
          },
          '&.group-employees':{
            backgroundColor: '#424141'
          }
        },
        '& .vis-left.vis-panel.vis-vertical-scroll, & .vis-right.vis-panel.vis-vertical-scroll': {
          overflowY: 'hidden',
        },
        '& .vis-item': {
          fontSize: 12,
          backgroundColor: 'transparent',      
          color: theme.palette.text.primary,
          '& .vis-item-content':{
            width: '95px',
            whiteSpace: 'normal',
            padding: '5px 5px 5px 0px',
            '& .cluster-header':{
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              padding: 5,
              border: '0px',
              '& .cluster-image': {
                backgroundRepeat: 'no-repeat',
                backgroundSize: '17px',
                width: 32,
                height: 17,
                display: 'inline-block',
                marginRight: '5px' 
              }         
            },
            '& .cluster-employees, .cluster-acqusitions, .cluster-sales, .cluster-courtOrders, .cluster-mergersIn, .cluster-mergersOut':{
              borderColor: '#e60000'
            },
            '& .cluster-releaseIn, .cluster-releaseOut':{
              borderColor: '#70A800'
            },
            '& .cluster-lending, .cluster-borrowing':{
              borderColor: '#FFAA00'
            },
            '& .cluster-licenseIn, .cluster-licenseOut':{
              borderColor: '#C0C000'
            },
            '& .cluster-other, .cluster-options':{
              borderColor: '#CA7C46'
            }
          },
          '& .vis-dot':{ 
            backgroundColor: 'inherit',
            borderColor: 'inherit',
            width: 17,
            height: 17, 
            top: '7px !important',
             /* left: 10, */
            border: 0,       
            backgroundRepeat: 'no-repeat',
            backgroundSize: 15
          },
          '& .vis-dot.asset-type-default': {
            borderColor: indigo[500],
          },
          '& .vis-dot.asset-type-acquisitions,  .cluster-acquisitions': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/acquisition.svg)',
          },
          '& .vis-dot.asset-type-sales, .cluster-sales': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/sales.svg)',
          },
          '& .vis-dot.asset-type-licenseIn, .cluster-licenseIn': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/licensein.svg)',
          },
          '& .vis-dot.asset-type-licenseOut, .cluster-licenseOut': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/licenseout.svg)',
          },
          '& .vis-dot.asset-type-lending, .vis-dot.asset-type-borrowing, .asset-type-securitiesOut, .asset-type-securitiesIn, .cluster-lending, .cluster-borrowing, .cluster-securitiesIn, .cluster-securitiesOut': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/secure.svg)',
          },
          '& .vis-dot.asset-type-mergersIn, .cluster-mergersIn': { 
            backgroundImage: 'url(https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerin.png)',
          },
          '& .vis-dot.asset-type-mergersOut, .cluster-mergersOut': {
            backgroundImage: 'url(https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerout.png)',
          },
          '& .vis-dot.asset-type-correct, .cluster-correct': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/correction.svg)',
          },
          '& .vis-dot.asset-type-options, .cluster-options': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/options.svg)',
          },
          '& .vis-dot.asset-type-courtOrders, .cluster-courtOrders': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/courtorder.svg)',
          },
          '& .vis-dot.asset-type-releaseOut, .vis-dot.asset-type-releaseIn, .cluster-releaseIn, .cluster-releaseOut': {
            backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/svg/release.svg)',
          },
          '& .vis-dot.asset-type-employees, .cluster-employees': {
            backgroundImage: 'url(https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png)',
          },
          '& .vis-dot.asset-type-other, .cluster-other': {
            backgroundImage: 'url(https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png)', 
          },
        },
        '& .vis-cluster': {
          background: 'none',
          border: '0px',
          '& .vis-item-content':{
            padding: 0,
            width: '112px !important'
          }
        },
        '& .vis-dot': {
          borderColor: indigo[500],
          backgroundColor: indigo[500],
        },
        '& .vis-item.vis-box': {
          borderColor: indigo[500],
          backgroundColor: indigo[500],
          '&.asset-type-default': {
            backgroundColor: indigo[500],
          },
          '&.asset-type-acquisitions': {
            backgroundColor: indigo[500],
          },
          '&.asset-type-sales': {
            backgroundColor: purple[500],
          },
          '&.asset-type-licenseIn': {
            backgroundColor: blue[500],
          },
          '&.asset-type-licenseOut': {
            backgroundColor: pink[500],
          },
          '&.asset-type-securities': {
            backgroundColor: teal[500],
          },
          '&.asset-type-mergersIn': {
            backgroundColor: cyan[500],
          },
          '&.asset-type-mergersOut': {
            backgroundColor: cyan[200],
          },
          '&.asset-type-options': {
            backgroundColor: lime[500],
          },
          '&.asset-type-courtOrders': {
            backgroundColor: green[500],
          },
          '&.asset-type-employees': {
            backgroundColor: orange[500],
          },
          '&.asset-type-other': {
            backgroundColor: grey[500],
          },
        },
        '& .vis-item.vis-point.vis-selected': {
          backgroundColor: 'inherit',
          color: pink[500],
          fontWeight: 'bold',
        },
        '& .vis-top':{
          '& .vis-foreground':{
            /* top: '-15px',
            fontSize: '1rem' */
          }
        },
        '& .vis-bottom':{
          '& .vis-foreground':{
            /* top: '15px',
            fontSize: '1rem' */
          }
        }
    },
    loader: {
        position: 'absolute',
        zIndex: 100,
        top: '50%',
        left: '50%',
    },
}));