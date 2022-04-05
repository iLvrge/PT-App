import { alpha } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const LOGO_WIDTH = 120
const HEADER_MARGIN = 5
const HEADER_PADDING = 15
const LEFT_PANEL_WIDTH = 2 * 100 / 12 // Grid size of 2 out of 12 parts

export default makeStyles(theme => ({
    root: {
        zIndex: theme.zIndex.drawer + 6,
        /* transition: theme.transitions.create([ 'margin' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }), */
        position: 'initial',
        /* background: '#222222', */
        width: 'initial',
        /* border: `1px solid ${theme.palette.divider}`, */
        marginBottom: '5px',
        //padding: `0px ${HEADER_PADDING}px`,
        overflow: 'hidden',
        padding: '0 10px',
        boxShadow: 'none',
        '& .iconItem':{
            width: 90,
            '& .MuiListItemIcon-root':{
                '& svg' :{
                    fill: 'currentColor',
                    stroke: 'currentColor',
                }
            }            
        }
    },
    headerClassAction1: {
      lineHeight: "1.2em",
      color: 'rgb(230, 0, 0)',
      fontSize: '2.0rem',
      textDecoration: 'none'
    },
    headerClassAction2: {
      lineHeight: "1.2em",
      color: '#E69800',
      fontSize: '2.0rem',
      textDecoration: 'none'
    },
    headerClassAction3: {
      lineHeight: "1.2em",
      color: '#70A800',
      fontSize: '2.0rem',
      textDecoration: 'none'
    },
    subHeaderClassAction1: {
      float: "left",
      marginTop: "10px",
      color: "rgba(255, 255, 255, 0.7)"
    },
    siteLogoCon: {
        display: 'flex',
        alignItems: 'center',
        
    },
    companyLogoCon: {
        display: 'flex',
        alignItems: 'center',
        width: '12rem', 
        justifyContent: 'flex-start', 
        cursor: 'pointer',
        '@media (max-width: 70em)': {
        //paddingLeft: 15
        },
    },
    menuButton: {
        padding: 0,
        '& svg': {
            color: 'white'
        },
        '& .fa-tasks':{
            width: 20
        }
    },
    logoContainer: {
        width: '18.5rem',
        display: 'flex' 
    },
    siteLogo: {
        /* width: LOGO_WIDTH,
        maxWidth: 'calc(100% - 30px)', */
        /* height: '2.7rem', */
        height: '3.1rem',
        marginRight: 15,
        fill: theme.palette.text.primary,
    }, 
    siteLogoLight:{
        height: '2rem',
        marginRight: 15,
        fill: theme.palette.text.primary,
    },
    userLogo: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: `calc(${LEFT_PANEL_WIDTH}% - ${LOGO_WIDTH + ((HEADER_MARGIN + HEADER_PADDING) / 2)}px)`,
    },
    userLogoOfficial: {
        height: '2rem', /*28px */
        marginRight: 15
    }, 
    organizationName: {
        marginLeft: 5,
        fontSize: 15,
    },

    toolbar: {
        padding: 0,
        minHeight: 40,
        position: 'relative',
    },
    headerIcon: {
        padding: 4,
    },
    signOut: {
        margin: '0 5px',
        cursor: 'pointer',
        '&:hover': {
        color: 'blue',
        }
    },

    headerMenuIcon: {
        fill: 'currentColor',
        transition: '.3s',
        transformOrigin: '50% 50%',
        transform: 'rotate(0)',
        filter: 'invert(75%)',
    },
    rightPanel: {
        marginLeft: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .MuiBadge-anchorOriginTopRightRectangular': {
            transform: 'scale(1) translate(27%, 0%)',
            padding: '0 3px',
            minWidth: 15,
            height: 15
        },
        '& .MuiBadge-anchorOriginTopRightRectangular.MuiBadge-invisible': {
            transform: 'scale(0) translate(50%, -50%)'
        },
        minWidth: '21%'
    },
    breadcrumbs: {
        display: 'flex',
        height: '100%',
        alignItems: 'flex-end',
        color: '#FFFFFF',
        whiteSpace: 'nowrap',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    grow: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: '100%',
        padding: '0 40px 0 0',
        '& .MuiButton-root':{
            textTransform: 'initial',
            fontSize: '1.3rem',
            minWidth: '85px'
        },
        '& .MuiButton-text':{
            padding: '0 20px'
        }
    },
    grow_buttons: {
        /* flexGrow: 1, */
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: '100%',
    },
    alignItemCenter: {
        alignItems: 'center',
    },
    rightMenu:{
        '& .MuiList-root':{
            paddingLeft: '20px',
            paddingRight: '20px'
        },
        '& .MuiListItem-gutters':{
            paddingRight: '70px'
        },
        '& .MuiListItemIcon-root':{
            minWidth: '35px'
        }
    },
    childMenu:{
        marginLeft: '1.5rem'
    },
    menu:{
      '& div': {
        display: 'inline-block'
      }
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        marginRight: '10px'
    },
    activeButton: {
        color: '#e60000',
        textDecoration: 'underline'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        /* margin: '0 4px !important', */
        height: 26,
        width: '100%', 
        [theme.breakpoints.up('sm')]: {
          width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: 0,
        height: 26,
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
        },
    },
    paper: {
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    right:{
      position: 'absolute',
      right: '35px',
      width: '20px',
      height: '20px',
      top: '33px',
      zIndex: 1
    },
    drawer:{
        '& .MuiDrawer-paper':{
            top: '42px'
        }
    },
    item:{
        background: '#222222',
        padding: '20px', 
        color: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid #545454',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        textDecoration: 'none',
        height: '250px',
        width: '250px',
        '& .MuiTypography-body1':{
            fontSize: '2rem',
            lineHeight: 1.1,
            '& span':{
                display: 'block'
            } 
        },
        '& .MuiTypography-body2':{
            marginTop: '20px' 
        },
        '&.maintain':{
            '&:hover':{
                background: '#eaeaea',
                color: '#222222',
                border: '1px solid rgb(230, 0, 0)'
            },
        },
        '&.correct':{
            '&:hover':{
                background: '#eaeaea',
                color: '#222222',
                border: '1px solid rgb(0, 169, 230)'
            },
        },
        '&.progress':{
            '&:hover':{
                background: '#eaeaea',
                color: '#222222',
                border: '1px solid rgb(255,255,0)'
            },
        },
        '&.bank':{
            '&:hover':{
                background: '#eaeaea',
                color: '#222222',
                border: '1px solid #E69800'
            },
        },
        '&.acquisition':{
            '&:hover':{
                background: '#eaeaea',
                color: '#222222',
                border: '1px solid #70A800'
            },
        },
        '&.read':{
            '&:hover':{
                background: '#eaeaea',
                color: '#222222',
                border: '1px solid rgb(255,255,255)'
            },
        },
        [theme.breakpoints.down('xl')]: {
            padding: '1vw',
        },
        '& .MuiLink-root': {
            textDecoration: 'none', 
        } 
    },
    boxWidth:{
        display:'flex',
        justifyContent: 'flex-end'
    },
    gridContainer:{
        marginBottom: '20px'
    },
    bank:{
        color: '#E69800',
    },
    acquisition: {
        color: '#70A800',
    },
    progress: {
        color: 'rgb(255,255,0)',
    },
    correct: {
        color: 'rgb(0, 169, 230)',
    },
    maintain: {
        color: 'rgb(230, 0, 0)',
    },
    read: {
        color: 'rgb(255,255,255)',
    },
    modal: {
        top: '42px !important',
        '& .MuiBackdrop-root':{
            top: '42px !important',
        },
        '&:focus-visible': {
            outline: '0 !important'
        }
    },
    padding0: {
        padding: 0,
        '& .MuiIconButton-label':{
            width: 36,
            height: 36
        }
    },
    tooltip:{
        fontSize: '1rem'
    },
    googleTooltip: {
        '& span':{
            display: 'block'
        }
    },
    buttonIcon: {
        width: 30,
        height: 30,
        borderRadius: 0 ,
        padding: 0,
        /* margin: '0 4px', */
        '& svg':{
            /* width: '2rem',
            height: '2rem', */
            fill: '#5a5a5a',
            /* stroke: '#5a5a5a' */
        },
        '&:hover':{
            '& svg':{
                fill: 'rgb(230, 0, 0)',
                stroke: 'rgb(230, 0, 0)',
            }
        }
    },
    slackIcon: {
        '& svg':{
            width: '100% !important',
            height: '100% !important'
        }
    },
    clipIconActive: {
        '& svg':{
            fill: '#f48fb1',
            stroke: '#f48fb1' 
        },
    },
    clipIconIsActive: {
        '& svg':{
            fill: '#FFF',
            stroke: '#FFF' 
        },
        '&:hover':{
            '& svg':{
                fill: '#FFF',
                stroke: '#FFF' 
            }
        }  
    },
    modalClipboard: {
        margin: '100px auto',
        width: 800,
        height: '50vh' 
    },
    rootClipboard: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '& .vis-panel.vis-background.vis-horizontal .vis-grid': {
            borderColor: '#e5e5e51c',
        }
    },
    calendly: {
        border:'1px solid #5a5a5a !important',
        /* margin: '0 4px', */
        textTransform: 'initial',
        overflow: 'auto',
        padding: '3px 5px',
        '&:hover':{
            border:'1px solid #e60000 !important',
            color: '#e60000 !important'
        },
        '&:first':{
            marginLeft: 5
        },
        '& .MuiButton-label':{
            whiteSpace: 'nowrap'
        }
        /* '& svg': {
            width: 60,
            height: 60
        },
        '& .cls-1':{
            fill: '#006bff'
        },
        '& .cls-2':{
            fill: '#0ae8f0'
        },
        '&:hover': {
            '& .cls-1':{
                fill: '#ef0000'
            },
            '& .cls-2':{
                fill: '#ef0000'
            }
        } */
    },
    btnActionMenu:{
        /* backgroundColor: 'transparent',
        color: '#FFF',
        '&:hover':{
            color: '#E60000',
            backgroundColor: 'transparent', 
        } */      
    },
    actionMenuList: {
        '& .MuiPaper-root':{
            backgroundImage: 'none',
            width: 320,
            boxShadow: `${theme.palette.action.active} 0px 0px 7px 0px`
        },
        '& .MuiPopover-paper':{
            top: '50px !important'  
        },
        '& .MuiMenuItem-root':{
            padding: '8px 20px'
        },
        '& .MuiListItemIcon-root':{
        },
        '& .fa-share-alt': { 
            width: '1rem'
        },
        '& .MuiButton-root': {
            textTransform: 'initial'
        },
        '& .customSVG': {
            width: '1.5em',
            height: '1.5em',
            '& path, polygon': {
                fill: "currentcolor"
            }
        },
        '& .MuiMenuItem-root.Mui-disabled':{ 
            pointerEvents: 'all'
        },
        '& svg':{
            fill: "currentcolor"
        }
    },
    uspto_logo: {
        width: 30
    },
    mBtn: {
        position: 'absolute'
    },
    disableHover: {
        cursor: 'text',
        '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'text',
        }
    },
    disabled: {
        opacity: 0.38
    } 
}))
