import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useLawFirmNames from './useLawFirmNames'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({ default: { getLawFirmsByCompany: vi.fn() } }))

const probe = (args) => {
  const result = { current: undefined }
  const Probe = () => { result.current = useLawFirmNames(args); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

const randomSize = () => 33

beforeEach(() => vi.clearAllMocks())

describe('useLawFirmNames', () => {
  it('passes the selected law firm as a second argument', async () => {
    // The same endpoint is called with one argument by useLawFirmsByCompany.
    PatenTrackApi.getLawFirmsByCompany.mockResolvedValue({ data: [] })
    probe({ selectedCompanies: [ 1 ], selectedLawFirm: 7, randomSize })
    await waitFor(() =>
      expect(PatenTrackApi.getLawFirmsByCompany).toHaveBeenCalledWith([ 1 ], 7))
  })

  it('uses the row distance as the word size when present', async () => {
    PatenTrackApi.getLawFirmsByCompany.mockResolvedValue({
      data: [ { lawfirm: 'Acme LLP', distance: 12 } ],
    })
    const r = probe({ selectedCompanies: [ 1 ], randomSize })
    await waitFor(() => expect(r.current.data).toBeTruthy())
    expect(r.current.data.namesData).toEqual([ { text: 'Acme LLP', value: 12 } ])
  })

  it('falls back to a random size when the row has no distance', async () => {
    PatenTrackApi.getLawFirmsByCompany.mockResolvedValue({ data: [ { lawfirm: 'Beta LLP' } ] })
    const r = probe({ selectedCompanies: [ 1 ], randomSize })
    await waitFor(() => expect(r.current.data).toBeTruthy())
    expect(r.current.data.namesData).toEqual([ { text: 'Beta LLP', value: 33 } ])
  })

  it('does not fire with no companies and no select-all', async () => {
    probe({ selectedCompanies: [], selectedCompaniesAll: false, randomSize })
    await waitFor(() => expect(PatenTrackApi.getLawFirmsByCompany).not.toHaveBeenCalled())
  })

  it('yields empty arrays for a non-array response', async () => {
    PatenTrackApi.getLawFirmsByCompany.mockResolvedValue({ data: null })
    const r = probe({ selectedCompanies: [ 1 ], randomSize })
    await waitFor(() => expect(r.current.data).toEqual({ rawData: [], namesData: [] }))
  })
})
