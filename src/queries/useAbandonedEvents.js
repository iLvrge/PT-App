import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/** Abandonment events for the selected companies, used by the timeline tab. */
export default function useAbandonedEvents(selectedCompanies = [], { enabled = true } = {}) {
  return useQuery({
    queryKey: [ 'abandonedEvents', selectedCompanies ],
    enabled,
    queryFn: async () => {
      const { data } = await PatenTrackApi.getAllAbandonedAssetsEvents(selectedCompanies)
      return data ?? []
    },
  })
}
