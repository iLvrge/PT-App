import { makeStyles, fade } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  actionTh: {
    width: 50,
  },
  table: {
    backgroundColor: theme.palette.background.default,
    '& th': {
      '&.MuiTableCell-stickyHeader': {
        backgroundColor: '#292929',
      },
      '&:first-child': {
        paddingLeft: 16
      },
    },
    '& td': {
      '&:first-child': {
        paddingLeft: 16
      },
    }
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  context: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    border: '1px solid #363636',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    width: '100%',
    textAlign: 'left',
    display: 'block',
    color: 'inherit',
    padding: '23px 10px 3px 23px',
    borderBottom: '1px solid #000',
  },
  list: {
    height: '100%',
    padding: '0.375rem !important',
    margin: 0,
  },
  listItem: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: '#d6d6d6',
    padding: '0.375rem 0 0 0.375rem !important',
    margin: 0,
    fontStyle: 'normal',
    lineHeight: 1.5,
    '& svg': {
      position: 'relative',
      top: '4px',
    },
    '& ul': {
      '& li': {
        marginBottom: '10px',
      },
    },
  },
  selected_company: {
    color: '#E60000',
    fontWeight: 'bold',
  },
  selected_sub_company: {
    color: '#70A800',
    fontWeight: 'bold',
  },
  children: {
    listStyle: 'none',
    paddingLeft: '25px',
    marginTop: '7px',
  },
  delete: {
    color: '#E60000',
    cursor: 'pointer',
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    marginTop: '4px',
  },
  paddingRight20: {
    paddingRight: '20px !important',
  },
  actions: {
    // height: 100,
    width: '100%',
    display: 'flex',
    marginBottom: 20,
  },
  searchInput: {
    margin: '0 10px',
    width: 150,
  },
  searchCompanies: {
    width: 200,
    marginRight: 20,
    background: 'yellow',
  },
  appBar: {
    background: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create([ 'width', 'margin' ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
}))
