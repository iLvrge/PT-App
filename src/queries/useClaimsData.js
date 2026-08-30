import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'
import queryKeys from './keys'
import { normaliseNumber } from './useAbstractData'

export default function useClaimsData(number, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.claims(normaliseNumber(number)),
    enabled: enabled && !!normaliseNumber(number),
    queryFn: async () => {
      const res = await PatenTrackApi.getClaimsData(normaliseNumber(number))
      const payload = res?.data
      return payload == null || payload === '' ? [] : payload
    },
  })
}
