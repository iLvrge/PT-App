import Drawer from '@material-ui/core/Drawer'
import clsx from 'clsx'
import React from 'react'
import useStyles from './styles'

const CustomDrawer = ({ children, open }) => {
  const classes = useStyles()

  return (
    <Drawer
      variant="permanent"
      className={clsx({
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        docked: classes.docked,
        paper: clsx(classes.drawerPaper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}>
      {children}
    </Drawer>
  )
}

export default CustomDrawer
