import makeStyles from '@mui/styles/makeStyles';

const LOGO_WIDTH = 120
const HEADER_MARGIN = 5
const HEADER_PADDING = 15
const LEFT_PANEL_WIDTH = 2 * 100 / 12 // Grid size of 2 out of 12 parts

export default makeStyles(theme => ({
    companyLogoCon: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '13rem', 
        justifyContent: 'flex-start', 
        cursor: 'pointer',
        '@media (max-width: 70em)': {
        //paddingLeft: 15
        }, 
    },
    userLogoOfficial: {
        height: '1.1rem', /*28px */
        marginRight: 15,
    }, 
    organizationName: {
        marginLeft: 5,
        fontSize: 15,
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
            stroke: '#5a5a5a'
        },
        '&:hover':{
            '& svg':{
                fill: 'rgb(230, 0, 0)',
                stroke: 'rgb(230, 0, 0)',
            }
        },
        [theme.breakpoints.down('lg')]: {
            width: 25,
            height: 25,
        }
    }
}))