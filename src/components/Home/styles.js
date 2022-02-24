import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({    
    root: {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: '5px',
        
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },    
    fullscreenChartsModal: {
        display: 'flex',
    },
    fullscreenCharts: {
        margin: 35,
        flex: 1,
        display: 'flex',
        border: '1px solid',
        '& .MuiGrid-item':{
            alignItems: 'center',
            '& .MuiLink-root':{
                textDecoration: 'none'
            }
        },
        '& .MuiTypography-body1':{
            fontSize: '2.5rem',
            lineHeight: 1.1,
            wordBreak: 'break-word',
            marginBottom: '0.7vw',
            [theme.breakpoints.down('lg')]: {
                fontSize: '2vw',
            }
        }
        /* '& .MuiGrid-container':{
            padding: '30px'
        },
        '& .MuiGrid-item':{
            background: '#222222',
            width: 'auto',
            height: 'auto',
            margin: '45px',
            padding: '5px',
            flexBasis: '12%',
            color: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid #545454',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'left',
            '& .MuiTypography-root':{
                display: 'flex',
                 justifyContent: 'center', 
            },
            '& .MuiTypography-body1':{
                fontSize: '3.5rem',
                lineHeight: 1
            }
        } */
    },
    container1:{
        justifyContent: 'space-between',
    },
    item:{
        background: '#222222',
        padding: '34px',
        color: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid #545454',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        '& .MuiTypography-body1':{
            '& span':{
                display: 'block'
            } 
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
    container2:{
        padding: '0 2vw'
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
    main: {
        padding: '55px 55px 5px 55px !important',
        '& .MuiTypography-body1':{
            fontSize: '1.8rem'
        }
    }
}))
 