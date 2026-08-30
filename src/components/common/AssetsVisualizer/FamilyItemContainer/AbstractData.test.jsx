import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createStore } from 'redux'
import AbstractData from './AbstractData'
import PatenTrackApi from '../../../../api/patenTrack2'

vi.mock('../../../../api/patenTrack2', () => ({
  default: { getAbstractData: vi.fn() },
}))

const store = (familyDataRetrieved) =>
  createStore(() => ({
    patenTrack: { familyDataRetrieved },
    patenTrack2: { selectedAssetsPatents: [] },
  }))

const setup = ({ data, number, retrieved = true } = {}) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <Provider store={store(retrieved)}>
      <QueryClientProvider client={client}>
        <AbstractData data={data} number={number} />
      </QueryClientProvider>
    </Provider>
  )
}

beforeEach(() => vi.clearAllMocks())

describe('AbstractData', () => {
  it('uses a supplied abstract without making a request', async () => {
    // The old version fetched on mount regardless, overwriting supplied data.
    setup({ data: 'supplied abstract', number: '1,234,567' })
    expect(await screen.findByText('supplied abstract')).toBeInTheDocument()
    expect(PatenTrackApi.getAbstractData).not.toHaveBeenCalled()
  })

  it('fetches by patent number when no abstract is supplied', async () => {
    PatenTrackApi.getAbstractData.mockResolvedValue({ data: { abstracts: 'fetched' } })
    setup({ data: '', number: '1,234,567' })
    expect(await screen.findByText('fetched')).toBeInTheDocument()
  })

  it('strips punctuation from the patent number before requesting', async () => {
    PatenTrackApi.getAbstractData.mockResolvedValue({ data: 'x' })
    setup({ data: '', number: '10/123, 456' })
    await waitFor(() => expect(PatenTrackApi.getAbstractData).toHaveBeenCalledWith('10123456'))
  })

  it('accepts a bare string payload as well as { abstracts }', async () => {
    PatenTrackApi.getAbstractData.mockResolvedValue({ data: 'plain string body' })
    setup({ data: '', number: '999' })
    expect(await screen.findByText('plain string body')).toBeInTheDocument()
  })

  it('renders empty rather than throwing when the payload is null', async () => {
    PatenTrackApi.getAbstractData.mockResolvedValue({ data: null })
    const { container } = setup({ data: '', number: '999' })
    await waitFor(() => expect(PatenTrackApi.getAbstractData).toHaveBeenCalled())
    expect(container.textContent).toBe('')
  })

  it('does not request until the family data has been retrieved', async () => {
    setup({ data: '', number: '999', retrieved: false })
    await waitFor(() => expect(PatenTrackApi.getAbstractData).not.toHaveBeenCalled())
  })

  it('treats a whitespace-only abstract as absent and fetches instead', async () => {
    PatenTrackApi.getAbstractData.mockResolvedValue({ data: 'real' })
    setup({ data: '   ', number: '999' })
    expect(await screen.findByText('real')).toBeInTheDocument()
  })
})
