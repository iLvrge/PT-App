import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(theme => ({ 
    svgIcon :{
        marginRight: 8
    },
    label: {
        position: 'relative',
        '& svg': { 
            width: 16,
            height: 16, 
            marginRight: 5
        },
        '& .noStroke':{
            fill: '#fff',
            stroke: '#fff'
        }
    },
    imgContainer: {
        width: 20,
        height: 20,
        position: 'relative',
        display: 'inline-block',
        '& svg':{
        }
    },  
    img: {
        width: '1.5em',
        marginRight: 8
    },
    svgImg: {
        width: '1em',
        height: '1em',
        display: 'inline-block',
        fill: 'currentColor', 
        flexShrink: 0,
        fontSize: '1.5rem',
        marginRight: 8
    }
}))