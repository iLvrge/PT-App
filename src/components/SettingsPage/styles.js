import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap !important',
    overflowX: 'hidden',
    overflowY: 'hidden',
    padding: 5
  },
  settings: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabPanel: {
    flex: 1,
    overflow: 'hidden',
  },
  subTabs: {
    display: 'flex',
    flexDirection: 'column',
    background: '#222222'
  },
  hideIndicator: {
    display: 'none',
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  listItemText: {
    margin: '4px 20px',
  }
}))
