import { QueryClient } from '@tanstack/react-query'

/**
 * Defaults chosen for this app:
 *  - staleTime 30s: most screens re-mount often as panes open and close, and
 *    refetching identical data on every mount is what makes navigation feel slow.
 *  - networkMode 'offlineFirst': paused rather than failed while offline, so a
 *    query resumes on reconnect instead of surfacing an error the user cannot act on.
 *  - no retry on 4xx: a 401/403/404 will not fix itself.
 *
 * Pinned to @tanstack/react-query v4: v5 requires React 18, since it is built on
 * useSyncExternalStore, and this app is on React 17. Moving to v5 is part of the
 * React 18 upgrade, not separable from it.
 */
/**
 * The asset grid barely changes within a session and is the most expensive
 * request the app makes, so it is held for an hour.
 *
 * cacheTime has to be raised alongside staleTime - they are different clocks.
 * staleTime is how long the data is served without refetching; cacheTime is how
 * long an entry survives with nothing observing it. Left at the 5-minute
 * default, the entry would be garbage-collected long before the hour was up and
 * the next visit would refetch regardless: the cache would look configured and
 * do nothing. It matters especially here because these are fetched with
 * fetchQuery, which registers no observer at all.
 */
export const ASSET_LIST_STALE_TIME = 60 * 60_000
export const ASSET_LIST_CACHE_TIME = 60 * 60_000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      cacheTime: 5 * 60_000,   // v5 renames this gcTime
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
      retry: (failureCount, error) => {
        const status = error?.response?.status
        if (status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
    mutations: { networkMode: 'offlineFirst', retry: 0 },
  },
})

export default queryClient
