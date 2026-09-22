// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { queryKeys } from './keys'
import { ASSET_LIST_STALE_TIME, ASSET_LIST_CACHE_TIME } from '../lib/queryClient'

/**
 * The asset grid is cached for an hour, so the key is the only thing keeping
 * one portfolio's assets from being served under another's name. A missing
 * field here is not a slow screen, it is the wrong data on screen - and for an
 * hour, which is long enough for someone to act on it.
 */
const base = {
  type: 'owned',
  companies: [ 859 ],
  tabs: [],
  customers: [],
  rfIDs: [],
  startIndex: 0,
  endIndex: 1000,
  column: 'asset',
  direction: 'DESC',
  salesAssets: false,
  lawyers: [],
}

const key = (over = {}) => JSON.stringify(queryKeys.layoutAssets({ ...base, ...over }))

describe('asset grid cache key', () => {
  it.each([
    [ 'layout', { type: 'divested' } ],
    [ 'company', { companies: [ 860 ] } ],
    [ 'an added company', { companies: [ 859, 860 ] } ],
    [ 'activity tab', { tabs: [ 3 ] } ],
    [ 'counterparty', { customers: [ 12 ] } ],
    [ 'transaction', { rfIDs: [ 99 ] } ],
    [ 'page offset', { startIndex: 1000 } ],
    [ 'page size', { endIndex: 50 } ],
    [ 'sort column', { column: 'patent' } ],
    [ 'sort direction', { direction: 'ASC' } ],
    [ 'the for-sale flag', { salesAssets: true } ],
    [ 'law firm', { lawyers: [ 7 ] } ],
  ])('changes when the %s changes', (_what, over) => {
    expect(key(over)).not.toBe(key())
  })

  it('is stable for the same selection, so the cache actually hits', () => {
    expect(key()).toBe(key())
  })

  it('ignores the order companies were picked in', () => {
    expect(key({ companies: [ 859, 860 ] })).toBe(key({ companies: [ 860, 859 ] }))
  })

  it('treats a numeric and string id as the same selection', () => {
    expect(key({ companies: [ '859' ] })).toBe(key({ companies: [ 859 ] }))
  })

  it('tolerates a missing list rather than keying on undefined', () => {
    expect(() => queryKeys.layoutAssets({ ...base, tabs: undefined })).not.toThrow()
    expect(key({ tabs: undefined })).toBe(key({ tabs: [] }))
  })

  it('sits under a prefix the invalidation helper can match', () => {
    const full = queryKeys.layoutAssets(base)
    expect(full.slice(0, 1)).toEqual(queryKeys.layoutAssetsRoot())
  })
})

describe('asset grid cache lifetime', () => {
  it('holds the response for an hour', () => {
    expect(ASSET_LIST_STALE_TIME).toBe(60 * 60_000)
  })

  /*
   * cacheTime below staleTime is the classic way to configure a cache that does
   * nothing: the entry is garbage-collected while it is still considered fresh,
   * so the next visit refetches anyway. fetchQuery registers no observer, which
   * makes the entry eligible for collection immediately.
   */
  it('keeps the entry alive at least as long as it is considered fresh', () => {
    expect(ASSET_LIST_CACHE_TIME).toBeGreaterThanOrEqual(ASSET_LIST_STALE_TIME)
  })
})
