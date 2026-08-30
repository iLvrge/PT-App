import React from 'react'
import cn from '../../ui/cn'

/**
 * Was a MUI Drawer with variant="permanent", but every meaningful style was
 * overridden to make it an in-flow panel: position relative, full height, and a
 * width transition. A plain element does that without the Drawer machinery.
 * Durations match the MUI defaults it replaced (225ms enter / 195ms leave).
 */
const CustomDrawer = ({ children, open }) => (
  <div
    className={cn(
      'relative h-full shrink-0 transition-[width] ease-[cubic-bezier(0.4,0,0.6,1)]',
      open ? 'duration-[225ms]' : 'w-0 overflow-x-hidden duration-[195ms]'
    )}
  >
    {children}
  </div>
)

export default CustomDrawer
