import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/**
 * Maintenance events for the selected companies.
 *
 * The effect this replaces also computed `tabs`, `customers` and `rfIDs` from
 * four more selectors and passed none of them - the endpoint takes only the
 * company list. Those computations are dropped, and with them the illusion that
 * the chart responded to those filters.
 */
export default function useMaintenanceEventsList({ selectedCompanies = [], selectedCompaniesAll } = {}) {
  const companies = selectedCompaniesAll === true ? [] : selectedCompanies
  return useQuery({
    queryKey: [ 'maintenanceEventsList', companies, selectedCompaniesAll === true ],
    queryFn: async () => {
      const { data } = await PatenTrackApi.getMaintainenceAssetsEventsList(companies)
      return data ?? []
    },
  })
}
