import makeStyles from '@mui/styles/makeStyles';
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@mui/material/colors'

export default makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
    background: 'inherit !important',
    '& .vis-time-axis .vis-text, .vis-item, .vis-y-axis':{
      color: theme.palette.text.primary,
    },
    '& .vis-timeline, .vis-panel.vis-center':{
      border: `1px solid ${theme.palette.divider}`
    },
    '& .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top, .vis-panel.vis-bottom': {
      borderBottomColor: theme.palette.divider,
      borderTopColor: theme.palette.divider,
      borderLeftColor: theme.palette.divider,
      borderRightColor: theme.palette.divider,
    },
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
    '& .vis-timeline':{
      border: '0 !important',
      /* backgroundColor: '#424242 !important', */
      '& .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground, & .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground':{
        /* backgroundColor: '#424242 !important', */
      }
    },
    '& .vis-left.vis-panel.vis-vertical-scroll, & .vis-right.vis-panel.vis-vertical-scroll': {
      overflowY: 'hidden',
    },
    '& .vis-item': {
      fontSize: 12,
      /* backgroundColor: '#222', */
      color: '#fff',
      borderRadius: '3px',
      '&.vis-point':{
        maxWidth:'125px',
        overflow:'hidden',
        maxHeight: '160px',
        /* minHeight: '125px' */
      },
      '& img':{
        /*height: '100%',
        width: '100%'*/ 
      },
      '& .vis-item-content':{
        margin:'0px !important'
      },
      '&.vis-line':{
        border: 0,
        backgroundColor: 'unset'
      },      
    },
    '& .vis-cluster': {
      backgroundColor: '#3f51b547',
    },
    '& .vis-dot': {
      background: 'none !important',
      border: 'none !important',
    },
    '& .vis-item.vis-box': {
      borderColor: indigo[500],
      backgroundColor: indigo[500],
      '&.asset-type-default': {
        backgroundColor: 'transparent',
        border: 0,
        width: '9.6rem',
        borderRadius: '3px',
        height: '4.4rem',
        '&.vis-selected':{
          '& .vis-item-content':{
            border: '1px solid #e60000 !important',
          }
        },
        '& .vis-item-content':{
          width:'100%',
          height:'100%',
          display: 'flex',
          flexWrap: 'wrap',          
          justifyContent: 'flex-start',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '3px',
          /* padding: '0rem 0.4rem', */
          padding: '0px 0px 0px 7px',
          overflow: 'hidden',
          color: theme.palette.text.primary,
          '& .maxHeight':{
            maxHeight: '51px',
            overflow: 'hidden',
            justifyContent: 'flex-start',
            paddingBottom: '0.15rem'
          },
          '& .first':{
            fontWeight: 500,
            fontSize: '0.875rem',
            
            display: 'flex',
            flexBasis:'100%',
            /* lineHeight: '0.875rem', */
            alignItems: 'center',
            /* marginBottom: '2px' */
          },
          '& .second':{
            display:'flex',
            flexDirection: 'column-reverse',
            /* flexBasis: '50%', */
            alignItems: 'flex-start',
            fontSize: '0.65rem',
            fontWeight: 400,
            /* paddingBottom: '2px', */
            '& div':{
              marginLeft: '5px'
            },
            '& img':{
              width: '5rem',
              /* maxHeight: '2.5rem' */
            }
          },
          '& .flexMain':{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden',
              height: '54%',
              '&.alignBaseline':{
                alignItems: 'baseline',
                '& .textColumn':{
                  '& .absolute':{
                    bottom: 7
                  }
                }
              },
            '& img':{
              width: '4.3rem'
            },
            '& .textColumn':{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '0.65rem',
              height: '100%',
              position: 'relative',
              paddingLeft: '5px',
              '& .absolute':{
                position: 'absolute',
                bottom: 0
              }
            }
          }
        }
      } 
    },
    '& .vis-item.vis-point.vis-selected': {
      backgroundColor: 'none !important',
      color: '#e60000',
      /* fontWeight: 'bold', */
    },
  },
  legend: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '5px 15px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 150,
    /* background: '#424242', */
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
    }
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
    /* background: '#424242cc', */
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
  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  blinkText: { 
    animationName: '$blinker',
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  } 
}))
