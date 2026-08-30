import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

const list = (all, selected) => JSON.stringify(all === true ? [] : selected)

/**
 * Shared fetch for the two abandoned-assets charts, which posted an identical
 * FormData to different endpoints.
 *
 * Both previously used a Redux request flag to de-duplicate the fetch and drive
 * the spinner, and both got it wrong in different ways - see the call sites.
 * Both also depended on [selectedCompanies] alone while reading seven other
 * values, so filter changes never refetched. Every input is in the query key.
 */
export default function useAbandonedAssets(endpoint, {
  selectedCompanies = [],
  assetTypesSelectAll,
  assetTypesSelected,
  assetTypesCompaniesSelectAll,
  assetTypesCompaniesSelected,
  selectedAssetAssignmentsAll,
  selectedAssetAssignments,
  displaySalesAssets,
  selectedCategory,
} = {}) {
  const tabs = list(assetTypesSelectAll, assetTypesSelected)
  const customers = list(assetTypesCompaniesSelectAll, assetTypesCompaniesSelected)
  const assignments = list(selectedAssetAssignmentsAll, selectedAssetAssignments)

  return useQuery({
    queryKey: [
      endpoint,
      selectedCompanies, tabs, customers, assignments, displaySalesAssets, selectedCategory,
    ],
    enabled: selectedCompanies.length > 0,
    queryFn: async () => {
      const form = new FormData()
      form.append('list', [])
      form.append('total', 0)
      form.append('selectedCompanies', JSON.stringify(selectedCompanies))
      form.append('tabs', tabs)
      form.append('customers', customers)
      form.append('assignments', assignments)
      form.append('other_mode', displaySalesAssets)
      form.append('type', selectedCategory)
      const { data } = await PatenTrackApi[endpoint](form)
      return data ?? []
    },
  })
}
