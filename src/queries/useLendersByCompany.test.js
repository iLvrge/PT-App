import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useLendersByCompany from './useLendersByCompany'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({
  default: { getLendersByCompany: vi.fn() },
}))

const probe = (companies) => {
  const result = { current: undefined }
  const Probe = () => { result.current = useLendersByCompany(companies); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

beforeEach(() => vi.clearAllMocks())

describe('useLendersByCompany', () => {
  it('does not fire with no companies selected', async () => {
    probe([])
    await waitFor(() => expect(PatenTrackApi.getLendersByCompany).not.toHaveBeenCalled())
  })

  it('passes the selection straight through', async () => {
    PatenTrackApi.getLendersByCompany.mockResolvedValue({ data: [ { id: 1 } ] })
    const r = probe([ 3, 4 ])
    await waitFor(() => expect(PatenTrackApi.getLendersByCompany).toHaveBeenCalledWith([ 3, 4 ]))
    await waitFor(() => expect(r.current.data).toEqual([ { id: 1 } ]))
  })

  it('returns an array when the API returns nothing, so rows.length is safe', async () => {
    // The component derives grandTotal from rows.length; undefined would throw.
    PatenTrackApi.getLendersByCompany.mockResolvedValue({ data: null })
    const r = probe([ 1 ])
    await waitFor(() => expect(r.current.data).toEqual([]))
  })

  it('caches per selection rather than refetching for the same one', async () => {
    PatenTrackApi.getLendersByCompany.mockResolvedValue({ data: [] })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const Probe = () => { useLendersByCompany([ 7 ]); return null }
    render(
      <QueryClientProvider client={client}>
        <Probe /><Probe />
      </QueryClientProvider>
    )
    await waitFor(() => expect(PatenTrackApi.getLendersByCompany).toHaveBeenCalled())
    expect(PatenTrackApi.getLendersByCompany).toHaveBeenCalledTimes(1)
  })
})
