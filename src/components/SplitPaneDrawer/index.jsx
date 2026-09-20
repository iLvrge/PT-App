import React, { useCallback, useState } from 'react'
import SplitPane from 'react-split-pane'
import CustomDrawer from '../CustomDrawer'
import cn from '../../ui/cn'

/**
 * .Resizer and .Pane1 are react-split-pane's own class names, so they are
 * addressed with arbitrary variants rather than a stylesheet. They stay until
 * the split-pane layer itself is replaced - see MIGRATION_PLAN.md section 4b.
 *
 * Collapsing is still width:0 on Pane 1 rather than a library feature; the
 * transition is disabled mid-drag so the pane tracks the cursor exactly.
 */
const RESIZER =
  '[&_.Resizer]:h-full [&_.Resizer]:w-[3px] [&_.Resizer]:z-[3] [&_.Resizer]:bg-none ' +
  '[&_.Resizer]:opacity-100 [&_.Resizer]:cursor-col-resize [&_.Resizer]:box-border ' +
  '[&_.Resizer]:bg-clip-padding [&_.Resizer:hover]:bg-[#E91E63]'

const SplitPaneDrawer = ({ open, drawerChildren, mainChildren, defaultSize }) => {
  const [ isDrag, setIsDrag ] = useState(false)
  const onDragStarted = useCallback(() => setIsDrag(true), [])
  const onDragFinished = useCallback(() => setIsDrag(false), [])

  return (
    <div className="flex h-full overflow-hidden">
      <SplitPane
        className={cn(
          '!relative',
          RESIZER,
          '[&_.Pane1]:transition-[width] [&_.Pane1]:duration-300',
          isDrag && '[&_.Pane1]:!transition-none',
          !open && '[&_.Pane1]:!w-0 [&_.Resizer]:!hidden'
        )}
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        split="vertical"
        defaultSize={defaultSize || 400}
        minSize={315}
        maxSize={700}
      >
        <CustomDrawer open={open}>{drawerChildren}</CustomDrawer>
        {mainChildren}
      </SplitPane>
    </div>
  )
}

export default SplitPaneDrawer
