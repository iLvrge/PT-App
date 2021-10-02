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
  dashboard: {
    /* position: 'absolute',
    top: '38px',
    left: 0,
    right: 0,
    bottom: 0,*/
    padding: '10px',
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden auto',
    background: '#222222 !important' 
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    flexGrow: 1,
    overflow: 'auto'
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
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
    opacity: 0.8,
    background: '#303030',
    '&:hover': {
      opacity: 1,
      background: '#303030',
    }
  },
  forceStrech: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    zIndex: 100,
    top: '50%',
    left: '50%',
  },
  filetree:{
    '& ul': {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      '& li ul': {
        display: 'block !important',
        padding: 0,
        '& li': {
          padding: '20px 0 0 0 !important',
        }
      }
    },
    '& li': {
      margin: 0,
      padding: '20px 0 0 0',
      lineHeight: '25px',
      '&:first-child': {
        padding: 0
      },
      '& .MuiTypography-body2': {
        '& .index.1': {
          margin: '14px 0 0 20px'
        }
      }
    },
    '& .node': {
      //background: 'url(./assets/images/treeview-default-line.gif) 0 -176px no-repeat'
    },
    '& .node.last>.hitarea': {
      //backgroundPosition: '0 -111px'
    },
    '& .node.collapsed.last>.hitarea': {
      //backgroundPosition: '-32px -67px'
    },
    '& .leaf': {
      //background: 'url(./assets/images/treeview-default-line.gif) 0 0 no-repeat',
      '& .hitarea': {
        //background: 0
      }
    },
    '& .hitarea': {
      /* background: 'url(./assets/images/treeview-default.gif)-64px -25px no-repeat',
      height: '16px',
      width: '16px',
      marginLeft: '-16px',
      cursor: 'pointer' */
    },
    '& .collapsed': {
      '& .hitarea': {
        //backgroundPosition: '-80px -3px'
      }
    },
    '& #tree': {
      overflow:'auto',
      display: 'none'
    }
  },
  paperRoot: {
    height: 'calc(100% - 38px)'
  },
  borderBottom: {
    borderBottom: '1px solid #fff',
    marginBottom: '10px'
  }, /**PTAB */
  timeline: { 
    height: '100%', 
    width: '100%',
    '& .vis-panel.vis-center':{
      borderTop: 0
    },
    '& .vis-timeline':{
      border: '0 !important',
      backgroundColor: '#424242 !important',
      '& .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground, & .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground':{
        backgroundColor: '#424242 !important',
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
              '& path.st1': {
                fill: '#fff' 
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
              '& path.st1': {
                fill: '#fff' 
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
  },/**CitationTimeline */
  citation_timeline: {
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
      backgroundColor: '#424242 !important',
      '& .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground, & .vis-label.vis-nested-group.vis-group-level-1, & .vis-itemset .vis-background, & .vis-itemset .vis-foreground':{
        backgroundColor: '#424242 !important',
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
        backgroundColor: '#222222',
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
          border: '1px solid #545454',
          borderRadius: '3px',
          /* padding: '0rem 0.4rem', */
          padding: '0px 0px 0px 7px',
          overflow: 'hidden',
          color: '#BDBDBD',
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
  rootContainer: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  heading: {
    position: 'absolute',
    top: 40,
    zIndex: 1,
    left: 32,
    color: '#e60000'
  },
  figures: {
    width: '100%',
    marginBottom: 15,
    '&:last':{
      marginBottom: 0
    },
    '&:first':{
      marginTop: 15
    }
  },
  iconButton: {
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center'
  },
  inlineContainer: {
    display: 'flex',
    height: '100%',
    width: '100%',
    '& .react-viewer-toolbar li:nth-child(4)':{
      display: 'none'
    },
    '& .react-viewer-icon-reset': {
      display: 'none'
    },
    '& .react-viewer-mask':{
      background: 'none'
    },
    '& .react-viewer-navbar': {
      backgroundColor: '#424242'
    }
  },
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
  }
}))
