import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(() => ({
  // Toolbar height and search visibility are now Page props. These two remain
  // because they target ids rendered by Page's header child component.
  childrenTable: {
    '& #mutiple-checkbox-label': { display: 'inline' },
    '& #mutiple-checkbox': { minWidth: '100px' },
  },
}))
