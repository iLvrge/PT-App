import makeStyles from '@mui/styles/makeStyles';
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@mui/material/colors'

export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        /* backgroundColor: theme.palette.background.default, */
        '& #visualization': {
            position: 'relative',
            '& .menu': {
                position: 'absolute',
                zIndex: 9999,
                right: 25,
                top: 2
            }
        },
        '& .vis-time-axis .vis-text, .vis-item, .vis-y-axis': {
            color: theme.palette.text.primary,
        },
        '& .vis-timeline': {
            border: 0
        },
        '&.vis-panel.vis-center': {
            border: `1px solid ${theme.palette.divider}`
        },
        '& .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top, .vis-panel.vis-bottom': {
            borderBottomColor: theme.palette.divider,
            borderTopColor: theme.palette.divider,
            borderLeftColor: theme.palette.divider,
            borderRightColor: theme.palette.divider,
        },
        '&.vis-panel .vis-shadow': {
            /*height: 0*/
        },
        '& .vis-time-axis .vis-text': {
            padding: '1px 3px'
        },
        '& .vis-tooltip': {
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
        '& .vis-dot': {
            background: 'none !important',
            border: 'none !important',
        },
        '& .vis-line':{
            border: 0,
            backgroundColor: 'unset'
        }, 
        '& .vis-content': {
            color: '#000000', 
            '& .vis-item.vis-box.asset-type-security-release-partial': {
                borderBottom: '3px solid #228DE8 !important'
            },
            '& .vis-item.vis-range.asset-type-lending, .vis-item.vis-range.asset-type-borrowing, .vis-item.vis-box.asset-type-lending, .vis-item.vis-box.asset-type-borrowing': {
                borderBottom: '3px solid #FFAA00 !important'
            },
            '& .vis-item.vis-range.asset-type-security-release, .vis-item.vis-box.asset-type-security-release, .vis-item.vis-box.asset-type-releaseOut': {
                borderBottom: '3px solid #70A800 !important'
            },
            '& .vis-item': {
                fontSize: 12,
                backgroundColor: 'transparent',
                color: theme.palette.text.primary,
                '& .vis-item-content': {
                    /* width: '95px', */
                    whiteSpace: 'normal',
                    padding: '5px 5px 5px 0px',
                    '& .cluster-header': {
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
                },
                '&.vis-dot': {
                    backgroundColor: 'inherit',
                    borderColor: 'inherit',
                    width: 24,
                    height: 24,
                    top: '1px !important',
                    left: -5,
                    border: 0,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 24
                },
                '&.vis-dot.asset-type-default': {
                    borderColor: indigo[500],
                },
            }, 
            '& .vis-item.vis-box': {
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
            },
            '& .vis-item.vis-point.vis-selected': {
                backgroundColor: 'none !important',
                color: theme.palette.secondary.main
                /* fontWeight: 'bold', */
            },
            '& .vis-item.vis-point': {
                backgroundColor: /* theme.palette.background.default */ 'unset',
                border: 0,
                width: '9.6rem',
                borderRadius: '3px',
                height: '4.4rem',
                '&.vis-selected': {
                    '& .vis-item-content': {
                        border: '1px solid #e60000 !important',
                    }
                },
                '& .vis-item-content': {
                    color: '#BDBDBD',
                    width: '100%',
                    border: '1px solid #545454',
                    height: '100%',
                    display: 'flex',
                    padding: 5,
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                    borderRadius: 3,
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    '& .maxHeight': {
                        maxHeight: '51px',
                        overflow: 'hidden',
                        justifyContent: 'flex-start',
                        paddingBottom: '0.15rem'
                    },
                    '& .first': {
                        display: 'flex',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        overflow: 'hidden',
                        height: '100%',
                        width: '55%',
                        marginRight: 3
                    },
                    '& .second': {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 400,
                        height: '100%',
                        width: '45%',
                        overflow: 'hidden',
                        '& div': {
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
                        '& img': {
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
                        '& img.no-image': {
                            /* height: '4rem', */
                            /* maxHeight: '2.5rem' */
                        }
                    },
                    '& .flexMain': {
                        display: 'flex',
                        overflow: 'hidden',
                        flexGrow: 1,
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        height: '100%',
                        '&.alignBaseline': {
                            alignItems: 'baseline',
                            '& .textColumn': {
                                '& .absolute': {
                                    bottom: 7
                                }
                            }
                        },
                        '& img': {
                            width: '4.3rem'
                        },
                        '& .textColumn': {
                            display: 'flex',
                            lineHeight: '1.1',
                            '& .absolute': {
                                position: 'absolute',
                                bottom: 0
                            }
                        },
                        '& .small-font': {
                            fontSize: '0.65rem',
                            marginTop: 2,
                            lineHeight: '0.81'
                        },
                        '& .text-height': {
                            whiteSpace: 'initial',
                            textAlign: 'left',
                            marginTop: 1,
                            marginBottom: 1,
                            lineHeight: '1.025',
                            overflow: 'hidden',
                            height: '27px !important'
                        }
                    }
                },
                '&.asset-type-employees': {
                    width: 'auto',
                    height: 'auto',
                    '& .vis-item-content': {
                        border: 0,
                        width: 'auto',
                        height: 'auto'
                    }
                }
            },
            '& .vis-item.vis-range.vis-cluster': {
                '& .vis-item-content': {
                    border: '0px !important',
                    height: 'auto !important'
                }
            },
            '& .vis-item.vis-range': {
                border: 0,
                backgroundColor: 'unset',
                '& .vis-item-content': {
                    color: '#BDBDBD',
                    width: '9.6rem',
                    borderRadius: '3px',
                    height: '4.4rem',
                    border: '1px solid #545454',
                    borderBottom: 0,
                    display: 'flex',
                    padding: 5,
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                    borderRadius: 3,
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    '& .maxHeight': {
                        maxHeight: '51px',
                        overflow: 'hidden',
                        justifyContent: 'flex-start',
                        paddingBottom: '0.15rem'
                    },
                    '& .first': {
                        display: 'flex',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        overflow: 'hidden',
                        height: '100%',
                        width: '55%',
                        marginRight: 3
                    },
                    '& .second': {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 400,
                        height: '100%',
                        width: '45%',
                        overflow: 'hidden',
                        '& div': {
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
                        '& img': {
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
                        '& img.no-image': {
                            /* height: '4rem', */
                            /* maxHeight: '2.5rem' */
                        }
                    },
                    '& .flexMain': {
                        display: 'flex',
                        overflow: 'hidden',
                        flexGrow: 1,
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        height: '100%',
                        '&.alignBaseline': {
                            alignItems: 'baseline',
                            '& .textColumn': {
                                '& .absolute': {
                                    bottom: 7
                                }
                            }
                        },
                        '& img': {
                            width: '4.3rem'
                        },
                        '& .textColumn': {
                            display: 'flex',
                            lineHeight: '1.1',
                            '& .absolute': {
                                position: 'absolute',
                                bottom: 0
                            }
                        },
                        '& .small-font': {
                            fontSize: '0.65rem',
                            marginTop: 2,
                            lineHeight: '0.81'
                        },
                        '& .text-height': {
                            whiteSpace: 'initial',
                            textAlign: 'left',
                            marginTop: 1, 
                            marginBottom: 1,
                            lineHeight: '1.025',
                            overflow: 'hidden',
                            height: '27px !important'
                        }
                    }
                }
            }
        },
        '& .custom_tooltip': {
            position: 'absolute',
            width: '150px',
            /* height:'150px', */
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.action.disabled}`,
            color: theme.palette.text.primary,
            padding: '5px 10px',
            '& h4': {
                margin: '5px 0 0 0'
            },
            overflow: 'hidden'
        },
        '& .vis-group': {
            '&.group-others': {
                backgroundColor: '#491B1B'
            },
            '&.group-financing': {
                backgroundColor: '#1b1200'
            },
            '&.group-ownership': {
                backgroundColor: '#100000'
            },
            '&.group-licensing': {
                backgroundColor: '#171700'
            },
            '&.group-employees': {
                backgroundColor: '#424141'
            }
        },
        '& .vis-label': {
            '&.group-others': {
                backgroundColor: '#491B1B'
            },
            '&.group-financing': {
                backgroundColor: '#1b1200'
            },
            '&.group-ownership': {
                backgroundColor: '#100000'
            },
            '&.group-licensing': {
                backgroundColor: '#171700'
            },
            '&.group-employees': {
                backgroundColor: '#424141'
            }
        },
        '& .vis-left.vis-panel.vis-vertical-scroll, & .vis-right.vis-panel.vis-vertical-scroll': {
            overflowY: 'hidden',
        },
        '& .vis-cluster': {
            backgroundColor: '#222222',
            border: '1px solid #545454 !important',
            borderRadius: 3,
            padding: 5,
            '& .vis-item-content': {
                padding: 0,
                width: 'auto !important',
                textAlign: 'left',
                padding: '0 !important'
            }
        },
        /* '& .vis-dot': {
            borderColor: indigo[500],
            backgroundColor: indigo[500],
        }, */
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
                backgroundColor: theme.palette.secondary.main,
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
            color: theme.palette.secondary.main,
            fontWeight: 'bold',
        },
        '& .vis-item': {
            '& .vis-item-overflow': {
                overflow: 'visible',
            }
        },
        '& .vis-item.vis-range.recordings': {
            backgroundColor: 'unset !important',
            borderBottom: '3px solid #FFAA00 !important',
            '& .vis-item-overflow': {
                minHeight: 55,
            }
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
            backgroundColor: theme.palette.secondary.main,
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