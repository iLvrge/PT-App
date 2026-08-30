import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

const list = (all, selected) => JSON.stringify(all === true ? [] : selected)

/**
 * Replaces a Redux request-flag pattern that both de-duplicated the fetch and
 * drove the spinner. The flag was set to true immediately before the await, so
 * the loader disappeared while the request was still in flight; React Query's
 * own loading state is used instead.
 *
 * The previous effect listed only [selectedCompanies] as a dependency while
 * reading seven other values, so changing a tab or assignment filter did not
 * refetch. All inputs are in the query key here, so any of them refetches.
 */
export default function useAbandonedYears({
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
      'abandonedYears',
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
      const { data } = await PatenTrackApi.getAllAbandonedAssetsYears(form)
      return data ?? []
    },
  })
}
