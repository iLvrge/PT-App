import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& .MuiGrid-container': {
      justifyContent: 'flex-end',
      paddingRight: '8px'
    },
    '& .MuiGrid-item':{
      padding: '4px 2px',
      flexGrow: 1 
    }
  },
  assetsCounterContainer: {
    display: 'inline-block',
  },
  assetsCounterNumber: {
    // fontSize: 20,
  },
  assetsCounterLabel: {
    // fontSize: '0.8125rem',
  },
  summaryItemContainer: {
    display: 'flex',
    border: '1px solid #424242',
    margin: '0',
    padding: '9px 11px',
    boxShadow: '0 0 2px 0 #424242',
    background: '#222222',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  cell: {
    '&:not(:first-child)': {
      marginLeft: 12,
      '@media (max-width: 70em)': {
        marginLeft: 6,
      },
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  /* label: {
    fontSize: '0.875rem',
    '@media (max-width: 70em)': {
      fontSize: '0.725rem',
    },
  }, */
  flexEnd: {
    alignItems: 'flex-end',
  },
  summaryItemTotal: {
    display: 'flex',
    alignItems: 'center',
  },
  /* summaryItemTotalNumber: {
    fontSize: '0.875rem',
    '@media (max-width: 70em)': {
      fontSize: '0.725rem',
    },
  }, */
  summaryItemTotalNumberFromLastYear: {
    /*fontSize: '0.9375rem',
    '@media (max-width: 70em)': {
      fontSize: '0.75rem',
    },*/
  },
  summaryItemTotalGrowth: {
    /*fontSize: '0.8125rem',
    '@media (max-width: 70em)': {
      fontSize: '0.625rem',
    },*/
    display: 'flex',
    alignItems: 'center',
  },
}))
