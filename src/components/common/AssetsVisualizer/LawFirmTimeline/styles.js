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
    },
    '& .vis-tooltip':{
      width: 260,
      whiteSpace: 'normal !important'
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
      '& .vis-dot.lawfirm,  .cluster-lawfirm': {
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' style='&%2310; fill: %23fff;&%2310; stroke: %23fff;&%2310;'%3E%3Cg%3E%3Cpath d='M37,30H27a5.006,5.006,0,0,1-5-5V14a1,1,0,0,1,1-1,3.85,3.85,0,0,0,4-4,1,1,0,0,1,2,0c0,.008.411,4,12,4a1,1,0,0,1,1,1V25A5.006,5.006,0,0,1,37,30ZM24,14.915V25a3,3,0,0,0,3,3H37a3,3,0,0,0,3-3V14.99c-6.783-.138-10.03-1.684-11.583-3.178A5.821,5.821,0,0,1,24,14.915Z'/%3E%3Cpath d='M45,19H43V7a5.006,5.006,0,0,0-5-5H26a5.006,5.006,0,0,0-5,5V19H19V7a7.008,7.008,0,0,1,7-7H38a7.008,7.008,0,0,1,7,7Z'/%3E%3Cpath d='M41 23V21a2 2 0 0 0 0-4V15a4 4 0 0 1 0 8zM23 23a4 4 0 0 1 0-8v2a2 2 0 0 0 0 4zM31 64H12a1 1 0 0 1-1-1V36a1 1 0 0 1 .876-.992L27 33.117V29h2v5a1 1 0 0 1-.876.992L13 36.883V62H31zM53 39H51V36.883L35.876 34.992A1 1 0 0 1 35 34V29h2v4.117l15.124 1.891A1 1 0 0 1 53 36zM62 64H34a1 1 0 0 1-1-1V43a1 1 0 0 1 1-1H62a1 1 0 0 1 1 1V63A1 1 0 0 1 62 64zM35 62H61V44H35z'/%3E%3Cpath d='M56 43H54V40H44v3H42V39a1 1 0 0 1 1-1H55a1 1 0 0 1 1 1zM44 55H38a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 44 55zm-5-2h4V51H39zM58 55H52a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 58 55zm-5-2h4V51H53z'/%3E%3Crect width='2' height='7' x='38' y='43'/%3E%3Crect width='2' height='7' x='42' y='43'/%3E%3Crect width='2' height='7' x='52' y='43'/%3E%3Crect width='2' height='7' x='56' y='43'/%3E%3Cpath d='M41 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 38 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 41 60zM55 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 52 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 55 60z'/%3E%3Crect width='4' height='2' x='34' y='51'/%3E%3Crect width='8' height='2' x='44' y='51'/%3E%3Crect width='4' height='2' x='58' y='51'/%3E%3Cpath d='M32,39a1,1,0,0,1-.707-.293l-4-4,1.414-1.414L32,36.586l3.293-3.293,1.414,1.414-4,4A1,1,0,0,1,32,39Z'/%3E%3Cpath d='M34,41a1,1,0,0,1-.707-.293L32,39.414l-1.293,1.293a1,1,0,0,1-1.414,0l-4-4A1,1,0,0,1,25,36V34h2v1.586l3,3,1.293-1.293a1,1,0,0,1,1.414,0L34,38.586l3-3V34h2v2a1,1,0,0,1-.293.707l-4,4A1,1,0,0,1,34,41Z'/%3E%3Crect width='2' height='17' x='17' y='46'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      '& .vis-dot.filled,  .cluster-filled': {
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' style='&%2310; fill: %23e91e63;&%2310; stroke: %23e91e63;&%2310;'%3E%3Cg%3E%3Cpath d='M37,30H27a5.006,5.006,0,0,1-5-5V14a1,1,0,0,1,1-1,3.85,3.85,0,0,0,4-4,1,1,0,0,1,2,0c0,.008.411,4,12,4a1,1,0,0,1,1,1V25A5.006,5.006,0,0,1,37,30ZM24,14.915V25a3,3,0,0,0,3,3H37a3,3,0,0,0,3-3V14.99c-6.783-.138-10.03-1.684-11.583-3.178A5.821,5.821,0,0,1,24,14.915Z'/%3E%3Cpath d='M45,19H43V7a5.006,5.006,0,0,0-5-5H26a5.006,5.006,0,0,0-5,5V19H19V7a7.008,7.008,0,0,1,7-7H38a7.008,7.008,0,0,1,7,7Z'/%3E%3Cpath d='M41 23V21a2 2 0 0 0 0-4V15a4 4 0 0 1 0 8zM23 23a4 4 0 0 1 0-8v2a2 2 0 0 0 0 4zM31 64H12a1 1 0 0 1-1-1V36a1 1 0 0 1 .876-.992L27 33.117V29h2v5a1 1 0 0 1-.876.992L13 36.883V62H31zM53 39H51V36.883L35.876 34.992A1 1 0 0 1 35 34V29h2v4.117l15.124 1.891A1 1 0 0 1 53 36zM62 64H34a1 1 0 0 1-1-1V43a1 1 0 0 1 1-1H62a1 1 0 0 1 1 1V63A1 1 0 0 1 62 64zM35 62H61V44H35z'/%3E%3Cpath d='M56 43H54V40H44v3H42V39a1 1 0 0 1 1-1H55a1 1 0 0 1 1 1zM44 55H38a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 44 55zm-5-2h4V51H39zM58 55H52a1 1 0 0 1-1-1V50a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4A1 1 0 0 1 58 55zm-5-2h4V51H53z'/%3E%3Crect width='2' height='7' x='38' y='43'/%3E%3Crect width='2' height='7' x='42' y='43'/%3E%3Crect width='2' height='7' x='52' y='43'/%3E%3Crect width='2' height='7' x='56' y='43'/%3E%3Cpath d='M41 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 38 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 41 60zM55 60a1 1 0 0 1-.707-.293l-2-2A1 1 0 0 1 52 57V54h2v2.586l1 1 1-1V54h2v3a1 1 0 0 1-.293.707l-2 2A1 1 0 0 1 55 60z'/%3E%3Crect width='4' height='2' x='34' y='51'/%3E%3Crect width='8' height='2' x='44' y='51'/%3E%3Crect width='4' height='2' x='58' y='51'/%3E%3Cpath d='M32,39a1,1,0,0,1-.707-.293l-4-4,1.414-1.414L32,36.586l3.293-3.293,1.414,1.414-4,4A1,1,0,0,1,32,39Z'/%3E%3Cpath d='M34,41a1,1,0,0,1-.707-.293L32,39.414l-1.293,1.293a1,1,0,0,1-1.414,0l-4-4A1,1,0,0,1,25,36V34h2v1.586l3,3,1.293-1.293a1,1,0,0,1,1.414,0L34,38.586l3-3V34h2v2a1,1,0,0,1-.293.707l-4,4A1,1,0,0,1,34,41Z'/%3E%3Crect width='2' height='17' x='17' y='46'/%3E%3C/g%3E%3C/svg%3E\")",
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
    '& .vis-item.filled': {
      color: pink[500]
    },
    '& .vis-cluster': {
      background: 'none',
      border: '0px',
      '& .vis-item-content':{
        padding: 0,
        width: '112px !important',
        textAlign: 'left'
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
    '& .vis-item.asset-type-security-release':{
      backgroundColor: '#70A800 !important'
    },
    '& .vis-item.asset-type-security-release-partial':{
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