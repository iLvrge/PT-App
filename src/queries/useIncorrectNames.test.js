import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useIncorrectNames from './useIncorrectNames'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({ default: { getIncorrectNames: vi.fn() } }))

const probe = (args) => {
  const result = { current: undefined }
  const Probe = () => { result.current = useIncorrectNames(args); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

beforeEach(() => vi.clearAllMocks())

describe('useIncorrectNames', () => {
  it('does not fire with no companies and no select-all', async () => {
    probe({ selectedCompanies: [], selectedCompaniesAll: false })
    await waitFor(() => expect(PatenTrackApi.getIncorrectNames).not.toHaveBeenCalled())
  })

  it('fires with an empty list when select-all is set', async () => {
    PatenTrackApi.getIncorrectNames.mockResolvedValue({ data: [] })
    probe({ selectedCompanies: [ 1, 2 ], selectedCompaniesAll: true })
    await waitFor(() => expect(PatenTrackApi.getIncorrectNames).toHaveBeenCalledWith([]))
  })

  it('maps distance to the word-cloud value as 40 + distance * 2', async () => {
    PatenTrackApi.getIncorrectNames.mockResolvedValue({
      data: [ { name: 'Acme', distance: 3, id: 9 } ],
    })
    const r = probe({ selectedCompanies: [ 1 ] })
    await waitFor(() => expect(r.current.data).toBeTruthy())
    expect(r.current.data.namesData).toEqual([ { text: 'Acme', value: 46 } ])
  })

  it('keeps the raw rows alongside, since clicks look ids up in them', async () => {
    const row = { name: 'Acme', distance: 1, id: 9 }
    PatenTrackApi.getIncorrectNames.mockResolvedValue({ data: [ row ] })
    const r = probe({ selectedCompanies: [ 1 ] })
    await waitFor(() => expect(r.current.data).toBeTruthy())
    expect(r.current.data.rawData).toEqual([ row ])
  })

  it('yields empty arrays when the API returns a non-array', async () => {
    PatenTrackApi.getIncorrectNames.mockResolvedValue({ data: null })
    const r = probe({ selectedCompanies: [ 1 ] })
    await waitFor(() => expect(r.current.data).toEqual({ rawData: [], namesData: [] }))
  })
})
