import React from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import cn from './cn'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

export const DialogContent = React.forwardRef(
  ({ className, children, title, description, ...props }, ref) => (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <RadixDialog.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2',
          'overflow-auto rounded-lg bg-bg-paper text-text-primary shadow-xl outline-none',
          'border border-divider p-5',
          className
        )}
        {...props}
      >
        {/* Radix requires a title for screen readers; hide it when unused visually. */}
        <RadixDialog.Title className={title ? 'mb-2 text-lg font-semibold' : 'sr-only'}>
          {title || 'Dialog'}
        </RadixDialog.Title>
        {description && (
          <RadixDialog.Description className="mb-4 text-sm opacity-70">
            {description}
          </RadixDialog.Description>
        )}
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
)
DialogContent.displayName = 'DialogContent'
