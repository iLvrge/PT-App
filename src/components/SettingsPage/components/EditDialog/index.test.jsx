import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditDialog from './index'

const Fields = ({ edited, onChangeField }) => (
  <input aria-label="name" value={edited.name || ''} onChange={onChangeField('name')} />
)

const setup = (props = {}) =>
  render(
    <EditDialog
      setEditedRow={() => {}}
      editedRow={null}
      onSubmit={vi.fn()}
      fieldsComponent={Fields}
      name="user"
      idKey="user_id"
      {...props}
    />
  )

describe('EditDialog', () => {
  it('renders nothing while editedRow is null', () => {
    setup()
    expect(screen.queryByLabelText('name')).not.toBeInTheDocument()
  })

  it('opens with a New title for a row without an id', () => {
    setup({ editedRow: {} })
    expect(screen.getByText('New user')).toBeInTheDocument()
  })

  it('opens with an Edit title for an existing row', () => {
    setup({ editedRow: { user_id: 7, name: 'Ada' } })
    expect(screen.getByText('Edit user')).toBeInTheDocument()
  })

  it('renders the fields component once open', () => {
    // Previously gated on MUI's transition onEnter; Radix mounts on open.
    setup({ editedRow: { name: 'Ada' } })
    expect(screen.getByLabelText('name')).toHaveValue('Ada')
  })

  it('works on a deep copy, so editing does not mutate the source row', () => {
    const row = { name: 'Ada' }
    setup({ editedRow: row })
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Grace' } })
    expect(row.name).toBe('Ada')
  })

  it('submits the edited values and then closes', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const setEditedRow = vi.fn()
    setup({ editedRow: { name: 'Ada' }, onSubmit, setEditedRow })
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Grace' } })
    fireEvent.click(screen.getByText('CREATE'))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'Grace' }))
    await waitFor(() => expect(setEditedRow).toHaveBeenCalledWith(null))
  })

  it('labels the button SAVE when editing an existing row', () => {
    setup({ editedRow: { user_id: 7, name: 'Ada' } })
    expect(screen.getByText('SAVE')).toBeInTheDocument()
  })

  it('closes without submitting when Close is pressed', () => {
    const onSubmit = vi.fn()
    const setEditedRow = vi.fn()
    setup({ editedRow: { name: 'Ada' }, onSubmit, setEditedRow })
    fireEvent.click(screen.getByText('Close'))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(setEditedRow).toHaveBeenCalledWith(null)
  })
})
