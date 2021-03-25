import makeStyles from '@material-ui/core/styles/makeStyles'

export default makeStyles(() => ({
  expand: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  collapsedCell: {
    padding: 0,
    backgroundColor: 'rgb(41 41 41)',
    paddingLeft: '36px !important',
  },
  cell: {
    padding: 8
  },
  box: {
    margin: '0 0 -1px 19px',
  },
  actionCell: {
    width: 20,
    padding: 8
  },
}))