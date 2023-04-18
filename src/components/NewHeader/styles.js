import { pink } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import { isValidRGBA } from 'vis-util';

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
        padding: '0 0 0 10px',
        boxShadow: 'none',  
        '& .iconItem':{
            width: 90,
            '& .MuiListItemIcon-root':{
                '& svg' :{
                    fill: 'currentColor',
                    stroke: 'currentColor',
                }
            }
        },
        
    },
    title:{
        whiteSpace: 'nowrap', 
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '1.1rem',
        marginRight: 'auto',
        '& span':{
            textTransform:'uppercase',
            marginLeft: 24
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
        /* width: '14rem',  */
        justifyContent: 'flex-start', 
        /* cursor: 'pointer', */
        overflow: 'hidden',
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
        width: '260px',
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
        height: '2.5rem', /*28px */
        marginRight: 15
    }, 
    organizationName: {
        marginLeft: 5,
        fontSize: 15,
    },
    middleContainer: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        minWidth: 595,  
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
        /* textAlign: 'right' */
    },
    toolbar: {
        padding: 0,
        height: 43,
        minHeight: 43,
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
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: 465,
        '& .MuiBadge-anchorOriginTopRightRectangular': {
            transform: 'scale(1) translate(27%, 0%)',
            padding: '0 3px',
            minWidth: 15,
            height: 15
        },
        '& .MuiBadge-anchorOriginTopRightRectangular.MuiBadge-invisible': {
            transform: 'scale(0) translate(50%, -50%)'
        },
        minWidth: 150
    },
    breadcrumbs: {
        display: 'flex',
        height: '100%',
        alignItems: 'center',
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
        position: 'relative',
        height: '100%',
        '& .MuiList-root':{
            paddingLeft: 20,
            paddingRight: 20,
            height: '100%'
        },
        '& .MuiListItem-gutters':{
            paddingRight: 70
        },
        '& .MuiListItemIcon-root':{
            minWidth: 35
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
        position: 'fixed',
        top: 55,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        /* margin: '0 4px !important', */
        height: 32,
        width: 400, 
        [theme.breakpoints.up('sm')]: {
          width: 400,
        },
        display: 'none'
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
    searchEnable:{
        display: 'block'
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: 0,
        height: 32,
        // vertical padding + font size from searchIcon
        paddingLeft: theme.spacing(1),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
            '&:focus': {
              width: '100%',
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
            top: 53
        }
    },
    borderItem: {
        borderTop: '1px solid #545454',
        marginTop: 20
    },
    svgIcon: {
        fontSize: '1.5rem',
        width: '1em',
        height: '1em',
        fill: 'currentColor',
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
    slackContainer: {
        width: 40,
        height: 30,
        position: 'relative',
        '& .MuiIconButton-root':{
            marginRight: 6,
            position: 'absolute',
            height: 40,
            width: 40,
            top: -4,
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
            fill: theme.palette.text.disabled,
            /* stroke: '#5a5a5a' */
        },
        '&:hover':{
            backgroundColor: 'unset',
            /* '& svg':{
                fill: 'rgb(230, 0, 0)',
                stroke: 'rgb(230, 0, 0)',
            } */
            color: pink['A400'] ,
            '& svg':{
                fill: pink['A400'],
                /* stroke: pink['A400'], */
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
        cursor: 'default' ,
        fontSize: '1.1rem',
        fontWeight: 200,
        textTransform: 'initial',
        color: `${theme.palette.text.primary}`
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
    },  
    assetIcon: {
        width: '1em',
        height: '1em',
        fontSize: '1.5rem',
        display: 'inline-block',
        userSelect: 'none'
    },
    actionIconDashboard: {
        '& svg' : {
            fontSize: '2.3rem !important'
        }
    },
    actionIcon: {
        /* '& svg':{
            width: '1rem !important',
            height: '1rem !important'
        } */
        margin: '0 5px',
        color: theme.palette.text.disabled,
        '& svg' : {
          fill: theme.palette.text.disabled, 
          fontSize: '2rem'
        },
        '&:hover':{
            color: pink['A400'] ,
            '& svg':{
                fill: pink['A400'],
                /* stroke: pink['A400'], */
            }
        },
    }, 
    active: {
        color: pink['A400'],
        '& svg':{
            fill: pink['A400'],
            /* stroke: pink['A400'], */
        }
    },
    shareIcon: {
        '& svg' : {
            width: '1rem !important', 
            height: '1rem !important'
        }
    },
    breadcrumbHeadingIcon: {
        '& svg': {
            marginRight: 5,
            display: 'inline-block',
            position: 'absolute',
            bottom: 10
        },
        '& span':{
            marginLeft: 25
        }
    },
    noStrokeHeightWidth: {
        width: '1em',
        height: '1em'
    }
}))
