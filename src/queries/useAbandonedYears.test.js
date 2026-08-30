import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAbandonedYears from './useAbandonedYears'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({
  default: { getAllAbandonedAssetsYears: vi.fn() },
}))

const probe = (args) => {
  const result = { current: undefined }
  const Probe = () => { result.current = useAbandonedYears(args); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

const formOf = () => {
  const form = PatenTrackApi.getAllAbandonedAssetsYears.mock.calls[0][0]
  return Object.fromEntries([ ...form.entries() ])
}

beforeEach(() => vi.clearAllMocks())

describe('useAbandonedYears', () => {
  it('does not fire without any selected company', async () => {
    probe({ selectedCompanies: [] })
    await waitFor(() => expect(PatenTrackApi.getAllAbandonedAssetsYears).not.toHaveBeenCalled())
  })

  it('sends an empty list when the "select all" flag is set', async () => {
    PatenTrackApi.getAllAbandonedAssetsYears.mockResolvedValue({ data: [] })
    probe({
      selectedCompanies: [ 1 ],
      assetTypesSelectAll: true,
      assetTypesSelected: [ 9, 8 ],
    })
    await waitFor(() => expect(PatenTrackApi.getAllAbandonedAssetsYears).toHaveBeenCalled())
    expect(formOf().tabs).toBe('[]')
  })

  it('sends the selection when the "select all" flag is not set', async () => {
    PatenTrackApi.getAllAbandonedAssetsYears.mockResolvedValue({ data: [] })
    probe({
      selectedCompanies: [ 1 ],
      assetTypesSelectAll: false,
      assetTypesSelected: [ 9, 8 ],
    })
    await waitFor(() => expect(PatenTrackApi.getAllAbandonedAssetsYears).toHaveBeenCalled())
    expect(formOf().tabs).toBe('[9,8]')
  })

  it('returns an empty array when the API returns no data', async () => {
    PatenTrackApi.getAllAbandonedAssetsYears.mockResolvedValue({ data: null })
    const r = probe({ selectedCompanies: [ 1 ] })
    await waitFor(() => expect(r.current.data).toEqual([]))
  })

  it('exposes a loading state for the whole request, not just its start', async () => {
    // The Redux flag it replaces was set to true before the await, so the
    // spinner vanished while the request was still running.
    let resolve
    PatenTrackApi.getAllAbandonedAssetsYears.mockReturnValue(new Promise((r) => { resolve = r }))
    const r = probe({ selectedCompanies: [ 1 ] })
    await waitFor(() => expect(r.current.isFetching).toBe(true))
    resolve({ data: [ [ 'y', 1 ], [ '2020', 2 ] ] })
    await waitFor(() => expect(r.current.isFetching).toBe(false))
  })
})
