import makeStyles from '@mui/styles/makeStyles';
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@mui/material/colors'

export default makeStyles(theme => ({
   
  root: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
    /* background: '#222222 !important',
    border: '1px solid #5c5c5c !important', */
    overflow: 'hidden'
  }, 
  timelineRoot: {
    height: '100%',
    width: '100%',
    position: 'relative',
    flex: 1,
    display: 'flex',
  },  
  fullscreenBtn: {
    position: 'absolute',
    top: 9,
    right: 0,
    zIndex: 999
  },
  tab: {
    minWidth: '25%',
    minHeight: 47,
    fontSize: '1.1rem'
  },
  tabs: {
    minHeight: 47,
    display: 'flex',
    /* '& .MuiTab-root': {
      fontSize: '1.1rem'
    } */
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
    '& .custom_tooltip':{
      position:'absolute',  
      width:'150px',
      /* height:'150px', */
      background: theme.palette.background.default,
      border:`1px solid ${theme.palette.divider}`, 
      color: theme.palette.text.primary,
      padding: '5px 10px' ,
      '& h4':{
        margin: 0 
      },
      overflow: 'hidden'
    },
    '& .vis-panel.vis-center':{
      borderTop: 0
    },
    '& .vis-timeline':{
      border: 0,
      borderTop:`1px solid ${theme.palette.divider}`, 
      borderBottom:`1px solid ${theme.palette.divider}`, 
      backgroundColor: `${theme.palette.background.paper}!important`,
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
    '& .vis-item.vis-background.yellow.negative': {
      background: '#FFAA00 !important',
      opacity: '1'
    },
    '& .vis-item.vis-background.red.negative': {
      background: '#E60000 !important',
      opacity: '1'
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
          border: '1px solid #545454',
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
          '& .first.limit':{
            height: 29,
            overflow: 'hidden',
            alignItems: 'flex-start'
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
              },
              '& path.none': {
                fill: 'none' 
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
    },
  },
  timelinePtab: {
    height: '100%', 
    width: '100%',
    '& .custom_tooltip':{
      position:'absolute',  
      width:'200px',
      /* height:'150px', */
      background: theme.palette.background.default,
      border:`1px solid ${theme.palette.divider}`, 
      color: theme.palette.text.primary,
      padding: '5px 10px' ,
      '& h4':{
        margin: 0 
      },
      overflow: 'hidden'
    },
    '& .vis-panel.vis-center':{
      borderTop: 0
    },
    '& .vis-timeline':{
      border: 0,
      borderTop:`1px solid ${theme.palette.divider}`, 
      borderBottom:`1px solid ${theme.palette.divider}`, 
      backgroundColor: `${theme.palette.background.paper}!important`,
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
    '& .vis-item.vis-background.negative': {
      background: 'linear-gradient(to right,  #FFFF00 0%,#FFFF00 50%,#E60000 50%,#E60000 100%)',
      opacity: '0.5',
    },
    '& .vis-item.vis-range.asset-type-default':{
      backgroundColor: '#228DE8 !important'
    },
    '& .vis-item.vis-range':{
      border: 0,
      '& .vis-item-overflow':{
        overflow: 'visible',
        position: 'unset',
        minHeight: 28,
        '& .vis-item-content':{
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
            }
          }
        }
      } 
    }
  },
  timelineCitation: {
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
      background:'#222222',
      border:'1px solid #545454',
      color:'#BDBDBD',
      padding: '5px 10px' ,
      '& h4':{
        margin: 0 
      },
      overflow: 'hidden'
    },
    '& .vis-timeline':{
      border: 0,
      borderTop:`1px solid ${theme.palette.divider}`, 
      borderBottom:`1px solid ${theme.palette.divider}`, 
      backgroundColor: `${theme.palette.background.paper}!important`,
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
        backgroundColor: /* theme.palette.background.default */ 'unset',
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
          color: '#BDBDBD',
          width:'100%',
          border: '1px solid #545454',
          height:'100%',          
          display: 'flex',
          padding: 5,
          overflow: 'hidden',
          flexWrap: 'wrap',   
          borderRadius: 3,       
          justifyContent: 'flex-start',
          flexDirection: 'column',           
          '& .maxHeight':{
            maxHeight: '51px',
            overflow: 'hidden',
            justifyContent: 'flex-start',
            paddingBottom: '0.15rem'
          },
          '& .first':{
            display: 'flex',
            fontSize: '0.875rem',
            fontWeight: 500,
            overflow: 'hidden',
            height: '100%',
            width:'55%',
            marginRight: 3
          },
          '& .second':{
            display:'flex',
            flexDirection: 'column',  
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 400,
            height: '100%',
            width: '45%',
            overflow: 'hidden',
            '& div':{
              marginLeft: '5px'
            },
            '& .img-holder': {
              display: 'inline-block',
              width: 50,
              height: 50,
              backgroundColor: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            },
            '& img':{
              width: 50,
              display: 'flex'
              /* width: '3.5rem', */
              /*width: '5rem',
              height: '3.5rem',*/
              /* opacity: '0.75',
              '&:hover':{
                opacity: 1
              } */
              /* maxHeight: '2.5rem' */
            },
            '& img.no-image':{
              /* height: '4rem', */
              /* maxHeight: '2.5rem' */
            }
          },
          '& .flexMain':{
              display: 'flex',
              overflow: 'hidden',
              flexGrow: 1,
              alignItems: 'flex-start',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%',
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
              lineHeight: '1.1',
              '& .absolute':{
                position: 'absolute',
                bottom: 0
              }
            },
            '& .small-font':{                
              fontSize: '0.65rem',  
              marginTop: 2,
              lineHeight: '0.81'
            },
            '& .text-height':{
              whiteSpace: 'initial',
              textAlign: 'left',
              marginTop: 1,
              lineHeight: '1.025',
              overflow: 'hidden',
              height: '130px !important'
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
  containerRelative: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  counter: {
    display: 'flex',
    position: 'absolute',
    lineHeight: 1, 
    bottom: '-8px',
    alignItems: 'center',
    color: '#E60000',
  },
  badge: {
    position: 'absolute',
    left: -4, 
    '& .MuiBadge-colorPrimary': {
      top: 16,
      backgroundColor: 'inherit',
      right: 'inherit',
      transform: 'none',
      wordBreak: 'keep-all',
      color: theme.palette.text.secondary 
    }    
  },
  redColor: {
    '& .MuiBadge-badge':{
      color: '#E60000'
    }
  }
}))