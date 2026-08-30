import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import usePartyAssets from './usePartyAssets'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({
  default: { getCustomerAssets: vi.fn(), getAssetTypeAssignments: vi.fn() },
}))

const probe = (variant, args) => {
  const result = { current: undefined }
  const Probe = () => { result.current = usePartyAssets(variant, args); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

beforeEach(() => vi.clearAllMocks())

describe('usePartyAssets', () => {
  it('does not fire without a party id', async () => {
    probe('customerAssets', { partiesId: 0 })
    await waitFor(() => expect(PatenTrackApi.getCustomerAssets).not.toHaveBeenCalled())
  })

  it('routes the customerAssets variant to getCustomerAssets', async () => {
    PatenTrackApi.getCustomerAssets.mockResolvedValue({ data: { list: [] } })
    probe('customerAssets', { partiesId: 5 })
    await waitFor(() => expect(PatenTrackApi.getCustomerAssets).toHaveBeenCalled())
    expect(PatenTrackApi.getAssetTypeAssignments).not.toHaveBeenCalled()
  })

  it('routes the assetTypeAssignments variant to the other endpoint', async () => {
    PatenTrackApi.getAssetTypeAssignments.mockResolvedValue({ data: { list: [] } })
    probe('assetTypeAssignments', { partiesId: 5 })
    await waitFor(() => expect(PatenTrackApi.getAssetTypeAssignments).toHaveBeenCalled())
    expect(PatenTrackApi.getCustomerAssets).not.toHaveBeenCalled()
  })

  it('sends an empty company list when the select-all flag is set', async () => {
    PatenTrackApi.getAssetTypeAssignments.mockResolvedValue({ data: { list: [] } })
    probe('assetTypeAssignments', {
      partiesId: 5, selectedCompanies: [ 1, 2 ], selectedCompaniesAll: true,
    })
    await waitFor(() => expect(PatenTrackApi.getAssetTypeAssignments).toHaveBeenCalled())
    expect(PatenTrackApi.getAssetTypeAssignments.mock.calls[0][0]).toEqual([])
  })

  it('always yields an object with a list, so response?.list is safe', async () => {
    PatenTrackApi.getAssetTypeAssignments.mockResolvedValue({ data: null })
    const r = probe('assetTypeAssignments', { partiesId: 5 })
    await waitFor(() => expect(r.current.data).toEqual({ list: [] }))
  })

  it('passes the party id through as the customers argument', async () => {
    PatenTrackApi.getAssetTypeAssignments.mockResolvedValue({ data: { list: [] } })
    probe('assetTypeAssignments', { partiesId: 42 })
    await waitFor(() => expect(PatenTrackApi.getAssetTypeAssignments).toHaveBeenCalled())
    expect(PatenTrackApi.getAssetTypeAssignments.mock.calls[0][2]).toEqual([ 42 ])
  })
})
