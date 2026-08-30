import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

const norm = (all, selected) => (all === true ? [] : selected)

/**
 * Assets belonging to one party (an inventor or a customer), used by the
 * expandable child tables. InventorTable and CustomerTable ask different
 * endpoints for the same shape, so `variant` selects which.
 */
export default function usePartyAssets(variant, {
  partiesId,
  selectedCategory = '',
  selectedCompanies = [],
  selectedCompaniesAll,
  assetTypesSelected = [],
  assetTypesSelectAll,
} = {}) {
  const companies = norm(selectedCompaniesAll, selectedCompanies)
  const tabs = norm(assetTypesSelectAll, assetTypesSelected)
  const customers = [ partiesId ]

  return useQuery({
    queryKey: [ variant, partiesId, selectedCategory, companies, tabs ],
    enabled: partiesId > 0,
    queryFn: async () => {
      const { data } = variant === 'customerAssets'
        ? await PatenTrackApi.getCustomerAssets(
            selectedCategory, companies, tabs, customers, [], 0, 3000, 'asset', 'desc', false)
        : await PatenTrackApi.getAssetTypeAssignments(
            companies, tabs, customers, selectedCategory !== '' ? selectedCategory : '', false)
      return data ?? { list: [] }
    },
  })
}
