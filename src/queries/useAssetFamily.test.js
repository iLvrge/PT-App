import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAssetFamily from './useAssetFamily'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({ default: { assetFamily: vi.fn() } }))

const probe = (asset) => {
  const result = { current: undefined }
  const Probe = () => { result.current = useAssetFamily(asset); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

beforeEach(() => vi.clearAllMocks())

describe('useAssetFamily', () => {
  it('does not fire without an asset', async () => {
    probe('')
    await waitFor(() => expect(PatenTrackApi.assetFamily).not.toHaveBeenCalled())
  })

  it('formats patent and application numbers with the country prefix', async () => {
    PatenTrackApi.assetFamily.mockResolvedValue({
      data: [ { publication_country: 'US', patent_number: '1234567', application_number: '10123456' } ],
    })
    const r = probe('A1')
    await waitFor(() => expect(r.current.data).toBeTruthy())
    expect(r.current.data[0].patent_number).toBe('US 1,234,567')
    expect(r.current.data[0].application_number).toMatch(/^US /)
  })

  it('renders empty strings rather than "null" for missing numbers', async () => {
    PatenTrackApi.assetFamily.mockResolvedValue({
      data: [ { publication_country: 'US', patent_number: null, application_number: null } ],
    })
    const r = probe('A1')
    await waitFor(() => expect(r.current.data).toBeTruthy())
    expect(r.current.data[0].patent_number).toBe('')
    expect(r.current.data[0].application_number).toBe('')
  })

  it('does not mutate the response array', async () => {
    // The effect this replaces wrote formatting back into the API response
    // in place, so the same object was both source and result.
    const row = { publication_country: 'US', patent_number: '1234567', application_number: null }
    PatenTrackApi.assetFamily.mockResolvedValue({ data: [ row ] })
    const r = probe('A1')
    await waitFor(() => expect(r.current.data).toBeTruthy())
    expect(row.patent_number).toBe('1234567')
  })

  it('returns an array when the API returns a non-array', async () => {
    PatenTrackApi.assetFamily.mockResolvedValue({ data: null })
    const r = probe('A1')
    await waitFor(() => expect(r.current.data).toEqual([]))
  })
})
