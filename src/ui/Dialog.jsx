import React from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import cn from './cn'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

export const DialogContent = React.forwardRef(
  ({ className, children, title, description, hideTitle, ...props }, ref) => (
    <RadixDialog.Portal>
      {/* z-[10000000], not Radix's z-50. This app stacks its own chrome very
          high - TitleBar sits at 9999999, the header at 1206 - so a dialog at
          50 renders underneath them: the header icons, the left rail and the
          companies column all painted on top of the fullscreen chart. The MUI
          Modal this replaced sat in a different stacking arrangement and did
          not have to compete. One above the app's highest is the only value
          that reliably wins. */}
      <RadixDialog.Overlay className="fixed inset-0 z-[10000000] bg-black/50" />
      <RadixDialog.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-[10000000] max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2',
          'overflow-auto rounded-lg bg-bg-paper text-text-primary shadow-xl outline-none',
          'border border-divider p-5',
          className
        )}
        {...props}
      >
        {/* Radix requires a title for screen readers, so there is always one.
            `hideTitle` keeps it announced but out of the layout: the content
            here replaced an MUI Modal that drew no heading, and a rendered
            <h2> is a flex sibling - in the fullscreen chart it took 112px of
            width and pushed the chart 136px to the right. */}
        <RadixDialog.Title className={title && !hideTitle ? 'mb-2 text-lg font-semibold' : 'sr-only'}>
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
