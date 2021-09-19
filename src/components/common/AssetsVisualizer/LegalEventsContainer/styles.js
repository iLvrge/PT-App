import { makeStyles } from '@material-ui/core/styles'
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@material-ui/core/colors'

export default makeStyles(theme => ({
   
  root: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTab-root':{
      minWidth: 'inherit',
    },
    '& .MuiTypography-root':{
      lineHeight: '25px'
    },
    '& embed':{
      height: '100%',
      width: '100%'
    },
    '& .MuiPaper-elevation1': {
      boxShadow: 'none'
    },
    '& .MuiTableCell-root': {
      padding: '0 10px',
      lineHeight: '25px',
      verticalAlign: 'top',
      borderBottom: '0px',
      '&:first-child': {
        paddingLeft: '0px'
      }
    },
    '& .MuiTabScrollButton-root':{
      width: '20px'
    },
    
  },
  graphContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#222222 !important',
    border: '1px solid #5c5c5c !important',
    overflow: 'hidden'
  }, 
  timelineRoot: {
    height: '100%',
    width: '100%',
    position: 'relative',
    flex: 1,
    display: 'flex',
  },
  tab: {
    minWidth: '25%',
    minHeight: 35,
  },
  tabs: {
    minHeight: 35,
    display: 'flex',
    '& .MuiTab-root': {
      fontSize: '1rem'
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
    '& .vis-panel.vis-center':{
      borderTop: 0
    },
    '& .vis-timeline':{
      border: '0 !important',
      backgroundColor: '#222222 !important',
      '& .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground, & .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground':{
        /* backgroundColor: '#424242 !important', */
      }
    },
    '& .vis-left.vis-panel.vis-vertical-scroll, .vis-right.vis-panel.vis-vertical-scroll':{
      overflowY: 'hidden'
    },
    '& .vis-itemset .vis-background':{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'visible',
    },
    '& .vis-item': {
      '&.vis-line':{
        border: 0,
        backgroundColor: 'unset'
      }
    },
    '& .vis-dot': {
      background: 'none !important',
      border: 'none !important',
    },
    '& .vis-item.vis-background.negative': {
      background: 'linear-gradient(to right,  #FFFF00 0%,#FFFF00 50%,#E60000 50%,#E60000 100%)',
      opacity: '0.5',
    },
    '& .vis-item.vis-box': {      
      '&.asset-type-default': {
        backgroundColor: 'rgba(34,34,34, 0.75)',
        border: 0,
        borderRadius: '3px',
        width: '9.6rem',
        height: '4.4rem',
        '& .vis-item-content':{
          width:'100%',
          height:'100%',
          display: 'flex',
          flexWrap: 'wrap',          
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          border: '1px solid #9d9d9d',
          borderRadius: '3px', 
          padding: '4px 0px 2px 4px',
          overflow: 'hidden',
          color: '#BDBDBD',
          '& .first':{
            fontWeight: 500,
            fontSize: '0.875rem',
            display: 'flex',
            /* flexBasis:'100%', */
            /* lineHeight: '0.875rem', */
            alignItems: 'center',
            /* marginBottom: '2px' */
            whiteSpace: 'initial',
            textAlign: 'left',
            width: '57%',
            lineHeight: 1.1
          },
          '& .second':{            
            fontSize: '0.875rem',
            lineHeight: '1.3',
            fontWeight: 400,
            float: 'left',
            width: '50%',
            /* height: '100%', */
            whiteSpace: 'initial',
            textAlign: 'left',
            '& .event_icon1':{
              width: '100%',
              height: '100%'
            },
            '& svg':{
              '& path': {
                fill: '#fff' 
              },
              '& path.svg_red': {
                fill: '#E60000' 
              },
              '& path.svg_blue': {
                fill: '#00A9E6' 
              },
              '& path.svg_green': {
                fill: '#70A800' 
              }
            },
            '& div':{
              /* marginLeft: '5px' */
            }, 
            '& img':{
              width: '5rem',
              maxHeight: '2.5rem'
            }
          },
          '& .textColumn':{
            position: 'absolute',
            bottom: '4px',
            fontSize: '0.65rem',
          },
          '& .absolute':{
            position: 'absolute',
            top: '6px',
            right: '0px',
            width: '43%',
            height: '84%',
            '& svg':{
              width: '100%',
              height: '100%',
              '& path': {
                fill: '#fff' 
              },
              '& path.svg_red': {
                fill: '#E60000' 
              },
              '& path.svg_blue': {
                fill: '#00A9E6' 
              },
              '& path.svg_green': {
                fill: '#70A800' 
              }
            }
          },
          '& .flexMain':{
              display: 'flex',
              overflow: 'hidden',
              height: '34%',
            '& img':{
              width: '4.3rem'
            },            
            
          }
        }
      }
    },
    '& .vis-item.vis-range': {
      '&.asset-type-yellow': {
        background: 'linear-gradient(to right,  #FFFF00 0%,#FFFF00 50%,#E60000 50%,#E60000 100%)',
        opacity: '0.5',
      } 
    }
  }
}))