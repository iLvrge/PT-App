import { QueryClient } from '@tanstack/react-query'

/**
 * Defaults chosen for this app:
 *  - staleTime 30s: most screens re-mount often as panes open and close, and
 *    refetching identical data on every mount is what makes navigation feel slow.
 *  - networkMode 'offlineFirst': paused rather than failed while offline, so a
 *    query resumes on reconnect instead of surfacing an error the user cannot act on.
 *  - no retry on 4xx: a 401/403/404 will not fix itself.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
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
