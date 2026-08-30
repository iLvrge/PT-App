import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'
import queryKeys from './keys'
import { normaliseNumber } from './useAbstractData'

/** The API returns bare image srcs; react-viewer wants { src } objects. */
export default function useFamilyFigures(number, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.figures(normaliseNumber(number)),
    enabled: enabled && !!normaliseNumber(number),
    queryFn: async () => {
      const res = await PatenTrackApi.getFamilyData(normaliseNumber(number))
      const payload = res?.data
      if (payload == null || payload === '' || !payload.length) return []
      return payload.map((src) => ({ src }))
    },
  })
}
