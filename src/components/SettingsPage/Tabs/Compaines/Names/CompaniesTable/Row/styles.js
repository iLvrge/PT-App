import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(() => ({
  expand: {
    /* backgroundColor: 'rgba(255, 255, 255, 0.08)' */
  },
  collapsedCell: {
    padding: 0,
    /* backgroundColor: 'rgb(41 41 41)', */
    paddingLeft: '36px !important',
    '& td':{
      padding: 0
    }
  },
  cell: {
    padding: 8
  },
  box: {
    margin: '0 0 -1px 19px',
    maxHeight: 400,
    overflow: 'auto'
  },
  actionCell: {
    width: 20,
    padding: 8
  },
  padLR0:{
    paddingLeft: 0,
    padingRight: 0
  },
}))