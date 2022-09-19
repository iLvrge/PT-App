import makeStyles from '@mui/styles/makeStyles';
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@mui/material/colors'

export default makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
    /* backgroundColor: theme.palette.background.default, */
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
    '&.vis-panel .vis-shadow':{
      /*height: 0*/
    },
    '& .vis-time-axis .vis-text':{
      padding: '1px 3px'
    }
  },  
  loader: {
    position: 'absolute',
    zIndex: 100,
    top: '50%',
    left: '50%',
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
    '& .vis-item.vis-range.asset-type-borrowing':{
      backgroundColor: '#FFAA00 !important'
    },
    '& .vis-item.vis-range.asset-type-lending':{
      backgroundColor: '#FFAA00 !important'
    },
    '& .vis-item.vis-range.asset-type-security-release ':{
      backgroundColor: '#70A800 !important'
    },
    '& .vis-item.vis-range.asset-type-security-release-partial, .vis-item.vis-range.asset-type-default':{
      backgroundColor: '#228DE8 !important'
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
  legend: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '5px 15px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 150,
    background: '#424242cc',
    borderRadius: 2,
  },
  legendAssetType: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    marginTop: 5,
  },
  tag: {
    width: 12,
    height: 12,
    borderRadius: 15,
    marginRight: 10,
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
  illustrationContainer: {
    top: 120,
    right: 20,
    width: '33%',
    height: '82%',
    display: 'flex',
    zIndex: 111111,
    position: 'fixed',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  onRangeChangeMessage: {
    position: 'absolute',
    background: '#424242cc',
    borderRadius: 2,    
    top: 10,
    right: 30,
    fontSize: 16,
    padding: 10,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    height: 50,
    justifyContent: 'space-evenly',
  },
  previousBtn: {
    position: 'absolute',
    top: 0,
    left: 0,    
    zIndex: 1111,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 10,
    transition: 'background 0.5',
    '&:hover': {
      background: '#78787826',
    },
  },
  timelineProcessingIndicator: {
    position: 'absolute',
    top: 10, 
    right: 10,
  },
  nextBtn: {
    position: 'absolute',
    top: 0,
    right: 0,    
    zIndex: 1111,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 10,
    transition: 'background 0.5',
    '&:hover': {
      background: '#78787826',
    },
  },
  defaultLoadingImages: {
    position: 'absolute',     
    top: '-99999999px'
  }
}))