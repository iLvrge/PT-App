import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'
import queryKeys from './keys'

/** Patent numbers arrive punctuated; the API wants them bare. */
export const normaliseNumber = (number) =>
  String(number ?? '').replace('/', '').replace(/[, ]+/g, '')

/**
 * Replaces a hand-rolled fetch that kept its own loading flag and called
 * PatenTrackApi.cancelAbstractData() to cancel in-flight requests. React Query
 * keys the request by patent number, so a superseded one is simply no longer
 * the active query and its result is ignored.
 */
export default function useAbstractData(number, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.abstract(normaliseNumber(number)),
    enabled: enabled && !!normaliseNumber(number),
    queryFn: async () => {
      const res = await PatenTrackApi.getAbstractData(normaliseNumber(number))
      const payload = res?.data
      if (payload == null || payload === '') return ''
      return typeof payload.abstracts !== 'undefined' ? payload.abstracts : payload
    },
  })
}
