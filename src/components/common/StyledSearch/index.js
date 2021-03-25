import React from 'react'
import InputBase from '@material-ui/core/InputBase'
import useStyles from './styles'
import SearchIcon from '@material-ui/icons/Search'

const StyledSearch = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>

      <InputBase
        placeholder={'Search…'}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search', type: 'search' }}
        {...props}
      />
    </div>
  )
}

export default StyledSearch
