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
        flexDirection: 'column'
    },
    flexColumnFullHeight: {
      height: '100% !important',
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
    kpiBorder: {
      display: 'flex',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    kpiNumber: {
      display: 'flex',
      height: '63%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    topMargin: {
      marginTop: 10
    },
    kpiNumberSmall:{
      display: 'flex',
      height: '22.5%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headingContainer:{
      padding: '7px 10px 5px'
    },
    border: {  
      /* borderTop: `1px solid ${theme.palette.divider}`, */
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',    
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'fit-content',
    }, 
    border1:{
      position: 'unset'
    } ,
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
    alignTop: {
      '& .MuiCardContent-root':{
        alignItems: 'flex-start',
        flexDirection: 'column'
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
        position: 'absolute',
        right: 0
        /* '& .MuiIconButton-root':{
            '& svg':{
                width: '1em !important',
                height: '1em !important',
            }
        } */
    },    
    tooltip:{
      fontSize: '1rem',
      '&.3':{
        maxWidth: 290
      },
      '&.4':{
        maxWidth: 260
      },
      '&.6':{
        maxWidth: 300
      }
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
      width: '92%',
      maxWidth: '92%',
      height: '92%',
      alignItems: 'center'
    },
    widthResponsive:{
      width: '92%',
      maxWidth: '92%',
      height: '92%'
    },
    timelineContainer: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      height: '85%',
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
      '& .vis-panel.vis-center':{
        borderTop: 0
      },
      '& .vis-panel.vis-top':{
        visibility: 'hidden',
        '& .vis-time-axis':{
          height: '1px !important'
        }
      },
      '& .vis-dot':{ 
        backgroundColor: 'inherit',
        borderColor: 'inherit',
        width: 17,  
        height: 17, 
        top: '7px !important',
        left: 2,
        border: 0,       
        backgroundRepeat: 'no-repeat',
        backgroundSize: 15
      },
      '& .vis-dot.asset-type-acquisitions,  .cluster-acquisitions': {
        backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/acquisition.svg)',
      },
      '& .vis-dot.asset-type-sales, .cluster-sales': {
        backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/sales.svg)',
      },
      '& .vis-dot.asset-type-licenseIn, .cluster-licenseIn': {
        backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/licensein.svg)',
      },
      '& .vis-dot.asset-type-licenseOut, .cluster-licenseOut': {
        backgroundImage: 'url(https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/licenseout.svg)',
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
      '& .vis-dot.asset-type-employees, .cluster-employees': {
        backgroundImage: 'url(https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png)',
      },
      '& .vis-dot.asset-type-other, .cluster-other': {
        backgroundImage: 'url(https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png)', 
      },
      '&.vis-panel .vis-shadow':{
        /*height: 0*/
      },
      '& .vis-time-axis .vis-text':{
        padding: '1px 3px'
      },
      '& .vis-item.asset-type-security-release':{
        backgroundColor: '#70A800 !important'
      },
      '& .vis-item.asset-type-security-release-partial':{
        backgroundColor: '#228DE8 !important'
      },
      '& .vis-item.asset-type-lending':{
        backgroundColor: '#FFAA00'
      },
      '& .vis-item.asset-type-borrowing':{
        backgroundColor: '#FFAA00'
      },
      '& .vis-item.vis-range':{
        border: 0,
        '& .vis-item-overflow':{
          position: 'unset',
          minHeight: 28,
          '& .vis-item-content':{
            width: '100%',
            position: 'absolute',
            '& span':{
              whiteSpace: 'nowrap',
              display: 'block',
              width: '100%'
            },
            '& tt':{
              marginRight: 10,
              cursor: 'pointer',
              '& img':{
                width: 16
              }
            },
            '& em':{
              position: 'absolute',
              right: 7,
              cursor: 'pointer',
              '& img':{
                width: 16
              },
              '& span':{
                position: 'absolute',
                right: 35,
                textAlign: 'right'
              }
            }
          }
        } 
      }
    },
    timelineContainerFullheight:{
      height: '100% !important'
    },
    timelineHeading: {
      display: 'flex',
      width: '100%'
    },
    exampleButton: {
      position: 'absolute',
      bottom: 5,
      /* left: 'calc(50% - 45px)' */
      right: 0
    },
    actionButton: {
      position: 'absolute',
      left: 0,
      bottom: 5,
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
      height: '70%',
      overflow: 'hidden'
    },   
    active: {
      color: pink[500]
    },
    maxChildHeight: {
      maxHeight: '50%'
    },
    tableContainer: {
      height: '60%',
      width: '100%',
      overflow: 'auto',
      boxShadow: 'none',
      /* marginTop:15, */
      '& .MuiListItem-root':{
        padding: 0
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
      width: '80%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis', 
      marginRight: 5,
      fontSize: '1.2rem'
    },
    itemText:{
      position: 'absolute',
      top: 0,
      width: '15%',
      textAlign: 'right',
      fontSize: '1.2rem'
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
        '& .vis-item': {
          fontSize: 12, 
          color: theme.palette.text.primary,
        },
    },
    loader: {
        position: 'absolute',
        zIndex: 100,
        top: '50%',
        left: '50%',
    },
    fullscreenButton:{
      position: 'absolute', 
      right: 5, 
      top: 0,
      zIndex: 9999
    },
    transparentTooltip:{
      backgroundColor: 'transparent',
      minWidth: 250,
      maxWidth: 500
    },
    headingName: {
      marginLeft: 10
    },
    fixKPI: {
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },
    gauge:{
      '& g.text-group text':{
        fontSize: '1.2rem !important'
      }
    }
}));