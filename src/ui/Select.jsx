import React from 'react'
import * as Radix from '@radix-ui/react-select'
import cn from './cn'

export const Select = Radix.Root
export const SelectValue = Radix.Value

export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <Radix.Trigger
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-between gap-2 rounded border border-divider',
      'bg-bg-paper px-3 text-sm text-text-primary outline-none',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
      'data-[disabled]:text-action-disabled',
      className
    )}
    {...props}
  >
    {children}
    <Radix.Icon aria-hidden>▾</Radix.Icon>
  </Radix.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

export const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <Radix.Portal>
    <Radix.Content
      ref={ref}
      position="popper"
      sideOffset={4}
      className={cn(
        'z-50 overflow-hidden rounded-md border border-divider bg-bg-paper text-text-primary shadow-lg',
        className
      )}
      {...props}
    >
      <Radix.Viewport className="p-1">{children}</Radix.Viewport>
    </Radix.Content>
  </Radix.Portal>
))
SelectContent.displayName = 'SelectContent'

export const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <Radix.Item
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm outline-none',
      'focus:bg-bg-default data-[disabled]:pointer-events-none data-[disabled]:text-action-disabled',
      className
    )}
    {...props}
  >
    <Radix.ItemText>{children}</Radix.ItemText>
  </Radix.Item>
))
SelectItem.displayName = 'SelectItem'
