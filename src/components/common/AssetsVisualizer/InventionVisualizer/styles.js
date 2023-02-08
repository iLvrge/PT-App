import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        '& fieldset':{
            border: 0
        },
        '& .MuiTab-root':{
            minWidth: 'inherit',
            maxWidth: 150
        },
        '& .vis-panel.vis-background.vis-horizontal .vis-grid': {
            borderColor: '#e5e5e51c',
        },
        '& .MuiTableCell-root .MuiSelect-select.MuiSelect-select':{
            paddingRight: 0 
        },
        '& .MuiListItem-root':{
            '& svg.clipboard':{
                width: 24,
                height: 24
            }
        },
        '& .MuiTableCell-root .MuiSelect-select.MuiSelect-select':{
            paddingRight: 0 
        },
        '& .ReactVirtualized__Table__headerRow':{
            '& .selectedIcon .MuiSvgIcon-root':{
                fontSize: 20,
                width: '1em',
                height: '1em' ,
                position: 'absolute',
                fontSize: '20px',
                left: 2,
                top: '17px  !important'  
            }
        },
        '& .ReactVirtualized__Table__rowColumn':{
            '& .MuiSvgIcon-root':{
                fontSize: 20,
                width: '1em',
                height: '1em' ,
                position: 'absolute',
                top: 5
            },
            '& .MuiTableCell-root span':{
                padding: 6
            }
        },
        '& .MuiSelect-select:focus':{
         background: 'none'
        },
        '& svg.MuiSelect-icon':{
            fontSize: '1.7rem',
            top: 3,
            opacity: 0
        },
        '& .MuiInput-underline':{
            /* paddingRight: 11  */
        }, 
        '& .MuiInput-underline:hover:not(.Mui-disabled):before, .MuiInput-underline:before, .MuiInput-underline:after':{
            border: 0
        },
        '& .selectedIcon ':{     
            '& svg': {
                position: 'absolute',
                fontSize: '1.3rem',
                width: '1.3rem',
                left: 2,
                top: '17px  !important'  
            } ,
            '& svg.clipboard':{
                width: 17,
                height: 17
            }   
        },
        '& .MuiSlider-rail':{
            color: '#Ef0000'
        },
        '& .MuiSlider-thumb': {
            backgroundColor: '#Ef0000'
        },
        '& .MuiSlider-markActive': {
            backgroundColor: '#Ef0000'
        },
        '& .MuiTab-wrapper':  {
            whiteSpace: 'nowrap'
        }
    },
    tabs: {
        minHeight: 47, 
        width: '94%'
        /* borderTop: `1px solid ${theme.palette.divider} !important`, */
    },
    tab: {
        flex: 1,
        minWidth: '25%',
        minHeight: 47,
        fontSize: '1.1rem'
    },
    clipboard: {
        fill: '#fff',  
        width: 24,
        height: 24
    },
    boxContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    graphContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        /* borderTop: `1px solid ${theme.palette.divider} !important`, */
        overflow: 'hidden',
        width: '100%'
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    fullscreenBtn: {
        position: 'absolute',
        top: -2,
        right: 0,
        zIndex: 99999
    },
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: 35,
        flex: 1,
        display: 'flex'
    },
    modal: {
        '& .react-draggable':{
            width: 800,
            height: '50vh',
        },
        '& .MuiDialog-paperWidthSm':{
            maxWidth: 'inherit',
        },
        '& .MuiDialogContent-root':{
            padding: 0,
            overflowX: 'hidden'
        },
        '& .MuiDialogTitle-root':{
            //padding: 0,
            background: 'transparent'
        }
    },
    modalFilter: {
        '& .react-draggable':{
            width: '70vw',
            height: '70vh',
        },
        '& .MuiDialog-paperWidthSm':{
            maxWidth: 'inherit',
            maxHeight: 'inherit',
            height: '100%',
            margin: 0
        },
        '& .MuiDialog-scrollPaper':{
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        }
    },
    sliderContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        cursor: 'pointer',
        zIndex: 999
    },
    filterContent: {
        margin: '0px 40px 32px 40px',
        padding: '0 !important',
        overflow: 'hidden'
    },
    heading: {
        '& .MuiTypography-body1': {
            fontWeight: 500,
            marginBottom: 0
        },
        /* background: '#292929', */
        padding: '8px 15px'
    },
    displayFlex:{
        display: 'flex', 
        height: '100%',
        flexDirection: 'column',
        width: '100%',
    },
    headingContainer: {
        display: 'flex',
        height: 37
    },
    topMargin: {
        marginTop: 15
    },  
    mainContainer: {
        display: 'flex',
        height: '94%',        
    },
    selectorContainer: {
        display: 'flex',
        height: '93%',
        overflow: 'hidden auto'
    },
    holder: {
        display: 'flex',
        width: '100%',
    },
    flexColumn: {
        display: 'flex', 
        flexDirection: 'column',
        height:'100%'       
    },
    customHeight: {
        height:'200px'    
    },
    flexColumnYear: {
        minWidth: 135,
        maxWidth: 135 
    },
    flexColumnDepth: {
        minWidth: 135,
        maxWidth: 135 
    },
    flexColumnScope: {
        flexBasis: '74%'   
    },
    close: { 
        position: 'absolute', 
        right: 10, 
        top: 7, 
        zIndex: 999,
        cursor: 'pointer'
    },
    reset: {
        position: 'absolute', 
        right: 30, 
        top: 2, 
        zIndex: 999,
        cursor: 'pointer',
        color: '#fff'
    },
    btnSetting: {
        justifyContent: 'flex-start',
        padding: 4
    },
    resizable:{
        position: "relative",
        display: 'flex',
        flexDirection: 'column',
        "& .react-resizable-handle": {
            position: "absolute",
            width: 25,
            height: 25,
            bottom: 0,
            right: 0,
            background:
                "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiPjxwYXRoIGQ9Ik0xOSAxMmgtMnYzaC0zdjJoNXYtNXpNNyA5aDNWN0g1djVoMlY5em0xNC02SDNjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMThjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptMCAxNi4wMUgzVjQuOTloMTh2MTQuMDJ6Ij48L3BhdGg+PC9zdmc+')",
            backgroundPosition: "bottom right",
            /* padding: "0 3px 3px 0", */
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            boxSizing: "border-box",
            cursor: "se-resize",
            padding: 5
        }
    },
    settingBtn:{
        /* padding: 0,
        position: 'absolute',
        right: 5,
        top: 50 */
    },
    settingBtnTop: {
        /* right: 35,
        top: 6 */
    },
    button:{
        textTransform: 'initial',
        color: 'inherit'
    },
    settingContainer:{
        position: 'relative',
        '& button':{
            position: 'absolute',
            top: 60,
            zIndex: 9999
        }
    }
}))
