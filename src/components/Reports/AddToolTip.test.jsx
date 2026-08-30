import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TooltipProvider } from '../../ui/Tooltip'
import AddToolTip from './AddToolTip'

const withProvider = (ui) => render(<TooltipProvider>{ui}</TooltipProvider>)

describe('AddToolTip', () => {
  it('renders its child', () => {
    withProvider(<AddToolTip tooltip="explain"><button>press</button></AddToolTip>)
    expect(screen.getByRole('button', { name: 'press' })).toBeInTheDocument()
  })

  it('passes the child straight through when there is no tooltip text', () => {
    // Several call sites pass a possibly-empty tooltip; the child must survive.
    withProvider(<AddToolTip tooltip=""><button>bare</button></AddToolTip>)
    expect(screen.getByRole('button', { name: 'bare' })).toBeInTheDocument()
  })

  it('marks the child as a tooltip trigger when text is present', () => {
    withProvider(<AddToolTip tooltip="explain"><button>press</button></AddToolTip>)
    // Radix describes the trigger; MUI did the same via aria-describedby on open.
    expect(screen.getByRole('button', { name: 'press' })).toHaveAttribute('data-state')
  })

  it('does not wrap the child in an extra element', () => {
    const { container } = withProvider(
      <AddToolTip tooltip="explain"><button>press</button></AddToolTip>
    )
    expect(container.firstChild.tagName).toBe('BUTTON')
  })

  it.each([ 'bottom', 'top', 'left', 'right' ])('accepts placement=%s', (placement) => {
    withProvider(
      <AddToolTip tooltip="explain" placement={placement}><button>press</button></AddToolTip>
    )
    expect(screen.getByRole('button', { name: 'press' })).toBeInTheDocument()
  })
})
