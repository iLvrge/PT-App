import React from 'react'
import cn from './cn'

const variants = {
  contained: 'bg-secondary text-white hover:opacity-90',
  outlined: 'border border-divider text-text-primary hover:bg-bg-default',
  text: 'text-text-primary hover:bg-bg-default',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-base',
}

const Button = React.forwardRef(
  ({ className, variant = 'text', size = 'md', disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded font-medium transition-opacity',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        'disabled:cursor-not-allowed disabled:text-action-disabled disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export default Button
