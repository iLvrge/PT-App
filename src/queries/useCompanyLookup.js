import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/**
 * Shared shape for the "give me X for the selected companies" endpoints, which
 * all take the company id list and return a flat array.
 */
export default function useCompanyLookup(endpoint, selectedCompanies = [], { enabled = true } = {}) {
  return useQuery({
    queryKey: [ endpoint, selectedCompanies ],
    enabled: enabled && selectedCompanies.length > 0,
    queryFn: async () => {
      const { data } = await PatenTrackApi[endpoint](selectedCompanies)
      return data ?? []
    },
  })
}
