import { makeStyles } from '@material-ui/core/styles'

const LOGO_WIDTH = 120
const HEADER_MARGIN = 5
const HEADER_PADDING = 15
const LEFT_PANEL_WIDTH = 2 * 100 / 12 // Grid size of 2 out of 12 parts

export default makeStyles(theme => ({
    companyLogoCon: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '12rem', 
        justifyContent: 'flex-start', 
        cursor: 'pointer',
        '@media (max-width: 70em)': {
        //paddingLeft: 15
        }, 
    },
    userLogoOfficial: {
        height: '2rem', /*28px */
        marginRight: 15
    }, 
    organizationName: {
        marginLeft: 5,
        fontSize: 15,
    },
    userLogo: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: `calc(${LEFT_PANEL_WIDTH}% - ${LOGO_WIDTH + ((HEADER_MARGIN + HEADER_PADDING) / 2)}px)`,
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
        }
    }
}))