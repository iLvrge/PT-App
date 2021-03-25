import { makeStyles } from '@material-ui/core/styles'

const LOGO_WIDTH = 120
const HEADER_MARGIN = 5
const HEADER_PADDING = 15
const LEFT_PANEL_WIDTH = 2 * 100 / 12 // Grid size of 2 out of 12 parts

export default makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 6,
    transition: theme.transitions.create([ 'margin' ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    position: 'initial',
    margin: HEADER_MARGIN,
    background: '#222222',
    width: 'initial',
    border: '1px solid #363636',
    //padding: `0px ${HEADER_PADDING}px`,
  },
  siteLogoCon: {
    display: 'flex',
    alignItems: 'center',
  },
  companyLogoCon: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 70em)': {
      //paddingLeft: 15
    },
  },
  
  siteLogo: {
    /* width: LOGO_WIDTH,
    maxWidth: 'calc(100% - 30px)', */
    height: '2.3rem',
    margin: '0px 15px 0 10px'
  }, 

  userLogo: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: `calc(${LEFT_PANEL_WIDTH}% - ${LOGO_WIDTH + ((HEADER_MARGIN + HEADER_PADDING) / 2)}px)`,
  },
  userLogoOfficial: {
    height: '2.3rem', /*28px */
    maxWidth: '100%'
  },
  organizationName: {
    marginLeft: 5,
    fontSize: 15,
  },

  toolbar: {
    padding: 0,
    height: 30,
    minHeight: 30,
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
  }
 
}))
