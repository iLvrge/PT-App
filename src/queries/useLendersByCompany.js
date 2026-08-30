import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/** Lenders for the currently selected companies. */
export default function useLendersByCompany(selectedCompanies = []) {
  return useQuery({
    queryKey: [ 'lendersByCompany', selectedCompanies ],
    enabled: selectedCompanies.length > 0,
    queryFn: async () => {
      const { data } = await PatenTrackApi.getLendersByCompany(selectedCompanies)
      return data ?? []
    },
  })
}
