import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
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
    filterContent: {
        margin: '0px 40px 32px 40px',
        padding: '0 !important',
        overflow: 'hidden'
    },
    scroll: {
        overflowY: 'auto'
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
}))