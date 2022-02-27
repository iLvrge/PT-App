import makeStyles from '@mui/styles/makeStyles';
import { indigo } from '@mui/material/colors'
export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .vis-panel.vis-background.vis-horizontal .vis-grid': {
            borderColor: '#e5e5e51c',
        },
        '& .MuiTab-root':{
            minWidth: 'inherit',
            maxWidth:  150
        },
        '& .MuiTab-wrapper':{
            whiteSpace: 'nowrap'
        }
    },
    tabs: {
        minHeight: 47,
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 47,  
        fontSize: '1.1rem'                          
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,        
        border: `1px solid ${theme.palette.divider} !important`
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    fullscreenBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: 35,
        flex: 1,
        display: 'flex'
    },
    fullScreenContainer:{
        position: 'absolute',
        top: 10,
        right: 10,
        cursor: 'pointer',
        zIndex: 999
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
    }
}))
