import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useLendersByCompany from './useLendersByCompany'
import useLawFirmsByCompany from './useLawFirmsByCompany'
import useCustomerAddresses from './useCustomerAddresses'
import PatenTrackApi from '../api/patenTrack2'

vi.mock('../api/patenTrack2', () => ({
  default: {
    getLendersByCompany: vi.fn(),
    getLawFirmsByCompany: vi.fn(),
    getCustomerAddressByCompanyIDs: vi.fn(),
  },
}))

const probe = (hook, ...args) => {
  const result = { current: undefined }
  const Probe = () => { result.current = hook(...args); return null }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><Probe /></QueryClientProvider>)
  return result
}

beforeEach(() => vi.clearAllMocks())

describe('company lookups', () => {
  it('each hook calls only its own endpoint', async () => {
    PatenTrackApi.getLawFirmsByCompany.mockResolvedValue({ data: [] })
    probe(useLawFirmsByCompany, [ 1 ])
    await waitFor(() => expect(PatenTrackApi.getLawFirmsByCompany).toHaveBeenCalledWith([ 1 ]))
    expect(PatenTrackApi.getLendersByCompany).not.toHaveBeenCalled()
    expect(PatenTrackApi.getCustomerAddressByCompanyIDs).not.toHaveBeenCalled()
  })

  it('none fire without a selected company', async () => {
    probe(useLendersByCompany, [])
    await waitFor(() => expect(PatenTrackApi.getLendersByCompany).not.toHaveBeenCalled())
  })

  it('returns an array when the API returns null, so rows.length is safe', async () => {
    PatenTrackApi.getLendersByCompany.mockResolvedValue({ data: null })
    const r = probe(useLendersByCompany, [ 1 ])
    await waitFor(() => expect(r.current.data).toEqual([]))
  })

  it('customer addresses stay disabled until an address is selected', async () => {
    // The component alerts rather than fetching in that state.
    probe(useCustomerAddresses, [ 1 ], { enabled: false })
    await waitFor(() =>
      expect(PatenTrackApi.getCustomerAddressByCompanyIDs).not.toHaveBeenCalled())
  })

  it('customer addresses fetch once enabled', async () => {
    PatenTrackApi.getCustomerAddressByCompanyIDs.mockResolvedValue({ data: [ { id: 1 } ] })
    const r = probe(useCustomerAddresses, [ 1 ], { enabled: true })
    await waitFor(() => expect(r.current.data).toEqual([ { id: 1 } ]))
  })
})
