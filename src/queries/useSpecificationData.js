import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'
import queryKeys from './keys'
import { normaliseNumber } from './useAbstractData'

export default function useSpecificationData(number, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.specification(normaliseNumber(number)),
    enabled: enabled && !!normaliseNumber(number),
    queryFn: async () => {
      const res = await PatenTrackApi.getSpecificationData(normaliseNumber(number))
      const payload = res?.data
      return payload == null || payload === '' ? [] : payload
    },
  })
}
