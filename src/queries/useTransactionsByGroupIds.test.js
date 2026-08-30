import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useTransactionsByGroupIds from './useTransactionsByGroupIds'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({ default: { getTransactionByRfIds: vi.fn() } }))

const probe = (ids) => {
  const result = { current: undefined }
  const Probe = () => { result.current = useTransactionsByGroupIds(ids); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

beforeEach(() => vi.clearAllMocks())

describe('useTransactionsByGroupIds', () => {
  it('does not fire for an empty id list', async () => {
    probe([])
    await waitFor(() => expect(PatenTrackApi.getTransactionByRfIds).not.toHaveBeenCalled())
  })

  it('posts the ids as a JSON array in group_ids', async () => {
    PatenTrackApi.getTransactionByRfIds.mockResolvedValue({ data: { list: [] } })
    probe([ '11', '22' ])
    await waitFor(() => expect(PatenTrackApi.getTransactionByRfIds).toHaveBeenCalled())
    const form = PatenTrackApi.getTransactionByRfIds.mock.calls[0][0]
    expect(form.get('group_ids')).toBe('["11","22"]')
  })

  it('unwraps the list from the response', async () => {
    PatenTrackApi.getTransactionByRfIds.mockResolvedValue({ data: { list: [ { rf_id: 5 } ] } })
    const r = probe([ '1' ])
    await waitFor(() => expect(r.current.data).toEqual([ { rf_id: 5 } ]))
  })

  it('returns an array when the response has no list', async () => {
    // The old code did setAssignments(data.list) unguarded, which would have
    // set undefined and broken the table's rows prop.
    PatenTrackApi.getTransactionByRfIds.mockResolvedValue({ data: {} })
    const r = probe([ '1' ])
    await waitFor(() => expect(r.current.data).toEqual([]))
  })

  it('refetches when the id set changes', async () => {
    PatenTrackApi.getTransactionByRfIds.mockResolvedValue({ data: { list: [] } })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const Probe = ({ ids }) => { useTransactionsByGroupIds(ids); return null }
    const { rerender } = render(
      <QueryClientProvider client={client}><Probe ids={[ '1' ]} /></QueryClientProvider>
    )
    await waitFor(() => expect(PatenTrackApi.getTransactionByRfIds).toHaveBeenCalledTimes(1))
    rerender(<QueryClientProvider client={client}><Probe ids={[ '2' ]} /></QueryClientProvider>)
    await waitFor(() => expect(PatenTrackApi.getTransactionByRfIds).toHaveBeenCalledTimes(2))
  })
})
