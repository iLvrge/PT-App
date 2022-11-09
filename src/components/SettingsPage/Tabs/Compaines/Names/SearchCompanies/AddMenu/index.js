import React, { Fragment, useCallback } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { NestedMenuItem } from 'mui-nested-menu'
import { useSelector } from 'react-redux'
import AddIcon from '@mui/icons-material/Add'
import LayersIcon from '@mui/icons-material/Layers'
import useStyles from './styles'

const AddMenu = ({ anchorEl, onClose, createParent, associateToParent }) => {
  const companiesList = useSelector(state => state.patenTrack2.companiesList)
  const classes = useStyles()

  const onAction = useCallback((action) => () => {
    onClose()
    action()
  }, [ onClose ])

  return (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',  
      }}>

      <MenuItem onClick={onAction(createParent)}>
        <AddIcon className={classes.icon} />
          Import
      </MenuItem>

      <NestedMenuItem
        label={
          <Fragment>
            <LayersIcon className={classes.icon} />
            Import into group
          </Fragment>
        }
        parentMenuOpen={!!anchorEl}
        onClick={onClose}>
        {(companiesList || []).map(company => {
          return company.type == 1 
            ?
              <MenuItem key={company.id} onClick={onAction(associateToParent(company))}>{
                company.representative_name === null
                  ? company.original_name
                  : company.representative_name
              }
              </MenuItem>
            :
             ''
        })}        
      </NestedMenuItem>
    </Menu>
  )
}

export default AddMenu
