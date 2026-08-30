import React from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import cn from './cn'

export const TooltipProvider = RadixTooltip.Provider

/** Drop-in for MUI's <Tooltip title=...>: wraps a single focusable child. */
const Tooltip = ({ title, children, side = 'top', delayDuration = 200, className }) => {
  if (!title) return children
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 max-w-xs rounded bg-bg-paper px-2 py-1 text-xs text-text-primary',
            'border border-divider shadow-md',
            className
          )}
        >
          {title}
          <RadixTooltip.Arrow className="fill-[var(--pt-bg-paper)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

export default Tooltip
