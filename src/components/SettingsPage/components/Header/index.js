import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import React, { Fragment, useCallback, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import StyledSearch from '../../../common/StyledSearch'
import clsx from 'clsx'

const Header = ({ onDelete, onAdd, onCheckable, numSelected, title, search, setSearch, childComponent, selectedType, searchable = true, dense = false }) => {

  const [ openDialog, setOpenDialog ] = useState(false)

  const deleteHandled = useCallback(() => {
    setOpenDialog(true)
  }, [])

  const onCloseDialog = useCallback(() => {
    setOpenDialog(false)
  }, [])

  const onConfirmDelete = useCallback((event) => {
    setOpenDialog(false)
    onDelete(event)
  }, [ onDelete ]) 
  return (
    <Fragment>

      <Dialog open={openDialog} onClose={onCloseDialog} className={"[&_.MuiDialogContent-root]:!px-6 [&_.MuiDialogContent-root]:!py-2 [&_.MuiDialogActions-root]:p-2"}>
        <DialogTitle id="alert-dialog-title">Remove Items</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove {numSelected} { typeof selectedType != 'undefined' ? selectedType.toLowerCase() : title.toLowerCase()}?
            {
              typeof selectedType != 'undefined' && selectedType.toLowerCase() != 'companies' && (
                <React.Fragment>
                  <Button
                    onClick={onConfirmDelete}
                  >Remove the group together with its entities</Button>
                  <Button
                    onClick={onConfirmDelete}
                  >Remove the group but keep its entities</Button>
                </React.Fragment>
              ) 
            }
          </DialogContentText>
        </DialogContent> 

        <DialogActions>
          <Button onClick={onCloseDialog}>
            CANCEL
          </Button>
          {
            (typeof selectedType != 'undefined' && selectedType.toLowerCase() == 'companies' || typeof selectedType == 'undefined') && (
              <Button onClick={onConfirmDelete} color="primary" variant={'contained'} autoFocus>
                OK
              </Button>
            )
          }
        </DialogActions>
      </Dialog>
      <Toolbar variant={dense ? 'dense' : 'regular'} className={clsx("bg-bg-paper", dense && 'h-10 min-h-0')}>
        <Typography className={"flex-[1_1_100%]"} variant="h6" id="tableTitle" component="div">
          {numSelected > 0 ? `${numSelected} Selected` : title}
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
        </Typography>
        
        {
          !onCheckable && numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={deleteHandled} size="large">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Fragment>
              {searchable && (
                <StyledSearch
                  value={search}
                  onChange={(e) => setSearch(e.target.value)} />
              )}

              {
                onAdd && (
                  <Tooltip title="Add">
                    <IconButton onClick={onAdd} size="large">
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
  );
}

export default Header
