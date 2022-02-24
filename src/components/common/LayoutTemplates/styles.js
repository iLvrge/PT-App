import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex:1,
        overflow: 'hidden auto',
        '& .disable_header':{
            '& .ReactVirtualized__Table__headerRow': {
                /* visibility: 'hidden' */
                display: 'none'
            }
        },
        '& .ReactVirtualized__Table__headerColumn, .ReactVirtualized__Table__rowColumn':{
            paddingLeft: 10
        }        
    }    
}))