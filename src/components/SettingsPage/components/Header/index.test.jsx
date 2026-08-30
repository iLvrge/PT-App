import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TooltipProvider } from '../../../../ui/Tooltip'
import Header from './index'

const setup = (props = {}) =>
  render(
    <TooltipProvider>
      <Header
        title="Users"
        numSelected={0}
        search=""
        setSearch={() => {}}
        {...props}
      />
    </TooltipProvider>
  )

describe('SettingsPage Header', () => {
  it('shows the title when nothing is selected', () => {
    setup()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows the selected count instead of the title', () => {
    setup({ numSelected: 3 })
    expect(screen.getByText('3 Selected')).toBeInTheDocument()
  })

  it('renders the search box by default', () => {
    setup()
    expect(screen.getByLabelText('search')).toBeInTheDocument()
  })

  it('hides the search box when searchable is false', () => {
    // AddressChild and LawyerChild rely on this prop; it replaced a CSS hack
    // that targeted a JSS-generated class name.
    setup({ searchable: false })
    expect(screen.queryByLabelText('search')).not.toBeInTheDocument()
  })

  it('does not open the confirm dialog until delete is pressed', () => {
    setup({ numSelected: 2, onDelete: vi.fn() })
    expect(screen.queryByText('Remove Items')).not.toBeInTheDocument()
  })

  it('opens the Radix confirm dialog from the delete button', () => {
    setup({ numSelected: 2, onDelete: vi.fn() })
    fireEvent.click(screen.getByLabelText('delete'))
    expect(screen.getByText('Remove Items')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument()
  })

  it('calls onDelete only after confirming', () => {
    const onDelete = vi.fn()
    setup({ numSelected: 2, onDelete })
    fireEvent.click(screen.getByLabelText('delete'))
    expect(onDelete).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('OK'))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('closes without deleting when CANCEL is pressed', () => {
    const onDelete = vi.fn()
    setup({ numSelected: 2, onDelete })
    fireEvent.click(screen.getByLabelText('delete'))
    fireEvent.click(screen.getByText('CANCEL'))
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.queryByText('Remove Items')).not.toBeInTheDocument()
  })
})
