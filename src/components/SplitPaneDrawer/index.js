import SplitPane from 'react-split-pane'
import clsx from 'clsx'
import CustomDrawer from '../CustomDrawer'
import React, { useCallback, useState } from 'react'
import useStyles from './styles'

const SplitPaneDrawer = ({ open, drawerChildren, mainChildren, defaultSize }) => {
  const classes = useStyles()
  const [ isDrag, setIsDrag ] = useState(false)
  const onDragStarted = useCallback(() => setIsDrag(true), [])
  const onDragFinished = useCallback(() => setIsDrag(false), [])

  return (
    <div className={classes.root}>
      <SplitPane
        className={clsx(classes.splitPane, {
          [classes.onDrag]: isDrag,
          [classes.hidePane1]: !open,
        })}
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        split="vertical"
        defaultSize={defaultSize || 400}
        minSize={250}
        maxSize={700}
      >
        <CustomDrawer open={open}>
          {drawerChildren}
        </CustomDrawer>

        {mainChildren}
      </SplitPane>
    </div>
  )
}

export default SplitPaneDrawer
