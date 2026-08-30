import React from 'react'
import * as Radix from '@radix-ui/react-tabs'
import cn from './cn'

export const Tabs = Radix.Root

export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <Radix.List ref={ref} className={cn('flex items-center gap-1 border-b border-divider', className)} {...props} />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <Radix.Trigger
    ref={ref}
    className={cn(
      'px-3 py-2 text-sm text-text-primary opacity-70 outline-none transition-opacity',
      'border-b-2 border-transparent hover:opacity-100',
      'data-[state=active]:border-secondary data-[state=active]:text-text-active data-[state=active]:opacity-100',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = Radix.Content
