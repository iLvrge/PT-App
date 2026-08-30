import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChangeNameDialog from './ChangeNameDialog'

const setup = (props = {}) =>
  render(
    <ChangeNameDialog
      open
      onClose={vi.fn()}
      onChangeName={vi.fn()}
      onSubmit={vi.fn()}
      {...props}
    />
  )

describe('ChangeNameDialog', () => {
  it('renders nothing when closed', () => {
    setup({ open: false })
    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument()
  })

  it('is labelled, unlike the two modals it replaced', () => {
    // Both originals pointed aria-labelledby at a Change-Name-Modal id that
    // exists nowhere in the codebase.
    setup()
    expect(screen.getByText('Change company name')).toBeInTheDocument()
  })

  it('reports typing through onChangeName', () => {
    const onChangeName = vi.fn()
    setup({ onChangeName })
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Acme' } })
    expect(onChangeName).toHaveBeenCalled()
  })

  it('submits through onSubmit', () => {
    const onSubmit = vi.fn()
    setup({ onSubmit })
    fireEvent.click(screen.getByText('Submit'))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('passes the caller class names through, since the two call sites differ', () => {
    const { container } = setup({ formClassName: 'form-x', buttonClassName: 'btn-y' })
    expect(container.ownerDocument.querySelector('form.form-x')).toBeTruthy()
    expect(container.ownerDocument.querySelector('.btn-y')).toBeTruthy()
  })

  it('tolerates an undefined button class, which is what ActionMenu passes', () => {
    expect(() => setup({ buttonClassName: undefined })).not.toThrow()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
