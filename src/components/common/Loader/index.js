import React from 'react'
import useStyles from './styles'
import 'font-awesome/css/font-awesome.min.css'
import CircularProgress from '@material-ui/core/CircularProgress'

function Loader(props) {
  const classes = useStyles()

  return (

    <div className={classes.loaderContainer}>
      <CircularProgress />
    </div>
  )
};

export default Loader