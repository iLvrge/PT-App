import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import React, { Fragment, useCallback, useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import useStyles from './styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import StyledSearch from '../../../common/StyledSearch'
import clsx from 'clsx'

const Header = ({ onDelete, onAdd, onCheckable, numSelected, title, search, setSearch, childComponent }) => {
  const classes = useStyles()

  const [ openDialog, setOpenDialog ] = useState(false)

  const deleteHandled = useCallback(() => {
    setOpenDialog(true)
  }, [])

  const onCloseDialog = useCallback(() => {
    setOpenDialog(false)
  }, [])

  const onConfirmDelete = useCallback(() => {
    setOpenDialog(false)
    onDelete()
  }, [ onDelete ])
  console.log(`typeof childComponent !== 'undefined' && childComponent.length > 0`, typeof childComponent, childComponent )
  return (
    <Fragment>
      <Dialog open={openDialog} onClose={onCloseDialog}>
        <DialogTitle id="alert-dialog-title">Delete Items</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove {numSelected} {title.toLowerCase()}?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseDialog} color="default">
            CANCEL
          </Button>
          <Button onClick={onConfirmDelete} color="primary" variant={'contained'} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Toolbar className={clsx(classes.root, /* { [classes.highlight]: numSelected > 0 } */)}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {numSelected > 0 ? `${numSelected} Selected` : title}
        </Typography>
        {
          typeof childComponent !== 'undefined' && childComponent.length > 0
          ?
            childComponent.map(
              ({component: Component, ...props }, index) => (
                  <Component key={index} {...props} />
              )
            )
          :
          ''
        }
        {
          !onCheckable && numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={deleteHandled}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Fragment>
              <StyledSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)} />

              {
                onAdd && (
                  <Tooltip title="Add">
                    <IconButton onClick={onAdd}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )
              }
            </Fragment>
          )
        }
      </Toolbar>
    </Fragment>
  )
}

export default Header
