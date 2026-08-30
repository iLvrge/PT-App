import React from 'react'
import * as Radix from '@radix-ui/react-dropdown-menu'
import cn from './cn'

export const DropdownMenu = Radix.Root
export const DropdownMenuTrigger = Radix.Trigger

const panel =
  'z-50 min-w-[10rem] overflow-hidden rounded-md border border-divider bg-bg-paper p-1 text-text-primary shadow-lg'

export const DropdownMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <Radix.Portal>
    <Radix.Content ref={ref} sideOffset={4} className={cn(panel, className)} {...props} />
  </Radix.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <Radix.Item
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none',
      'focus:bg-bg-default data-[disabled]:pointer-events-none data-[disabled]:text-action-disabled',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuSeparator = ({ className }) => (
  <Radix.Separator className={cn('my-1 h-px bg-divider', className)} />
)
